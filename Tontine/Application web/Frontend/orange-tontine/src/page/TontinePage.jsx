import React, { useState, useMemo } from "react";
import { useNavigate } from 'react-router-dom';
import "./TontinePage.css";

const TontinePage = () => {
  const navigate = useNavigate();
  
  // États pour la pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(3);
  const [searchTerm, setSearchTerm] = useState("");

  // Données des tontines (simulées)
  const [tontines] = useState([
    {
      N: 1,
      nomTontine: "Tontine ToTo",
      nbMembre: "0/5",
      montantMax: "500 000",
      montantPersonne: "125 000",
      inscription: "OUVERT",
      dateCreation: "01/01/2025",
      tauxInteret: "5%",
    },
    {
      N: 2,
      nomTontine: "Tontine ToTa",
      nbMembre: "0/5",
      montantMax: "500 000",
      montantPersonne: "125 000",
      inscription: "OUVERT",
      dateCreation: "01/01/2025",
      tauxInteret: "5%",
    },
    {
      N: 3,
      nomTontine: "Tontine ToTi",
      nbMembre: "0/4",
      montantMax: "900 000",
      montantPersonne: "135 000",
      inscription: "OUVERT",
      dateCreation: "01/01/2025",
      tauxInteret: "5%",
    },
  ]);

  // Calcul du nombre total de pages
  const totalPages = Math.ceil(tontines.length / itemsPerPage);

  // Filtrage des tontines
  const filteredTontines = useMemo(() => {
    if (!searchTerm) return tontines;
    return tontines.filter(tontine =>
      Object.values(tontine).some(value =>
        String(value).toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
  }, [tontines, searchTerm]);

  // Pagination des tontines
  const paginatedTontines = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return filteredTontines.slice(startIndex, endIndex);
  }, [filteredTontines, currentPage, itemsPerPage]);

  // Gestionnaires d'événements
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  const handleItemsPerPageChange = (e) => {
    setItemsPerPage(Number(e.target.value));
    setCurrentPage(1); // Retour à la première page
  };

  // Fonction pour aller à la page précédente
  const goToPreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  // Fonction pour aller à la page suivante
  const goToNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  return (
    <div className="dashboard-container">
      <main className="main-content">
        <section className="tontine-body">
          <h2 className="section-title">Mes Tontines</h2>

          {/* Barre de recherche */}
          <div className="tontine-header-row">
            <div className="search-box">
              <input 
                type="text" 
                placeholder="Rechercher une tontine" 
                value={searchTerm}
                onChange={handleSearchChange}
              />
              <button className="search-button">Rechercher</button>
            </div>
          </div>

          {/* Tableau des tontines */}
          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>N</th>
                  <th>Nom-Tontine</th>
                  <th>Nb Membre</th>
                  <th>Montant Max</th>
                  <th>Montant/Personne</th>
                  <th>Inscription</th>
                  <th>Date de création</th>
                  <th>Taux d'intérêt</th>
                </tr>
              </thead>
              <tbody>
                {paginatedTontines.length > 0 ? (
                  paginatedTontines.map((tontine) => (
                    <tr key={tontine.N}>
                      <td>{tontine.N}</td>
                      <td>{tontine.nomTontine}</td>
                      <td>{tontine.nbMembre}</td>
                      <td>{tontine.montantMax}</td>
                      <td>{tontine.montantPersonne}</td>
                      <td>
                        <span className="inscription-status">
                          <span className="status-dot green"></span>
                          <span 
                            className="inscription-text"
                            onClick={() => navigate('/DetailTontine')}
                            style={{ cursor: "pointer" }}
                          >
                            {tontine.inscription}
                          </span>
                        </span>
                      </td>
                      <td>{tontine.dateCreation}</td>
                      <td>{tontine.tauxInteret}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="8" style={{ textAlign: "center", padding: "20px" }}>
                      Aucune tontine trouvée.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Contrôles de pagination */}
          <div className="pagination-controls">
            <select 
              value={itemsPerPage} 
              onChange={handleItemsPerPageChange}
              className="items-per-page-select"
            >
              <option value="3">3 par page</option>
              <option value="5">5 par page</option>
              <option value="10">10 par page</option>
            </select>
            
            <div className="pagination-buttons">
              <button 
                className="pagination-button-prev" 
                onClick={goToPreviousPage} 
                disabled={currentPage === 1}
              >
                Précédent
              </button>
              
              <button 
                className="pagination-button-next" 
                onClick={goToNextPage} 
                disabled={currentPage === totalPages}
              >
                Suivant
              </button>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default TontinePage;