import { BrowserRouter as Router, Routes, Route, Link} from "react-router-dom";
import StatisticsPage from "./pages/StatisticsPage";

function App() {
  return (
    <Router>
      <nav>
        <ul>
          <li><Link to="/">Accueil</Link></li>
          <li><Link to="/statistics">Statistiques</Link></li>
        </ul>
      </nav>
      <Routes>
        <Route path="/" element={<h1>Accueil</h1>} />
        <Route path="/statistics" element={<StatisticsPage/>} />
      </Routes>
    </Router>
  );
}

export default App;

