import { useEffect, useState } from "react";
import { getStatistics } from "../api/Statistics";

type Statistic = {
  id: number;
  country: {
    id: number;
    name: string;
    population: number;
    continent: {
      id: number;
      name: string;
    };
  };
  disease: {
    id: number;
    name: string;
  };
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

export default function StatisticsPage() {
  const [statistics, setStatistics] = useState<Statistic[]>([]);

  useEffect(() => {
    getStatistics()
      .then((res) => setStatistics(res.data))
      .catch((err) => console.error("Erreur API:", err));
  }, []);

  return (
    <div>
      <h2>Liste des statistiques</h2>
      {statistics.length === 0 ? (
        <p>Aucune donnée disponible.</p>
      ) : (
        <table border={1} cellPadding={5}>
          <thead>
            <tr>
              <th>Pays</th>
              <th>Maladie</th>
              <th>Confirmés</th>
              <th>Décès</th>
              <th>Rétablis</th>
              <th>Actifs</th>
              <th>Graves</th>
              <th>Tests</th>
            </tr>
          </thead>
          <tbody>
            {statistics.map((stat) => (
              <tr key={stat.id}>
                <td>{stat.country.name} ({stat.country.continent.name})</td>
                <td>{stat.disease.name}</td>
                <td>{stat.totalConfirmed}</td>
                <td>{stat.totalDeaths}</td>
                <td>{stat.totalRecovered}</td>
                <td>{stat.activeCases}</td>
                <td>{stat.seriousOrCritical}</td>
                <td>{stat.totalTests}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
