import React, { useContext, useEffect } from 'react';
import { SocketContext } from '../context/SocketContext';
import useMapbox from '../hooks/useMapbox';

const initialPoint = {
  lng: 5,
  lat: 34,
  zoom: 2,
};

const MapPage = () => {
  const { socket } = useContext(SocketContext);
  const {
    coordsState: coords,
    setRef,
    newMarker$,
    markerMovement$,
    addMarker,
    updateMarker,
  } = useMapbox(initialPoint);

  useEffect(() => {
    socket.on('active_markers', markers => {
      for (const key of Object.keys(markers)) {
        addMarker(markers[key], key);
      }
    });
  }, [socket, addMarker]);

  useEffect(() => {
    newMarker$.subscribe(markerT => {
      socket.emit('new_marker', markerT);
    });
  }, [newMarker$, socket]);

  useEffect(() => {
    markerMovement$.subscribe(marker => {
      socket.emit('update_marker', marker);
    });
  }, [markerMovement$, socket]);

  useEffect(() => {
    socket.on('update_marker', marker => {
      console.log(marker);
      updateMarker(marker);
    });
  }, [socket, updateMarker]);

  useEffect(() => {
    socket.on('new_marker', marker => {
      addMarker(marker, marker.id);
    });
  }, [socket, addMarker]);

  return (
    <>
      <div className="info">
        LNG: {coords.lng} | LAT: {coords.lat} | ZOOM: {coords.zoom}
      </div>
      <div ref={setRef} className="map-container"></div>
    </>
  );
};

export default MapPage;
