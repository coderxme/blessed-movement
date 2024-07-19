import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';

const CheckCookie = () => {
  const navigate = useNavigate();
    const cookieExists = Cookies.get('sessionid');
    if (!cookieExists) {
      alert('Session Expired!');
      navigate('/home');
    }
}
export default CheckCookie;
