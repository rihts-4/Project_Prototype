import React, { useRef, useState } from 'react';
import MapView, { Marker } from 'react-native-maps';

const MapWithBoundaries = () => {
  const mapRef = useRef(null);
  const [visibleObjects, setVisibleObjects] = useState([]);

  // Your objects data
  const allObjects = [
    { id: 'a_1', latitude: 37.78825, longitude: -122.4324, title: 'Object 1' },
    { id: 'b_2', latitude: 37.78925, longitude: -122.4344, title: 'Object 2' },
    { id: 'a_3', latitude: 37.79025, longitude: -122.4364, title: 'Object 3' },
    // Add your objects...
  ];

  // Get boundaries and filter objects on pan drag
  const handlePanDrag = async () => {
    if (mapRef.current) {
      try {
        const boundaries = await mapRef.current.getMapBoundaries();
        const objectsInView = allObjects.filter(obj => 
          obj.latitude >= boundaries.southWest.latitude &&
          obj.latitude <= boundaries.northEast.latitude &&
          obj.longitude >= boundaries.southWest.longitude &&
          obj.longitude <= boundaries.northEast.longitude
        );
        setVisibleObjects(objectsInView);
      } catch (error) {
        console.error('Error getting boundaries:', error);
      }
    }
  };

  return (
    <MapView
      ref={mapRef}
      style={{ flex: 1 }}
      initialRegion={{
        latitude: 37.78825,
        longitude: -122.4324,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
      }}
      onPanDrag={handlePanDrag}
    >
      {visibleObjects.map(obj => (
        <Marker
          key={obj.id}
          coordinate={{
            latitude: obj.latitude,
            longitude: obj.longitude,
          }}
          title={obj.title}
          pinColor={obj.id.startsWith('a_') ? "red" : obj.id.startsWith('b_') ? "blue" : "green"}
        />
      ))}
    </MapView>
  );
};

export default MapWithBoundaries;