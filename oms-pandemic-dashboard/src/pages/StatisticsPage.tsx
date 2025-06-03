import { useEffect, useState } from "react";
import { getStatistics, createStatistic, deleteStatistic, updateStatistic } from "../api/Statistics";

type Statistic = {
  id: number;
  country: { id: number; name: string; population: number; continent: { id: number; name: string } };
  disease: { id: number; name: string };
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
  const [newStat, setNewStat] = useState({
    countryId: 0,
    diseaseId: 0,
    totalConfirmed: 0,
    totalDeaths: 0,
    totalRecovered: 0,
  });
  const [editStat, setEditStat] = useState<Statistic | null>(null);

  useEffect(() => {
    getStatistics()
      .then((res: any) => setStatistics(res.data))
      .catch((err: any) => console.error("Erreur API:", err));
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewStat({ ...newStat, [name]: Number(value) });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const payload = {
      country: { id: newStat.countryId },
      disease: { id: newStat.diseaseId },
      totalConfirmed: newStat.totalConfirmed,
      totalDeaths: newStat.totalDeaths,
      totalRecovered: newStat.totalRecovered,
      activeCases: newStat.totalConfirmed - newStat.totalRecovered - newStat.totalDeaths,
      seriousOrCritical: 0,
      totalCasesPer1MPopulation: 0,
      totalDeathsPer1MPopulation: 0,
      totalTests: 0,
      totalTestsPer1MPopulation: 0,
    };

    createStatistic(payload).then(() => {
      alert("Statistique ajoutée !");
      window.location.reload();
    });
  };

  const handleDelete = (id: number) => {
    if (confirm("Confirmer la suppression ?")) {
      deleteStatistic(id).then(() => window.location.reload());
    }
  };

  return (
    <div>
      <h2>Liste des statistiques</h2>

      <form onSubmit={handleSubmit}>
        <input type="number" name="countryId" placeholder="ID Pays" onChange={handleInputChange} required />
        <input type="number" name="diseaseId" placeholder="ID Maladie" onChange={handleInputChange} required />
        <input type="number" name="totalConfirmed" placeholder="Confirmés" onChange={handleInputChange} required />
        <input type="number" name="totalDeaths" placeholder="Décès" onChange={handleInputChange} required />
        <input type="number" name="totalRecovered" placeholder="Rétablis" onChange={handleInputChange} required />
        <button type="submit">Ajouter</button>
      </form>

      {editStat && (
        <form
          onSubmit={(e) => {
            e.preventDefault();
            const payload = {
              ...editStat,
              country: { id: editStat.country.id },
              disease: { id: editStat.disease.id },
            };
            updateStatistic(editStat.id, payload).then(() => {
              alert("Modifié !");
              setEditStat(null);
              window.location.reload();
            });
          }}
        >
          <h3>Modifier Statistique #{editStat.id}</h3>
          <input
            type="number"
            value={editStat.totalConfirmed}
            onChange={(e) => setEditStat({ ...editStat, totalConfirmed: Number(e.target.value) })}
          />
          <input
            type="number"
            value={editStat.totalDeaths}
            onChange={(e) => setEditStat({ ...editStat, totalDeaths: Number(e.target.value) })}
          />
          <input
            type="number"
            value={editStat.totalRecovered}
            onChange={(e) => setEditStat({ ...editStat, totalRecovered: Number(e.target.value) })}
          />
          <button type="submit">Valider</button>
          <button type="button" onClick={() => setEditStat(null)}>Annuler</button>
        </form>
      )}

      <table border={1} cellPadding={5}>
        <thead>
          <tr>
            <th>Pays</th>
            <th>Maladie</th>
            <th>Confirmés</th>
            <th>Décès</th>
            <th>Rétablis</th>
            <th>Actifs</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {statistics.map((stat) => (
            <tr key={stat.id}>
              <td>{stat.country.name}</td>
              <td>{stat.disease.name}</td>
              <td>{stat.totalConfirmed}</td>
              <td>{stat.totalDeaths}</td>
              <td>{stat.totalRecovered}</td>
              <td>{stat.activeCases}</td>
              <td>
                <button onClick={() => handleDelete(stat.id)}>Supprimer</button>
                <button onClick={() => setEditStat(stat)}>Modifier</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
