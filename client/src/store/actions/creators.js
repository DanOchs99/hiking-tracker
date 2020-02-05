import * as actionTypes from '../types/types'

const addLocationActionCreator = (loc) => {
    return ({type: actionTypes.ADD_LOCATION, payload: loc});
}

const setMessageActionCreator = (msg) => {
    return ({type: actionTypes.SET_MESSAGE, payload: msg});
}

export const addLocation = (loc) => {
    return (dispatch) => {
        fetch("http://localhost:8080/add", {
            method: 'POST',  
            body: JSON.stringify({location: loc }),
            headers: {
                "Content-Type": "application/json",
                "authorization": ""
            }
        })
        .then((response)=> {  
            if (response.status === 200) {
                response.json()
                .then((json) => {
                    dispatch(addLocationActionCreator(loc));
                });
            }
            else {
                dispatch(setMessageActionCreator(`Server responded with code ${response.status}`));
            }
        })
    }
}

export const setMessage = (msg) => {
    return (dispatch) => {
        dispatch(setMessageActionCreator(msg))
    }
}
