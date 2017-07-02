import React from 'react'
import Page from 'components/Page'
import Layout from 'components/Layout'
import LoginForm from 'components/auth/LoginForm'
import { Card } from 'antd'
import { nextConnect } from 'next/connect'

@nextConnect((state) => state)
class LogIn extends Page {
    static async getInitialProps ({ req }) {
        await super.getInitialProps({ req })
        return {}
    }

    render() {
        let { url } = this.props
        return (
            <Layout title="login" pathname={ url.pathname }>
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
            </Layout>
        )
    }
}

export default LogIn
