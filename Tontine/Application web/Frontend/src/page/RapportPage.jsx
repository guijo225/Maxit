import { BiSearch,BiDownload } from "react-icons/bi";

import './RapportPage.css'

function RapportPage() {

  return (
    <div className ='rapport'>
      <div className='premiere_vue'> 
        <h5>Document à disposition</h5>
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
            placeholder="Rechercher..."
            style={{
              width: "100%",
              padding: "8px 8px 8px 36px",
              boxSizing: "border-box",
            }}
          />
        </div>
        <button>rechercher</button>
        </div>
      </div>

      <div className='deuxieme_vue'>
        <h5>Retrouvez ici les documents qui vous permettent de suivre en détail l'évolution de votre activité, 
            notamment le nombre de tontines ouvertes cette année, les transactions effectuées, les fonds
            disponibles, ainsi que les redistributions réalisées par période.
        </h5>
      </div>
      <div className="troisieme_vue">
        <div className="rapport1">Rapport hebdomadaire</div>
        <div className="rapport1">Rapport mensuel</div>
        <div className="rapport1">Rapport annuel</div>
      </div>
      <div className="quatrieme_vue">
        <table>
          <thead>
            <tr>
              <th className='nomDoc'>Nom du document</th>
              <th>Date</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className='nomDoc'>Rapport hebdomadaire</td>
              <td>01/01/2023</td>
              <td>
                <button style={{ display: "flex",alignItems:"center", gap: 6 }}>
                  <BiDownload style={{ fontSize: 18 }} />
                  Télécharger
                </button>
              </td>
            </tr>
            <tr>
              <td className='nomDoc'>Rapport mensuel</td>
              <td>01/02/2023</td>
              <td>
                <button style={{ display: "flex", alignItems: "center", gap: 6 }}>
                  <BiDownload style={{ fontSize: 18 }} />
                  Télécharger
                </button>
              </td>
            </tr>
            <tr>
              <td className='nomDoc'>Rapport annuel</td>
              <td>01/12/2023</td>
              <td>
                <button style={{ display: "flex", alignItems: "center", gap: 6 }}>
                  <BiDownload style={{ fontSize: 18 }} />
                  Télécharger
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default RapportPage;