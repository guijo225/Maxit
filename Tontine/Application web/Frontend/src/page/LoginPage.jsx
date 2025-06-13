import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./LoginPage.css";

const LoginPage = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleUsernameChange = (e) => {
    setUsername(e.target.value);
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Tentative de connexion avec:", username, password);
    navigate("/dashboard");
  };

  return (
    <div className="login-container">
      <div className="login-left">
        <h2>Bienvenue sur</h2>
        <h1>Orange Max It TONTINE</h1>
        <p>
          Gérez vos opérations en toute simplicité.<br />
          Accédez à votre tableau de bord pour consulter les rapports, suivre les transactions, et administrer les comptes en toute sécurité.
        </p>
      </div>
      <div className="login-right">
        <h2>
          Identifiez-vous et accedez<br />
          à l'administration
        </h2>
        <form className="login-form" onSubmit={handleSubmit}>
          <div className="input-group">
            <img src="/images/man-profile.jpg" alt="user" className="icon" />
            <input
              type="text"
              placeholder="Entrer vos identifiants ..."
              value={username}
              onChange={handleUsernameChange}
            />
          </div>
          <div className="input-group">
            <img src="/images/lock.png" alt="user" className="icon" />
            <input
              type="password"
              placeholder="Code secret ..."
              value={password}
              onChange={handlePasswordChange}
            />
          </div>
          <button type="submit">Se Connecter</button>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;