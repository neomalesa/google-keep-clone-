import React from 'react';
import Left from "./Left";
import Right from "./Right";
import SearchBar from "./SearchBar";
import '../styles/Navigation.css';

const Navigation = ({ toggleSidebar }) => {
    return (
        <header className="nav-container">
            <Left toggleSidebar={toggleSidebar} />
            <SearchBar />
            <Right />
        </header>
    )
}

export default Navigation;