import React from 'react';
import Button from './Button.css';

function App() {
  const buttonsData = [
    { label: 'Tous', onClick: () => alert('Action du bouton 1') },
    { label: 'En cours', onClick: () => alert('Action du bouton 2') },
    { label: 'En attente', onClick: () => alert('Action du bouton 3') },
    { label: 'Echec', onClick: () => alert('Action du bouton 4') },
    { label: 'Terminé', onClick: () => alert('Action du bouton 5') },
  ];


  return (
    <div>
      {buttonsData.map((button, index) => (
        <Button
          key={index}
          label={button.label}
          onClick={button.onClick}
        />
      ))}
    </div>
  );
}

export default App;