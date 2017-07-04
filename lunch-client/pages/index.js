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
                    { todayJSX }
                    { tomorrowJSX }
                    <div className="menu">
                        <strong>금요일 점심은 격주로 시행됩니다.</strong><br/><br/>
                        - 우리푸드: 짝수달 금요일<br/>
                        - 밥도: 홀수달 금요일
                    </div>
                </div>
            </Layout>
        )
    }
}

export default Index