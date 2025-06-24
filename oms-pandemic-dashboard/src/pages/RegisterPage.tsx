import { useState } from "react";
import axios from "axios";

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
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-tr from-blue-100 via-blue-200 to-blue-400">
      <div className="w-full max-w-md px-2">
        <form
          onSubmit={handleSubmit}
          className="relative bg-white rounded-2xl shadow-2xl p-8 md:p-10 flex flex-col gap-6 border border-blue-100 animate-fade-in"
          aria-label="Formulaire d'inscription"
          autoComplete="on"
        >
          <div className="flex flex-col items-center mb-2">
            <span className="rounded-full bg-blue-100 p-4 mb-3 shadow-sm">
              {/* SVG User Icon */}
              <svg width="36" height="36" viewBox="0 0 24 24" fill="none">
                <circle cx="12" cy="8" r="4" fill="#2563eb" />
                <path d="M4 20v-1c0-2.761 4.477-5 8-5s8 2.239 8 5v1" fill="#2563eb" opacity=".3"/>
              </svg>
            </span>
            <h2 className="text-3xl font-extrabold text-blue-800 mb-1 tracking-tight">Créer un compte</h2>
            <p className="text-gray-500 text-center">Bienvenue ! Inscrivez-vous pour profiter de tous nos services.</p>
          </div>

          {success && (
            <p className="text-green-700 bg-green-50 border border-green-300 px-3 py-2 rounded text-center" role="alert" aria-live="polite">
              {success}
            </p>
          )}
          {error && (
            <p className="text-red-700 bg-red-50 border border-red-300 px-3 py-2 rounded text-center" role="alert" aria-live="assertive">
              {error}
            </p>
          )}

          {/* Champ Username */}
          <div className="relative">
            <label htmlFor="username" className="block mb-2 font-semibold text-gray-800">
              Nom d'utilisateur <span className="text-red-500">*</span>
            </label>
            <div className="flex items-center relative">
              <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-400">
                {/* SVG user */}
                <svg width="20" height="20" fill="none" stroke="currentColor"><path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4z"/><path d="M12 14c-3.31 0-8 1.67-8 5v1a1 1 0 001 1h14a1 1 0 001-1v-1c0-3.33-4.69-5-8-5z" opacity="0.3"/></svg>
              </span>
              <input
                id="username"
                name="username"
                type="text"
                required
                autoComplete="username"
                placeholder="Ex : jean.dupont"
                value={formData.username}
                onChange={handleChange}
                className="w-full p-3 pl-10 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all text-base bg-blue-50 placeholder:text-gray-400"
                aria-required="true"
                aria-label="Nom d'utilisateur"
                maxLength={32}
              />
            </div>
          </div>

          {/* Champ Email */}
          <div className="relative">
            <label htmlFor="email" className="block mb-2 font-semibold text-gray-800">
              Adresse email <span className="text-red-500">*</span>
            </label>
            <div className="flex items-center relative">
              <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-400">
                {/* SVG mail */}
                <svg width="20" height="20" fill="none" stroke="currentColor"><path d="M2 7.75A2.75 2.75 0 014.75 5h14.5A2.75 2.75 0 0122 7.75v8.5A2.75 2.75 0 0119.25 19H4.75A2.75 2.75 0 012 16.25v-8.5zm2.5.25l7 4.5 7-4.5"/></svg>
              </span>
              <input
                id="email"
                name="email"
                type="email"
                required
                autoComplete="email"
                placeholder="exemple@domaine.com"
                value={formData.email}
                onChange={handleChange}
                className="w-full p-3 pl-10 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all text-base bg-blue-50 placeholder:text-gray-400"
                aria-required="true"
                aria-label="Adresse email"
              />
            </div>
          </div>

          {/* Champ Password */}
          <div className="relative">
            <label htmlFor="password" className="block mb-2 font-semibold text-gray-800">
              Mot de passe <span className="text-red-500">*</span>
            </label>
            <div className="flex items-center relative">
              <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-400">
                {/* SVG lock */}
                <svg width="20" height="20" fill="none" stroke="currentColor"><path d="M17 9V7a5 5 0 10-10 0v2"/><rect x="5" y="9" width="14" height="10" rx="2"/><circle cx="12" cy="14" r="2"/></svg>
              </span>
              <input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                required
                autoComplete="new-password"
                placeholder="••••••••"
                value={formData.password}
                onChange={handleChange}
                className="w-full p-3 pl-10 pr-10 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all text-base bg-blue-50 placeholder:text-gray-400"
                aria-required="true"
                aria-label="Mot de passe"
                minLength={8}
              />
              {/* Afficher/masquer mot de passe */}
              <button
                type="button"
                tabIndex={0}
                onClick={() => setShowPassword((s) => !s)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-blue-500 focus:outline-none"
                aria-label={showPassword ? "Masquer le mot de passe" : "Afficher le mot de passe"}
              >
                {/* Eye icon */}
                {showPassword ? (
                  <svg width="20" height="20" fill="none" stroke="currentColor"><path d="M1 10s4-6 11-6 11 6 11 6-4 6-11 6S1 10 1 10z"/><circle cx="12" cy="10" r="3"/></svg>
                ) : (
                  <svg width="20" height="20" fill="none" stroke="currentColor"><path d="M17.94 17.94a10.97 10.97 0 01-5.94 1.56c-7 0-11-6-11-6a20.87 20.87 0 012.93-3.33"/><path d="M1 1l22 22"/></svg>
                )}
              </button>
            </div>
            <div className="text-gray-500 text-xs mt-1" id="passwordHelp">
              8 caractères minimum, une majuscule, un chiffre, un caractère spécial.
            </div>
          </div>

          {/* Bouton Submit */}
          <button
            type="submit"
            className="w-full py-3 px-4 bg-gradient-to-r from-blue-600 to-blue-500 text-white rounded-xl font-semibold hover:from-blue-700 hover:to-blue-600 focus:ring-2 focus:ring-blue-400 focus:outline-none transition-all text-base shadow-md active:scale-95"
            disabled={loading}
            aria-busy={loading}
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="animate-spin h-5 w-5 text-white" viewBox="0 0 24 24">
                  <circle className="opacity-20" cx="12" cy="12" r="10" stroke="white" strokeWidth="4" fill="none" />
                  <path className="opacity-70" fill="white" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                </svg>
                Création du compte...
              </span>
            ) : (
              "S'inscrire"
            )}
          </button>
        </form>
      </div>
    </div>
  );
}

export default RegisterPage;
