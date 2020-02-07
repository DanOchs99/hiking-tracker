import React from 'react'
import './Places.css'
import {connect} from 'react-redux'
import * as actionCreators from '../store/actions/creators'

function Places(props) {
    const handleDeleteClick = (e) => {
        props.onDelete(e.target.id, props.token)
    }

    const styles = {margin: 10}
    const placesElements = props.locations.map((loc, index) => {
        const showDate = loc.date.toString()
        const mapURL = `https://www.latlong.net/c/?lat=${loc.lat}&long=${loc.lon}`
        return(
               <div key={index} style={styles}>
                 <div>Lat: {loc.lat}</div>
                 <div>Lon: {loc.lon}</div>
                 <div>Date: {showDate}</div>
                 <button onClick={handleDeleteClick} id={loc.id}>X</button>
                 <a href={mapURL}>Map</a>
               </div>
        );
    })
    
    return(
        <div>{placesElements}</div>
    );
}

const mapStateToProps = (state) => {
    return { locations: state.locations,
             token: state.token }
}

const mapDispatchToProps = (dispatch) => {
    return { onDelete: (id, token) => { dispatch(actionCreators.onDelete(id, token)) } }
}

export default connect(mapStateToProps, mapDispatchToProps)(Places)
