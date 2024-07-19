/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/prop-types */
import { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import 'leaflet/dist/leaflet.css';
import { apiIncident,  apiIncidentType} from '../../../api/api';
// import { apiIncident, apiIncidentSeverity, apiIncidentType ,getCsrfTokenUrl } from '../../../api/api';
import { MapContainer, TileLayer, Marker} from 'react-leaflet';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';
import MapSelection from './MapSelection';
import L from 'leaflet';
import GetToken from '../../../components/token/GetToken'

// Import the image
import markerIcon from '../../../assets/landing/location.svg'; // Adjust the path to your image file

// Define a custom icon
const customIcon = new L.Icon({
  iconUrl: markerIcon,
  iconSize: [32, 32],
  iconAnchor: [16, 32],
});



export default function NewReport() {
  const csrfToken = GetToken()
  // const [incidentSeverity, setIncidentSeverity] = useState([])
  const [incidentType, setIncidentType] = useState([])
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
// Define a state to track whether the device marker should be displayed
const [showDeviceMarker, setShowDeviceMarker] = useState(true);
  const [formData, setFormData] = useState({
    type: '',
    incident_details: '',
    glongitude_incident: '',
    glatitude_incident: '',
    address_incident: '',
    glongitude_reported: '',
    glatitude_reported: '',
    incident_image: null,
    address_reported: ''
  });

  // Inside your functional component
const [locationChoice, setLocationChoice] = useState('map');
const [deviceLocation, setDeviceLocation] = useState(null);
const mapRef = useRef(null);
const initialZoom = 5;


const handleLocationChoiceChange = (event) => {
  if (event.target.value === 'map') {
    // Reset the map's zoom level
    if (mapRef.current) {
      mapRef.current.setView([12.8797, 121.774], initialZoom);
    }
  }
  // Handle other location choices if needed
  setLocationChoice(event.target.value);

};



const handleDeviceLocation = () => {
  console.log('Attempting to get device location...');
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        console.log('Device location retrieved successfully:', position.coords);
        const { latitude, longitude } = position.coords;
        setDeviceLocation({ latitude, longitude });

        // Update the map's center and zoom level
        mapRef.current.setView([latitude, longitude], 14,  { animate: true }); // 14 is an example zoom level

        setShowDeviceMarker(true); // Show the device marker again
        try {
          const response = await axios.get(`https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`);
          const { address } = response.data;
          const { road, city, county, state, postcode, country, building } = address;
          const formattedAddress = `${building ? building + ', ' : ''}${road ? road + ', ' : ''}${city ? city + ', ' : ''}${county ? county + ', ' : ''}${state ? state + ', ' : ''}${postcode ? postcode + ', ' : ''}${country ? country : ''}`;
          setFormData((prevFormData) => ({
            ...prevFormData,
            address_incident: formattedAddress
          }));
        } catch (error) {
          console.error('Error fetching address:', error);
        }
      },
      (error) => {
        console.error('Error getting user location:', error);
      }
    );
  } else {
    console.error('Geolocation is not supported by this browser.');
  }
};



  const handleOpenSnackbar = (message) => {
    setSnackbarMessage(message);
    setOpenSnackbar(true);
  };

  const handleCloseSnackbar = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpenSnackbar(false);
  };
  
  


  useEffect(() => {
    const fetchUserLocation = () => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const { latitude, longitude } = position.coords;
            setFormData({
              ...formData,
              glatitude_reported: latitude,
              glongitude_reported: longitude,

              glatitude_incident: latitude,
              glongitude_incident: longitude,
            });
            
          },
          (error) => {
            console.error('Error getting user location:', error);
          }
        );
      } else {
        console.error('Geolocation is not supported by this browser.');
      }
    };

    fetchUserLocation();
  }, []);
  

  useEffect(() => {
    const fetchAddress = async () => {
      try {
        const response = await axios.get(`https://nominatim.openstreetmap.org/reverse?lat=${formData.glatitude_reported}&lon=${formData.glongitude_reported}&format=json`);
        const { address } = response.data;
        const { road, city, county, state, postcode, country, building } = address;
        const formattedAddress = `${building ? building + ', ' : ''}${road ? road + ', ' : ''}${city ? city + ', ' : ''}${county ? county + ', ' : ''}${state ? state + ', ' : ''}${postcode ? postcode + ', ' : ''}${country ? country : ''}`;
        setFormData((prevFormData) => ({
          ...prevFormData,
          address_reported: formattedAddress,
        }));

        console.log('Address response:', response);
      } catch (error) {
        console.error('Error fetching address:', error);
      }
    };
  
    if (formData.glatitude_reported && formData.glongitude_reported) {
      fetchAddress();
    }
  }, [formData.glatitude_reported, formData.glongitude_reported]);
  


  useEffect(() => {
    const fetchIncident = async () => {
      try {
        // const serverityResponse = await axios.get(apiIncidentSeverity);
        // setIncidentSeverity(serverityResponse.data.success);

        const typeResponse = await axios.get(apiIncidentType);
        setIncidentType(typeResponse.data.success);

        const incidentResponse = await axios.get(apiIncident);
        console.log("Incident", incidentResponse.data)
        // console.log("Incident Serverity", serverityResponse.data)
        console.log("Incident Type", typeResponse.data)
      } catch (error) {
        console.log(error);
      }
    };

    fetchIncident();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.onloadend = () => {
      let base64String = reader.result.split(',')[1]; // Extract base64 string without the prefix
      const filename = file.name;
      const photo = {
        data: base64String,
        filename: filename
      };
      setFormData({
        ...formData,
        incident_image: photo
      });
    };
    reader.readAsDataURL(file);
  };
  
  const handleMapChange = async (location) => {
    try {
      const response = await axios.get(`https://nominatim.openstreetmap.org/reverse?lat=${location.lat}&lon=${location.lng}&format=json`);
      const { address } = response.data;
      const { road, city, county, state, postcode, country } = address;
      const formattedAddress = `${road ? road + ', ' : ''}${city ? city + ', ' : ''}${county ? county + ', ' : ''}${state ? state + ', ' : ''}${postcode ? postcode + ', ' : ''}${country ? country : ''}`;
      setFormData({
        ...formData,
        glatitude_incident: location.lat,
        glongitude_incident: location.lng,
        address_incident: formattedAddress
      });
      console.log('address map', response)
      // Hide the device marker when the user selects a location on the map
      setShowDeviceMarker(false);
    } catch (error) {
      console.error('Error fetching address:', error);
    }
  };


  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(apiIncident, formData, {
        headers: {
          'X-CSRFToken': csrfToken // Add CSRF token to request headers
        }
      });
      console.log('Report submitted:', response.data);
      handleOpenSnackbar('Report submitted successfully!');
      // Reset formData state
      setFormData({
        type: '',
        incident_details: '',
        glongitude_incident: '',
        glatitude_incident: '',
        address_incident: '',
        glongitude_reported: '',
        glatitude_reported: '',
        incident_image: null,
        address_reported: ''
      });
    } catch (error) {
      console.error('Error submitting report:', error);
    }
  };

  return (
    <div className="h-full flex flex-col items-center font-montserrat bg-[#EBF4FD] pt-10">
     
      <div className="w-[80%] px-5">
     

      <Snackbar
          open={openSnackbar}
          autoHideDuration={3000} // Set auto hide duration to 3 seconds
          onClose={handleCloseSnackbar}
          anchorOrigin={{ vertical: 'top', horizontal: 'center' }} // Position Snackbar at the top center
        >
        <MuiAlert
          elevation={6}
          variant="filled"
          onClose={handleCloseSnackbar}
          severity="success"
        >
    {snackbarMessage}
  </MuiAlert>
</Snackbar>



        <h2 className="text-[#298BD9] text-[2rem] font-extrabold">New Report</h2>
        <form onSubmit={handleSubmit } className='flex flex-col gap-3 mt-10'>
          
          {/* <select name="severity" value={formData.severity} onChange={handleChange}>
             <option value="">Select Severity</option>
                {incidentSeverity.map((item, index) => (
                  <option key={index} value={item.id}>{item.severity_name}</option>
                ))}
           </select> */}



        
          <label htmlFor="" className='flex flex-col'>
            <span className="text-[#298BD9] text-[1rem] font-extrabold py-4">Incident Type</span>
          <select className='p-3' name="type" value={formData.type} onChange={handleChange}>
              <option value="">Select Incident Type</option>
                {incidentType.map((item, index) => (
                  <option key={index} value={item.id}>{item.type_name}</option>
                ))}
           </select>
          </label>

          <label className='flex flex-col'>
          <span className="text-[#298BD9] text-[1rem] font-extrabold py-4">Incident Details</span>
          <textarea className='h-[100px]'  name="incident_details" value={formData.incident_details} onChange={handleChange} placeholder="Incident details" />
          </label>


          <div>
            <p className="text-[#298BD9] text-[1rem] font-extrabold py-4">Incident Location/ Address</p>
       <div className="flex gap-3 items-center">

       <label>
        <input
          type="radio"
          value="map"
          checked={locationChoice === 'map'}
          onChange={handleLocationChoiceChange}
          
        />
        Select on Map
      </label>
      <label>
        <input
          type="radio"
          value="device"
          checked={locationChoice === 'device'}
          onChange={handleLocationChoiceChange}
          onClick={handleDeviceLocation} 
        />
        Use Current Location
      </label>
       </div>
    </div>

      <MapContainer  ref={mapRef}  center={[12.8797, 121.774]}  zoom={initialZoom} style={{ height: '400px', width: '100%' }}>
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                {/* Conditionally render MapSelection if deviceLocation is not selected */}
        {locationChoice !== 'device' && <MapSelection onChange={handleMapChange} />}
        {/* Render the deviceLocation marker only if locationChoice is 'device' and showDeviceMarker is true */}
        {locationChoice === 'device' && showDeviceMarker && deviceLocation && (
          <Marker position={[deviceLocation.latitude, deviceLocation.longitude]} icon={customIcon} />
        )}
      </MapContainer>

   

          <input type="text" className='p-3' name="address_incident" value={formData.address_incident} onChange={handleChange} placeholder="Address incident" />
          


          <input  hidden type="text" name="glongitude_incident" value={formData.glongitude_incident} onChange={handleChange} placeholder="Glongitude incident" />
          <input  hidden type="text" name="glatitude_incident" value={formData.glatitude_incident} onChange={handleChange} placeholder="Glatitude incident" />
          {/* Glongitude reported */}
          <input hidden type="text" name="glongitude_reported" value={formData.glongitude_reported} onChange={handleChange} placeholder="Glongitude reported" />
          <input hidden  type="text" name="glatitude_reported" value={formData.glatitude_reported} onChange={handleChange} placeholder="Glatitude reported" />
        
           <label htmlFor="" className='flex flex-col'>
            <span className="text-[#298BD9] text-[1rem] font-extrabold py-4">Incident Image</span>
              <input type="file" name="incident_image" onChange={handleFileChange} />
           </label>

           <label htmlFor="" className='flex flex-col'>
            <span className="text-[#298BD9] text-[1rem] font-extrabold py-3">Reported Addresss</span>
              <input className='p-4' type="text" name="address_reported" value={formData.address_reported} onChange={handleChange} placeholder="Address reported" />
           </label>
  
          <button type="submit" className='bg-[#298BD9] text-white p-3'>Submit</button>
        </form>
      </div>
    </div>
  );
}

