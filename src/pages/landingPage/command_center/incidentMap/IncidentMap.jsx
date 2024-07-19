import { useState, useEffect } from 'react';
import { apiIncident, baseUrl } from '../../../../api/api';
import axios from 'axios';
import { Table, TableHead, TableRow, TableCell, TableBody } from '@mui/material';
import "leaflet/dist/leaflet.css";
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import markerIcon from '../../../../assets/landing/marker.svg';

// Import your custom marker icon

export default function ReportTracker() {
  const [incidentData, setIncidentData] = useState([]);
  
  useEffect(() => {
    const fetchIncident = async () => {
      try {
        const incidentResponse = await axios.get(apiIncident);
        setIncidentData(incidentResponse.data.success);
        console.log("Incident", incidentResponse.data);
      } catch (error) {
        console.log(error);
      }
    };

    fetchIncident();
  }, []);

  // Create a custom marker icon
  const customIcon = L.icon({
    iconUrl: markerIcon,
    iconSize: [32, 32], // Adjust the size of the icon as needed
    iconAnchor: [16, 32], // Center the icon on its position
  });

  return (
      <div className="w-[80%] px-5">
        <h2 className="text-[#298BD9] text-[1rem] font-extrabold py-4">Incident Location map</h2>
        <div style={{ width: '100%', height: '700px' }}>
          <MapContainer
            center={[13.9041, 121.6023]}
            zoom={6}
            style={{ width: '100%', height: '100%' }}
          >
            <TileLayer 
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            {incidentData.map((incident, index) => (
              <Marker
                key={index}
                position={[
                  parseFloat(incident.glatitude_incident) || 0,
                  parseFloat(incident.glongitude_incident) || 0
                ]}
                icon={customIcon} // Use the custom icon
              >
                <Popup>
                  <div>
                    <b>{incident.type_details.type_name}</b><br />
                    {incident.address_incident}
                  </div>
                </Popup>
              </Marker>
            ))}
          </MapContainer>
        </div>

       <span>
       <h2 className="text-[#298BD9] text-[1rem] font-extrabold py-4">Incident List</h2>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell><b>Type</b></TableCell>
              <TableCell><b>Incident Details</b></TableCell>
              <TableCell><b>Incident Address</b></TableCell>
              <TableCell><b>Incident Image</b></TableCell>
              <TableCell><b>Reporter Address</b></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {incidentData.map((item, index) => (
              <TableRow key={index}>
                <TableCell>{item.type_details.type_name}</TableCell>
                <TableCell>{item?.incident_details ?? "--"}</TableCell>
                <TableCell>{item.address_incident}</TableCell>
                <TableCell>
                  {item.incident_image ? (
                    <img src={`${baseUrl}${item.incident_image}`} alt="Incident" style={{ maxWidth: '100px' }} />
                  ) : (
                    "No image available"
                  )}
                </TableCell>
                <TableCell>{item.address_reported}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
       </span>
      </div>
  );
}
