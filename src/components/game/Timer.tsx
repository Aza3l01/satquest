import React from 'react';

export default function Timer({ timeLeft }: { timeLeft: number }) {
  const formatTime = () => {
    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  return (
    <div className="flex items-center bg-black/70 text-white px-4 py-2 rounded-lg">
      <div className="font-mono font-bold">{formatTime()}</div>
      <span className="ml-2">remaining</span>
    </div>
  );
}