import React, { useState } from 'react';

interface Props {
  onChange: (facts: any[]) => void;
}

export default function FactUploader({ onChange }: Props) {
  const [text, setText] = useState('');

  const handleBlur = () => {
    try {
      const parsed = JSON.parse(text);
      onChange(parsed);
    } catch (_) {
      console.error('Invalid JSON');
    }
  };

  return (
    <textarea
      className="border w-full h-32"
      placeholder="Enter facts as JSON array"
      value={text}
      onChange={(e) => setText(e.target.value)}
      onBlur={handleBlur}
    />
  );
}
