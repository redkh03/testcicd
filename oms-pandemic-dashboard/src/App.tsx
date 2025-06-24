import { BrowserRouter as Router, Routes, Route, Navigate, Link } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import DashboardPage from "./pages/DashboadPage";
import { useEffect, useState } from "react";
import whoLogo from "./media/World-Health-Organization-Logo2.png";
import PredictionPage from "./pages/PredictionPage";

function App() {
  const [token, setToken] = useState<string | null>(localStorage.getItem("token"));

  const isAuthenticated = !!token;

  useEffect(() => {
    const stored = localStorage.getItem("token");
    if (stored) setToken(stored);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    setToken(null);
    window.location.href = "/login";
  };

  return (
    <Router>
      <header style={styles.header}>
        <div style={{ display: "flex", alignItems: "center" }}>
          <img src={whoLogo} alt="Logo" style={{ height: 40, marginRight: 10 }} />
          <h1 style={styles.title}>Pandemic Dashboard</h1>
        </div>
        <nav>
          <ul style={styles.navList}>
            {!isAuthenticated && (
              <>
                <li><Link to="/login" style={styles.link}>Login</Link></li>
                <li><Link to="/register" style={styles.link}>Register</Link></li>
              </>
            )}
            {isAuthenticated && (
              <>
                <li><Link to="/dashboard" style={styles.link}>Dashboard</Link></li>
                 <li><Link to="/predictions" style={styles.link}>Prédictions IA</Link></li>
                <li><button onClick={handleLogout} style={styles.linkButton}>Logout</button></li>
              </>
            )}
          </ul>
        </nav>
      </header>

      <main style={styles.main}>
        <Routes>
          <Route path="/login" element={!isAuthenticated ? <LoginPage /> : <Navigate to="/dashboard" />} />
          <Route path="/register" element={!isAuthenticated ? <RegisterPage /> : <Navigate to="/dashboard" />} />
          <Route path="/dashboard" element={isAuthenticated ? <DashboardPage /> : <Navigate to="/login" />} />
          <Route path="*" element={<Navigate to={isAuthenticated ? "/dashboard" : "/login"} />} />
          <Route path="/predictions" element={isAuthenticated ? <PredictionPage /> : <Navigate to="/login" />} />

        </Routes>
      </main>
    </Router>
  );
}

const styles: any = {
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "1rem 2rem",
    backgroundColor: "#1f2937",
    color: "white"
  },
  title: { margin: 0, fontSize: "1.4rem" },
  navList: {
    display: "flex",
    listStyle: "none",
    gap: "1rem",
    margin: 0,
    padding: 0
  },
  link: {
    color: "white",
    textDecoration: "none",
    fontWeight: "bold"
  },
  linkButton: {
    background: "none",
    border: "none",
    color: "white",
    fontWeight: "bold",
    cursor: "pointer"
  },
  main: { padding: "2rem" }
};

export default App;
