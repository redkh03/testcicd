import PredictionForm from "../pages/PredictionForm";

export default function PredictionPage() {
  return (
    <main className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Page de prédictions IA</h1>
        <PredictionForm />
      </div>
    </main>
  );
}