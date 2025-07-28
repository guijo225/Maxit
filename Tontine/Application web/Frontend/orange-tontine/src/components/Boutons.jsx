import React from 'react';

function Boutons({ label, onClick, style }) {
  return (
    <button onClick={onClick} style={style}>
      {label}
    </button>
  );
}

export default Boutons;