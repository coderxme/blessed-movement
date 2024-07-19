import { useState, useEffect } from 'react';
import { apiIncident, baseUrl } from '../../../api/api';
import axios from 'axios';
import { Table, TableHead, TableRow, TableCell, TableBody } from '@mui/material';
// import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
// import L from 'leaflet';
// import iconSvg from '../../../assets/landing/marker.svg'; // Import your custom SVG icon

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

  // // Define custom icon
  // const customIcon = new L.Icon({
  //   iconUrl: iconSvg, // Path to your custom icon SVG
  //   iconSize: [30, 30], // Size of the icon
  // });

  return (
    <div className="h-full flex flex-col items-center font-montserrat bg-[#EBF4FD] pt-10">
      <div className="w-[80%] px-5">
        <h2 className="text-[#298BD9] text-[2rem] font-extrabold py-20">Report History</h2>
       <div>
        {/* <p>Incident Location Map</p>
         <MapContainer center={[13.9041, 121.6023]} zoom={3} style={{ height: '500px', width: '100%' }}>
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
          {incidentData.map((incident, index) => (
            <Marker key={index}
              position={[
                parseFloat(incident.glatitude_incident) || 0,
                parseFloat(incident.glongitude_incident) || 0
              ]}
              icon={customIcon} // Set custom icon
            >
              <Popup>
                <div>
                  <b>{incident.type_details.type_name}</b><br />
                  {incident.address_incident}
                </div>
              </Popup>
            </Marker>
          ))}
        </MapContainer> */}
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
                <TableCell><img className='w-[300px]' src={`${baseUrl}${item.incident_image}`} alt="" /></TableCell>
                <TableCell>{item.address_reported}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
       </div>
      </div>
    </div>
  );
}
