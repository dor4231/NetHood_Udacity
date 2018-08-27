/*global google*/

import React from "react"
import {compose, withProps} from "recompose"
import {withScriptjs, withGoogleMap, GoogleMap, Marker, InfoWindow} from "react-google-maps"

const lat = 32.1500,
    lng = 34.8839;

const styles = {
    mapContainer: {
        height: "calc(100% - 64px)",
        padding: 0,

    }
}


const MapComp = compose(
    withProps({
        googleMapURL: "https://maps.googleapis.com/maps/api/js?key=AIzaSyBUTQfI6CTeTw-g7tJwNbFLTy799wzRNeI&v=3.exp&libraries=geometry,drawing,places",
        loadingElement: <div style={{
            height: `100%`
        }}/>,
        containerElement: < div style={{
            height: `calc(100% - 64px)`
        }}/>,
        mapElement: < div style={{
            height: `100%`
        }}/>,
    }),
    withScriptjs,
    withGoogleMap)((props) => {
        const markerPin = {
            url: 'https://cdn0.iconfinder.com/data/icons/small-n-flat/24/678111-map-marker-512.png',
            scaledSize: new google.maps.Size(42, 43)
        };
        console.log(props.isOpen);
        return (
            <GoogleMap styles={styles.mapContainer}
                       defaultZoom={14}
                       defaultCenter={{lat: lat, lng: lng}}>

                {props.markers.filter((location) => location.type === "POI")
                    .map((marker) => {
                        console.log(marker.position.lng);
                        if (props.isMarkerShown) {
                            return (
                            <Marker defaultIcon={markerPin}
                                        key={marker.id}
                                        position={{lat: marker.position.lat, lng: marker.position.lon}}
                                        onClick={(e) => props.onToggleOpen(marker.id)}>
                            {props.isOpen[marker.id] && (
                                <InfoWindow onCloseClick={props.closeWindows}>
                                    <p>Dor Bar</p>
                                </InfoWindow>)}
                            </Marker>
                        )}
                    }
                )}
            </GoogleMap>)
    }
);

class MyFancyComponent extends React.PureComponent {
    state = {
        isMarkerShown: false,
    };

    componentDidMount() {
        this.delayedShowMarker()
    }

    delayedShowMarker = () => {
        setTimeout(() => {
            this.setState({
                isMarkerShown: true
            })
        }, 3000)
    }

    handleMarkerClick = () => {
        this.setState({
            isMarkerShown: false
        })
        this.delayedShowMarker()
    }

    render() {
        return (<MapComp isMarkerShown={this.state.isMarkerShown}
                         onMarkerClick={this.handleMarkerClick}
                         markers={this.props.markers}
                         isOpen={this.props.isOpen}
                         onToggleOpen={this.props.onToggleOpen}
                         closeWindows={this.props.closeWindows}
            />
        )
    }
}


// export default MapComp
export default MyFancyComponent