import React, { useState } from "react";
import { usenavigate } from "react-router-dom";
import "./DetailPage.css";
import { BiLogoDribbble } from "react-icons/bi";

const DetailPage = () => {

    const navigate = usenavigate();

    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(3);
    const [searchTerm, setSearchTerm] = useState("");

    const [client] = useState([
        {
            id: 1,
            nomClient: "Yobouet Yasmine",
            Téléphone: "0709053334",
            nomTontine: "OrangePagne",
            actionClient: "modifier ou supprimer",       
    },

    {
        id: 2,
        nomClient: "Yobouet Yasmine",
        Téléphone: "0709053334",
        nomTontine: "OrangePagne",
        actionClient: "modifier ou supprimer", 
    },
    {
       id: 3,
        nomClient: "Yobouet Yasmine",
        Téléphone: "0709053334",
        nomTontine: "OrangePagne",
        actionClient: "modifier ou supprimer",
    },
]);

// Calcul du nombre total de pages
const totalPages = Math.ceil(clients.length / itemsPerPage);

// Pagination

const paginatedClients = useMemo(() => {
  const startIndex = (currentPage - 1) * itemsPerPage;
  return filteredClients.slice(startIndex, startIndex + itemsPerPage);
}, [filteredClients, currentPage, itemsPerPage]);


  // Fonctions pour gérer les clients
  const handleViewClient = (clientn) => {
    // Logique pour voir les détails d'un client
    console.log('Voir client:', clientn);
  };

  const handleEditClient = (clientn) => {
    // Logique pour modifier un client
    console.log('Modifier client:', clientn);
  };

  const handleDeleteClient = (clientn) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer ce client ?')) {
      setClients(prevClients => prevClients.filter(client => client.n !== clientn));
    }
  };


  return ([
   <div className="dashboard-container">
    <main className="main-content">
        <section className="tontine-board">
            <h2 className="section-title">Mes Clients</h2>

            {/*tableau des clients */}
            <div className="table-container">
                <table>
                    <thead>
                        <tr>
                            <th>Nom</th>
                            <th>Contact</th>
                            <th>Téléphone</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        
                    </tbody>
                </table>
            </div>
        </section>
    </main>
   </div>
  ]) ;
}