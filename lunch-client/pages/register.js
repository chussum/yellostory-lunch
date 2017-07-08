import React from 'react'
import Page from 'components/Page'
import Layout from 'components/Layout'
import RegisterForm from 'components/auth/RegisterForm'
import { Card } from 'antd'
import { nextConnect } from 'next/connect'

@nextConnect((state) => state)
class Register extends Page {
    static async getInitialProps(ctx) {
        await super.getInitialProps(ctx)
        return {}
    }

    render() {
        return (
            <Layout className="home" title="회원가입" publicPage={ true } hideHeader={ true } { ...this.props }>
                <div className="bg-pasta">
                    <div className="overlay"></div>
                    <div className="hello register">
                        <Card bordered={false}>
                            <RegisterForm />
                        </Card>
                    </div>
                </div>
            </Layout>
        )
    }
}

export default Register
