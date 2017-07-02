import React from 'react'
import Page from 'components/Page'
import Layout from 'components/Layout'
import axios from 'axios'
import { nextConnect } from 'next/connect'
import { Card, Row, Col } from 'antd';

@nextConnect((state) => state)
class About extends Page {
    static async getInitialProps ({ req }) {
        await super.getInitialProps({ req })

        let response
        try {
            response = await axios.get('https://jsonplaceholder.typicode.com/posts')
        } catch (err) {
            err.code = 'ENOENT'
            throw err
        }

        return {
            posts: response.data
        }

        return {}
    }

    render() {
        let { url, posts } = this.props

        const postList = posts.map(
            post => (
                <Col xs={24} sm={8} md={8} lg={6} style={{ padding: 10 }}>
                    <a>
                        <Card style={{ width: '100%', borderRadius: 0, border: '1px solid #e6e6e6'}} bodyStyle={{ padding: 0 }} bordered={false}>
                            <div className="custom-image">
                                <img alt="example" width="100%" src="http://cowndog.com/wp-content/themes/wordpress-bootstrap/images/slide_cafe_img1.jpg" />
                            </div>
                            <div className="custom-card">
                                <h3>TEST</h3>
                                <p>www.instagram.com</p>
                            </div>
                        </Card>
                    </a>
                </Col>
            )
        )

        return (
            <Layout title="about" pathname={ url.pathname } {...this.props} >
                <div className="container">
                    <Row style={{ marginLeft: -10, marginRight: -10 }}>
                        { postList }
                    </Row>
                </div>
            </Layout>
        )
    }
}

export default About
