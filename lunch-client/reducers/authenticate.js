import { READY, AUTH_USER, UNAUTH_USER, AUTH_ERROR } from 'constants/ActionTypes';

const INITIAL_STATE = {
    error: '',
    content: '',
    fetching: false,
    authenticated: false
}

export default function (state = INITIAL_STATE, action) {
    switch (action.type) {
        case READY:
            return {
                ...state,
                fetching: true
            }
        case AUTH_USER:
            return {
                ...state,
                authenticated: true,
                fetching: false,
                content: action.payload,
                error: '',
            }
        case UNAUTH_USER:
            return {
                ...state,
                authenticated: false,
                fetching: false,
                content: '',
                error: '',
            }
        case AUTH_ERROR:
            const code = action.code

            return {
                ...state,
                authenticated: false,
                fetching: false,
                content: '',
                error: {
                    message: action.payload,
                    code
                },
            }
    }

    return state;
}
