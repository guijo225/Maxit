import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import TontinePage from './page/TontinePage';
import DashboardPage from './page/DashboardPage';
import RapportPage from './page/RapportPage'
import './App.css';
import DetailPage from './page/DetailPage';
import DetailTontine from './page/DetailTontine';
import LoginPage from './page/LoginPage';
import ComptePage from './page/ComptePage'

function AppLayout() {
  const [isSubmenuOpen, setIsSubmenuOpen] = useState(false);
  const toggleSubmenu = () => setIsSubmenuOpen(!isSubmenuOpen);

  return (
    <div className="app-layout">
      <aside className="sidebar-container">
        <Sidebar 
          isSubmenuOpen={isSubmenuOpen}
          toggleSubmenu={toggleSubmenu}
        />
      </aside>
      <div className="main-layout">
        <header className="header-container">
          <Header />
        </header>
        <main className="page-container">
          <Routes>
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/tontines" element={<TontinePage />} />
            <Route path="/Rapport" element={<RapportPage />} />
            <Route path="/DetailPage" element={<DetailPage/>} />
            <Route path="/DetailTontine" element={<DetailTontine/>}/>
            <Route path="/ComptePage" element={<ComptePage/>}/>
          </Routes>
        </main>
      </div>
    </div>
  );
}

function App() {
  const location = useLocation();

  // Si on est sur la page de connexion on affiche uniquement LoginPage
  if (location.pathname === "/") {
    return <LoginPage />;
  }

  // Sinon, on affiche le layout normal
  return <AppLayout />;
}

export default function RootApp() {
  return (
    <Router>
      <App />
    </Router>
  );
}