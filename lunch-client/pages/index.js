import React from 'react'
import Page from 'components/Page'
import Layout from 'components/Layout'
import { nextConnect } from 'next/connect'
import axios from 'axios'
import moment from 'moment'

@nextConnect((state) => state)
class Index extends Page {
    static async getInitialProps(ctx) {
        await super.getInitialProps(ctx)
        let today, tomorrow
        try {
            let todayResponse = await axios.get('/lunch/today')
            let tomorrowResponse = await axios.get('/lunch/tomorrow')
            today = todayResponse.data
            tomorrow = tomorrowResponse.data
        } catch (err) {
            err.code = 'ENOENT'
            throw err
        }
        return { today, tomorrow }
    }


    render() {
        let { url, authenticate: { content }, today, tomorrow } = this.props
        let todayJSX, tomorrowJSX
        if (today) {
            let date = moment(today.date)
            todayJSX = (
                <div className="menu">
                    <h2>{date.format('M월 D일')} 오늘의 점심 메뉴 / {today.category}</h2>
                    <ul>
                    { today.foods.split('\n').map((item, key) => {
                        if (!item) return
                        return (<li key={key}>{item}</li>)
                    }) }
                    </ul>
                </div>
            )
        } else {
            let date = moment()
            todayJSX = (
                <div className="menu">
                    <h2>{date.format('M월 D일')} 오늘의 점심 메뉴</h2>
                    <span>식단표가 없습니다.</span>
                </div>
            )
        }
        if (tomorrow) {
            let date = moment(tomorrow.date)
            tomorrowJSX = (
                <div className="menu">
                    <h2>{date.format('M월 D일')} 내일의 점심 메뉴 / {tomorrow.category}</h2>
                    <ul>
                    { tomorrow.foods.split('\n').map((item, key) => {
                        if (!item) return
                        return (<li key={key}>{item}</li>)
                    }) }
                    </ul>
                </div>
            )
        } else {
            let date = moment().add(1, 'days')
            tomorrowJSX = (
                <div className="menu">
                    <h2>{date.format('M월 D일')} 내일의 점심 메뉴</h2>
                    <span>식단표가 없습니다.</span>
                </div>
            )
        }
        return (
            <Layout className="home" pathname={ url.pathname }>
                <div className="container">
                    { todayJSX }
                    { tomorrowJSX }
                </div>
            </Layout>
        )
    }
}

export default Index