import React from 'react';
import './Header.css';

const Header = () => {
  return (
    <header className="main-header">
      <div className="breadcrumb">Nombres de tontine / Tableau de bord</div>
      <div className="header-actions">
        <img src="/images/notification.png" alt="User Profile" className="profile-pic" />
        <img src="/images/Ellipse 14.png" alt="User Profile" className="profile-pic" />
        <img src="/images/menuderoulant.png" alt="User menu" className="menu-pic" />
      </div>
    </header>
  );
};

export default Header; 