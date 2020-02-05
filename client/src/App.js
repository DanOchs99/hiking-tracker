import React from 'react';
import './App.css';
import Places from './components/Places'
import {connect} from 'react-redux'
import * as actionCreators from './store/actions/creators'

function App(props) {
  const handleClick = () => {
    // user clicked the SAVE button
    props.setMessage("Getting location...")
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
          let timestamp = new Date();
          let loc = {lat: position.coords.latitude, lon: position.coords.longitude, date: timestamp}
          props.addLocation(loc);
          // TODO : not sure why props.message comes back as empty here...
          if (props.message === '') {
              props.setMessage("location saved!")        
          }
      }, (error) => {
          switch(error.code) {
              case error.PERMISSION_DENIED:
                  props.setMessage("User denied the request for Geolocation.")
                  break;
              case error.POSITION_UNAVAILABLE:
                  props.setMessage("Location information is unavailable.")
                  break;
              case error.TIMEOUT:
                  props.setMessage("The request to get user location timed out.")
                  break;
              case error.UNKNOWN_ERROR:
                  props.setMessage("An unknown error occurred.")
                  break;
              default:
                  props.setMessage("An unknown error occurred.")
                  break;
          }
      })
    } else {
      props.setMessage("Geolocation is not supported by this browser.")
    }
  }

  return (
    <div id="container">
      <h2>Hiking Tracker</h2>
      <Places />
      <button id="saveLocationButton" onClick={handleClick}>SAVE</button>
      <div>{props.message}</div>
    </div>
  );
}

const mapStateToProps = (state) => {
  return { message: state.message }
}

const mapDispatchToProps = (dispatch) => {
  return { addLocation: (loc) => dispatch(actionCreators.addLocation(loc)),
           setMessage: (msg) => dispatch(actionCreators.setMessage(msg)) }
}

export default connect(mapStateToProps, mapDispatchToProps)(App)
