import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import TontinePage from './page/TontinePage';
import DashboardPage from './page/DashboardPage';
import RapportPage from './page/RapportPage'
import './App.css';

function App() {
  const [isSubmenuOpen, setIsSubmenuOpen] = useState(false);

  const toggleSubmenu = () => {
    setIsSubmenuOpen(!isSubmenuOpen);
  };

  return (
    <Router>
      <div className="app-layout">
        {/* Sidebar fixe */}
        <aside className="sidebar-container">
          <Sidebar 
            isSubmenuOpen={isSubmenuOpen}
            toggleSubmenu={toggleSubmenu}
          />
        </aside>

        {/* Contenu principal avec header et routes */}
        <div className="main-layout">
          <header className="header-container">
            <Header />
          </header>
          
          <main className="page-container">
            <Routes>
              <Route path="/dashboard" element={<DashboardPage />} />
              <Route path="/tontines" element={<TontinePage />} />
              <Route path="/Rapport" element={<RapportPage />} />
            </Routes>
          </main>
        </div>
      </div>
    </Router>
  );
}

export default App;