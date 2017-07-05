import React from 'react'
import Page from 'components/Page'
import Layout from 'components/Layout'
import { nextConnect } from 'next/connect'
import axios from 'axios'
import moment from 'moment'

@nextConnect((state) => state)
class Index extends Page {
    week = ['일', '월', '화', '수', '목', '금', '토']

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
                    <h2>{date.format('M월 D일')} ({ this.week[date.format('d')] }) 오늘의 점심 / {today.category}</h2>
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
                    <h2>{date.format('M월 D일')} ({ this.week[date.format('d')] }) 오늘의 점심</h2>
                    <span>식단표가 없습니다.</span>
                </div>
            )
        }
        if (tomorrow) {
            let date = moment(tomorrow.date)
            tomorrowJSX = (
                <div className="menu">
                    <h2>{date.format('M월 D일')} ({ this.week[date.format('d')] }) 내일의 점심 / {tomorrow.category}</h2>
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
                    <h2>{date.format('M월 D일')} ({ this.week[date.format('d')] }) 내일의 점심</h2>
                    <span>식단표가 없습니다.</span>
                </div>
            )
        }
        return (
            <Layout className="home" pathname={ url.pathname }>
                <div className="container">
                    <div>
                        { todayJSX }
                        { tomorrowJSX }
                    </div>
                    <div className="description">
                        <h2>금요일 점심은 격월로 시행됩니다.</h2>
                        <ul>
                            <li>- 우리푸드: 2, 4, 6, 8, 10, 12월</li>
                            <li>- 밥도: 1, 3, 5, 7, 9, 11월</li>
                        </ul>
                    </div>
                </div>
            </Layout>
        )
    }
}

export default Index