import { Market } from '../data/markets';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, Area, AreaChart } from 'recharts';
import { ArrowLeft, ExternalLink, BarChart3, Clock, DollarSign, Activity } from 'lucide-react';
import { OrderBook } from './OrderBook';
import { useState } from 'react';

interface MarketDetailProps {
  market: Market;
  onBack: () => void;
}

export function MarketDetail({ market, onBack }: MarketDetailProps) {
  const [timeRange, setTimeRange] = useState<'7D' | '30D' | 'ALL'>('30D');
  const yesOutcome = market.outcomes[0];
  const isUp = yesOutcome.change24h > 0;

  const formatVolume = (vol: number) => {
    if (vol >= 1000000) return `$${(vol / 1000000).toFixed(1)}M`;
    if (vol >= 1000) return `$${(vol / 1000).toFixed(0)}K`;
    return `$${vol}`;
  };

  const filteredHistory = market.priceHistory.slice(
    timeRange === '7D' ? -7 : timeRange === '30D' ? -30 : 0
  );

  return (
    <div className="min-h-screen bg-gray-950">
      {/* Header */}
      <div className="border-b border-gray-800 bg-gray-950/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <button
              onClick={onBack}
              className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
            >
              <ArrowLeft size={18} />
              <span className="text-sm">Back</span>
            </button>
            <div className="h-4 w-px bg-gray-800" />
            <span className="text-xs font-medium px-2 py-1 rounded-full bg-purple-500/10 text-purple-400 border border-purple-500/20">
              {market.category}
            </span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Title & Stats */}
        <div className="mb-8">
          <h1 className="text-2xl md:text-3xl font-bold text-white mb-4">{market.title}</h1>
          
          <div className="flex flex-wrap items-center gap-6">
            <div className="flex items-center gap-3">
              <div className="text-4xl font-bold text-white">{(yesOutcome.price * 100).toFixed(0)}¢</div>
              <div className={`flex items-center gap-1 text-lg font-medium ${isUp ? 'text-green-400' : 'text-red-400'}`}>
                {isUp ? '+' : ''}{yesOutcome.change24h}%
              </div>
            </div>
            
            <div className="flex items-center gap-6 text-sm text-gray-400">
              <div className="flex items-center gap-1.5">
                <DollarSign size={14} />
                <span>Vol: {formatVolume(market.volume)}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Activity size={14} />
                <span>Liquidity: {formatVolume(market.liquidity)}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Clock size={14} />
                <span>Ends: {market.endDate}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Chart Section */}
          <div className="lg:col-span-2">
            <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <BarChart3 size={16} className="text-purple-400" />
                  <span className="text-sm font-medium text-white">Price History</span>
                </div>
                <div className="flex gap-1">
                  {(['7D', '30D', 'ALL'] as const).map((range) => (
                    <button
                      key={range}
                      onClick={() => setTimeRange(range)}
                      className={`px-3 py-1 text-xs font-medium rounded-md transition-colors ${
                        timeRange === range
                          ? 'bg-purple-500/20 text-purple-400 border border-purple-500/30'
                          : 'text-gray-500 hover:text-gray-300'
                      }`}
                    >
                      {range}
                    </button>
                  ))}
                </div>
              </div>

              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={filteredHistory} margin={{ top: 5, right: 5, left: 5, bottom: 5 }}>
                    <defs>
                      <linearGradient id="priceGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#a855f7" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="#a855f7" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <XAxis
                      dataKey="timestamp"
                      tick={{ fill: '#6b7280', fontSize: 11 }}
                      tickLine={false}
                      axisLine={false}
                      tickFormatter={(val) => val.slice(5)}
                    />
                    <YAxis
                      domain={[0, 1]}
                      tick={{ fill: '#6b7280', fontSize: 11 }}
                      tickLine={false}
                      axisLine={false}
                      tickFormatter={(val) => `${(val * 100).toFixed(0)}¢`}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#1f2937',
                        border: '1px solid #374151',
                        borderRadius: '8px',
                        color: '#fff',
                        fontSize: '12px',
                      }}
                      labelStyle={{ color: '#9ca3af' }}
                      formatter={(value: number) => [`${(value * 100).toFixed(0)}¢`, 'Price']}
                    />
                    <Area
                      type="monotone"
                      dataKey="price"
                      stroke="#a855f7"
                      strokeWidth={2}
                      fill="url(#priceGradient)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>

              {/* Volume bars */}
              <div className="mt-4 pt-4 border-t border-gray-800">
                <div className="text-xs text-gray-500 mb-2">Daily Volume</div>
                <div className="flex items-end gap-1 h-12">
                  {filteredHistory.map((point, i) => (
                    <div
                      key={i}
                      className="flex-1 rounded-t-sm bg-purple-500/30 hover:bg-purple-500/50 transition-colors"
                      style={{
                        height: `${(point.volume / Math.max(...filteredHistory.map(p => p.volume))) * 100}%`,
                        minHeight: '2px',
                      }}
                    />
                  ))}
                </div>
              </div>
            </div>

            {/* Market Info */}
            <div className="bg-gray-900 border border-gray-800 rounded-xl p-5 mt-6">
              <h3 className="text-sm font-medium text-white mb-3">Market Details</h3>
              <p className="text-sm text-gray-400 leading-relaxed mb-4">{market.description}</p>
              <div className="flex flex-wrap gap-2">
                {market.tags.map((tag) => (
                  <span key={tag} className="text-xs px-2 py-1 rounded-md bg-gray-800 text-gray-400">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Order Book & Trading */}
          <div className="lg:col-span-1">
            <OrderBook market={market} />
            
            {/* Outcomes */}
            <div className="bg-gray-900 border border-gray-800 rounded-xl p-5 mt-6">
              <h3 className="text-sm font-medium text-white mb-4">Outcomes</h3>
              {market.outcomes.map((outcome) => (
                <div key={outcome.name} className="flex items-center justify-between py-2">
                  <div className="flex items-center gap-3">
                    <div className={`w-2 h-2 rounded-full ${outcome.name === 'Yes' ? 'bg-green-400' : 'bg-red-400'}`} />
                    <span className="text-sm text-gray-300">{outcome.name}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-medium text-white">{(outcome.price * 100).toFixed(0)}¢</span>
                    <span className={`text-xs ${outcome.change24h > 0 ? 'text-green-400' : 'text-red-400'}`}>
                      {outcome.change24h > 0 ? '+' : ''}{outcome.change24h}%
                    </span>
                  </div>
                </div>
              ))}
              
              {/* Probability bar */}
              <div className="mt-4 pt-4 border-t border-gray-800">
                <div className="flex justify-between text-xs text-gray-500 mb-2">
                  <span>Yes {(yesOutcome.price * 100).toFixed(0)}%</span>
                  <span>No {((1 - yesOutcome.price) * 100).toFixed(0)}%</span>
                </div>
                <div className="h-2 rounded-full bg-gray-800 overflow-hidden flex">
                  <div
                    className="bg-green-500 rounded-l-full transition-all"
                    style={{ width: `${yesOutcome.price * 100}%` }}
                  />
                  <div
                    className="bg-red-500 rounded-r-full transition-all"
                    style={{ width: `${(1 - yesOutcome.price) * 100}%` }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
