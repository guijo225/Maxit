import React, { useState, useMemo } from "react";
import "./DashboardPage.css";

const DashboardPage = () => {
  const [isSubmenuOpen, setIsSubmenuOpen] = useState(false);
  const [sortColumn, setSortColumn] = useState(null);
  const [sortDirection, setSortDirection] = useState('asc');
  const [openFilterColumn, setOpenFilterColumn] = useState(null); // Null si aucun filtre n'est ouvert, sinon le nom de la colonne
  const [filters, setFilters] = useState({}); // { 'colonne': 'valeurDeFiltre' }

  const toggleSubmenu = () => {
    setIsSubmenuOpen(!isSubmenuOpen);
  };

  // Données initiales pour le tableau. C'est votre source de vérité non-filtrée/non-triée.
  const initialTransactions = [
    { id: 1, title: "dépôt", date: "12/02/25", relatedTo: "Tontine Frean", status: "Terminer" },
    { id: 2, title: "retrait", date: "12/04/25", relatedTo: "Tontine yayo", status: "En cours" },
      ];

  // Helper pour obtenir les valeurs uniques pour les options de filtre
  const getUniqueValues = (columnName) => {
    return [...new Set(initialTransactions.map(item => item[columnName]))].sort();
  };

  // Gère le clic sur l'icône de tri/filtre dans l'en-tête du tableau
  const handleSortAndFilterToggle = (columnName) => {
    // Logique de tri
    const isCurrentlySorted = sortColumn === columnName;
    const newSortDirection = isCurrentlySorted && sortDirection === 'asc' ? 'desc' : 'asc';
    setSortColumn(columnName);
    setSortDirection(newSortDirection);

    // Logique d'ouverture/fermeture du filtre déroulant
    setOpenFilterColumn(openFilterColumn === columnName ? null : columnName);
  };

  // Gère la sélection d'une option dans le filtre déroulant
  const handleFilterSelection = (columnName, value) => {
    setFilters(prevFilters => ({
      ...prevFilters,
      [columnName]: value === 'Tout' ? null : value // 'Tout' réinitialise le filtre pour cette colonne
    }));
    setOpenFilterColumn(null); // Ferme le filtre après sélection
  };

  // Utilisation de useMemo pour filtrer et trier les transactions de manière optimisée
  const displayedTransactions = useMemo(() => {
    let currentData = [...initialTransactions]; // Commence avec toutes les transactions

    // Applique les filtres
    for (const column in filters) {
      const filterValue = filters[column];
      if (filterValue) { // Si un filtre est actif pour cette colonne
        currentData = currentData.filter(item => item[column] === filterValue);
      }
    }

    // Applique le tri
    if (sortColumn) {
      currentData.sort((a, b) => {
        let valA = a[sortColumn];
        let valB = b[sortColumn];

        if (sortColumn === 'date') {
          // Conversion pour le tri par date (JJ/MM/AA vers MM/JJ/AA pour Date object)
          const parseDate = (dateString) => {
            const parts = dateString.split('/');
            return new Date(`${parts[1]}/${parts[0]}/${parts[2]}`);
          };
          valA = parseDate(a[sortColumn]);
          valB = parseDate(b[sortColumn]);
        } else if (typeof valA === 'string' && typeof valB === 'string') {
          // Tri insensible à la casse pour les chaînes
          valA = valA.toLowerCase();
          valB = valB.toLowerCase();
        }

        if (valA < valB) {
          return sortDirection === 'asc' ? -1 : 1;
        }
        if (valA > valB) {
          return sortDirection === 'asc' ? 1 : -1;
        }
        return 0;
      });
    }

    return currentData;
  }, [initialTransactions, filters, sortColumn, sortDirection]); // Dépendances de useMemo

  return (
    <div className="dashboard-container">
      {/* Colonne de navigation latérale (Sidebar) */}
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
              <button className="nav-link">Accueil</button>
            </li>
            <li className={`nav-item has-submenu ${isSubmenuOpen ? 'open' : ''}`}>
              <img src="/images/compte.png" alt="compte" className="icon" />
              <button className="nav-link" onClick={toggleSubmenu}>Compte</button>
              <span className="submenu-arrow">▼</span>
              <ul className="submenu">
                {/* Seul "Gains" est maintenu comme option du sous-menu "Compte" */}
                <li><button className="submenu-link">Gains</button></li>
              </ul>
            </li>
            <li className="nav-item">
              <img src="/images/rapports.png" alt="user" className="icon" />
              <button className="nav-link">Rapports</button>
            </li>
            <li className="nav-item">
              <img src="/images/man-profile.jpg" alt="user" className="icon" />
              <button className="nav-link">Fichier clients</button>
            </li>
          </ul>
        </nav>
        <div className="sidebar-footer">
          <img src="/images/man-profile.jpg" alt="user" className="icon" />
          {/* Icône de déconnexion */}
          <button className="nav-link">Déconnexion</button>
        </div>
      </aside>

      {/* Contenu principal du tableau de bord */}
      <main className="main-content">
        <header className="main-header">
          <div className="breadcrumb">Accueil / Tableau de bord</div>
          <div className="header-actions">
            <img src="/images/man-profile.jpg" alt="user" className="icon" />
            {/* Icône de notification */}
            {/* Remplace user-profile.jpg par ton image de profil */}
            <img src="/images/user-profile.jpg" alt="User Profile" className="profile-pic" />
            <img src="/images/man-profile.jpg" alt="user" className="icon" />
            {/* Icône de menu déroulant */}
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
              <img src="/images/man-profile.jpg" alt="user" className="icon" />
              <h3>Nombres de Tontines</h3>
              <p className="card-value">10</p>
              <button className="card-details">Détails</button>
            </div>
            <div className="card orange-card">
              <img src="/images/man-profile.jpg" alt="user" className="icon" />
              <h3>Nombres d'utilisateurs</h3>
              <p className="card-value">120</p>
              <button className="card-details">Détails</button>
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
                  {/* En-tête Titre de la transaction */}
                  <th>
                    <input type="checkbox" /> Titre de la transaction
                    <span className="icon sort-filter-icon" onClick={() => handleSortAndFilterToggle('title')}>
                      {sortColumn === 'title' ? (sortDirection === 'asc' ? '▲' : '▼') : '▼'}
                      {openFilterColumn === 'title' && (
                        <ul className="filter-dropdown" onClick={(e) => e.stopPropagation()}> {/* Empêche la fermeture lors d'un clic interne */}
                          <li><button onClick={() => handleFilterSelection('title', 'Tout')}>Tout</button></li>
                          {getUniqueValues('title').map(value => (
                            <li key={value}><button onClick={() => handleFilterSelection('title', value)}>{value}</button></li>
                          ))}
                        </ul>
                      )}
                    </span>
                  </th>
                  {/* En-tête Date */}
                  <th>
                    Date
                    <span className="icon sort-filter-icon" onClick={() => handleSortAndFilterToggle('date')}>
                      {sortColumn === 'date' ? (sortDirection === 'asc' ? '▲' : '▼') : '▼'}
                      {openFilterColumn === 'date' && (
                        <ul className="filter-dropdown" onClick={(e) => e.stopPropagation()}>
                          <li><button onClick={() => handleFilterSelection('date', 'Tout')}>Tout</button></li>
                          {getUniqueValues('date').map(value => (
                            <li key={value}><button onClick={() => handleFilterSelection('date', value)}>{value}</button></li>
                          ))}
                        </ul>
                      )}
                    </span>
                  </th>
                  {/* En-tête Lié à */}
                  <th>
                    Lié à
                    <span className="icon sort-filter-icon" onClick={() => handleSortAndFilterToggle('relatedTo')}>
                      {sortColumn === 'relatedTo' ? (sortDirection === 'asc' ? '▲' : '▼') : '▼'}
                      {openFilterColumn === 'relatedTo' && (
                        <ul className="filter-dropdown" onClick={(e) => e.stopPropagation()}>
                          <li><button onClick={() => handleFilterSelection('relatedTo', 'Tout')}>Tout</button></li>
                          {getUniqueValues('relatedTo').map(value => (
                            <li key={value}><button onClick={() => handleFilterSelection('relatedTo', value)}>{value}</button></li>
                          ))}
                        </ul>
                      )}
                    </span>
                  </th>
                  {/* En-tête Statut */}
                  <th>
                    Statut
                    <span className="icon sort-filter-icon" onClick={() => handleSortAndFilterToggle('status')}>
                      {sortColumn === 'status' ? (sortDirection === 'asc' ? '▲' : '▼') : '▼'}
                      {openFilterColumn === 'status' && (
                        <ul className="filter-dropdown" onClick={(e) => e.stopPropagation()}>
                          <li><button onClick={() => handleFilterSelection('status', 'Tout')}>Tout</button></li>
                          {getUniqueValues('status').map(value => (
                            <li key={value}><button onClick={() => handleFilterSelection('status', value)}>{value}</button></li>
                          ))}
                        </ul>
                      )}
                    </span>
                  </th>
                </tr>
              </thead>
              <tbody>
                {displayedTransactions.map(transaction => (
                  <tr key={transaction.id}>
                    <td><input type="checkbox" /> {transaction.title}</td>
                    <td>{transaction.date}</td>
                    <td>{transaction.relatedTo}</td>
                    <td>{transaction.status}</td>
                  </tr>
                ))}
                {displayedTransactions.length === 0 && (
                  <tr>
                    <td colSpan="4" style={{ textAlign: 'center', padding: '20px' }}>Aucune transaction à afficher pour le moment.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>
      </main>
    </div>
  );
};

export default DashboardPage;