import React from 'react';

const ClientRow = ({ client, onStatusChange }) => {
  const statusOptions = ['En attend', 'En cours', 'Echec', 'Termine'];
  
  return (
    <tr>
      <td>{client.contact}</td>
      <td>{client.tontine}</td>
      <td>{client.status}</td>
      <td>
        <select 
          value={client.status}
          onChange={(e) => onStatusChange(client.id, e.target.value)}
        >
          {statusOptions.map(option => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      </td>
    </tr>
  );
};

export default ClientRow;