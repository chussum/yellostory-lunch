import * as user from './user'
import Account from '../models/Account'
import jwt from 'jsonwebtoken'

export const generateToken = (user, secret, remember = false) => {
    return new Promise(resolve => {
        jwt.sign(
            {
                _id: user._id,
                email: user.email,
                nick: user.nick,
                thumbnail: user.thumbnail,
                admin: user.admin,
                remember,
            },
            secret,
            {
                expiresIn: '7d',
                subject: 'userInfo',
            }, (err, token) => {
                resolve(token)
            })
    })
}

/**
 * @api {post} /auth/register create
 * @apiGroup Authenticate
 */
export const register = (req, res) => user.create(req, res)

/**
 * @api {post} /auth/login login
 * @apiGroup Authenticate
 */
export const login = async (req, res) => {
    const { email, password, remember } = req.body
    const secret = req.app.get('jwt-secret')
    const user = await Account.findUserByEmail(email)

    let token
    let code
    let errorMessage

    if (!user) {
        errorMessage = '존재하지 않는 이메일입니다.'
        code = 'email'
    } else if (!password || !user.verify(password)) {
        errorMessage = '비밀번호를 확인해주세요.'
        code = 'password'
    }

    if (errorMessage) {
        return res.status(403).json({
            success: false,
            message: errorMessage,
            code,
        })
    }

    token = await generateToken(user, secret, remember)

    res.cookie('token', token, {
        path: '/',
        expires: remember ? new Date(Date.now() + 365 * 24 * 60 * 60 * 1000) : 0,
        httpOnly: true
    })

    res.json({
        success: true,
        message: 'logged in successfully',
        token,
    })
}

/**
 * @api {get} /auth/logout
 * @apiGroup Authenticate
 */
export const logout = (req, res) => {
    res.cookie('token', '', {
        expires: new Date(),
        httpOnly: true
    })

    res.json({
        success: true,
        message: 'logout.',
    })
}

/**
 * @api {post} /auth/verify validate token
 * @apiGroup Authenticate
 */
export const validateToken = (req, res) => {
    let secret = req.app.get('jwt-secret')
    let token = req.headers['Authorization'] || req.cookies.token || req.body.token

    if (token) {
        jwt.verify(token, secret, async (err, decoded) => {
            if (err) {
                // TokenExpiredError
                return res.status(403).send({
                    success: false,
                    message: '로그인 정보가 만료되었습니다. 다시 로그인해주세요.',
                })
            } else {
                const remember = decoded.remember
                const user = await Account.findUserByEmail(decoded.email)

                if (!user) {
                    return res.status(403).send({
                        success: false,
                        message: '로그인 정보를 찾을 수 없습니다.',
                    })
                }

                const newToken = await generateToken(user, secret, remember)

                res.cookie('token', newToken, {
                    path: '/',
                    expires: remember ? new Date(Date.now() + 365 * 24 * 60 * 60 * 1000) : 0,
                    httpOnly: true
                })

                return res.status(200).send({
                    success: true,
                    message: 'done.',
                    user: decoded,
                })
            }
        })
    } else {
        return res.status(403).send({
            success: false,
            message: '로그인 정보를 찾을 수 없습니다.'
        })
    }
}

/**
 * @api {get} /auth/exists/email/:email check exists email
 * @apiGroup Authenticate
 */
export const existsEmail = (req, res) => {
    Account
        .findUserByEmail(req.params.email)
        .then(account => {
            if (account) {
                res.json({exists: true})
            } else {
                res.json({exists: false})
            }
        })
}

export const auth = (req, res, next) => {
    let secretKey = req.app.get('jwt-secret')
    let token = req.headers['Authorization'] || req.cookies.token || req.body.token

    if (token) {
        jwt.verify(token, secretKey, (err, decoded) => {
            if (err) {
                return res.status(403).send({
                    success: false,
                    message: '로그인 정보가 만료되었습니다. 다시 로그인해주세요.'
                })
            } else {
                req.decoded = decoded
                next()
            }
        })
    } else {
        return res.status(401).send({
            success: false,
            message: '로그인이 필요한 서비스입니다.'
        })
    }
}