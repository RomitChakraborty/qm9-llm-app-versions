import React from 'react';

interface Props {
  onChange: (persona: any) => void;
}

export default function PersonaForm({ onChange }: Props) {
  const handle = (e: React.ChangeEvent<HTMLInputElement>) => {
    const form = e.currentTarget.form!;
    const data = {
      name: form.name.value,
      jurisdiction: form.jurisdiction.value,
      start_date: form.start_date.value,
      injury_type: form.injury_type.value,
    };
    onChange(data);
  };

  return (
    <form className="space-y-2">
      <input name="name" placeholder="Name" className="border" onChange={handle} />
      <input name="jurisdiction" placeholder="Jurisdiction" className="border" onChange={handle} />
      <input type="date" name="start_date" className="border" onChange={handle} />
      <input name="injury_type" placeholder="Injury Type" className="border" onChange={handle} />
    </form>
  );
}
