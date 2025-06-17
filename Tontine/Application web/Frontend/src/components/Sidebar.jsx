import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Sidebar.css';

const Sidebar = ({ isSubmenuOpen, toggleSubmenu }) => {
  const navigate = useNavigate();

  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        {/* Remplace orange-logo.png par ton propre logo */}
        <img src="/images/orange.png" alt="Orange Logo" className="orange-logo" />
      </div>
      <nav className="sidebar-nav">
        <p className="nav-section-title">GÉNÉRAL</p>
        <ul>
          <li className="nav-item active">
            <img src="/images/accueil.png" alt="home" className="icon" />
            <button className="nav-link" onClick={() => navigate('/dashboard')}>Accueil</button>
          </li>
          <li className={`nav-item has-submenu ${isSubmenuOpen ? 'open' : ''}`}>
            <img src="/images/compte.png" alt="compte" className="icon" />
            <button className="nav-link" onClick={toggleSubmenu}>Compte</button>
            <span className="submenu-arrow">▼</span>
            <ul className="submenu">
              <li>
                <button className="submenu-link" onClick={() => navigate('/gains')}>Gains</button>
              </li>
            </ul>
          </li>
          <li className="nav-item">
            <img src="/images/rapports.png" alt="rapports" className="icon" />
            <button className="nav-link" onClick={() => navigate('/Rapport')}>Rapports</button>
          </li>
          <li className="nav-item">
            <img src="/images/man-profile.jpg" alt="user" className="icon" />
            <button className="nav-link" onClick={() => navigate('/DetailPage')}>Fichier clients</button>
          </li>
        </ul>
      </nav>
      <div className="sidebar-footer">
        <img src="/images/man-profile.jpg" alt="user" className="icon" />
        {/* Icône de déconnexion */}
        <button className="nav-link" onClick={() => navigate('/logout')}>Déconnexion</button>
      </div>
    </aside>
  );
};

export default Sidebar; 