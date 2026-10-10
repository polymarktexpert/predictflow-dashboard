import { Market } from '../data/markets';
import { TrendingUp, TrendingDown, DollarSign, Clock, Brain, Shield, Zap } from 'lucide-react';

interface MarketCardProps {
  market: Market;
  onClick: (market: Market) => void;
}

export function MarketCard({ market, onClick }: MarketCardProps) {
  const yesOutcome = market.outcomes[0];
  const isUp = yesOutcome.change24h > 0;
  const signal = market.aiSignal;
  const compliance = market.usCompliance;

  const formatVolume = (vol: number) => {
    if (vol >= 1000000) return `$${(vol / 1000000).toFixed(1)}M`;
    if (vol >= 1000) return `$${(vol / 1000).toFixed(0)}K`;
    return `$${vol}`;
  };

  const dirColor = signal.direction === 'bullish' ? 'text-green-400' : signal.direction === 'bearish' ? 'text-red-400' : 'text-gray-400';
  const complianceColor = compliance.cftcStatus === 'allowed' ? 'text-green-400' : compliance.cftcStatus === 'restricted' ? 'text-amber-400' : 'text-red-400';

  return (
    <div
      onClick={() => onClick(market)}
      className="bg-gray-900/50 border border-gray-800/60 rounded-xl p-5 cursor-pointer hover:border-purple-500/40 hover:bg-gray-900/80 transition-all duration-200 group"
    >
      {/* Top Row: Category + AI Signal */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-purple-500/10 text-purple-400 border border-purple-500/20">
            {market.category}
          </span>
          <div className={`flex items-center gap-0.5 ${complianceColor}`}>
            <Shield size={10} />
          </div>
        </div>
        <div className="flex items-center gap-1.5">
          <div className={`flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-medium ${
            signal.direction === 'bullish' ? 'bg-green-500/10 text-green-400' : 
            signal.direction === 'bearish' ? 'bg-red-500/10 text-red-400' : 
            'bg-gray-500/10 text-gray-400'
          }`}>
            <Brain size={9} />
            <span>{signal.confidence}%</span>
          </div>
          <div className={`flex items-center gap-0.5 text-xs font-medium ${isUp ? 'text-green-400' : 'text-red-400'}`}>
            {isUp ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
            <span className="text-[11px]">{isUp ? '+' : ''}{yesOutcome.change24h}%</span>
          </div>
        </div>
      </div>

      {/* Title */}
      <h3 className="text-white font-semibold text-sm mb-4 leading-snug group-hover:text-purple-300 transition-colors line-clamp-2">
        {market.title}
      </h3>

      {/* Price + Sparkline */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-baseline gap-1.5">
          <div className="text-2xl font-bold text-white">{(yesOutcome.price * 100).toFixed(0)}¢</div>
          <span className="text-gray-600 text-xs">YES</span>
        </div>
        
        {/* Mini sparkline */}
        <div className="flex items-end gap-[2px] h-7">
          {market.priceHistory.slice(-14).map((point, i) => (
            <div
              key={i}
              className="w-[3px] rounded-sm bg-purple-500/30 group-hover:bg-purple-500/50 transition-colors"
              style={{ height: `${Math.max(3, point.price * 28)}px` }}
            />
          ))}
        </div>
      </div>

      {/* Oracle + Volume */}
      <div className="flex items-center justify-between text-[11px] text-gray-500 border-t border-gray-800/60 pt-3">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1">
            <DollarSign size={10} />
            <span>{formatVolume(market.volume)}</span>
          </div>
          <div className="flex items-center gap-1">
            <Zap size={10} className="text-amber-500/70" />
            <span>{market.oracle.provider.split(' ')[0]}</span>
          </div>
        </div>
        <div className="flex items-center gap-1">
          <Clock size={10} />
          <span>{market.endDate.slice(5)}</span>
        </div>
      </div>
    </div>
  );
}
