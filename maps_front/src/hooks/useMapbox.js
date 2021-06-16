import { useCallback, useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import { v4 as uuidV4 } from 'uuid';
import { Subject } from 'rxjs';

mapboxgl.accessToken =
  'pk.eyJ1IjoiZWFtemVhIiwiYSI6ImNrcHJscGg5bjAzN2kybnF1bzFxMjV6YWkifQ.jC32_6cucrnbsCdC7dCbhQ';

const useMapbox = initialPoint => {
  const mapElement = useRef(null);
  const setRef = useCallback(node => {
    mapElement.current = node;
  }, []);

  const markers = useRef({});

  const markerMovement = useRef(new Subject());
  const newMarker = useRef(new Subject());

  const globalMap = useRef();
  const [coordsState, setCoordsState] = useState(initialPoint);

  const addMarker = useCallback((event, id) => {
    const { lng, lat } = event.lngLat || event;

    const marker = new mapboxgl.Marker();

    marker.id = id ?? uuidV4();

    marker.setLngLat([lng, lat]).addTo(globalMap.current).setDraggable(true);

    markers.current[marker.id] = marker;

    if (!id) {
      newMarker.current.next({ id: marker.id, lng, lat });
    }

    marker.on('drag', ({ target }) => {
      const { id } = target;
      const { lng, lat } = target.getLngLat();

      markerMovement.current.next({
        id,
        lng,
        lat,
      });
    });
  }, []);

  const updateMarker = useCallback(({ id, lng, lat }) => {
    markers.current[id].setLngLat([lng, lat]);
  }, []);

  useEffect(() => {
    const map = new mapboxgl.Map({
      container: mapElement.current,
      style: 'mapbox://styles/mapbox/streets-v11',
      center: [initialPoint.lng, initialPoint.lat],
      zoom: initialPoint.zoom,
    });

    globalMap.current = map;
  }, [initialPoint]);

  useEffect(() => {
    globalMap.current?.on('move', () => {
      const { lng, lat } = globalMap.current.getCenter();
      setCoordsState({
        lng: lng.toFixed(4),
        lat: lat.toFixed(4),
        zoom: globalMap.current.getZoom().toFixed(2),
      });
    });

    return globalMap.current?.off('move');
  }, []);

  useEffect(() => {
    globalMap.current?.on('click', addMarker);
  }, [addMarker]);

  return {
    coordsState,
    setRef,
    markers,
    addMarker,
    updateMarker,
    newMarker$: newMarker.current,
    markerMovement$: markerMovement.current,
  };
};

export default useMapbox;
