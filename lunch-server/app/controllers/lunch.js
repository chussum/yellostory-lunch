import Lunch from '../models/Lunch'
import moment from 'moment'

const dateRegex = /^(19|20)\d{2}-(0[1-9]|1[012])-(0[1-9]|[12][0-9]|3[0-1])$/

/**
 * @api {get} /lunch LunchList
 * @apiGroup Lunch
 */
export const get = async (req, res) => {
    let errorMessage
    let { startDate, endDate, category } = req.query

    !errorMessage && startDate && !dateRegex.test(startDate) && (errorMessage = '시작일을 확인해주세요.')
    !errorMessage && endDate && !dateRegex.test(endDate) && (errorMessage = '종료일 확인해주세요.')

    if (errorMessage) {
        return res.status(400).json({
            success: false,
            message: errorMessage,
        });
    }

    let lunches = await Lunch.findAllLunch(category, startDate, endDate)
    res.json({
        success: true,
        items: lunches,
    })
}

/**
 * - 우리푸드 : 짝수달 금요일, 월,수 (1,3)
 * - 밥도 : 홀수달 금요일, 화,목 (2,4)
 *
 */
/**
 * @api {get} /lunch/today LunchList
 * @apiGroup Lunch
 */
export const getTodayLunch = async (req, res) => {
    let today = moment()
    let day = Number(today.day())
    let category

    if ([1, 3].includes(day)) {
        category = '우리푸드'
    } else if ([2, 4].includes(day)) {
        category = '밥도'
    } else if (day === 5) {
        switch (Number(today.format('M') % 2)) {
            case 0:
                category = '우리푸드'
                break
            case 1:
                category = '밥도'
                break
        }
    }

    let lunch = await Lunch.findLunch(category, today)
    res.json(lunch)
}

/**
 * @api {get} /lunch/tomorrow LunchList
 * @apiGroup Lunch
 */
export const getTomorrowLunch = async (req, res) => {
    let tomorrow = moment().add(1, 'days')
    let day = Number(tomorrow.day())
    let category

    if ([1, 3].includes(day)) {
        category = '우리푸드'
    } else if ([2, 4].includes(day)) {
        category = '밥도'
    } else if (day === 5) {
        switch (Number(tomorrow.format('M') % 2)) {
            case 0:
                category = '우리푸드'
                break
            case 1:
                category = '밥도'
                break
        }
    }

    let lunch = await Lunch.findLunch(category, tomorrow)
    res.json(lunch)
}

/**
 * @api {post} /lunch create
 * @apiGroup Lunch
 */
export const create = async (req, res) => {
    let errorMessage, errorCode
    let { date, category, foods } = req.body

    !errorMessage && !date && (errorMessage = '날짜를 입력해주세요.') && (errorCode = 'date')
    !errorMessage && !dateRegex.test(date) && (errorMessage = '날짜를 확인해주세요.') && (errorCode = 'date')
    !errorMessage && !category && (errorMessage = '카테고리를 입력해주세요.') && (errorCode = 'category')
    !errorMessage && !foods && (errorMessage = '식단표를 입력해주세요.') && (errorCode = 'foods')

    if (errorMessage) {
        return res.status(400).json({
            success: false,
            code: errorCode,
            message: errorMessage,
        });
    }

    let lunch = await Lunch.findLunch(category, date)
    if (lunch) {
        // duplicated, update foods.
        await lunch.updateLunchMenu(foods)
    } else {
        lunch = await Lunch.create({date, category, foods})
    }

    res.json({
        success: true,
        message: 'registered successfully',
        content: lunch,
    })
}


/**
 * @api {delete} /lunch delete
 * @apiGroup Lunch
 */
export const remove = async (req, res) => {
    let errorMessage, errorCode
    let { date, category } = req.query

    !errorMessage && !category && (errorMessage = '카테고리를 입력해주세요.') && (errorCode = 'category')
    !errorMessage && !date && (errorMessage = '날짜를 입력해주세요.') && (errorCode = 'date')
    !errorMessage && !dateRegex.test(date) && (errorMessage = '날짜를 확인해주세요.') && (errorCode = 'date')

    if (errorMessage) {
        return res.status(400).json({
            success: false,
            code: errorCode,
            message: errorMessage,
        });
    }

    let lunch = await Lunch.findLunch(category, date)
    if (lunch) {
        await Lunch.remove(lunch._id)
    }

    res.json({
        success: true,
        message: 'removed successfully',
    })
}
