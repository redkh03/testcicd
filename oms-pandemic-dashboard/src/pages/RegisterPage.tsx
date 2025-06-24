// 📁 src/pages/RegisterPage.tsx
import { useState } from "react";
import axios from "axios";

function RegisterPage() {
  const [formData, setFormData] = useState({ username: "", email: "", password: "" });
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSuccess("");
    setError("");
    try {
      await axios.post("http://localhost:8081/api/auth/register", formData);
      setSuccess("Inscription réussie !");
    } catch (err: any) {
      console.error(err);
      setError(err.response?.data?.message || "Erreur d'inscription.");
    }
  };

  return (
    <main className="flex justify-center items-center min-h-screen bg-gray-100 p-4">
      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-lg rounded-xl w-full max-w-md p-6 space-y-4"
        aria-label="Formulaire d'inscription"
      >
        <h2 className="text-2xl font-bold text-center">Inscription</h2>
        {success && <p className="text-green-600" role="alert">{success}</p>}
        {error && <p className="text-red-600" role="alert">{error}</p>}

        <div>
          <label htmlFor="username" className="block mb-1 font-medium">Nom d'utilisateur</label>
          <input
            id="username"
            name="username"
            type="text"
            required
            value={formData.username}
            onChange={(e) => setFormData({ ...formData, username: e.target.value })}
            className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600"
          />
        </div>

        <div>
          <label htmlFor="email" className="block mb-1 font-medium">Adresse email</label>
          <input
            id="email"
            name="email"
            type="email"
            required
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600"
          />
        </div>

        <div>
          <label htmlFor="password" className="block mb-1 font-medium">Mot de passe</label>
          <input
            id="password"
            name="password"
            type="password"
            required
            value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600"
          />
        </div>

        <button
          type="submit"
          className="w-full py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:ring-2 focus:ring-blue-400"
        >
          S'inscrire
        </button>
      </form>
    </main>
  );
}

export default RegisterPage;
