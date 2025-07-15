import React, { useState } from "react";
import "./ClientIntegrationCenter.css";
import ClientFilter from "../components/ClientFilter";
import ClientTable from "../components/ClientTable";

const ClientIntegrationCenter = () => {
    // je cree un etat pour stocker toutes les données des utilisateurs
    const [clients, setClients] = useState([
      {id:'1', contact: '0709053334', Tontineàintegrer: 'tontine les amitiés', statutintegration: 'Echec'},
      {id:'2', contact: '0709053334', Tontineàintegrer: 'tontine les amitiés', statutintegration: 'En cours'},
      {id:'3', contact: '0709053334', Tontineàintegrer: 'tontine les amitiés', statutintegration: 'Terminé'},
      {id:'4', contact: '0709053334', Tontineàintegrer: 'tontine les amitiés', statutintegration: 'En attente'}
  ]);

    // je cree un autre etat pour les filtres

    const [filtres, setFiltres] = useState('Tous');

    return (
      <div className="client-integration-center">
     <div className="theme">
     <img src="/images/teorange.png" alt="icon" className="photo"/>
     <h1>Centre d'intégration clients</h1>
     </div>
      
      <ClientFilter 
        currentFilter={filtres}
        onFilterChange={setFiltres}
      />
      
      <h2>Gestion des clients</h2>
      
      <ClientTable 
        clients={clients}
        onStatusChange={setClients}
      />
    </div>
      );  

};

export default ClientIntegrationCenter;