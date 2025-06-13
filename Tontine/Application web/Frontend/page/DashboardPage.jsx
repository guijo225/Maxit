import React from "react";
import "./DashboardPage.css";

const DashboardPage = () => {
  return (
    <div className="dashboard-container">
      {/* Colonne de navigation latérale (Sidebar) */}
      <aside className="sidebar">
        <div className="sidebar-header">
          {/* Remplace orange-logo.png par ton propre logo */}
          <img src="/images/orange-logo.png" alt="Orange Logo" className="orange-logo" />
        </div>
        <nav className="sidebar-nav">
          <p className="nav-section-title">GÉNÉRAL</p>
          <ul>
            <li className="nav-item active">
              <span className="icon">📁</span>
              <a href="#">Accueil</a>
            </li>
            <li className="nav-item has-submenu">
              <span className="icon">💳</span>
              <a href="#">Compte</a>
              <span className="submenu-arrow">▼</span>
              {/* Le sous-menu pourrait être ici ou géré par un état */}
            </li>
            <li className="nav-item">
              <span className="icon">📈</span>
              <a href="#">Gains</a>
            </li>
            <li className="nav-item">
              <span className="icon">📊</span>
              <a href="#">Rapports</a>
            </li>
            <li className="nav-item">
              <span className="icon">🗂️</span>
              <a href="#">Fichier clients</a>
            </li>
          </ul>
        </nav>
        <div className="sidebar-footer">
          <span className="icon">➡️</span> {/* Icône de déconnexion */}
          <a href="#">Déconnexion</a>
        </div>
      </aside>

      {/* Contenu principal du tableau de bord */}
      <main className="main-content">
        <header className="main-header">
          <div className="breadcrumb">Accueil / Tableau de bord</div>
          <div className="header-actions">
            <span className="icon">🔔</span> {/* Icône de notification */}
            {/* Remplace user-profile.jpg par ton image de profil */}
            <img src="/images/user-profile.jpg" alt="User Profile" className="profile-pic" />
            <span className="icon">🔽</span> {/* Icône de menu déroulant */}
          </div>
        </header>

        <section className="dashboard-body">
          <p className="current-date">Nous sommes mercredi 04 Juin</p>
          <div className="dashboard-header-row">
            <h1>Tableau de bord</h1>
            <div className="search-period-group">
              <div className="search-box">
                <input type="text" placeholder="Rechercher un document" />
                <button className="search-button">Rechercher</button>
              </div>
              <div className="period-selector">
                <span>Période : </span>
                <select>
                  <option>Cette Semaine</option>
                  <option>Ce Mois</option>
                  <option>Cette Année</option>
                </select>
              </div>
            </div>
          </div>

          <h2 className="section-title">Vue d'ensemble</h2>
          <div className="overview-cards">
            <div className="card orange-card">
              <span className="card-icon">💰</span>
              <h3>Nombres de Tontines</h3>
              <p className="card-value">10</p>
              <a href="#" className="card-details">Détails</a>
            </div>
            <div className="card orange-card">
              <span className="card-icon">👨‍💻</span>
              <h3>Nombres d'utilisateurs</h3>
              <p className="card-value">120</p>
              <a href="#" className="card-details">Détails</a>
            </div>
            {/* Ajoute d'autres cartes si nécessaire */}
          </div>

          <h2 className="section-title">Historique des tontines</h2>
          <div className="filter-section">
            <button className="filter-button">Filtrer <span className="icon">▼</span></button>
          </div>
          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th><input type="checkbox" /> Titre de la transaction <span className="icon">▼</span></th>
                  <th>Date <span className="icon">▼</span></th>
                  <th>Lié à <span className="icon">▼</span></th>
                  <th>Statut <span className="icon">▼</span></th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td><input type="checkbox" /> Lorem ipsum dual core advanced</td>
                  <td>12/02/25</td>
                  <td>Tontine Frean/Annive</td>
                  <td>Terminer</td>
                </tr>
                <tr>
                  <td><input type="checkbox" /> Lorem ipsum dual core advanced</td>
                  <td>12/04/25</td>
                  <td>Tontine Frean/Annive</td>
                  <td>Terminer</td>
                </tr>
                {/* Plus de lignes de tableau */}
              </tbody>
            </table>
          </div>
        </section>
      </main>
    </div>
  );
};

export default DashboardPage;