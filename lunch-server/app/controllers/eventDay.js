import axios from 'axios'
import moment from 'moment'
import * as _ from 'lodash'

const getEventDays = async (eventDays, year, key) => {
    if (year < 2017) return []

    let today = moment()
    if (eventDays[year] && today.diff(eventDays[year].updatedAt, 'months') < 1) {
        return eventDays[year].items
    }

    let items
    let response = await axios.get('https://apis.sktelecom.com/v1/eventday/days', {
        headers: {
            'TDCProjectKey': key,
        },
        params: {
            year: year,
            type: 'h,i',
        }
    })
    items = response.data ? response.data.results : []
    items.push({
        year: year,
        month: '05',
        day: '01',
        type: 'a',
        name: '근로자의 날',
    })
    items = _.map(items, item => {
        return {
            date: item.year + '-' + item.month + '-' + item.day,
            ...item,
        }
    })
    eventDays[year] = {
        updatedAt: today,
        items,
    }

    return items
}

/**
 * @api {get} /event-days 공휴일 목록
 * @apiGroup Lunch
 */
export const get = async (req, res) => {
    let apiKey = req.app.get('skt-api-key')
    let eventDays = req.app.get('event-days')
    let today = moment()
    let prevYear = today.clone().subtract(1, 'years').format('YYYY')
    let thisYear = today.format('YYYY')
    let nextYear = today.clone().add(1, 'years').format('YYYY')
    let items = []
    let errorMessage

    try {
        let response = await Promise.all([
            getEventDays(eventDays, prevYear, apiKey),
            getEventDays(eventDays, thisYear, apiKey),
            getEventDays(eventDays, nextYear, apiKey)
        ])
        _.forEach(response, eventDays => {
            items = _.concat(items, eventDays)
        })
    } catch (err) {
        errorMessage = err.response && err.response.data && err.response.data.error && err.response.data.error.message
    }

    if (errorMessage) {
        res.status(400).json({
            success: false,
            message: errorMessage,
        });
    } else {
        res.status(200).json({
            success: true,
            items: items,
        })
    }
}