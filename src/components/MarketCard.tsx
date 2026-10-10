import { Market } from '../data/markets';
import { TrendingUp, TrendingDown, Clock, DollarSign } from 'lucide-react';

interface MarketCardProps {
  market: Market;
  onClick: (market: Market) => void;
}

export function MarketCard({ market, onClick }: MarketCardProps) {
  const yesOutcome = market.outcomes[0];
  const isUp = yesOutcome.change24h > 0;

  const formatVolume = (vol: number) => {
    if (vol >= 1000000) return `$${(vol / 1000000).toFixed(1)}M`;
    if (vol >= 1000) return `$${(vol / 1000).toFixed(0)}K`;
    return `$${vol}`;
  };

  return (
    <div
      onClick={() => onClick(market)}
      className="bg-gray-900 border border-gray-800 rounded-xl p-5 cursor-pointer hover:border-purple-500/50 hover:bg-gray-850 transition-all duration-200 group"
    >
      <div className="flex items-start justify-between mb-3">
        <span className="text-xs font-medium px-2 py-1 rounded-full bg-purple-500/10 text-purple-400 border border-purple-500/20">
          {market.category}
        </span>
        <div className={`flex items-center gap-1 text-sm font-medium ${isUp ? 'text-green-400' : 'text-red-400'}`}>
          {isUp ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
          {isUp ? '+' : ''}{yesOutcome.change24h}%
        </div>
      </div>

      <h3 className="text-white font-semibold text-base mb-4 leading-snug group-hover:text-purple-300 transition-colors">
        {market.title}
      </h3>

      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="text-2xl font-bold text-white">{(yesOutcome.price * 100).toFixed(0)}¢</div>
          <span className="text-gray-500 text-sm">YES</span>
        </div>
        
        {/* Mini sparkline */}
        <div className="flex items-end gap-[2px] h-8">
          {market.priceHistory.slice(-12).map((point, i) => (
            <div
              key={i}
              className="w-1.5 rounded-sm bg-purple-500/40 group-hover:bg-purple-500/60 transition-colors"
              style={{ height: `${Math.max(4, point.price * 32)}px` }}
            />
          ))}
        </div>
      </div>

      <div className="flex items-center justify-between text-xs text-gray-500 border-t border-gray-800 pt-3">
        <div className="flex items-center gap-1">
          <DollarSign size={12} />
          <span>Vol: {formatVolume(market.volume)}</span>
        </div>
        <div className="flex items-center gap-1">
          <Clock size={12} />
          <span>{market.endDate}</span>
        </div>
      </div>
    </div>
  );
}
