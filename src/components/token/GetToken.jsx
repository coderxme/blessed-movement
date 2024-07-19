import { useState, useEffect } from 'react'; 
import { getCsrfTokenUrl  } from '../../api/api'
import axios from 'axios'

export default function GetToken() {
    const [csrfToken, setCsrfToken] = useState('');
    
    useEffect(() => {
        const getTheCsrfToken = async () => {
          try {
            const response = await axios.get(getCsrfTokenUrl);
            setCsrfToken(response.data['csrf-token']);
          } catch (error) {
            console.log(error);
          }
        };
    
        getTheCsrfToken();
      }, []);

    // Return the CSRF token
    return csrfToken;
}
