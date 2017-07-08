const config = require('./config.json')
const httpProxy = require('http-proxy')
const express = require('express')
const next = require('next')
const sass = require('node-sass')
const less = require('less')
const fs = require('fs')

less.renderSync = (filepath, options) => {
    let result = { 'css': '' }
    if (!options || typeof options != "object") options = {}
    let content = fs.readFileSync(filepath, 'utf-8')
    less.render(content, options, (err, res) => {
        if (err) throw err;
        result.css = res.css;
    });
    return result;
};

const dev = process.env.NODE_ENV !== 'production'
const port = process.env.PORT || 3000
const app = next({ dev })
const handle = app.getRequestHandler()
const server = express()

app.prepare()
    .then(() => {
        // Use cookie parser
        server.use(require('cookie-parser')())

        // Add route to serve compiled SCSS from /assets/{build id}/main.min.css
        let sassResult = sass.renderSync({file: './styles/_main.scss', outputStyle: 'compressed'})
        var antdResult = less.renderSync('./node_modules/antd/dist/antd.less', {
            paths: ['./node_modules/antd/dist'],
            modifyVars: {
                'primary-color': '#000000',
                'link-color': '#000000',
                'border-radius-base': '2px',
            }
        })

        server.get('/assets/:id/main.min.css', (req, res) => {
            res.setHeader('Content-Type', 'text/css')
            res.send(sassResult.css)
        })
        server.get('/assets/:id/antd.min.css', (req, res) => {
            res.setHeader('Content-Type', 'text/css')
            res.send(antdResult.css)
        })

        // backend api proxy
        let proxy = httpProxy.createProxyServer({
            target: config.backend.baseURL,
            changeOrigin: config.backend.remote ? true : false,
            cookieDomainRewrite: config.backend.remote ? '' : false,
        })
        proxy.on('proxyReq', (proxyReq, req, res, options) => {
            if (req.cookies.token && !req.headers['Authorization']) {
                req.cookies && req.cookies.token && proxyReq.setHeader('Authorization', req.cookies.token)
            }
        })
        proxy.on('error', (err, req, res) => {
            res.status(500).end('Something went wrong.');
        })
        server.use('/api', (req, res) => proxy.web(req, res))

        // frontend custom routes
        server.get('/woori-food', (req, res) => {
            return app.render(req, res, '/foods/list', Object.assign({
                category: '우리푸드',
            }, req.params))
        })
        server.get('/babdo', (req, res) => {
            return app.render(req, res, '/foods/list', Object.assign({
                category: '밥도',
            }, req.params))
        })
        server.get('*', (req, res) => handle(req, res))
        server.listen(port, (err) => {
            if (err) throw err
            console.log('> Ready on http://localhost:' + port)
        })
    })
