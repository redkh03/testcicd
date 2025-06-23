import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await axios.post("http://localhost:8081/api/auth/login", { 
        username,
        password,
      });

      const token = response.data.token; // ou .accessToken selon ta réponse
      localStorage.setItem("token", token);

      console.log("✅ Login réussi :", response.data);
      sessionStorage.setItem("auth", btoa(`${username}:${password}`)); // stocké encodé
      navigate("/dashboard");
    } catch (err) {
      console.error("❌ Échec de connexion :", err);
      setError("Identifiants incorrects.");
    }
  };

  return (
    <div style={{ maxWidth: 400, margin: "auto", padding: "2rem" }}>
      <h2>Connexion</h2>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <form onSubmit={handleLogin}>
        <div>
          <label>Nom d'utilisateur :</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            style={{ width: "100%", padding: "0.5rem", marginBottom: "1rem" }}
          />
        </div>
        <div>
          <label>Mot de passe :</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            style={{ width: "100%", padding: "0.5rem", marginBottom: "1rem" }}
          />
        </div>
        <button type="submit" style={{ padding: "0.5rem 1rem" }}>Se connecter</button>
      </form>
    </div>
  );
}

export default LoginPage;
