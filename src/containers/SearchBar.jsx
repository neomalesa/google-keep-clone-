import React from 'react';
import '../styles/SearchBar.css';
import searchIcon from '../assets/search.svg';
const SearchBar = () => {
  return (
    <form className="search-bar-container" onSubmit={(e) => e.preventDefault()}>
      <button type="button" className="search-btn" aria-label="Search">
        <img src={searchIcon} alt="Search" className="search-icon" />
      </button>

      <input
        type="text"
        className="search-input"
        placeholder="Search"
        autoComplete="off"
      />
    </form>
  );
};

export default SearchBar;