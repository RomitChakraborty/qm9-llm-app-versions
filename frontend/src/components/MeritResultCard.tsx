import React from 'react';

export default function MeritResultCard({ result }: { result: { score: number; explanation: string } }) {
  return (
    <div className="border p-4 bg-white">
      <h2 className="text-xl font-bold">Merit Score: {result.score.toFixed(2)}</h2>
      <p>{result.explanation}</p>
    </div>
  );
}
