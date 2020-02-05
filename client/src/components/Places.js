import React from 'react'
import './Places.css'
import {connect} from 'react-redux'

function Places(props) {

    const styles = {margin: 10}
    const placesElements = props.locations.map((loc, index) => {
        const showDate = loc.date.toString()
        return(
               <div key={index} style={styles}>
                 <div>Lat: {loc.lat}</div>
                 <div>Lon: {loc.lon}</div>
                 <div>Date: {showDate}</div>
               </div>
        );
    })
    
    return(
        <div>{placesElements}</div>
    );
}

const mapStateToProps = (state) => {
    return { locations: state.locations }
}

export default connect(mapStateToProps)(Places)
