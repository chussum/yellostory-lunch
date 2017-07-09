import Account from '../models/Account'

/**
 * @api {get} /user/:id get
 * @apiGroup User
 *
 * @apiSuccess {Bool} success
 * @apiSuccess {String} message
 */
export const get = (req, res) => {
    let id = parseInt(req.params.id, 10)

    if (!id) {
        return res.status(400).json({
            success: false,
            message: '잘못된 아이디'
        })
    }

    return res.status(404).json({
        success: false,
        message: '사용자를 찾을 수 없습니다.'
    })
}


/**
 * @api {post} /user create
 * @apiGroup User
 */
export const create = async (req, res) => {
    let errorMessage, errorCode
    let emailRegex = /^([a-zA-Z0-9_\.\-\+])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/
    let { email, password, repassword, nick } = req.body

    !errorMessage && !email && (errorMessage = '이메일을 입력해주세요.') && (errorCode = 'email')
    !errorMessage && !emailRegex.test(email) && (errorMessage = '이메일을 확인해주세요.') && (errorCode = 'email')
    !errorMessage && !password && (errorMessage = '비밀번호를 입력해주세요.') && (errorCode = 'password')
    !errorMessage && !repassword && (errorMessage = '비밀번호 확인을 입력해주세요.') && (errorCode = 'repassword')
    !errorMessage && password !== repassword && (errorMessage = '비밀번호가 일치하지 않습니다.') && (errorCode = 'repassword')
    !errorMessage && !nick && (errorMessage = '닉네임을 입력해주세요.') && (errorCode = 'nick')

    if (errorMessage) {
        return res.status(400).json({
            success: false,
            code: errorCode,
            message: errorMessage,
        })
    }

    let user = await Account.findUserByEmail(email)
    if (user) {
        return res
            .status(409)
            .json({
                success: false,
                code: 'email',
                message: '이미 가입되어 있는 이메일입니다.'
            })
    }

    await Account.create({ email, password, nick })

    res.json({
        success: true,
        message: 'registered successfully',
    })
}
