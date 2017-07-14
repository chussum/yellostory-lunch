import axios from 'axios'
import moment from 'moment'
import * as _ from 'lodash'

const getEventDays = async (year, key) => {
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
    items = _.map(items, item => {
        return {
            date: item.year + '-' + item.month + '-' + item.day,
            ...item,
        }
    })
    return items
}

/**
 * @api {get} /event-days 공휴일 목록
 * @apiGroup Lunch
 */
export const get = async (req, res) => {
    let apiKey = req.app.get('skt-api-key')
    let today = moment()
    let prevYear = today.clone().subtract(1, 'years').format('YYYY')
    let thisYear = today.format('YYYY')
    let nextYear = today.clone().add(1, 'years').format('YYYY')
    let items
    let errorMessage

    try {
        items = _.concat(
            await getEventDays(prevYear, apiKey),
            await getEventDays(thisYear, apiKey),
            await getEventDays(nextYear, apiKey)
        )
    } catch (err) {
        errorMessage = err.response && err.response.data && err.response.data.error && err.response.data.error.message
    }

    if (errorMessage) {
        res.status(400).json({
            success: false,
            message: errorMessage,
        });
    } else {
        res.json({
            success: true,
            items: items,
        })
    }
}