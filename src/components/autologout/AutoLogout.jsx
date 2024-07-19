/* eslint-disable react/no-unescaped-entities */
/* eslint-disable react/prop-types */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-undef */
import { useEffect, useCallback, useState, useRef } from 'react';
import { logoutUrl } from '../../api/api';
import axios from 'axios';
import Cookies from 'js-cookie';
import { Dialog, DialogActions, DialogContent, DialogTitle, Button } from '@mui/material';
import GetToken from '../token/GetToken';

const AutoLogout = ({ children }) => {
     const csrfToken = GetToken()
    const [showModal, setShowModal] = useState(false);
    const [countdown, setCountdown] = useState(60); // Initial countdown value
    const timerRef = useRef(null);
  
    const events = ['mousemove'];
    
    const resetTimer = useCallback(() => {
      if (timerRef.current) clearTimeout(timerRef.current);
      handleLogoutTimer();
    }, []);
  
    const handleLogoutTimer = useCallback(() => {
      timerRef.current = setTimeout(() => {
        setShowModal(true);
      }, 900 * 1000); // Set timeout dynamically based on countdown value
    }, [countdown]);
  
   
    useEffect(() => {
      const handleUserActivity = () => {
        resetTimer();
        console.log('Mouse movement'); 
      };
  
      events.forEach((event) => {
        window.addEventListener(event, handleUserActivity);
      });
  
      return () => {
        events.forEach((event) => {
          window.removeEventListener(event, handleUserActivity);
        });
      };
    }, [resetTimer, events]);
  
    const logoutAction = async () => {
      try {
        const headers = {
          'Content-Type': 'application/json',
          'X-CSRFToken': csrfToken,
        };
        Cookies.remove('sessionid');
        console.log('Logout will occur in a moment...');
  
        await new Promise((resolve) => setTimeout(resolve, 2000));
  
        const response = await axios.get(logoutUrl, { headers });
  
        console.log(response);
  
        if (response.request.status === 200) {
          window.location.href = '/home';
          console.log('Logout successful');
        } else {
          console.error('Logout failed:', response.statusText);
        }
      } catch (error) {
        console.error('Logout failed:', error.message);
      }
    };
  
    const handleConfirmLogout = () => {
      setShowModal(false);
      clearTimeout(timerRef.current);
      setCountdown(10); // Reset countdown to initial value
    };
  
    useEffect(() => {
      if (showModal) {
        if (countdown > 0) {
          const timerId = setTimeout(() => {
            setCountdown(countdown - 1); // Update countdown every second
          }, 1000);
    
          return () => clearTimeout(timerId);
        } else {
          handleAutoLogout(); // Auto logout when countdown reaches 0
        }
      }
    }, [showModal, countdown]);
  
    const handleAutoLogout = () => {
      setShowModal(false);
      logoutAction();
    };
  
    return (
      <>
        {children}
        <Dialog open={showModal} >
          <DialogTitle>Warning</DialogTitle>
          <DialogContent>
            <p className=' font-manrope text-sm '>Are you still there? <br /> You will be logged out <i className="ion-spoon"></i>
           <b>"Yes"</b> to stay logged in.
            <br />
           logout in <span id="timer" className='font-bolb'>{countdown}</span> seconds</p>
          </DialogContent>
          <DialogActions>
            <Button variant='contained' onClick={handleConfirmLogout} color="primary">
              Yes
            </Button>
          </DialogActions>
        </Dialog>
      </>
    );
  };
  
  export default AutoLogout;