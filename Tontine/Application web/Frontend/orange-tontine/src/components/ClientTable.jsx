import React from 'react';
import { useNavigate } from 'react-router-dom';

const ClientTable = () => {
  const navigate = useNavigate();

  return (
    <div className="client-management">
      <table>
        <thead>
          <tr>
            <th></th> {/* Empty header for the color indicator */}
            <th>Contact</th>
            <th>Tontine à adhérer</th>
            <th>Statut d'intégration</th>
          </tr>
        </thead>
        <tbody>
          <tr className='mes' onClick={() => navigate("/Card")} style={{cursor:"pointer"}}>
            <td style={{backgroundColor: "#ED6C30", width: "20px", minWidth: "20px"}}></td>
            <td>0709053334</td>
            <td>tontine les amitiés</td>
            <td className="stat">
                <button style={{gap: 1, width: 100}}>
                    Echec
                </button>
            </td>
          </tr>
          <tr className='mes' onClick={() => navigate("/")} style={{cursor:"pointer"}}>
            <td style={{backgroundColor: "#ED6C30", width: "20px", minWidth: "20px"}}></td>
            <td>0709053334</td>
            <td>tontine les amitiés</td>
            <td className="stat">
                <button style={{gap: 1, width: 100}}>
                    En Attente
                </button>
            </td>
          </tr>
          <tr className='mes' onClick={() => navigate("/")} style={{cursor:"pointer"}}>
            <td style={{backgroundColor: "#ED6C30", width: "20px", minWidth: "20px"}}></td>
            <td>0709053334</td>
            <td>tontine les amitiés</td>
            <td className="stat">
                <button style={{gap: 1, width: 100}}>
                    En cours
                </button>
            </td>
          </tr>
          <tr className='mes' onClick={() => navigate("/")} style={{cursor:"pointer"}}>
            <td style={{backgroundColor: "#ED6C30", width: "20px", minWidth: "20px"}}></td>
            <td>0709053334</td>
            <td>tontine les amitiés</td>
            <td className="stat">
                <button style={{gap: 1, width: 100}}>
                    Terminé
                </button>
            </td>
          </tr>
          {/*autre ligne */}
        </tbody>
      </table>
    </div>
  );
};

export default ClientTable;