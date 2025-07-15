import React from 'react';
import { useNavigate } from 'react-router-dom';
import "./Cards.css"

function Card({
 Contact = '0709083334',
  Nomtontine = 'Client Anonyme',
  Statutintegration= 'Echec'
}) {
    const navigate = useNavigate();
  return (
    
    <div className='container'>
     <div className="detail">
        <h2>Detail</h2>
        <div className="les-p">
        <p><strong>Contact:</strong> {Contact}</p>
        <p><strong>Nom de tontine:</strong> {Nomtontine}</p>
        <p><strong>Status d'integration:</strong> {Statutintegration}</p> 
        </div>
     </div>
     
     <button onClick={() => navigate} className="button1">Ajouter</button>
     <button onClick={() => navigate} className="button2">Bloquer</button>
     </div>
    
  );
}

export default Card;