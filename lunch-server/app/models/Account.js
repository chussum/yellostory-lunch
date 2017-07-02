import mongoose, { Schema } from 'mongoose'
import crypto  from 'crypto'

require('dotenv').config()

const Account = new Schema({
    email: String,
    password: String,
    nick: String,
    thumbnail: { type: String, default: "none" },
    admin: { type: Boolean, default: false },
    o_auth: {
        facebook: {
            id: String,
            access_token: String
        },
        google: {
            id: String,
            access_token: String
        }
    }
});

// static methods
Account.statics.findUserByEmail = function(email) {
    return this.findOne({ 'email': email}).exec()
}

Account.statics.findUserByFacebookId = function(id) {
    return this.findOne({ 'o_auth.facebook.id' : id })
}

Account.statics.findUserByGoogleId = function(id) {
    return this.findOne({ 'o_auth.google.id' : id })
}

Account.statics.create = function({ email, password, nick }) {
    const encrypted = crypto
        .createHmac('sha1', process.env.SECRET_KEY)
        .update(password)
        .digest('base64')

    const user = new this({
        email,
        password: encrypted,
        nick
    })

    // return the Promise
    return user.save()
}

// verify the password of the User documment
Account.methods.verify = function(password) {
    const encrypted = crypto
        .createHmac('sha1', process.env.SECRET_KEY)
        .update(password)
        .digest('base64')

    return this.password === encrypted
}

Account.methods.assignAdmin = function() {
    this.admin = true
    return this.save()
}

Account.statics.remove = function(accountId) {
    return this.remove({_id: accountId}).exec()
}

export default mongoose.model('Account', Account)
