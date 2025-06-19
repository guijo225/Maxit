import React from "react";

import './DetailTontine.css'

function DetailTontine() {

    return (
        <div className="page-container">
           <div className="tableau">
           <main className="main-content">
           <div className="header">
             <h3>Détails de la tontine</h3>
           </div>
            <section className="case">
            <table>
                <thead>
                    <tr>
                        <td>Nom de la tontine</td>
                        <td className="droite">
                           <button className="bouton">
                            <h2>Tontine toto</h2>
                           </button>
                        </td>
                    </tr>
                    <tr>
                        <td>Montant Max</td>
                        <td className="droite">500 000</td>
                    </tr>
                    <tr>
                        <td>Inscription ouvert</td>
                        <td className="droite">
                            <button className="bout"><h2>OUI</h2></button>
                        </td>
                    </tr>
                    <tr>
                        <td>Date de création</td>
                        <td className="droite">01/01/2025</td>
                    </tr>
                    <tr>
                        <td>Description</td>
                        <td className="droite">Tontine</td>
                    </tr>
                    <tr>
                        <td>Membre(s)</td>
                        <td className="droite">
                            <button className="but"><h2>0/5</h2></button>
                        </td>
                    </tr>
                    <tr>
                        <td>Montant/Personne</td>
                        <td className="droite">125 000</td>
                    </tr>
                </thead>
                </table>
            </section>
           </main>
           </div>
          </div>
    )
}

export default DetailTontine;