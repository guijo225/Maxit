import React from 'react';
import './Bouton.css'

function Bouton({ goToPreviousPage, goToNextPage, currentPage, totalPages }) {
    return (
        <div className="pagination-buttons">
              <button 
                className="pagination-button prev" 
                onClick={goToPreviousPage} 
                disabled={currentPage === 1}
              >
                Précédent
              </button>
              
              <span className="page-number-indicator">
                Page {currentPage} sur {totalPages}
              </span>
              
              <button 
                className="pagination-button next" 
                onClick={goToNextPage} 
                disabled={currentPage === totalPages}
              >
                Suivant
              </button>
            </div>
    );
  }

  export default Bouton;