import './UserDashboardStyles.css'
import icon1 from '../../../assets/landing/dashboard/icon1.svg'
import icon2 from '../../../assets/landing/dashboard/icon2.svg'
import icon3 from '../../../assets/landing/dashboard/icon3.svg'
import icon4 from '../../../assets/landing/dashboard/icon4.svg'
import icon5 from '../../../assets/landing/dashboard/icon5.svg'
import icon6 from '../../../assets/landing/dashboard/icon6.svg'
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

export default function UserDashboard() {
      // Extracts pathname property(key) from an object
 const { pathname } = useLocation();

 // Automatically scrolls to top whenever pathname changes
 useEffect(() => {
   window.scrollTo(0, 0);
 }, [pathname]);
 
  return (
    <div className='userDashboardContainer'>
       <div className="userDashboardWrapper">
       <h1 className='userDashboardtitle'>Dashboard</h1>

              <div className="userBoxWrapper">
              <div className='userBox'>
                    <p>Important Announcement</p>
                    <div className="userIcon">
                    <img src={icon1} alt="icon" />
                    </div>
                </div>

                <div className='userBox'>
                    <p>Calendar of <br /> Activities</p>
                    <div className="userIcon">
                    <img src={icon2} alt="icon" />
                    </div>
                </div>


                <div className='userBox'>
                    <p>Upcoming <br /> Events</p>
                    <div className="userIcon">
                    <img src={icon3} alt="icon" />
                    </div>
                </div>

                <div className='userBox'>
                    <p>News Feed from Government Agencies</p>
                    <div className="userIcon">
                    <img src={icon4} alt="icon" />
                    </div>
                </div>

                <div className='userBox'>
                    <p>Holidays</p>
                    <div className="userIcon">
                    <img src={icon5} alt="icon" />
                    </div>
                </div>

                <div className='userBox'>
                    <p>Birthday <br /> Board</p>
                    <div className="userIcon">
                    <img src={icon6} alt="icon" />
                    </div>
                </div>


              </div>
       </div>
    </div>
  )
}
