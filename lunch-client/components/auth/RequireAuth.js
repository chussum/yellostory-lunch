import React  from 'react';
import Router from 'next/router'
import { nextConnect } from 'next/connect'
import Page from '../Page'

const href = '/login'
const as = href

export default (PageComponent) => {
    @nextConnect((state) => state)
    class Authentication extends Page {
        componentWillMount() {
            if (!this.props.authenticated) {
                // Router.push(href, as, { shallow: true })
            }
        }

        componentWillUpdate(nextProps) {
            if (!nextProps.authenticated) {
                // Router.push(href, as, { shallow: true })
            }
        }

        render() {
            return <PageComponent {...this.props} />
        }
    }

    return Authentication
}
