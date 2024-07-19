/* eslint-disable react-hooks/rules-of-hooks */
import { useAuth } from '../../auth/authContext/AuthContext';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { BiLogOut } from "react-icons/bi";
import { logoutUrl } from '../../api/api'
import GetToken from '../token/GetToken'


// eslint-disable-next-line react/prop-types, no-unused-vars
export default function ButtonLogout({isOpen}) {
    const csrfToken = GetToken()
    const { dispatch } = useAuth();
    const navigate = useNavigate()

      const handleLogout = async (e) => {
        e.preventDefault();
        try {
          const headers = {
            'X-CSRFToken': csrfToken // Include the CSRF token in the request headers
          };
      
          await axios.get(logoutUrl, null, { headers });
          dispatch({ type: 'LOGOUT' });
          navigate('/login');
        } catch (error) {
          console.error('Logout error:', error);
        }
      };
    

  return (
    <button style={{ justifyContent: isOpen ? "start" : "center" }} className='btn_logout' onClick={handleLogout}>
      < BiLogOut />
      Logout
      </button>
  )
}
