import React from 'react'
import Page from 'components/Page'
import Layout from 'components/Layout'
import Calendar from 'components/calendar/Calendar'
import { nextConnect } from 'next/connect'
import moment from 'moment'
import autobind from 'autobind-decorator'
import { Icon, Modal, Input } from 'antd'
import axios from 'axios'
import * as lodash from 'lodash'

const confirm = Modal.confirm

@nextConnect((state) => state)
class WooriFoodList extends Page {
    week = ['일', '월', '화', '수', '목', '금', '토']
    state = {
        category: '우리푸드',
        date: moment(),
        targetDate: moment(),
        visible: false,
        foods: '',
    }

    static async getInitialProps(ctx) {
        await super.getInitialProps(ctx)
        let foods = {}
        try {
            let response = await axios.get('/lunches', {
                params: {
                    category: '우리푸드'
                }
            })
            let items = response.data.items || []
            lodash.forEach(items, (item) => {
                let date = moment(item.date).format('YYYY-MM-DD')
                foods[date] = item
            })
        } catch (err) {
            err.code = 'ENOENT'
            throw err
        }
        return { items: foods }
    }

    @autobind
    showFoodsModal(date) {
        let item = this.props.items[date.format('YYYY-MM-DD')]
        let foods = item ? item.foods : ''
        this.setState({
            targetDate: date,
            visible: true,
            foods: foods,
        })
    }

    @autobind
    hideFoodsModal() {
        this.setState({
            visible: false,
            foods: '',
        })
    }

    @autobind
    showConfirm(date) {
        confirm({
            title: date.format('M월 D일') + ' 식단표를 초기화하겠습니까?',
            content: '입력된 메뉴들이 지워집니다.',
            onOk: async () => {
                this.setState({ isRemoved: false })
                let targetDate = date.format('YYYY-MM-DD')
                await axios.delete('/lunch', {
                    params: {
                        category: this.state.category,
                        date: targetDate,
                    }
                })
                delete this.props.items[targetDate]
                this.setState({ isRemoved: true })
            },
            onCancel: () => {
            },
        });
    }

    @autobind
    async submitFoods(date) {
        if (!this.state.foods || this.state.foods.trim() == '') {
            this.hideFoodsModal()
            return
        }

        try {
            let targetDate = date.format('YYYY-MM-DD')
            await axios.post('/lunch', {
                category: this.state.category,
                date: targetDate,
                foods: this.state.foods,
            })
            this.props.items[targetDate] = {
                category: this.state.category,
                foods: this.state.foods
            }
            this.hideFoodsModal()
        } catch (err) {
        }
    }

    @autobind
    changeFoods(e) {
        this.setState({ foods: e.target.value })
    }

    render() {
        let { url, items, authenticate: { content: { admin } } } = this.props
        return (
            <Layout title={ this.state.category + " 식단표" } pathname={ url.pathname } publicPage={ false } hideHeader={ false }>
                <div className="container">
                    <Calendar
                        title={ this.state.category }
                        onChangeMonth={ date => this.setState({ date }) }
                        date={ this.state.date }
                        onPickDate={ date => {} }
                        renderDay={ date => (
                            <div>
                                {(() => {
                                    if (items[date.format('YYYY-MM-DD')] && items[date.format('YYYY-MM-DD')].foods) {
                                        return <Icon className="remove" type="close-square" onClick={ () => this.showConfirm(date) }/>
                                    }
                                })()}
                                <span className="day" style={{
                                    fontWeight: date.isSame(moment(), 'day') ? 700 : 400,
                                    fontSize: date.isSame(moment(), 'day') ? 22 : 16,
                                }}>
                                    { date.format('D') } <strong>{ this.week[date.format('d')] }</strong>
                                </span>
                                <ul className="foods" onClick={ () => this.showFoodsModal(date) }>
                                    { items[date.format('YYYY-MM-DD')] && items[date.format('YYYY-MM-DD')].foods.split('\n').map((item, key) => {
                                        if (!item) return
                                        return (<li key={key}>{item}</li>)
                                    }) }
                                </ul>
                            </div>
                        )}
                    />
                    <Modal
                        title={ this.state.targetDate.format(`YYYY/MM/DD - ${this.state.category}`) }
                        visible={ this.state.visible }
                        onOk={ () => { this.submitFoods(this.state.targetDate) } }
                        onCancel={ this.hideFoodsModal }
                        maskClosable={ false }
                    >
                        <Input type="textarea"
                               placeholder="식단표를 입력하세요."
                               autosize={{ minRows: 6, maxRows: 12 }}
                               value={ this.state.foods }
                               onChange={ this.changeFoods }/>
                    </Modal>
                </div>
            </Layout>
        )
    }
}

export default WooriFoodList
