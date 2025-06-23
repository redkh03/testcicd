import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import DashboardPage from "./pages/DashboadPage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import whoLogo from "./media/World-Health-Organization-Logo2.png";
import PrivateRoute from "./PrivateRoute";

const styles = {
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "1rem 2rem",
    backgroundColor: "#1f2937",
    color: "white",
    boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)"
  },
  title: {
    margin: 0,
    fontSize: "1.5rem"
  },
  navList: {
    display: "flex",
    listStyle: "none",
    gap: "1.5rem",
    margin: 0,
    padding: 0
  },
  link: {
    color: "white",
    textDecoration: "none",
    fontWeight: "bold"
  },
  main: {
    padding: "2rem"
  }
};

function App() {
  return (
    <Router>
      <header style={styles.header}>
        <img src={whoLogo} alt="Logo" style={{ height: 50, marginRight: "1rem" }} />
        <h1 style={styles.title}>Pandemic Data Dashboard</h1>
        <nav>
          <ul style={styles.navList}>
            {/* Nav caché si pas connecté */}
            {localStorage.getItem("token") && (
              <>
                <li><Link to="/">Accueil</Link></li>
                <li><Link to="/statistics">Statistiques</Link></li>
                <li><Link to="/dashboard">Dashboard</Link></li>
              </>
            )}
          </ul>
        </nav>
      </header>

      <main style={styles.main}>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          
          {/* Routes protégées */}
          <Route path="/" element={<PrivateRoute><h2>Bienvenue sur le tableau de bord</h2></PrivateRoute>} />
          <Route path="/dashboard" element={<PrivateRoute><DashboardPage /></PrivateRoute>} />
          <Route path="/statistics" element={<PrivateRoute><h2>Page Statistiques</h2></PrivateRoute>} />
        </Routes>
      </main>
    </Router>
  );
  
}
