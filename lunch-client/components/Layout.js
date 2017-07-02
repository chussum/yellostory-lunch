import Package from '../package'
import React from 'react'
import Head from 'next/head'
import Header from './Header'
import LoginForm from 'components/auth/LoginForm'
import { nextConnect } from 'next/connect'
import { BackTop, Card, LocaleProvider } from 'antd'
import koKR from 'antd/lib/locale-provider/ko_KR';

let stylesheet
if (process.env.NODE_ENV === 'production') {
    // In production, serve pre-built CSS file from /assets/{version}/main.css
    stylesheet = <link rel="stylesheet" type="text/css" href={'/assets/' + Package.version + '/main.min.css'}/>
} else {
    // In development, serve CSS inline (with live reloading) with webpack
    // NB: Not using dangerouslySetInnerHTML will cause problems with some CSS
    stylesheet = <style dangerouslySetInnerHTML={{__html: require('styles/_main.scss')}}/>
}

@nextConnect((state) => state)
class Layout extends React.Component {
    componentDidMount() {
        // this.redirect()
    }

    componentDidUpdate() {
        // this.redirect()
    }

    redirect() {
        let { publicPage, pathname, authenticate: { authenticated } }  = this.props

        if (!publicPage && !authenticated && pathname !== '/login') {
            document && (document.location.href = '/login')
        } else if (authenticated && pathname === '/login') {
            document && (document.location.href = '/')
        }
    }

    render() {
        let { publicPage, className, title, pathname, authenticate, authenticate: { content, authenticated } }  = this.props
        let layout

        if (publicPage || authenticated && content) {
            let { hideHeader, children } = this.props

            layout = (
                <div className="layout">
                    { !hideHeader ? <Header pathname={ pathname } /> : '' }
                    { children }
                </div>
            )
        } else {
            layout = (
                <div className="home">
                    <div className="bg-cafe">
                        <div className="overlay"></div>
                        <div className="hello">
                            <Card bordered={false}>
                                <LoginForm />
                            </Card>
                        </div>
                    </div>
                </div>
            )
        }

        return (
            <div className={ className }>
                <Head>
                    <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1"/>
                    <link rel="stylesheet" type="text/css" href={'/assets/' + Package.version + '/antd.min.css'} />
                    {stylesheet}
                    <title>Lunch Site{ title ? ` - ${title}` : '' }</title>
                </Head>

                <BackTop />
                <LocaleProvider locale={koKR}>{ layout }</LocaleProvider>
            </div>
        )
    }
}


export default Layout
