import { Market } from '../data/markets';
import { Brain, TrendingUp, TrendingDown, Minus, Clock } from 'lucide-react';

interface AIFeedProps {
  markets: Market[];
}

export function AIFeed({ markets }: AIFeedProps) {
  const topSignals = [...markets]
    .sort((a, b) => b.aiSignal.confidence - a.aiSignal.confidence)
    .slice(0, 5);

  return (
    <div className="bg-gray-900/40 border border-gray-800/60 rounded-xl p-5">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Brain size={16} className="text-purple-400" />
          <h3 className="text-sm font-semibold text-white">AI Signal Feed</h3>
          <span className="text-[10px] px-1.5 py-0.5 rounded bg-purple-500/10 text-purple-400 border border-purple-500/20 font-medium">LIVE</span>
        </div>
        <div className="flex items-center gap-1 text-[11px] text-gray-500">
          <Clock size={11} />
          <span>Updated 3s ago</span>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
        {topSignals.map((market) => {
          const signal = market.aiSignal;
          const DirectionIcon = signal.direction === 'bullish' ? TrendingUp : signal.direction === 'bearish' ? TrendingDown : Minus;
          const dirColor = signal.direction === 'bullish' ? 'text-green-400' : signal.direction === 'bearish' ? 'text-red-400' : 'text-gray-400';
          const dirBg = signal.direction === 'bullish' ? 'bg-green-500/10' : signal.direction === 'bearish' ? 'bg-red-500/10' : 'bg-gray-500/10';

          return (
            <div key={market.id} className="bg-gray-900/80 border border-gray-800/60 rounded-lg p-3">
              <div className="flex items-center justify-between mb-2">
                <div className={`flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-medium ${dirBg} ${dirColor}`}>
                  <DirectionIcon size={10} />
                  <span>{signal.direction.toUpperCase()}</span>
                </div>
                <span className="text-[10px] text-gray-500">{signal.confidence}%</span>
              </div>
              <p className="text-xs text-gray-300 font-medium leading-tight line-clamp-2 mb-2">
                {market.title}
              </p>
              <div className="flex items-center justify-between">
                <span className="text-[10px] text-gray-500">{signal.model}</span>
                <div className="flex items-center gap-1">
                  <div className="w-12 h-1 rounded-full bg-gray-800 overflow-hidden">
                    <div
                      className={`h-full rounded-full ${
                        signal.confidence > 75 ? 'bg-green-400' : signal.confidence > 50 ? 'bg-amber-400' : 'bg-red-400'
                      }`}
                      style={{ width: `${signal.confidence}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
