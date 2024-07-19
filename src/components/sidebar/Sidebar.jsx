import { NavLink } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { apiAccount } from '../../api/api';
import { links1, links2 } from './Links'; 
import { AiOutlineAlignLeft } from 'react-icons/ai';

import axios from 'axios';
import Logo from '../../assets/sidebar/logo-1.png';
// import ButtonLogout from './ButtonLogout';

const Sidebar = () => {
    const [data, setData] = useState([]);

    const [isOpen, setIsOpen] = useState(true);
    const toggle = () => setIsOpen(!isOpen);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const dataResponse = await axios.get(apiAccount);

                setData(dataResponse.data.success);

                console.log('testttt', dataResponse.data.success);
            } catch (error) {
                console.log(error);
            }
        };

        fetchData();
    }, []);

    const filteredMenuItem = links1.filter((item) => {
        if (data && data.roles) {
            if (data.roles.includes('Administrator')) {
                // Show all menu items for administrators
                return true;
            } else if (data.roles.includes('Parallel Group Administrator')) {
                return item.name !== "Administrators" && item.name !== "Roles";
            } else if (data.roles.length === 0 || data.roles.includes('user')) {
                return item.name !== item.name;
            }
        }
        return true; // default case, include all other items
    });
    
    
    return (
        <div className="sidebar_container">
            <div style={{ width: isOpen ? '250px' : '100px' }} className="sidebar">
                <div>
                    <div className="top_section">
                        <div className="logo_box">
                            <img
                                src={Logo}
                                alt="logo"
                                style={{
                                    width: isOpen ? '70%' : '80px',
                                    transition: 'width 0.3s ease',
                                }}
                            />
                        </div>
                    </div>

                    <div className="link_wrapper">
                        <span>Navigate</span>
                        {filteredMenuItem.map((item, index) => (
                            <NavLink
                                to={item.path}
                                key={index}
                                className={`link ${({ isActive }) => (isActive ? 'active' : '')}`}
                                style={{ justifyContent: isOpen ? 'start' : 'center' }}
                            >
                                <div className="icon">{item.icon}</div>
                                <h2 style={{ display: isOpen ? 'block' : 'none' }} className="link_text">
                                    {item.name}
                                </h2>
                            </NavLink>
                        ))}
                    </div>
                </div>

                <div className="link_wrapper2">
                    {links2.map((item, index) => (
                        <NavLink
                            to={item.path}
                            key={index}
                            className={`link ${({ isActive }) => (isActive ? 'active' : '')}`}
                            style={{ justifyContent: isOpen ? 'start' : 'center' }}
                        >
                            <div className="icon">{item.icon}</div>
                            <h2 style={{ display: isOpen ? 'block' : 'none' }} className="link_text">
                                {item.name}
                            </h2>
                        </NavLink>
                    ))}
                    {/* <ButtonLogout isOpen={isOpen} /> */}
                </div>
            </div>

            <div style={{ marginLeft: isOpen ? '20px' : '10px' }} className="toggle_bar">
                <AiOutlineAlignLeft onClick={toggle} />
            </div>
        </div>
    );
};

export default Sidebar;
