import { Market } from '../data/markets';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { ArrowLeft, BarChart3, Clock, DollarSign, Activity, Brain, Shield, Zap, MapPin, AlertTriangle, CheckCircle } from 'lucide-react';
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
  const signal = market.aiSignal;
  const compliance = market.usCompliance;

  const formatVolume = (vol: number) => {
    if (vol >= 1000000) return `$${(vol / 1000000).toFixed(1)}M`;
    if (vol >= 1000) return `$${(vol / 1000).toFixed(0)}K`;
    return `$${vol}`;
  };

  const filteredHistory = market.priceHistory.slice(
    timeRange === '7D' ? -7 : timeRange === '30D' ? -30 : 0
  );

  const dirColor = signal.direction === 'bullish' ? 'text-green-400' : signal.direction === 'bearish' ? 'text-red-400' : 'text-gray-400';
  const dirBg = signal.direction === 'bullish' ? 'bg-green-500/10 border-green-500/20' : signal.direction === 'bearish' ? 'bg-red-500/10 border-red-500/20' : 'bg-gray-500/10 border-gray-500/20';

  return (
    <div className="min-h-screen bg-[#0a0b0f]">
      {/* Header */}
      <div className="border-b border-gray-800/60 bg-[#0a0b0f]/90 backdrop-blur-xl sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4">
          <div className="flex items-center gap-4">
            <button
              onClick={onBack}
              className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
            >
              <ArrowLeft size={16} />
              <span className="text-sm hidden sm:inline">Back to Markets</span>
            </button>
            <div className="h-4 w-px bg-gray-800" />
            <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-purple-500/10 text-purple-400 border border-purple-500/20">
              {market.category}
            </span>
            <div className="ml-auto flex items-center gap-2">
              <div className={`flex items-center gap-1 px-2 py-1 rounded-lg text-[11px] font-medium border ${dirBg} ${dirColor}`}>
                <Brain size={11} />
                <span>AI: {signal.confidence}% {signal.direction}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
        {/* Title & Key Stats */}
        <div className="mb-8">
          <h1 className="text-xl md:text-2xl font-bold text-white mb-3">{market.title}</h1>
          
          <div className="flex flex-wrap items-center gap-4 md:gap-6">
            <div className="flex items-center gap-3">
              <div className="text-3xl md:text-4xl font-bold text-white">{(yesOutcome.price * 100).toFixed(0)}¢</div>
              <div className={`flex items-center gap-1 text-base font-medium ${isUp ? 'text-green-400' : 'text-red-400'}`}>
                {isUp ? '+' : ''}{yesOutcome.change24h}%
              </div>
            </div>
            
            <div className="flex flex-wrap items-center gap-4 text-xs text-gray-400">
              <div className="flex items-center gap-1.5">
                <DollarSign size={12} />
                <span>Vol: {formatVolume(market.volume)}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Activity size={12} />
                <span>Liq: {formatVolume(market.liquidity)}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Clock size={12} />
                <span>Ends: {market.endDate}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Zap size={12} className="text-amber-500" />
                <span>{market.oracle.provider}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          {/* Left Column: Chart + Info */}
          <div className="lg:col-span-2 space-y-5">
            {/* Price Chart */}
            <div className="bg-gray-900/50 border border-gray-800/60 rounded-xl p-5">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <BarChart3 size={14} className="text-purple-400" />
                  <span className="text-sm font-medium text-white">Price History (YES)</span>
                </div>
                <div className="flex gap-1">
                  {(['7D', '30D', 'ALL'] as const).map((range) => (
                    <button
                      key={range}
                      onClick={() => setTimeRange(range)}
                      className={`px-2.5 py-1 text-[11px] font-medium rounded-md transition-all ${
                        timeRange === range
                          ? 'bg-purple-500/15 text-purple-400 border border-purple-500/30'
                          : 'text-gray-500 hover:text-gray-300'
                      }`}
                    >
                      {range}
                    </button>
                  ))}
                </div>
              </div>

              <div className="h-56">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={filteredHistory} margin={{ top: 5, right: 5, left: 5, bottom: 5 }}>
                    <defs>
                      <linearGradient id="priceGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#a855f7" stopOpacity={0.25} />
                        <stop offset="95%" stopColor="#a855f7" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <XAxis
                      dataKey="timestamp"
                      tick={{ fill: '#6b7280', fontSize: 10 }}
                      tickLine={false}
                      axisLine={false}
                      tickFormatter={(val) => val.slice(5)}
                    />
                    <YAxis
                      domain={[0, 1]}
                      tick={{ fill: '#6b7280', fontSize: 10 }}
                      tickLine={false}
                      axisLine={false}
                      tickFormatter={(val) => `${(val * 100).toFixed(0)}¢`}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#111827',
                        border: '1px solid #1f2937',
                        borderRadius: '8px',
                        color: '#fff',
                        fontSize: '11px',
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
              <div className="mt-3 pt-3 border-t border-gray-800/60">
                <div className="text-[10px] text-gray-500 mb-1.5 uppercase tracking-wider">Daily Volume</div>
                <div className="flex items-end gap-[2px] h-10">
                  {filteredHistory.map((point, i) => (
                    <div
                      key={i}
                      className="flex-1 rounded-t-sm bg-purple-500/20 hover:bg-purple-500/40 transition-colors"
                      style={{
                        height: `${(point.volume / Math.max(...filteredHistory.map(p => p.volume))) * 100}%`,
                        minHeight: '2px',
                      }}
                    />
                  ))}
                </div>
              </div>
            </div>

            {/* AI Signal Panel */}
            <div className="bg-gray-900/50 border border-gray-800/60 rounded-xl p-5">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Brain size={14} className="text-purple-400" />
                  <span className="text-sm font-medium text-white">AI Analysis</span>
                </div>
                <span className="text-[10px] text-gray-500">Model: {signal.model} • {signal.lastUpdated}</span>
              </div>

              <div className="flex items-center gap-4 mb-4">
                <div className={`flex items-center gap-2 px-3 py-2 rounded-lg border ${dirBg}`}>
                  <span className={`text-lg font-bold ${dirColor}`}>{signal.confidence}%</span>
                  <span className={`text-xs font-medium uppercase ${dirColor}`}>{signal.direction}</span>
                </div>
                <div className="flex-1">
                  <div className="h-2 rounded-full bg-gray-800 overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all ${
                        signal.confidence > 75 ? 'bg-green-400' : signal.confidence > 50 ? 'bg-amber-400' : 'bg-red-400'
                      }`}
                      style={{ width: `${signal.confidence}%` }}
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <div className="text-[10px] text-gray-500 uppercase tracking-wider">Key Factors</div>
                {signal.factors.map((factor, i) => (
                  <div key={i} className="flex items-start gap-2 text-xs text-gray-400">
                    <div className="w-1 h-1 rounded-full bg-purple-500 mt-1.5 shrink-0" />
                    <span>{factor}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* US Compliance */}
            <div className="bg-gray-900/50 border border-gray-800/60 rounded-xl p-5">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Shield size={14} className="text-green-400" />
                  <span className="text-sm font-medium text-white">US Regulatory Status</span>
                </div>
                <div className={`flex items-center gap-1 text-[10px] font-medium px-2 py-0.5 rounded ${
                  compliance.cftcStatus === 'allowed' ? 'bg-green-500/10 text-green-400' :
                  compliance.cftcStatus === 'restricted' ? 'bg-amber-500/10 text-amber-400' :
                  'bg-red-500/10 text-red-400'
                }`}>
                  {compliance.cftcStatus === 'allowed' ? <CheckCircle size={10} /> : <AlertTriangle size={10} />}
                  <span className="uppercase">{compliance.cftcStatus}</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 mb-4">
                <div className="bg-gray-800/30 rounded-lg p-3">
                  <div className="text-[10px] text-gray-500 uppercase tracking-wider mb-1">KYC Required</div>
                  <div className="text-sm font-medium text-white">{compliance.kycRequired ? 'Yes — Identity Verification' : 'No'}</div>
                </div>
                <div className="bg-gray-800/30 rounded-lg p-3">
                  <div className="text-[10px] text-gray-500 uppercase tracking-wider mb-1">Geo-Fencing</div>
                  <div className="text-sm font-medium text-white">{compliance.geoFencing ? 'Active — IP + Wallet Check' : 'Disabled'}</div>
                </div>
              </div>

              <div className="text-[10px] text-gray-500 uppercase tracking-wider mb-2">State-Level Access</div>
              <div className="flex flex-wrap gap-1.5">
                {compliance.states.map((state) => (
                  <div
                    key={state.name}
                    className={`flex items-center gap-1 px-2 py-1 rounded text-[10px] font-medium ${
                      state.status === 'open' ? 'bg-green-500/10 text-green-400 border border-green-500/20' :
                      state.status === 'restricted' ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20' :
                      'bg-red-500/10 text-red-400 border border-red-500/20'
                    }`}
                  >
                    <MapPin size={8} />
                    {state.name}
                  </div>
                ))}
              </div>
            </div>

            {/* Market Description */}
            <div className="bg-gray-900/50 border border-gray-800/60 rounded-xl p-5">
              <h3 className="text-sm font-medium text-white mb-3">Resolution Criteria</h3>
              <p className="text-sm text-gray-400 leading-relaxed mb-4">{market.description}</p>
              <div className="flex flex-wrap gap-2">
                {market.tags.map((tag) => (
                  <span key={tag} className="text-[10px] px-2 py-1 rounded-md bg-gray-800/60 text-gray-400 border border-gray-700/40">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column: Order Book + Outcomes */}
          <div className="lg:col-span-1 space-y-5">
            <OrderBook market={market} />

            {/* Outcomes */}
            <div className="bg-gray-900/50 border border-gray-800/60 rounded-xl p-5">
              <h3 className="text-sm font-medium text-white mb-4">Outcomes</h3>
              {market.outcomes.map((outcome) => (
                <div key={outcome.name} className="flex items-center justify-between py-2">
                  <div className="flex items-center gap-3">
                    <div className={`w-2 h-2 rounded-full ${outcome.name === 'Yes' ? 'bg-green-400' : 'bg-red-400'}`} />
                    <span className="text-sm text-gray-300">{outcome.name}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-medium text-white">{(outcome.price * 100).toFixed(0)}¢</span>
                    <span className={`text-[11px] ${outcome.change24h > 0 ? 'text-green-400' : 'text-red-400'}`}>
                      {outcome.change24h > 0 ? '+' : ''}{outcome.change24h}%
                    </span>
                  </div>
                </div>
              ))}
              
              {/* Probability bar */}
              <div className="mt-4 pt-4 border-t border-gray-800/60">
                <div className="flex justify-between text-[10px] text-gray-500 mb-1.5">
                  <span>Yes {(yesOutcome.price * 100).toFixed(0)}%</span>
                  <span>No {((1 - yesOutcome.price) * 100).toFixed(0)}%</span>
                </div>
                <div className="h-2 rounded-full bg-gray-800 overflow-hidden flex">
                  <div className="bg-green-500 rounded-l-full" style={{ width: `${yesOutcome.price * 100}%` }} />
                  <div className="bg-red-500 rounded-r-full" style={{ width: `${(1 - yesOutcome.price) * 100}%` }} />
                </div>
              </div>
            </div>

            {/* Oracle Info */}
            <div className="bg-gray-900/50 border border-gray-800/60 rounded-xl p-5">
              <div className="flex items-center gap-2 mb-4">
                <Zap size={14} className="text-amber-400" />
                <span className="text-sm font-medium text-white">Oracle Details</span>
              </div>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-xs text-gray-500">Provider</span>
                  <span className="text-xs text-white font-medium">{market.oracle.provider}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-xs text-gray-500">Resolution Date</span>
                  <span className="text-xs text-white">{market.oracle.resolutionDate}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-xs text-gray-500">Dispute Window</span>
                  <span className="text-xs text-white">{market.oracle.disputeWindow}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-xs text-gray-500">Bond Required</span>
                  <span className="text-xs text-white">{market.oracle.bondRequired}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-xs text-gray-500">Status</span>
                  <span className={`text-xs font-medium px-1.5 py-0.5 rounded ${
                    market.oracle.status === 'pending' ? 'bg-amber-500/10 text-amber-400' :
                    market.oracle.status === 'resolved' ? 'bg-green-500/10 text-green-400' :
                    'bg-red-500/10 text-red-400'
                  }`}>{market.oracle.status.toUpperCase()}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
