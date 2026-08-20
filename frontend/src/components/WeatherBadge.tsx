interface WeatherProps {
  weather?: string;
}

export default function WeatherBadge({ weather }: WeatherProps) {
  // Gracefully handle missing or unavailable weather
  if (!weather || weather === 'Weather unavailable') {
    return (
      <span className="inline-flex items-center gap-1 rounded-full bg-gray-50 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-gray-400 ring-1 ring-inset ring-gray-500/10">
        Weather Unavailable
      </span>
    );
  }

  return (
    <span 
      className="inline-flex items-center gap-1.5 rounded-full bg-blue-50/80 px-2.5 py-1 text-xs font-bold tracking-tight text-blue-700 ring-1 ring-inset ring-blue-500/20 backdrop-blur-sm transition-colors hover:bg-blue-100"
      title="Live Weather"
    >
      <span className="text-sm drop-shadow-sm">⛅</span> 
      <span>{weather}</span>
    </span>
  );
}