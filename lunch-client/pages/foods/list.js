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
class FoodsList extends Page {
    week = ['일', '월', '화', '수', '목', '금', '토']
    state = {
        date: moment(),
        targetDate: moment(),
        visible: false,
        foods: '',
    }

    static async getInitialProps(ctx) {
        await super.getInitialProps(ctx)
        let category = ctx.query.category
        let foods = {}
        try {
            let response = await axios.get('/lunches', {
                params: {
                    category: category,
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
        return { category: category, items: foods }
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
                        category: this.props.category,
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
                category: this.props.category,
                date: targetDate,
                foods: this.state.foods,
            })
            this.props.items[targetDate] = {
                category: this.props.category,
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
        let { items, authenticate: { content: { admin } } } = this.props
        return (
            <Layout title={ this.props.category + " 식단표" } publicPage={ false } hideHeader={ false } { ...this.props }>
                <div className="container">
                    <Calendar
                        title={ this.props.category }
                        onChangeMonth={ date => this.setState({ date }) }
                        date={ this.state.date }
                        onPickDate={ date => {} }
                        renderDay={ date => (
                            <div>
                                <Icon className="edit" type="edit" onClick={ () => this.showFoodsModal(date) } />
                                {(() => {
                                    if (items[date.format('YYYY-MM-DD')] && items[date.format('YYYY-MM-DD')].foods) {
                                        return <Icon className="remove" type="delete" onClick={ () => this.showConfirm(date) }/>
                                    }
                                })()}
                                <span className="day" style={{
                                    fontWeight: date.isSame(moment(), 'day') ? 700 : 400,
                                    fontSize: date.isSame(moment(), 'day') ? 22 : 16,
                                }}>
                                    { date.format('D') } <strong>{ this.week[date.format('d')] }</strong>
                                </span>
                                <ul className="foods">
                                    { items[date.format('YYYY-MM-DD')] && items[date.format('YYYY-MM-DD')].foods.split('\n').map((item, key) => {
                                        if (!item) return
                                        return (<li key={key}>{item}</li>)
                                    }) }
                                </ul>
                            </div>
                        )}
                    />
                    <Modal
                        title={ this.state.targetDate.format(`YYYY/MM/DD - ${this.props.category}`) }
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

export default FoodsList
