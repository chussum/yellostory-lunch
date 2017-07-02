import React from 'react'
import Router from 'next/router'
import NProgress from 'nprogress'
import axios from 'axios'
import config from '../config'
import { nextConnect } from 'next/connect'
import { validateToken } from 'actions/authenticate';

axios.defaults.baseURL = config.frontend.baseURL + '/api'
axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded'

Router.onRouteChangeStart = (url) => NProgress.start()
Router.onRouteChangeComplete = () => NProgress.done()
Router.onRouteChangeError = () => NProgress.done()

@nextConnect((state) => state)
class Page extends React.Component {
    static async getInitialProps({ req, store }) {
        let token = req && req.cookies && req.cookies.token
        await store.dispatch(validateToken({ token }))
        return {}
    }
}

export default Page
