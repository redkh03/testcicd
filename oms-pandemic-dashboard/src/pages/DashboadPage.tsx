import { useEffect, useState } from "react";
import { getStatistics } from "../api/statistics";
import {
  Chart as ChartJS,
  BarElement,
  ArcElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar, Pie } from "react-chartjs-2";

ChartJS.register(BarElement, ArcElement, CategoryScale, LinearScale, Tooltip, Legend);

// --- Types ---
type Continent = {
  id: number;
  name: string;
};

type Country = {
  id: number;
  name: string;
  population: number;
  continent: Continent;
};

type Disease = {
  id: number;
  name: string;
};

type Statistic = {
  id: number;
  country: Country;
  disease: Disease;
  totalConfirmed: number;
  totalDeaths: number;
  totalRecovered: number;
  activeCases: number;
  seriousOrCritical: number;
  totalCasesPer1MPopulation: number;
  totalDeathsPer1MPopulation: number;
  totalTests: number;
  totalTestsPer1MPopulation: number;
};

type MetricKey = "totalDeaths" | "totalTests" | "totalConfirmed" | "totalRecovered";

const metricOptions: Record<MetricKey, string> = {
  totalDeaths: "Décès",
  totalTests: "Tests",
  totalConfirmed: "Cas Confirmés",
  totalRecovered: "Rétablis",
};

// --- Composant ---
export default function DashboardPage() {
  const [statistics, setStatistics] = useState<Statistic[]>([]);
  const [selectedMetric, setSelectedMetric] = useState<MetricKey>("totalConfirmed");

  useEffect(() => {
    getStatistics()
      .then((res: any) => {
        const filtered: Statistic[] = res.data.filter(
          (s: Statistic) => s.country && s.disease
        );
        setStatistics(filtered);
      })
      .catch((err: any) => console.error("❌ Erreur API:", err));
  }, []);

  const topCountries = [...statistics]
    .sort((a, b) => b[selectedMetric] - a[selectedMetric])
    .slice(0, 10);

  const barData = {
    labels: topCountries.map((s) => s.country.name),
    datasets: [
      {
        label: metricOptions[selectedMetric],
        data: topCountries.map((s) => s[selectedMetric]),
        backgroundColor: "rgba(75, 192, 192, 0.7)",
        borderRadius: 5,
      },
    ],
  };

  const continentStats: Record<string, number> = statistics.reduce((acc, stat) => {
    const continent = stat.country.continent.name;
    acc[continent] = (acc[continent] || 0) + stat[selectedMetric];
    return acc;
  }, {} as Record<string, number>);

  const pieData = {
    labels: Object.keys(continentStats),
    datasets: [
      {
        label: metricOptions[selectedMetric],
        data: Object.values(continentStats),
        backgroundColor: [
          "#FF6384", "#36A2EB", "#FFCE56", "#4BC0C0", "#9966FF", "#FF9F40",
        ],
        borderWidth: 1,
      },
    ],
  };

  return (
    <div style={{ fontFamily: "Segoe UI, sans-serif", backgroundColor: "#f5f7fa", minHeight: "100vh" }}>

      {/* Content */}
      <main style={{ padding: "2rem" }}>
        {/* Filtre */}
        <div style={{ marginBottom: "1.5rem" }}>
          <label htmlFor="metric-select" style={{ marginRight: "0.5rem", fontWeight: "bold" }}>
            Filtrer par :
          </label>
          <select
            id="metric-select"
            value={selectedMetric}
            onChange={(e) => setSelectedMetric(e.target.value as MetricKey)}
            style={{
              padding: "0.4rem 0.8rem",
              borderRadius: "5px",
              border: "1px solid #ccc",
              fontSize: "1rem",
            }}
          >
            {Object.entries(metricOptions).map(([key, label]) => (
              <option key={key} value={key}>
                {label}
              </option>
            ))}
          </select>
        </div>

        {/* Graphiques */}
        <div style={{ display: "flex", flexWrap: "wrap", gap: "2rem" }}>
          <div style={{
            flex: 1,
            minWidth: 400,
            background: "#ffffff",
            padding: "1.5rem",
            borderRadius: "12px",
            boxShadow: "0 4px 10px rgba(0, 0, 0, 0.05)"
          }}>
            <h3 style={{ marginBottom: "1rem", color: "#1e293b" }}>
              Top 10 Pays - {metricOptions[selectedMetric]}
            </h3>
            <Bar data={barData} />
          </div>

          <div style={{
            flex: 1,
            minWidth: 400,
            background: "#ffffff",
            padding: "1.5rem",
            borderRadius: "12px",
            boxShadow: "0 4px 10px rgba(0, 0, 0, 0.05)"
          }}>
            <h3 style={{ marginBottom: "1rem", color: "#1e293b" }}>
              Répartition par Continent - {metricOptions[selectedMetric]}
            </h3>
            <Pie data={pieData} />
          </div>
        </div>
      </main>
    </div>
  );
}
