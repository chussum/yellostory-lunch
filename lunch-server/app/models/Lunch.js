import mongoose, { Schema } from 'mongoose'
import moment from 'moment'

const Lunch = new Schema({
    date: Date,
    category: String,
    foods: String,
})

// static methods
Lunch.statics.findLunch = function(category, date) {
    let startDate = moment(date).startOf('day')
    let endDate = moment(startDate).add(1, 'days')
    return this.findOne({
        category,
        date: {
            $gte: startDate,
            $lt: endDate,
        },
    }).exec()
}

Lunch.statics.findAllLunch = function(category, startDate, endDate) {
    let options = { category }
    let gte = moment(startDate).startOf('day')
    let lt = moment(endDate).add(1, 'days').startOf('day')
    let date
    if (startDate) {
        !date && (date = {})
        date['$gte'] = gte
    }
    if (endDate) {
        !date && (date = {})
        date['$lt'] = lt
    }
    date && (options['date'] = date)
    return this.find(options).exec()
}

Lunch.statics.create = function({ date, category, foods }) {
    const lunch = new this({
        date,
        category,
        foods,
    })

    // return the Promise
    return lunch.save()
}

Lunch.statics.remove = function(lunchId) {
    return this.find({ _id: lunchId }).remove().exec()
}

Lunch.methods.updateLunchMenu = function(foods) {
    this.foods = foods
    return this.save()
}

export default mongoose.model('Lunch', Lunch)
