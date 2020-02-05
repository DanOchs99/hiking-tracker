import * as actionTypes from '../types/types'

const initialState = { locations: [], message: '' }

const reducer = (state = initialState, action) => {
    switch(action.type) {
        case actionTypes.ADD_LOCATION:
            return {...state,
                    locations: state.locations.concat(action.payload) }
        case actionTypes.SET_MESSAGE:
            return {...state,
                message: action.payload }
        default:
            return state;
    }
}

export default reducer