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
    <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
      <div className="flex items-center gap-2 mb-4">
        <BookOpen size={16} className="text-purple-400" />
        <span className="text-sm font-medium text-white">Order Book</span>
        <span className="text-xs text-gray-500 ml-auto">YES shares</span>
      </div>

      {/* Header */}
      <div className="grid grid-cols-3 text-xs text-gray-500 mb-2 px-1">
        <span>Price</span>
        <span className="text-right">Size</span>
        <span className="text-right">Total</span>
      </div>

      {/* Asks (reversed to show highest at top) */}
      <div className="space-y-[2px] mb-2">
        {[...asks].reverse().map((entry, i) => (
          <div key={`ask-${i}`} className="relative grid grid-cols-3 text-xs py-1 px-1 rounded-sm">
            <div
              className="absolute inset-0 bg-red-500/10 rounded-sm"
              style={{ width: `${(entry.size / maxSize) * 100}%`, right: 0, left: 'auto' }}
            />
            <span className="text-red-400 relative z-10">{entry.price.toFixed(2)}</span>
            <span className="text-right text-gray-300 relative z-10">{formatSize(entry.size)}</span>
            <span className="text-right text-gray-500 relative z-10">{formatSize(entry.total)}</span>
          </div>
        ))}
      </div>

      {/* Spread */}
      <div className="flex items-center justify-center py-2 border-y border-gray-800 my-2">
        <span className="text-lg font-bold text-white">
          {market.outcomes[0].price.toFixed(2)}
        </span>
        <span className="text-xs text-gray-500 ml-2">spread</span>
      </div>

      {/* Bids */}
      <div className="space-y-[2px] mt-2">
        {bids.map((entry, i) => (
          <div key={`bid-${i}`} className="relative grid grid-cols-3 text-xs py-1 px-1 rounded-sm">
            <div
              className="absolute inset-0 bg-green-500/10 rounded-sm"
              style={{ width: `${(entry.size / maxSize) * 100}%`, right: 0, left: 'auto' }}
            />
            <span className="text-green-400 relative z-10">{entry.price.toFixed(2)}</span>
            <span className="text-right text-gray-300 relative z-10">{formatSize(entry.size)}</span>
            <span className="text-right text-gray-500 relative z-10">{formatSize(entry.total)}</span>
          </div>
        ))}
      </div>

      {/* Summary */}
      <div className="mt-4 pt-4 border-t border-gray-800 grid grid-cols-2 gap-4">
        <div>
          <div className="text-xs text-gray-500">Bid Depth</div>
          <div className="text-sm font-medium text-green-400">
            {formatSize(bids.reduce((acc, e) => acc + e.size, 0))}
          </div>
        </div>
        <div>
          <div className="text-xs text-gray-500">Ask Depth</div>
          <div className="text-sm font-medium text-red-400">
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
