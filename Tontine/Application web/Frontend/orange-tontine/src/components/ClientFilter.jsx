import React from 'react';
import PropTypes from 'prop-types';
import "./ClientFilter.css"

const ClientFilter = ({ currentFilter, onFilterChange }) => {
    const statuses = ['Tous', 'Echec', 'En cours', 'Terminé', 'En attente'];
    
    return (
        <div style={{alignItems:"center", textAlign:"center", justifyContent:"space-between",flex:1, padding:20}}>
            <div className="status-filter">
            {statuses.map(status => (
                <button
                    key={status}
                    className={currentFilter === status ? 'active' : ''}
                    onClick={() => onFilterChange(status)}
                >
                    {status}
                </button>
            ))}
        </div>
        </div>
    );
};

ClientFilter.propTypes = {
    currentFilter: PropTypes.string.isRequired,
    onFilterChange: PropTypes.func.isRequired
};

export default ClientFilter;