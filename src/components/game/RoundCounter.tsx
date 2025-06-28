import React from 'react';

export default function RoundCounter({ 
  current, 
  total 
}: { 
  current: number; 
  total: number; 
}) {
  return (
    <div className="flex items-center bg-black/70 text-white px-4 py-2 rounded-lg">
      <span className="font-bold">Round</span>
      <span className="font-mono mx-2">{current}/{total}</span>
    </div>
  );
}