import React from 'react'
import Page from 'components/Page'
import Layout from 'components/Layout'
import { nextConnect } from 'next/connect'

@nextConnect((state) => state)
class Search extends Page {
    static async getInitialProps({ req }) {
        await super.getInitialProps({ req })
        return {}
    }

    render() {
        let { url } = this.props

        return (
            <Layout title="search" pathname={url.pathname}>
                <div className="container">
                    Search keyword is "{url.query.keyword}".
                </div>
            </Layout>
        )
    }
}

export default Search
