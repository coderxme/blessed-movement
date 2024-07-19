 /* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
import React from 'react';
import { useState, useEffect, useCallback} from 'react';
import axios from 'axios';
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import FormControl from '@mui/material/FormControl';
import { random } from 'lodash';
import { BiImageAdd } from "react-icons/bi";
import { useDropzone } from 'react-dropzone';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import Button from '@mui/material/Button';

import { 
  apiUser, 
  apiRoles, 
  getParallelGroup,
  apiAccount,
  getRegions,
} from '../../../api/api';
import GetToken from '../../../components/token/GetToken'




export default function Login({onClose}) {
  const  csrfToken = GetToken()
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [errorSignup, setErrorSignup] = useState('');

  const [rolesOptions, setRolesOptions] = useState([])
  const [selectedRole, setSelectedRole] = useState([]);
  const [account, setAccount] = useState([]);
  const [parallelGroupOptions, setParallelGroupOptions] = useState([])
  const [selectedImage, setSelectedImage] = useState(null);
  const [passwordValidationError, setPasswordValidationError] = useState('');
  const [regionsOptions, setRegionsOptions] = useState([]);


  const [registerFormData, setRegisterFormData] = useState({
    username:'',
    password: '',
    password2: '',
    roles:[],
    individual: {
      first_name: '',
      last_name: '',
      birth_date:'',
      gender:'',
      parallel_groups_multiple:[],
      region:'',
    }, 
  });

  const [successMessage, setSuccessMessage] = useState('');

  const [showSuccessMessage, setShowSuccessMessage] = useState(false);

  const handleRoleChange = (e) => {
    const value = e.target.value;
  
    setSelectedRole(value);
  
    setRegisterFormData((prevData) => ({
      ...prevData,
      roles: value ? [value] : [], // Set to an array with the selected value or an empty array
    }));
  
  };

  
  useEffect(() => {
    const fetchData = async () => {
      try {
        const rolesResponse = await axios.get(apiRoles);
        setRolesOptions(rolesResponse.data.success);
        console.log('Test Roles', rolesResponse.data.success)

        const parallelGroupResponse = await axios.get(getParallelGroup);
        setParallelGroupOptions(parallelGroupResponse.data.success);
        console.log('Test Parallel Group', parallelGroupResponse.data.success)

        const parallelGroupAdminRole = await axios.get(apiAccount);
        setAccount(parallelGroupAdminRole.data.success.roles[0]);
        console.log('Test Account',  parallelGroupAdminRole.data.success.roles[0])

        const regionsResponse = await axios.get(getRegions);
        setRegionsOptions(regionsResponse.data.success);
        console.log('Test Regions', regionsResponse.data.success)

      } catch (error) {
        console.error('Error fetching options:', error);
      }
    };
  
    fetchData();
  }, []);



  useEffect(() => {
    if (successMessage) {
      setShowSuccessMessage(true);
      const timer = setTimeout(() => {
        setShowSuccessMessage(false);
      }, 3000); // 3 seconds
      return () => clearTimeout(timer);
    }
  }, [successMessage]);


  const handleRegisterChange = (e) => {
    const { name, value } = e.target;
    if (name.includes('individual.')) {
      const individualField = name.split('.')[1];
      setRegisterFormData((prevData) => ({
        ...prevData,
        individual: {
          ...prevData.individual,
          [individualField]: value,
        },
      }));
    } else {
      setRegisterFormData({ ...registerFormData, [name]: value });
    }
  };

  
  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
  
      setTimeout(() => {
        setPasswordValidationError('')
        setErrorSignup('');
      }, 3000);

    if (!registerFormData.individual.first_name) {
      setErrorSignup('Please input your first name.');
      setLoading(false);
      return;
    }


    if (!registerFormData.individual.last_name) {
      setErrorSignup('Please input your last name.');
      setLoading(false);
      return;
    }

    
    
         // Check if gender is selected
    if (!registerFormData.individual.gender) {
      setErrorSignup('Please select your gender.');
      setLoading(false);
      return;
    }


    


  
      // Ensure that birth_date is provided
      if (!registerFormData.individual.birth_date) {
        setErrorSignup('Please provide your birth date.');
        setLoading(false);
        return;
      }

        // Check if confirm password is empty
    if (!registerFormData.password2) {
      setErrorSignup('Please confirm your password.');
      setLoading(false);
      return;
    }

    

  
      // Calculate age based on the provided birth date
      const birthDate = new Date(registerFormData.individual.birth_date);
      const currentDate = new Date();
      const age = currentDate.getFullYear() - birthDate.getFullYear();
  
      // Check if the user is at least 18 years old
      if (age < 18) {
        setErrorSignup('You must be 18 years old or above to register.');
        setLoading(false);
  
       
        return;
      }
    
      const memshipId = random(100000, 999999).toString();
      const registrationData = {
        ...registerFormData,
        username: registerFormData.username,
        individual: {
          ...registerFormData.individual,
          memship_id: memshipId,
        },
      };
  
      const response = await axios.post(apiUser, registrationData, {
        headers: {
          'X-CSRFToken': csrfToken,
        },
      });
  
        setSuccessMessage('Registration successful!'); // Add this line
  
      
    } catch (error) {
      console.error('Registration error:', error);
      setErrorSignup(error.response.data.error);
    } finally {
      setLoading(false);
    }
  };
  

  const onDrop = useCallback((acceptedFiles) => {
    if (acceptedFiles.length === 0) {
      setSelectedImage(null); // Set selectedImage to null if no files are accepted
      return;
    }

    const image = acceptedFiles[0];
    const reader = new FileReader();
  
    reader.onload = () => {
      const base64String = reader.result.split(',')[1]; // Extracting the base64 string
      const filename = image.name;
  
      const photo = {
        data: base64String,
        filename: filename,
      };
  
      setSelectedImage(URL.createObjectURL(image));
  
      // Set the 'photo' property in registerFormData
      setRegisterFormData((prevData) => ({
        ...prevData,
        individual: {
          ...prevData.individual,
          photo: photo,
        },
      }));
  
      // Now, you can do something with the 'photo' object, like sending it to the server.
      console.log(photo);
    };
  
    reader.readAsDataURL(image);
  }, [setRegisterFormData]);
  
  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });


  


  useEffect(() => {
    // Calculate age based on the provided birth date
    const birthDate = new Date(registerFormData.individual.birth_date);
    const currentDate = new Date();
    const age = currentDate.getFullYear() - birthDate.getFullYear();
  
    // Check if the user is at least 18 years old
    if (age < 18) {
      setError  ('You must be 18 years old or above to register.');
      setLoading(false);
    }
  }, [registerFormData.individual.birth_date]);
  


  return (
    <div className="">
        <div className="flex flex-col items-center p-10 gap-10 font-manrope">
         {showSuccessMessage && (
            <p  className='text text-green-500 sticky  shadow-lg bg-[#fff] z-20 p-5 rounded-md top-0 text-center'>{successMessage}</p>
          )}
          {errorSignup && <p className='text shadow-lg bg-[#fff] z-20 p-5 rounded-md text-red-500 sticky top-0 text-center'>{errorSignup}</p>}

     
          <h2 className='text-[2rem] font-semibold font-manrope'>Add User</h2>
          <form className='flex flex-col gap-3 w-full font-manrope' onSubmit={handleRegisterSubmit}>
          {passwordValidationError && <p style={{ color: 'red' }}>{passwordValidationError}</p>}

          <TextField
              type="text"
              name="individual.first_name"
              value={registerFormData.individual.first_name || ""}
              placeholder="First Name"
              onChange={handleRegisterChange}
            />

            <TextField
              type="text"
              name="individual.last_name"
              value={registerFormData.individual.last_name || ""}
              placeholder="Last Name"
              onChange={handleRegisterChange}
            />

          <TextField
              type="text"
              name="username"
              value={registerFormData.username || ""}
              placeholder="Username"
              onChange={handleRegisterChange}
            />

         
          <TextField
              type="text"
              name="individual.email"
              value={registerFormData.individual.email || ""}
              placeholder="Email Address"
              onChange={handleRegisterChange}
            />

            <TextField
              type="text"
              name="individual.mobile_number"
              value={registerFormData.individual.mobile_number || ""}
              placeholder="Mobile Number"
              onChange={handleRegisterChange}
            />

         <div className="flex flex-col">
            <span>Gender:</span>
            <Select
              name="individual.gender"
              value={registerFormData.individual.gender || ""}
              required
              onChange={handleRegisterChange}
            >
              <MenuItem  value="" disabled>
                <span className='text-black'> Gender</span>
              </MenuItem>
              <MenuItem value="male">Male</MenuItem>
              <MenuItem value="female">Female</MenuItem>
              {/* <MenuItem value="other">Other</MenuItem> */}
            </Select>
          </div>

          <div className="flex flex-col">
            <span>Region:</span>
          <Select
                name="individual.region"
                value={registerFormData.individual.region || ""}
                required
                onChange={handleRegisterChange}
                
              >
                <MenuItem value="" disabled>
                Region
                </MenuItem>
                {regionsOptions.map((region) => (
                  <MenuItem key={region.id} value={region.id}>
                    {region.desc}
                  </MenuItem>
                ))}
              </Select>
              </div>

          <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DatePicker
                value={registerFormData.individual.birth_date || null}
                label="Date of Birth"
                renderInput={(props) => (
                  <input
                    {...props}
                    label="Date of Birth"
                    placeholder="Date of Birth"
                  />
                )}
                
                onChange={(date) => {
                  const formattedDate = date ? date.format('YYYY-MM-DD') : null;
                  handleRegisterChange({
                    target: {
                      name: 'individual.birth_date',
                      value: formattedDate,
                    },
                  });
                }}
              />
            </LocalizationProvider>


          <TextField
              type="password"
              name="password"
              value={registerFormData.password || ""}
              placeholder="Password"
              onChange={handleRegisterChange}
            />
             
             <TextField
              type="password"
              name="password2"
              value={registerFormData.password2 || ""}
              placeholder="Confirm Password"
              onChange={handleRegisterChange}
            />

        <div>
          <div {...getRootProps()} className={isDragActive ? 'dropzone-active' : 'dropzone'}>
            <input {...getInputProps()} id="file-input" />
            {selectedImage ? (
            <div>
              <img src={selectedImage} alt="Selected" className="selected-image" />
            </div>
          ) : (
            <div className="text-[30px] text-gray-500">
              <BiImageAdd />
            </div>
          )}
            {
              isDragActive ?
                <p className='text-xl text-gray-700 font-light'>Drop the image here...</p> :
                <p className='text-xl text-gray-400 font-light'>Drag and drop an image here or</p>
            }
            
          <div  className="choose-image-button">
            Choose Image
          </div>
          </div>


        
        </div>
             
           
             <div className="flex flex-col">
            <span>Roles:</span>
            <Select
              className='p-3 border rounded-[5px]'
              id="role"
              name="roles"
              value={selectedRole || ""}
              onChange={handleRoleChange}

            >
              <MenuItem value="">User</MenuItem>
              {rolesOptions
                .filter((role) => !(account === "Parallel Group Administrator" && role.name === "Administrator"))
                .map((role) => (
                  <MenuItem key={role.id} value={role.name}>
                    {role.name}
                  </MenuItem>
                ))}
            </Select>
          </div>
          
          
            {selectedRole === "Parallel Group Administrator" && (
            <div className="flex flex-col">
              <span>Parallel Groups:</span>
              <FormControl>
              <Select
                multiple
                id="parallel-groups"
                value={registerFormData.individual.parallel_groups_multiple || []}
                onChange={(e) =>
                  setRegisterFormData((prevData) => ({
                    ...prevData,
                    individual: {
                      ...prevData.individual,
                      parallel_groups_multiple: e.target.value,
                    },
                  }))
                }
              >
                {parallelGroupOptions.map((item) => (
                  <MenuItem key={item.id} value={item.id}>
                    {item.name} 
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            </div>
          )}



          <Button variant='contained'  type="submit">
            {loading ? 'Adding...' : 'Add'}
          </Button>
        </form>
        </div>
      </div>
  );
}


