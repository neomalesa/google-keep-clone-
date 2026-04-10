import React from 'react';

const Button = ({ name, icon, isActive, onClick }) => {
  return (
    <button type="button" className={`sidebar-btn ${isActive ? 'active' : ''}`} onClick={onClick}>
      <div className="sidebar-icon">
        <img src={icon} alt={`${name} icon`} />
      </div>
      <span className="sidebar-text">{name}</span>
    </button>
  );
};

export default Button;