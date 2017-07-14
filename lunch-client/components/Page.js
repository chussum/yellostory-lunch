import React from 'react'
import Router from 'next/router'
import NProgress from 'nprogress'
import axios from 'axios'
import config from '../config.json'
import { nextConnect } from 'next/connect'
import { validateToken } from 'actions/authenticate';

axios.defaults.baseURL = config.frontend.baseURL + '/api'
axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded'
axios.default.getJson = async (url, ctx, options = {}) => {
    options = !ctx.isServer ? options : {
        headers: {
            Cookie: "token=" + options.token,
        },
        ...options,
    }
    return await axios.get(url, options)
}

Router.onRouteChangeStart = (url) => NProgress.start()
Router.onRouteChangeComplete = () => NProgress.done()
Router.onRouteChangeError = () => NProgress.done()

@nextConnect((state) => state)
class Page extends React.Component {
    static async getInitialProps({ req, pathname, store }) {
        let token = req && req.cookies && req.cookies.token
        await store.dispatch(validateToken(token, { pathname }))
        return { token }
    }
}

export default Page
