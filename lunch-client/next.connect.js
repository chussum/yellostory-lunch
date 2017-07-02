import nextConnectRedux from 'next-connect-redux'
import { createStore, applyMiddleware } from 'redux'
import thunkMiddleware from 'redux-thunk'
import reducer from 'reducers'

export const initStore = (initialState = {}) => {
    return createStore(reducer, initialState, applyMiddleware(thunkMiddleware))
}

export const nextConnect = nextConnectRedux(initStore)
