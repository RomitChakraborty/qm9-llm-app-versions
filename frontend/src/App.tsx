import React, { useState } from 'react';
import FactUploader from './components/FactUploader';
import PersonaForm from './components/PersonaForm';
import MeritResultCard from './components/MeritResultCard';

type Fact = {
  speaker: string;
  timestamp: string;
  assertion: string;
  evidence_url?: string;
};

type Persona = {
  name: string;
  jurisdiction: string;
  start_date: string;
  injury_type: string;
};

type PredictionResult = {
  score: number;
  explanation: string;
};

function App() {
  const [persona, setPersona] = useState<Persona | null>(null);
  const [facts, setFacts] = useState<Fact[]>([]);
  const [result, setResult] = useState<PredictionResult | null>(null);

  const handleSubmit = async () => {
    if (!persona) return;
    const res = await fetch('http://localhost:8000/predict', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ persona, facts })
    });
    setResult(await res.json());
  };

  return (
    <div className="max-w-2xl mx-auto p-4 space-y-4">
      <PersonaForm onChange={setPersona} />
      <FactUploader onChange={setFacts} />
      <button className="bg-blue-500 text-white px-4 py-2" onClick={handleSubmit}>Predict</button>
      {result && <MeritResultCard result={result} />}
    </div>
  );
}

export default App;
