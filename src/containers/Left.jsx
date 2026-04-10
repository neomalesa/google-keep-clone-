import React from 'react';
import '../styles/Left.css';
import menuIcon from '../assets/menu.svg';

//This part contains the logo, as well as menu button for the nav section 
const Left = ({ toggleSidebar }) => {
    return (
        <div className="nav-left">
            {/* Menu button */}
            <button className="menu-btn" aria-label="Main menu" onClick={toggleSidebar}>
                <img src={menuIcon} alt="Menu" className="menu-icon" />
            </button>

            {/* Keep logo */}
            <img className="keep-logo" src="https://www.gstatic.com/images/branding/product/1x/keep_2020q4_48dp.png" alt="Google Keep" />

            {/* Keep text */}
            <span className="keep-text">Keep</span>
        </div>

    )
}
export default Left;