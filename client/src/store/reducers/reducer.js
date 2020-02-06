import * as actionTypes from '../types/types'

const initialState = { locations: [], isAuthenticated: false, user: {username: null, id: 0}, token: '' }

const reducer = (state = initialState, action) => {
    switch(action.type) {
        case actionTypes.ADD_LOCATION:
            return {...state,
                    locations: state.locations.concat(action.payload) }
        case actionTypes.ON_LOGIN:
            return {...state,
                isAuthenticated: true,
                user: {username: action.payload.username, id: action.payload.id },
                token: action.payload.token }
        case actionTypes.ON_LOGOFF:
            return {...state,
                isAuthenticated: false,
                user: {username: null, id: 0},
                token: '' }
        default:
            return state;
    }
}

export default reducer
