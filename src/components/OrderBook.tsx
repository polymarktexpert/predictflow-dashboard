import { Market } from '../data/markets';
import { BookOpen } from 'lucide-react';

interface OrderBookProps {
  market: Market;
}

export function OrderBook({ market }: OrderBookProps) {
  const bids = market.orderBook.filter(e => e.side === 'bid').sort((a, b) => b.price - a.price);
  const asks = market.orderBook.filter(e => e.side === 'ask').sort((a, b) => a.price - b.price);
  
  const maxSize = Math.max(...market.orderBook.map(e => e.size));

  return (
    <div className="bg-gray-900/50 border border-gray-800/60 rounded-xl p-5">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <BookOpen size={14} className="text-purple-400" />
          <span className="text-sm font-medium text-white">CLOB Depth</span>
        </div>
        <span className="text-[10px] text-gray-500">YES shares</span>
      </div>

      {/* Header */}
      <div className="grid grid-cols-3 text-[10px] text-gray-500 mb-2 px-1 uppercase tracking-wider">
        <span>Price</span>
        <span className="text-right">Size</span>
        <span className="text-right">Total</span>
      </div>

      {/* Asks (reversed to show highest at top) */}
      <div className="space-y-[2px] mb-2">
        {[...asks].reverse().map((entry, i) => (
          <div key={`ask-${i}`} className="relative grid grid-cols-3 text-[11px] py-1 px-1 rounded-sm">
            <div
              className="absolute inset-y-0 right-0 bg-red-500/8 rounded-sm"
              style={{ width: `${(entry.size / maxSize) * 100}%` }}
            />
            <span className="text-red-400 relative z-10 font-mono">{entry.price.toFixed(2)}</span>
            <span className="text-right text-gray-300 relative z-10 font-mono">{formatSize(entry.size)}</span>
            <span className="text-right text-gray-500 relative z-10 font-mono">{formatSize(entry.total)}</span>
          </div>
        ))}
      </div>

      {/* Spread / Mid */}
      <div className="flex items-center justify-center py-2.5 border-y border-gray-800/60 my-2 bg-gray-800/20 rounded">
        <span className="text-base font-bold text-white font-mono">
          {market.outcomes[0].price.toFixed(2)}
        </span>
        <span className="text-[10px] text-gray-500 ml-2">mid</span>
      </div>

      {/* Bids */}
      <div className="space-y-[2px] mt-2">
        {bids.map((entry, i) => (
          <div key={`bid-${i}`} className="relative grid grid-cols-3 text-[11px] py-1 px-1 rounded-sm">
            <div
              className="absolute inset-y-0 right-0 bg-green-500/8 rounded-sm"
              style={{ width: `${(entry.size / maxSize) * 100}%` }}
            />
            <span className="text-green-400 relative z-10 font-mono">{entry.price.toFixed(2)}</span>
            <span className="text-right text-gray-300 relative z-10 font-mono">{formatSize(entry.size)}</span>
            <span className="text-right text-gray-500 relative z-10 font-mono">{formatSize(entry.total)}</span>
          </div>
        ))}
      </div>

      {/* Summary */}
      <div className="mt-4 pt-4 border-t border-gray-800/60 grid grid-cols-2 gap-4">
        <div>
          <div className="text-[10px] text-gray-500 uppercase tracking-wider">Bid Depth</div>
          <div className="text-sm font-medium text-green-400 font-mono">
            {formatSize(bids.reduce((acc, e) => acc + e.size, 0))}
          </div>
        </div>
        <div>
          <div className="text-[10px] text-gray-500 uppercase tracking-wider">Ask Depth</div>
          <div className="text-sm font-medium text-red-400 font-mono">
            {formatSize(asks.reduce((acc, e) => acc + e.size, 0))}
          </div>
        </div>
      </div>
    </div>
  );
}

function formatSize(size: number): string {
  if (size >= 1000000) return `${(size / 1000000).toFixed(1)}M`;
  if (size >= 1000) return `${(size / 1000).toFixed(1)}K`;
  return size.toString();
}
