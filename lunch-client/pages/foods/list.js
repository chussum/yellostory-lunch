import React from 'react'
import Page from 'components/Page'
import Layout from 'components/Layout'
import Calendar from 'components/calendar/Calendar'
import { nextConnect } from 'next/connect'
import moment from 'moment'
import autobind from 'autobind-decorator'
import { Icon, Modal, Input } from 'antd'
import axios from 'axios'
import * as _ from 'lodash'

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
        let { token } = await super.getInitialProps(ctx)
        let getFoods = async (category) => {
            let foods = {}
            let response = await axios.getJson('/lunches', ctx, {
                params: {
                    category: category,
                },
                token,
            })
            let items = response.data.items || []
            _.forEach(items, (item) => {
                let date = moment(item.date).format('YYYY-MM-DD')
                foods[date] = item
            })
            return foods
        }
        let getEventDays = async () => {
            let eventDays = {}
            let response = await axios.getJson('/event-days', ctx, { token })
            let items = response.data.items || []
            _.forEach(items, (item) => {
                eventDays[item.date] = item
            })
            return eventDays
        }

        try {
            let category = ctx.query.category
            let [ foods, eventDays ] = await Promise.all([
                getFoods(category),
                getEventDays()
            ])
            return { category: category, items: foods, eventDays }
        } catch (err) {
            return {}
        }
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
        let { items, eventDays, authenticate: { content: { admin } } } = this.props
        return (
            <Layout title={ this.props.category + " 식단표" } publicPage={ false } hideHeader={ false } { ...this.props }>
                <div className="container">
                    <Calendar
                        title={ this.props.category }
                        onChangeMonth={ date => this.setState({ date }) }
                        date={ this.state.date }
                        onPickDate={ date => {} }
                        renderDay={ date => {
                            let dateYmd = date.format('YYYY-MM-DD')
                            let dayOfWeek = Number(date.format('d'))
                            let isEventDay = [0, 6].indexOf(dayOfWeek) !== -1 ? true : false
                            let managementArea
                            let menuArea

                            if (eventDays && eventDays[dateYmd]) {
                                isEventDay = true
                                menuArea = <div className="event-day name">{ eventDays[dateYmd].name }</div>
                            } else if (items[dateYmd] && items[dateYmd].foods) {
                                managementArea = (
                                    <div>
                                        <Icon className="edit" type="edit" onClick={ () => this.showFoodsModal(date) } />
                                        <Icon className="remove" type="delete" onClick={ () => this.showConfirm(date) }/>
                                    </div>
                                )
                            } else if (!isEventDay) {
                                managementArea = <Icon className="edit" type="edit" onClick={ () => this.showFoodsModal(date) } />
                            }

                            !menuArea && (menuArea = (
                                <ul className="foods">
                                    { items[dateYmd] && items[dateYmd].foods.split('\n').map((item, key) => {
                                        if (!item) return
                                        return (<li key={key}>{item}</li>)
                                    }) }
                                </ul>
                            ))

                            return (
                                <div>
                                    <span className={ isEventDay ? 'day event-day' : 'day' } style={{
                                        fontWeight: date.isSame(moment(), 'day') ? 700 : 400,
                                        fontSize: date.isSame(moment(), 'day') ? 22 : 16,
                                    }}>
                                        { date.format('D') } <strong>{ this.week[dayOfWeek] }</strong>
                                    </span>

                                    { managementArea }
                                    { menuArea }
                                </div>
                            )}
                        }
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
