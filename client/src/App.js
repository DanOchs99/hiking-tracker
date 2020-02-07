import React, {useState, useEffect } from 'react';
import './App.css';
import Places from './components/Places'
import {connect} from 'react-redux'
import * as actionCreators from './store/actions/creators'

function App(props) {
  const [message, setMessage] = useState('')
  const [login, setLogin] = useState({})

  const destructuredPropisAuthenticated = props.isAuthenticated
  const destructuredPropgetLocations = props.getLocations
  const destructuredProptoken = props.token
  useEffect(()=>{
      if (destructuredPropisAuthenticated) {
        destructuredPropgetLocations(destructuredProptoken)
      }
  },[destructuredPropisAuthenticated, destructuredPropgetLocations, destructuredProptoken])

  const handleClickSave = () => {
    // user clicked the SAVE button
    setMessage("Getting location...")
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
          let loc = {lat: position.coords.latitude.toFixed(6), lon: position.coords.longitude.toFixed(6)}
          props.addLocation(loc, props.token);
          // TODO: show error message from the server here...
          setMessage('');
      }, (error) => {
          switch(error.code) {
              case error.PERMISSION_DENIED:
                  setMessage("User denied the request for Geolocation.")
                  break;
              case error.POSITION_UNAVAILABLE:
                  setMessage("Location information is unavailable.")
                  break;
              case error.TIMEOUT:
                  setMessage("The request to get user location timed out.")
                  break;
              case error.UNKNOWN_ERROR:
                  setMessage("An unknown error occurred.")
                  break;
              default:
                  setMessage("An unknown error occurred.")
                  break;
          }
      })
    } else {
        setMessage("Geolocation is not supported by this browser.")
    }
  }

  const handleClickLogin = () => {
      props.onLogin(login)
  }

  const handleClickLogout = () => {
      props.onLogoff()
      setMessage('')
  }

  const handleClickRegister = () => {
      props.onRegister(login)
  }

  const handleClickProfile = () => {
      // TODO: add ability for user to set / modify their email here...
      setMessage("TODO: add this feature...")
  }

  const handleOnChangeLogin = (e) => {
      setLogin({...login, [e.target.name]: e.target.value})
  }

  return (
    <div id="container">
      <h2>Hiking Tracker</h2>
      {!props.isAuthenticated && <div id="loginDiv">
                                   <button id="loginButton" onClick={handleClickLogin}>Login</button>
                                   <button id="registerButton" onClick={handleClickRegister}>Register</button>
                                 </div> }
      {!props.isAuthenticated && <input onChange={handleOnChangeLogin} id="usernameTextbox" type="text" name="username" placeholder="username" />}
      {!props.isAuthenticated && <input onChange={handleOnChangeLogin} id="passwordTextbox" type="password" name="password" placeholder="password" />}
      {props.isAuthenticated && <div id="logoutDiv">
                                  <div id="userDiv">{props.username}</div>
                                  <button id="profileButton" onClick={handleClickProfile}>Profile</button>
                                  <button id="logoutButton" onClick={handleClickLogout}>Logout</button>
                                </div> }
      {props.isAuthenticated && <Places />}
      {props.isAuthenticated && <button id="saveLocationButton" onClick={handleClickSave}>SAVE</button>}
      <div>{message}</div>
    </div>
  );
}

const mapStateToProps = (state) => {
  return { isAuthenticated: state.isAuthenticated,
           username: state.username,
           token: state.token }
}

const mapDispatchToProps = (dispatch) => {
  return { addLocation: (loc, token) => dispatch(actionCreators.addLocation(loc, token)),
           getLocations: (token) => dispatch(actionCreators.getLocations(token)),
           onLogin: (user) => dispatch(actionCreators.onLogin(user)),
           onRegister: (user) => dispatch(actionCreators.onRegister(user)),
           onLogoff: () => dispatch(actionCreators.onLogoff()) }
}

export default connect(mapStateToProps, mapDispatchToProps)(App)
