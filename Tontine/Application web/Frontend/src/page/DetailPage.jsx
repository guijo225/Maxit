import React, { useState, useMemo } from "react";
// import { useNavigate } from "react-router-dom"; // <-- supprimé car non utilisé
import "./DetailPage.css";
import { BiEdit, BiTrash } from 'react-icons/bi';
import { BiSearch,BiDownload } from "react-icons/bi";

const DetailPage = () => {
  // const navigate = useNavigate(); // <-- supprimé car non utilisé

  // Données des clients
  const [clients, setClients] = useState([
    {
      id: 1,
      nomClient: "Yobouet Yasmine Vohlma",
      telephone: "+2250709053334",
      nomTontine: "OrangePagne",
    },
    {
      id: 2,
      nomClient: "Guitto Ezechiel",
      telephone: "+2250585044667",
      nomTontine: "OrangePagne",
    },
    {
      id: 3,
      nomClient: "Frean Debohi Grâce",
      telephone: "+2250585044667",
      nomTontine: "OrangePagne",
    },
    {
      id: 4,
      nomClient: "Bamba Mouhamed",
      telephone: "+2250585044667",
      nomTontine: "OrangePagne",
    },
  ]);

  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(4); // <-- setItemsPerPage supprimé car non utilisé
  const [searchTerm, setSearchTerm] = useState("");

  // Recherche
  const filteredClients = useMemo(() => {
    if (!searchTerm) return clients;
    return clients.filter(client =>
      Object.values(client).some(value =>
        String(value).toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
  }, [clients, searchTerm]);

  // Pagination
  const totalPages = Math.ceil(filteredClients.length / itemsPerPage);
  const paginatedClients = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredClients.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredClients, currentPage, itemsPerPage]);

  // Actions
  const handleEdit = (clientId) => {
    alert(`Modifier client : ${clientId}`);
  };

  const handleDelete = (clientId) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer ce client ?')) {
      setClients(prev => prev.filter(client => client.id !== clientId));
    }
  };

  // Pagination boutons
  const goToPreviousPage = () => setCurrentPage((prev) => Math.max(1, prev - 1));
  const goToNextPage = () => setCurrentPage((prev) => Math.min(totalPages, prev + 1));

  return (
    <div className="dashboard-container">
      <main className="main-content">
        <section className="tontine-board">
          <h2 className="section-title">Listes des utilisateurs</h2>
          <div className="header-row">
          <div className='recherche'>
           <div style={{ position: "relative", width: 250 }}>
            <BiSearch
              style={{
              position: "absolute",
              left: 10,
              top: "50%",
              transform: "translateY(-50%)",
              color: "#888",
              fontSize: 20,
              }}
           />
           <input
              type="text"
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              placeholder="Faire une recherche"
              style={{
              width: "100%",
              padding: "8px 8px 8px 36px",
             }}
           />
         </div>
        <button className="bouton">rechercher</button>
        </div>
      </div>
            <div className="actions-header">
              <button className="sort-btn">Trier par Tontine</button>
             <button style={{  gap: 1 }} className="download-btn">
                  <BiDownload style={{ fontSize: 18 }} />
                  Télécharger
                </button>
            </div>
          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>Nom</th>
                  <th>Contact</th>
                  <th>Tontine(s)</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {paginatedClients.length > 0 ? paginatedClients.map(client => (
                  <tr key={client.id}>
                    <td>{client.nomClient}</td>
                    <td>{client.telephone}</td>
                    <td>{client.nomTontine}</td>
                    <td>
                      <button className="action-btn" onClick={() => handleEdit(client.id)}>
                        <BiEdit />
                      </button>
                      <button className="action-btn" onClick={() => handleDelete(client.id)}>
                        <BiTrash />
                      </button>
                    </td>
                  </tr>
                )) : (
                  <tr>
                    <td colSpan="4" style={{ textAlign: "center" }}>Aucun client trouvé.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          <button onClick={goToPreviousPage} disabled={currentPage === 1}>Précédent</button>
          <button onClick={goToNextPage} disabled={currentPage === totalPages}>Suivant</button>
        </section>
      </main>
    </div>
  );
};

export default DetailPage;