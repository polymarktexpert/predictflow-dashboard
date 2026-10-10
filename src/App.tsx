import { useState } from 'react';
import { markets, categories, Market } from './data/markets';
import { MarketCard } from './components/MarketCard';
import { MarketDetail } from './components/MarketDetail';
import { AIFeed } from './components/AIFeed';
import { Search, Zap, Brain, Shield, BarChart3, Globe, Activity } from 'lucide-react';

function App() {
  const [selectedMarket, setSelectedMarket] = useState<Market | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  const [sortBy, setSortBy] = useState<'volume' | 'liquidity' | 'ai_confidence'>('volume');

  if (selectedMarket) {
    return <MarketDetail market={selectedMarket} onBack={() => setSelectedMarket(null)} />;
  }

  const filteredMarkets = markets
    .filter((m) => {
      const matchesSearch = m.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        m.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()));
      const matchesCategory = activeCategory === 'All' || m.category === activeCategory;
      return matchesSearch && matchesCategory;
    })
    .sort((a, b) => {
      if (sortBy === 'volume') return b.volume - a.volume;
      if (sortBy === 'liquidity') return b.liquidity - a.liquidity;
      return b.aiSignal.confidence - a.aiSignal.confidence;
    });

  const totalVolume = markets.reduce((acc, m) => acc + m.volume, 0);
  const totalLiquidity = markets.reduce((acc, m) => acc + m.liquidity, 0);
  const avgConfidence = Math.round(markets.reduce((acc, m) => acc + m.aiSignal.confidence, 0) / markets.length);

  return (
    <div className="min-h-screen bg-[#0a0b0f]">
      {/* Header */}
      <header className="border-b border-gray-800/60 bg-[#0a0b0f]/90 backdrop-blur-xl sticky top-0 z-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-purple-500 via-violet-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-purple-500/20">
                <Brain size={18} className="text-white" />
              </div>
              <div>
                <h1 className="text-lg font-bold text-white tracking-tight">PredictFlow AI</h1>
                <p className="text-[10px] text-gray-500 font-medium tracking-wider uppercase">Prediction Market Intelligence</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="hidden lg:flex items-center gap-1 px-3 py-1.5 rounded-lg bg-green-500/10 border border-green-500/20">
                <div className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
                <span className="text-xs text-green-400 font-medium">AI Models Online</span>
              </div>
              <div className="hidden md:flex items-center gap-4 text-sm text-gray-400">
                <span>{markets.length} Markets</span>
                <span className="text-gray-700">|</span>
                <span>${(totalVolume / 1000000).toFixed(1)}M Volume</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        {/* Hero Section */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-6">
            <div>
              <h2 className="text-2xl md:text-3xl font-bold text-white tracking-tight">
                AI-Powered Market Intelligence
              </h2>
              <p className="text-gray-400 mt-2 text-sm max-w-xl">
                Real-time CLOB analytics, oracle resolution tracking, and AI-generated signals for US prediction markets. Built for quant traders and AI agents.
              </p>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <StatCard
              icon={<BarChart3 size={16} className="text-purple-400" />}
              label="Total Volume"
              value={`$${(totalVolume / 1000000).toFixed(1)}M`}
              accent="purple"
            />
            <StatCard
              icon={<Activity size={16} className="text-cyan-400" />}
              label="Total Liquidity"
              value={`$${(totalLiquidity / 1000000).toFixed(1)}M`}
              accent="cyan"
            />
            <StatCard
              icon={<Brain size={16} className="text-amber-400" />}
              label="Avg AI Confidence"
              value={`${avgConfidence}%`}
              accent="amber"
            />
            <StatCard
              icon={<Shield size={16} className="text-green-400" />}
              label="US Compliant"
              value={`${markets.filter(m => m.usCompliance.cftcStatus === 'allowed').length}/${markets.length}`}
              accent="green"
            />
          </div>
        </div>

        {/* AI Feed */}
        <AIFeed markets={markets} />

        {/* Search & Filters */}
        <div className="flex flex-col md:flex-row gap-3 mb-5 mt-8">
          <div className="relative flex-1">
            <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500" />
            <input
              type="text"
              placeholder="Search markets, tags, oracles..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-gray-900/60 border border-gray-800 rounded-lg text-sm text-white placeholder-gray-500 focus:outline-none focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/20 transition-all"
            />
          </div>
          <div className="flex gap-2">
            {([
              { key: 'volume', label: 'Volume' },
              { key: 'liquidity', label: 'Liquidity' },
              { key: 'ai_confidence', label: 'AI Signal' },
            ] as const).map((sort) => (
              <button
                key={sort.key}
                onClick={() => setSortBy(sort.key)}
                className={`px-3 py-2 text-xs font-medium rounded-lg transition-all ${
                  sortBy === sort.key
                    ? 'bg-purple-500/15 text-purple-400 border border-purple-500/30 shadow-sm shadow-purple-500/10'
                    : 'bg-gray-900/60 text-gray-500 border border-gray-800 hover:text-gray-300 hover:border-gray-700'
                }`}
              >
                {sort.label}
              </button>
            ))}
          </div>
        </div>

        {/* Category Tabs */}
        <div className="flex gap-2 mb-6 overflow-x-auto pb-1">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-2 text-sm font-medium rounded-lg whitespace-nowrap transition-all ${
                activeCategory === cat
                  ? 'bg-purple-500/15 text-purple-400 border border-purple-500/30'
                  : 'bg-gray-900/40 text-gray-500 border border-gray-800/60 hover:text-gray-300 hover:border-gray-700'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Market Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredMarkets.map((market) => (
            <MarketCard key={market.id} market={market} onClick={setSelectedMarket} />
          ))}
        </div>

        {filteredMarkets.length === 0 && (
          <div className="text-center py-20">
            <div className="w-16 h-16 rounded-2xl bg-gray-900 border border-gray-800 flex items-center justify-center mx-auto mb-4">
              <Search size={24} className="text-gray-600" />
            </div>
            <p className="text-gray-400 text-lg font-medium">No markets found</p>
            <p className="text-gray-600 text-sm mt-1">Try adjusting your search or category filters</p>
          </div>
        )}

        {/* Architecture Section */}
        <div className="mt-14 grid md:grid-cols-3 gap-4">
          <ArchCard
            icon={<BarChart3 size={20} className="text-purple-400" />}
            title="CLOB Engine"
            description="Central Limit Order Book with price-time priority matching. Sub-100ms order execution via Polygon PoS settlement layer."
          />
          <ArchCard
            icon={<Shield size={20} className="text-green-400" />}
            title="Oracle Resolution"
            description="UMA Optimistic Oracle + Chainlink Functions dual-source resolution. 2hr dispute window with economic security bonds."
          />
          <ArchCard
            icon={<Globe size={20} className="text-cyan-400" />}
            title="US Geo-Compliance"
            description="State-level geo-fencing with IP + wallet address verification. CFTC/SEC regulatory mapping for all 50 states."
          />
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-800/40 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <Brain size={14} className="text-purple-500" />
              <span className="text-xs text-gray-500">PredictFlow AI — Prediction Market Intelligence Platform</span>
            </div>
            <div className="flex items-center gap-4 text-xs text-gray-600">
              <span>Simulated data for demonstration</span>
              <span className="text-gray-800">|</span>
              <span>Not financial advice</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

function StatCard({ icon, label, value, accent }: { icon: React.ReactNode; label: string; value: string; accent: string }) {
  const accentClasses: Record<string, string> = {
    purple: 'bg-purple-500/8 border-purple-500/15',
    cyan: 'bg-cyan-500/8 border-cyan-500/15',
    amber: 'bg-amber-500/8 border-amber-500/15',
    green: 'bg-green-500/8 border-green-500/15',
  };

  return (
    <div className={`rounded-xl p-4 border ${accentClasses[accent] || accentClasses.purple}`}>
      <div className="flex items-center gap-2 mb-2">
        {icon}
        <span className="text-[11px] text-gray-500 font-medium uppercase tracking-wider">{label}</span>
      </div>
      <div className="text-xl font-bold text-white">{value}</div>
    </div>
  );
}

function ArchCard({ icon, title, description }: { icon: React.ReactNode; title: string; description: string }) {
  return (
    <div className="bg-gray-900/40 border border-gray-800/60 rounded-xl p-5">
      <div className="flex items-center gap-3 mb-3">
        {icon}
        <h3 className="text-sm font-semibold text-white">{title}</h3>
      </div>
      <p className="text-sm text-gray-400 leading-relaxed">{description}</p>
    </div>
  );
}

export default App;
