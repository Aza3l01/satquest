export default function Timer({ timeLeft }: { timeLeft: number }) {
  const formatTime = () => {
    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  const getTimerStyle = () => {
    if (timeLeft > 30) return "bg-green-500/80";
    if (timeLeft > 10) return "bg-yellow-500/80";
    return "bg-red-500/80 animate-pulse";
  };

  return (
    <div className={`flex items-center ${getTimerStyle()} text-white px-4 py-2 rounded-lg transition-colors duration-300`}>
      <div className="font-mono font-bold">{formatTime()}</div>
    </div>
  );
}