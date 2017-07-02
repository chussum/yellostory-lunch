import React from 'react'
import Page from 'components/Page'
import Layout from 'components/Layout'
import RegisterForm from 'components/auth/RegisterForm'
import { Card } from 'antd'
import { nextConnect } from 'next/connect'

@nextConnect((state) => state)
class Register extends Page {
    static async getInitialProps({ req }) {
        await super.getInitialProps({ req })
        return {}
    }

    render() {
        let { url } = this.props
        return (
            <Layout className="home" title="회원가입" pathname={ url.pathname } publicPage={ true } hideHeader={ true }>
                <div className="bg-cafe">
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
