import path from 'path'
import morgan from 'morgan'
import express from 'express'
import mongoose from 'mongoose'
import bodyParser from 'body-parser'
import routes from './routes'

require('dotenv').config()

const app = express()
const db = mongoose.connection
const dev = process.env.NODE_ENV !== 'production'
const port = process.env.PORT

// require config setting
if (!port) {
    console.error('please rename config file and then edit the file. (.envcpy to .env)')
    process.exit(0)
}

app.set('jwt-secret', process.env.SECRET_KEY)
app.set('skt-api-key', process.env.SKT_API_KEY)
app.set('event-days', {})

if (dev) {
    app.use('/', express.static(path.join(__dirname, '..', 'doc')))
    app.use(morgan('dev'))
}

app.use(require('cookie-parser')())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Methods', 'GET, PUT, POST, DELETE, OPTIONS')
    res.header('Access-Control-Allow-Headers', 'Content-type, Accept, Authorization, X-Custom-Header')

    if (req.method === "OPTIONS") {
        return res.status(200).end()
    }

    return next()
})
app.use('/', routes)
app.use((err, req, res, next) => res.status(500).send('500 Error'))
app.listen(port, () => console.log('> Ready on http://localhost:' + port))

mongoose.Promise = global.Promise
mongoose.connect(process.env.DB_URI)

db.on('error', console.error)
db.once('open', () => {
    console.log('> Connected to mongod server')
})
