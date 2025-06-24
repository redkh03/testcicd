import { useState } from "react";
import axios from "axios";

function RegisterPage() {
  const [formData, setFormData] = useState({ username: "", password: "" });
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSuccess(""); setError("");

    try {
      await axios.post("http://localhost:8081/api/auth/register", formData);
      setSuccess("Inscription réussie !");
    } catch (err) {
      console.error(err);
      setError("Erreur d'inscription.");
    }
  };

  return (
    <div style={{ maxWidth: 400, margin: "auto", padding: "2rem" }}>
      <h2>Inscription</h2>
      {success && <p style={{ color: "green" }}>{success}</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}
      <form onSubmit={handleSubmit}>
        <input name="username" placeholder="Nom d'utilisateur" onChange={(e) => setFormData({ ...formData, username: e.target.value })} required />
        <input type="password" name="password" placeholder="Mot de passe" onChange={(e) => setFormData({ ...formData, password: e.target.value })} required />
        <button type="submit">S'inscrire</button>
      </form>
    </div>
  );
}

export default RegisterPage;
