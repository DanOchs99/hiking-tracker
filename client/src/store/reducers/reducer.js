import * as actionTypes from '../types/types'

const initialState = { locations: [], isAuthenticated: false, username: null }

const reducer = (state = initialState, action) => {
    switch(action.type) {
        case actionTypes.GET_LOCATIONS:
            return {...state,
                    locations: action.payload }
        case actionTypes.ON_LOGIN:
            return {...state,
                isAuthenticated: true,
                username: action.payload.username,
                token: action.payload.token }
        case actionTypes.ON_LOGOFF:
            return {...state,
                isAuthenticated: false,
                username: null,
                token: '' }
        default:
            return state;
    }
}

export default reducer
