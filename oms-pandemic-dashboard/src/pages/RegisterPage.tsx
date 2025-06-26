import { useState } from "react";
import axios from "axios";
import './RegisterPage.css';

function RegisterPage() {
  const [formData, setFormData] = useState({ username: "", email: "", password: "" });
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError("");
    setSuccess("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSuccess("");
    setError("");
    setLoading(true);
    try {
      await axios.post("http://localhost:8081/api/auth/register", formData);
      setSuccess("Inscription réussie !");
      setFormData({ username: "", email: "", password: "" });
    } catch (err: any) {
      setError(err.response?.data?.message || "Erreur d'inscription.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="register-wrapper">
      <h2>Créer un compte</h2>
      <p>Bienvenue ! Inscrivez-vous pour profiter de tous nos services.</p>

      {success && <div className="message success">{success}</div>}
      {error && <div className="message error">{error}</div>}

      <form onSubmit={handleSubmit}>
        <label htmlFor="username">Nom d'utilisateur *</label>
        <input
          id="username"
          name="username"
          type="text"
          required
          placeholder="Ex : jean.dupont"
          value={formData.username}
          onChange={handleChange}
        />

        <label htmlFor="email">Adresse email *</label>
        <input
          id="email"
          name="email"
          type="email"
          required
          placeholder="exemple@domaine.com"
          value={formData.email}
          onChange={handleChange}
        />

        <label htmlFor="password">Mot de passe *</label>
        <input
          id="password"
          name="password"
          type={showPassword ? "text" : "password"}
          required
          placeholder="••••••••"
          value={formData.password}
          onChange={handleChange}
        />
        <div style={{ marginBottom: "1rem", fontSize: "0.9rem" }}>
          <input
            type="checkbox"
            checked={showPassword}
            onChange={() => setShowPassword(!showPassword)}
            id="showPassword"
          />
          <label htmlFor="showPassword" style={{ marginLeft: "0.5rem" }}>
            Afficher le mot de passe
          </label>
        </div>

        <button type="submit" disabled={loading}>
          {loading ? "Création du compte..." : "S'inscrire"}
        </button>
      </form>
    </div>
  );
}

export default RegisterPage;
