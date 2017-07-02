import axios from 'axios'
import { READY, AUTH_USER, AUTH_ERROR, UNAUTH_USER } from 'constants/ActionTypes'

export const errorHandler = async (dispatch, error, type) => {
    let errorMessage
    let statusCode
    let code

    if (error.response) {
        errorMessage = error.response.data.message || error.response.data
        statusCode = error.response.status
        code = error.response.data.code
    } else {
        errorMessage = error.message
    }

    if (!code && statusCode === 403) {
        await dispatch({
            type: type,
            payload: errorMessage,
        })
        await dispatch(logoutUser())
    } else {
        await dispatch({
            type: type,
            payload: errorMessage,
            code
        })
    }
}

export const validateToken = ({ token }) => async dispatch => {
    try {
        let response = await axios.post('/auth/token', { token })
        await dispatch({
            type: AUTH_USER,
            payload: response.data.user
        })
    } catch (error) {
        await errorHandler(dispatch, error, AUTH_ERROR)
    }
}

export const loginUser = ({email, password, remember}) => async dispatch => {
    await dispatch({type: READY})

    try {
        let response = await axios.post('/auth/login', { email, password, remember })
        let token = response.data.token

        await dispatch(validateToken({ token }))
    } catch (error) {
        await errorHandler(dispatch, error, AUTH_ERROR)
    }
}

export const registerUser = ({email, password, repassword, nick}) => async dispatch => {
    await dispatch({type: READY})

    try {
        await axios.post('/auth/register', { email, password, repassword, nick })
        await dispatch({type: AUTH_USER})
    } catch (error) {
        await errorHandler(dispatch, error, AUTH_ERROR)
    }
}

export const logoutUser = () => async dispatch => {
    await dispatch({type: READY})

    try {
        await axios.get('/auth/logout')
        await dispatch({type: UNAUTH_USER})
    } catch (error) {
        await errorHandler(dispatch, error, AUTH_ERROR)
    }
}
