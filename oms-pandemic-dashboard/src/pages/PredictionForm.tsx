import { useState, useEffect, useRef } from "react";
import axios from "axios";
import {
  ComposableMap,
  Geographies,
  Geography,
  ZoomableGroup,
  Marker
} from "react-simple-maps";

const endpointMap = {
  "Capacité hospitalière": "/api/ia/hospital-capacity",
  "Charge virale": "/api/ia/viral-load",
  "Propagation géographique": "/api/ia/geographic-spread",
} as const;

type EndpointLabel = keyof typeof endpointMap;
type RiskLevel = "Élevé" | "Modéré" | "Faible" | string;
type NeighborRisk = { country: string; risk_level: RiskLevel };
type PredictionResponse = {
  neighboring_countries_risk?: NeighborRisk[];
};

const geoUrl = "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json";

function PredictionForm() {
  const [type, setType] = useState<EndpointLabel>("Capacité hospitalière");
  const [countryName, setCountryName] = useState("");
  const [result, setResult] = useState<PredictionResponse | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [tooltipContent, setTooltipContent] = useState<string>("");
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });
  const [hoveredCountry, setHoveredCountry] = useState<string | null>(null);
  const mapContainerRef = useRef<HTMLDivElement>(null);

  const handleSubmit = async () => {
    if (!countryName.trim()) return;
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const statsRes = await axios.get(
        `http://localhost:8081/api/statistics/by-country/${encodeURIComponent(countryName)}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const response = await axios.post<PredictionResponse>(
        `http://localhost:8081${endpointMap[type]}`,
        statsRes.data,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setResult(response.data);
      setError("");
    } catch {
      setError("Erreur lors de l'appel à l'IA ou à l'API statistiques.");
      setResult(null);
    } finally {
      setLoading(false);
    }
  };

  const riskColors: Record<RiskLevel, string> = {
    "Élevé": "#EF4444",
    "Modéré": "#F59E0B",
    "Faible": "#10B981",
  };

  const getCountryColor = (name: string) => {
    if (!result?.neighboring_countries_risk) return "#EEE";
    const match = result.neighboring_countries_risk.find(
      (c) => c.country.toLowerCase() === name.toLowerCase()
    );
    return match ? riskColors[match.risk_level] ?? "#EEE" : "#EEE";
  };

  const handleMouseEnter = (geo: any, event: React.MouseEvent) => {
    setTooltipContent(geo.properties.name);
    setHoveredCountry(geo.properties.name);
    if (mapContainerRef.current) {
      const rect = mapContainerRef.current.getBoundingClientRect();
      setTooltipPosition({ x: event.clientX - rect.left, y: event.clientY - rect.top });
    }
  };

  const handleMouseLeave = () => {
    setTooltipContent("");
    setHoveredCountry(null);
  };

  const renderMap = () => {
    if (!result?.neighboring_countries_risk || type !== "Propagation géographique") return null;
    return (
      <div ref={mapContainerRef} className="relative h-[250px] w-full">
        <ComposableMap
          projection="geoMercator"
          projectionConfig={{ scale: 100, center: [0, 20] }}
          className="w-full h-full"
        >
          <ZoomableGroup>
            <Geographies geography={geoUrl}>
              {({ geographies }) =>
                geographies.map((geo) => (
                  <Geography
                    key={geo.rsmKey}
                    geography={geo}
                    fill={getCountryColor(geo.properties.name)}
                    stroke="#D1D5DB"
                    strokeWidth={0.3}
                    onMouseEnter={(e) => handleMouseEnter(geo, e)}
                    onMouseLeave={handleMouseLeave}
                    style={{
                      default: {
                        outline: "none",
                        opacity: hoveredCountry === geo.properties.name ? 0.8 : 1,
                      },
                      hover: {
                        fill: "#3B82F6",
                        outline: "none",
                        stroke: "#1E40AF",
                        strokeWidth: 1,
                        opacity: 0.8,
                      },
                      pressed: { outline: "none" },
                    }}
                  />
                ))
              }
            </Geographies>
          </ZoomableGroup>
          {countryName && (
            <Marker coordinates={[0, 0]}>
              <circle r={5} fill="#7C3AED" stroke="#FFF" strokeWidth={1} />
            </Marker>
          )}
        </ComposableMap>
        {hoveredCountry && (
          <div
            className="absolute bg-gray-800 text-white px-3 py-2 rounded-md shadow-lg z-50 pointer-events-none"
            style={{ top: `${tooltipPosition.y + 15}px`, left: `${tooltipPosition.x + 15}px`, transform: "translateX(-50%)" }}
          >
            <div className="font-bold">{hoveredCountry}</div>
            {result && (
              <div className="mt-1">
                Niveau de risque: {result.neighboring_countries_risk.find((c) => c.country.toLowerCase() === hoveredCountry.toLowerCase())?.risk_level ?? "Inconnu"}
              </div>
            )}
          </div>
        )}
      </div>
    );
  };

  const renderLegend = () => {
    if (!result?.neighboring_countries_risk || type !== "Propagation géographique") return null;
    return (
      <div className="mt-4">
        <h4 className="text-md font-medium mb-2">Légende des couleurs</h4>
        <div className="grid grid-cols-1 gap-2 text-sm">
          <div className="flex items-center gap-2">
            <span className="w-4 h-4 rounded" style={{ backgroundColor: "#EF4444" }} />
            <span>Risque Élevé</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-4 h-4 rounded" style={{ backgroundColor: "#F59E0B" }} />
            <span>Risque Modéré</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-4 h-4 rounded" style={{ backgroundColor: "#10B981" }} />
            <span>Risque Faible</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-4 h-4 bg-gray-200 rounded" />
            <span>Données non disponibles</span>
          </div>
        </div>
      </div>
    );
  };

  const renderRiskList = () => {
    if (!result?.neighboring_countries_risk) return null;

    const grouped: Record<RiskLevel, string[]> = {
      "Élevé": [],
      "Modéré": [],
      "Faible": [],
    };

    result.neighboring_countries_risk.forEach(({ country, risk_level }) => {
      if (!grouped[risk_level]) grouped[risk_level] = [];
      grouped[risk_level].push(country);
    });

    const riskOrder: RiskLevel[] = ["Élevé", "Modéré", "Faible"];

    return (
      <div className="space-y-4">
        {riskOrder.map((level) => (
          grouped[level] && grouped[level].length > 0 && (
            <div key={level} className="border-l-4 pl-3 py-2" style={{ borderColor: riskColors[level] }}>
              <h4 className="text-md font-semibold flex items-center gap-2 mb-1">
                <span className="inline-block w-3 h-3 rounded-full" style={{ backgroundColor: riskColors[level] }} />
                {level} <span className="text-gray-500 text-sm">({grouped[level].length} pays)</span>
              </h4>
              <div className="mt-1 grid grid-cols-2 md:grid-cols-3 gap-1 text-sm text-gray-700 max-h-40 overflow-auto pr-1">
                {grouped[level].map((c) => (
                  <div key={c} className="flex items-center">
                    <span className="mr-1">•</span>
                    <span className="truncate">{c}</span>
                  </div>
                ))}
              </div>
            </div>
          )
        ))}
      </div>
    );
  };

  return (
    <section className="mt-10 bg-white p-6 rounded-xl shadow-md" aria-labelledby="predictionTitle">
      <h2 id="predictionTitle" className="text-2xl font-bold mb-6 flex items-center gap-2">
        <span role="img" aria-label="emoji">🧠</span> Prédiction IA
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block mb-1 font-semibold text-gray-700">Type de prédiction</label>
          <select
            value={type}
            onChange={(e) => setType(e.target.value as EndpointLabel)}
            className="w-full border border-gray-300 p-2 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {Object.keys(endpointMap).map((label) => (
              <option key={label} value={label}>{label}</option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="country" className="block mb-1 font-semibold text-gray-700">Nom du pays</label>
          <input
            id="country"
            type="text"
            value={countryName}
            onChange={(e) => setCountryName(e.target.value)}
            className="w-full border border-gray-300 p-2 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-600"
            required
          />
        </div>
      </div>

      <button
        onClick={handleSubmit}
        className="mt-6 w-full md:w-auto px-6 py-2 bg-blue-600 text-white rounded-md font-semibold hover:bg-blue-700 focus:ring-2 focus:ring-blue-400 focus:outline-none"
        disabled={loading}
      >
        {loading ? "Chargement..." : "Lancer la prédiction"}
      </button>

      {error && <p className="text-red-600 mt-4" role="alert">{error}</p>}

      {result && (
        <div id="Global" className="mt-8">
          {result.neighboring_countries_risk && type === "Propagation géographique" ? (
            <>
              <div id="gauche" style={{ float: 'left', width: '60%' }}>
                <h3 className="text-xl font-semibold mb-4 text-blue-800 border-b pb-2">
                  Résultats de prédiction pour {countryName}
                </h3>
                <div className="mb-6">
                  <h4 className="text-lg font-medium mb-3">Niveaux de risque des pays voisins</h4>
                  {renderRiskList()}
                </div>
              </div>
              <div id="droite" style={{ marginLeft: '60%' }}>
                <h3 className="text-xl font-semibold mb-4 text-blue-800 border-b pb-2">
                  Visualisation géographique
                </h3>
                {renderMap()}
                {renderLegend()}
              </div>
            </>
          ) : (
            <div className="w-full">
              {Object.entries(result).map(([key, value]) => {
                if (key === "neighboring_countries_risk") return null;
                return (
                  <div key={key} className="mt-4 p-3 bg-gray-50 rounded">
                    <h4 className="text-md font-semibold mb-2 capitalize">{key.replace(/_/g, " ")}</h4>
                    {typeof value === "object" ? (
                      <pre className="bg-white p-2 rounded text-sm overflow-auto max-h-40 border">
                        {JSON.stringify(value, null, 2)}
                      </pre>
                    ) : (
                      <p className="text-gray-800 bg-white p-2 rounded border">{String(value)}</p>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}
    </section>
  );
}

export default PredictionForm;
