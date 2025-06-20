import React from "react";

import "./ComptePage.css";

function Mycompte({ data }) {
    return (
      <div className="bar-chart-container">
        {data.map((item, index) => (
          <div key={index} className="bar-container">
            <div
              className="bar"
              style={{
                height: `${item.value}%`, // Hauteur basée sur la valeur
                backgroundColor: item.color // Couleur de la barre
              }}
            >
               {/* Optionnel : Afficher la valeur sur la barre */}
              {/* <span>{item.value}</span> */}
            </div>
            <div className="label">{item.label}</div>
          </div>
        ))}
      </div>
    );
  }
  
export default Mycompte