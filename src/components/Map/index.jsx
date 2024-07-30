import { GoogleMap, LoadScript, Marker, InfoWindow } from '@react-google-maps/api';
import { useState } from 'react';
import Loading from '../Loading';
import Styles from "./Styles.module.css";

const containerStyle = {
    width: '100%',
    height: '100%'
};

const MapGenerator = ({ focusOn, MarkLocations, zoom = 5 }) => {
    const key = process.env.REACT_APP_GMAK;
    let p = process.env
    console.log({p});
    const [selectedMarker, setSelectedMarker] = useState(null);
    return (<LoadScript
        googleMapsApiKey={key}
        loadingElement={<Loading />}
    >
        <GoogleMap
            mapContainerStyle={containerStyle}
            center={focusOn}
            zoom={zoom}
        >
            {MarkLocations.length && MarkLocations.map((location, index) => (
                <Marker
                    key={index}
                    icon={location.icon || "/assets/marker.png"}
                    position={{ lat: location.lat, lng: location.lng }}
                    onClick={() => setSelectedMarker(location)}
                />
            ))}

            {selectedMarker && (
                <InfoWindow
                    position={{ lat: selectedMarker.lat, lng: selectedMarker.lng }}
                    onCloseClick={() => setSelectedMarker(null)}
                >
                    <div className={Styles.markerHolder}>
                        <h2>{selectedMarker.title}</h2>
                        {selectedMarker?.content && <div dangerouslySetInnerHTML={{ __html: selectedMarker?.content }} />}
                    </div>
                </InfoWindow>
            )}
        </GoogleMap>
    </LoadScript>)
}

export default MapGenerator