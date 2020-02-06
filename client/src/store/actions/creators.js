import * as actionTypes from '../types/types'

const addLocationActionCreator = (loc) => {
    return ({type: actionTypes.ADD_LOCATION, payload: loc});
}

const onLoginActionCreator = (user) => {
    return ({type: actionTypes.ON_LOGIN, payload: user})
}

const onLogoffActionCreator = () => {
    return({type: actionTypes.ON_LOGOFF})
}

export const addLocation = (loc, token) => {
    return (dispatch) => {
        fetch("http://localhost:8080/add", {
            method: 'POST',  
            body: JSON.stringify({location: loc }),
            headers: {
                "Content-Type": "application/json",
                "authorization": `Bearer ${token}`
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
               console.log(`Server returned code ${response.status}`)
            }
        })
    }
}

export const onLogin = (user) => {
    return (dispatch) => {
        fetch("http://localhost:8080/login", {
            method: 'POST',  
            body: JSON.stringify({user: user }),
            headers: {
                "Content-Type": "application/json"
            }
        })
        .then((response)=> {  
            if (response.status === 200) {
                response.json()
                .then((json) => {
                    localStorage.setItem('token', json.token)
                    user['token'] = json.token
                    dispatch(onLoginActionCreator(user));
                });
            }
            else {
               console.log(`Server returned code ${response.status}`)
            }
        })
    }
}

export const onRegister = (user) => {
    return (dispatch) => {
        fetch("http://localhost:8080/register", {
            method: 'POST',  
            body: JSON.stringify({user: user }),
            headers: {
                "Content-Type": "application/json"
            }
        })
        .then((response)=> {  
            if (response.status === 200) {
                response.json()
                .then((json) => {
                    localStorage.setItem('token', json.token)
                    user['token'] = json.token
                    user['id'] = json.id
                    dispatch(onLoginActionCreator(user));
                });
            }
            else {
               console.log(`Server returned code ${response.status}`)
            }
        })
    }
}




export const onLogoff = () => {
    return (dispatch) => {
        localStorage.removeItem('token')
        dispatch(onLogoffActionCreator())
    }
}
