import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import './LoginPage.css';
import whoLogo from "../media/World-Health-Organization-Logo2.png";

function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      const res = await axios.post("http://localhost:8081/api/auth/login", { username, password });
      const token = res.data;

      if (!token) {
        setError("Token non reçu !");
        return;
      }
      localStorage.setItem("token", token);
      window.location.href = "/dashboard";
    } catch (err) {
      console.error("Login error", err);
      setError("Identifiants incorrects");
    }
  };

  return (
    
    <div className="login-wrapper">
      {error && <p style={{ color: "red" }}>{error}</p>}
      <form className="login-form" onSubmit={handleLogin}>
        <div className="logo-container">
          <img src={whoLogo} alt="Logo OMS" />
        </div>
        <h2>Connexion</h2>
        <input type="text" placeholder="Nom d'utilisateur" value={username} onChange={(e) => setUsername(e.target.value)} required />
        <input type="password" placeholder="Mot de passe" value={password} onChange={(e) => setPassword(e.target.value)} required />
        <button type="submit">Se connecter</button>
        <p className="register-text">
          Pas encore de compte ? <a href="/register">Inscription</a>
        </p>
      </form>
    </div>
  );
}

export default LoginPage;

