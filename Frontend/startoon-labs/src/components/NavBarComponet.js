import React, { useState, useContext } from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import { SidebarData } from './NavBarData';
import { authContext } from '../hooks/authContext';

const NavBarComponent = ({ onLogout }) => {
  const [isNavOpen, setIsNavOpen] = useState(false); 
  const [searchQuery, setSearchQuery] = useState('');
  const { user } = useContext(authContext);


  const handleSearch = () => {
    console.log('Search Query:', searchQuery);
  };

  return (
    <>
      <header style={{ position: "sticky", top: "0", zIndex: "1000" }}>
        <nav className="navbar navbar-expand-lg" style={{ backgroundColor: "#6a5acd" }}>
          <div className="container-fluid">
            <div className="d-flex align-items-center">
              {SidebarData.map((item, index) => (
                <NavLink
                  key={index}
                  to={item.path}
                  className="nav-item nav-link"
                  style={{ fontSize: "20px", color: isNavOpen ? 'blue' : '#2F4F4F' }}
                  activeClassName="active"
                >
                  <button className='btn mx-2' style={{color: "white", background: "#616161"}}>
                    {item.icon}
                    <span className="navbar-item-title">{item.title}</span>
                  </button>
                </NavLink>
              ))}
            </div>
            <div className={`collapse navbar-collapse justify-content-end ${isNavOpen ? 'show' : ''}`} id="navbarNav">
              <div className="d-flex align-items-center">
                <div className="input-group mx-2" style={{ maxWidth: "300px" }}>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Search"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                  <button className="btn btn-outline-light" type="button" onClick={handleSearch}>
                    Search
                  </button>
                </div>
                <button className="btn ml-2" style={{ backgroundColor: "#616161", color: "white" }} onClick={onLogout}>
                  Logout
                </button>
              </div>
            </div>
          </div>
        </nav>
      </header>
      <Outlet />
    </>
  );
};

export default NavBarComponent;
