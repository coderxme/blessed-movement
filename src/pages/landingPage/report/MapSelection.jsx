/* eslint-disable react/prop-types */
import { useState } from 'react';
import { Marker, useMapEvents } from 'react-leaflet';
import L from 'leaflet';

// Import the image
import markerIcon from '../../../assets/landing/location.svg'; // Adjust the path to your image file

// Define a custom icon
const customIcon = new L.Icon({
  iconUrl: markerIcon,
  iconSize: [32, 32],
  iconAnchor: [16, 32],
});

function MapSelection({ onChange }) {
  const [position, setPosition] = useState(null);

  useMapEvents({
    click(e) {
      const { lat, lng } = e.latlng;
      setPosition([lat, lng]);
      onChange({ lat, lng });
    },
  });

  return position === null ? null : <Marker position={position} icon={customIcon} />;
}

export default MapSelection;
