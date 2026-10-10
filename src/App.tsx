import { useState } from 'react';
import { markets, categories, Market } from './data/markets';
import { MarketCard } from './components/MarketCard';
import { MarketDetail } from './components/MarketDetail';
import { Search, TrendingUp, BarChart3, Zap, Globe } from 'lucide-react';

function App() {
  const [selectedMarket, setSelectedMarket] = useState<Market | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  const [sortBy, setSortBy] = useState<'volume' | 'liquidity' | 'newest'>('volume');

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
      return new Date(b.endDate).getTime() - new Date(a.endDate).getTime();
    });

  const totalVolume = markets.reduce((acc, m) => acc + m.volume, 0);
  const totalLiquidity = markets.reduce((acc, m) => acc + m.liquidity, 0);

  return (
    <div className="min-h-screen bg-gray-950">
      {/* Hero / Header */}
      <header className="border-b border-gray-800 bg-gray-950/80 backdrop-blur-sm sticky top-0 z-20">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center">
                <Zap size={16} className="text-white" />
              </div>
              <h1 className="text-lg font-bold text-white">PredictFlow</h1>
              <span className="text-xs text-gray-500 hidden sm:block">Prediction Market Analytics</span>
            </div>
            <div className="flex items-center gap-4">
              <div className="hidden md:flex items-center gap-6 text-sm">
                <div>
                  <span className="text-gray-500">Markets: </span>
                  <span className="text-white font-medium">{markets.length}</span>
                </div>
                <div>
                  <span className="text-gray-500">Volume: </span>
                  <span className="text-white font-medium">${(totalVolume / 1000000).toFixed(1)}M</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <StatCard
            icon={<BarChart3 size={18} className="text-purple-400" />}
            label="Total Volume"
            value={`$${(totalVolume / 1000000).toFixed(1)}M`}
          />
          <StatCard
            icon={<TrendingUp size={18} className="text-green-400" />}
            label="Total Liquidity"
            value={`$${(totalLiquidity / 1000000).toFixed(1)}M`}
          />
          <StatCard
            icon={<Globe size={18} className="text-blue-400" />}
            label="Active Markets"
            value={markets.length.toString()}
          />
          <StatCard
            icon={<Zap size={18} className="text-yellow-400" />}
            label="Categories"
            value={(categories.length - 1).toString()}
          />
        </div>

        {/* Search & Filters */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
            <input
              type="text"
              placeholder="Search markets..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-gray-900 border border-gray-800 rounded-lg text-sm text-white placeholder-gray-500 focus:outline-none focus:border-purple-500/50 transition-colors"
            />
          </div>
          <div className="flex gap-2">
            {(['volume', 'liquidity', 'newest'] as const).map((sort) => (
              <button
                key={sort}
                onClick={() => setSortBy(sort)}
                className={`px-3 py-2 text-xs font-medium rounded-lg transition-colors ${
                  sortBy === sort
                    ? 'bg-purple-500/20 text-purple-400 border border-purple-500/30'
                    : 'bg-gray-900 text-gray-500 border border-gray-800 hover:text-gray-300'
                }`}
              >
                {sort.charAt(0).toUpperCase() + sort.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* Category Tabs */}
        <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-2 text-sm font-medium rounded-lg whitespace-nowrap transition-colors ${
                activeCategory === cat
                  ? 'bg-purple-500/20 text-purple-400 border border-purple-500/30'
                  : 'bg-gray-900 text-gray-500 border border-gray-800 hover:text-gray-300 hover:border-gray-700'
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
          <div className="text-center py-16">
            <p className="text-gray-500 text-lg">No markets found</p>
            <p className="text-gray-600 text-sm mt-2">Try adjusting your search or filters</p>
          </div>
        )}

        {/* CLOB Info Section */}
        <div className="mt-12 bg-gray-900 border border-gray-800 rounded-xl p-6">
          <h2 className="text-lg font-semibold text-white mb-4">How CLOB Markets Work</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div>
              <h3 className="text-sm font-medium text-purple-400 mb-2">Central Limit Order Book</h3>
              <p className="text-sm text-gray-400 leading-relaxed">
                Prediction markets use a CLOB matching engine where buyers and sellers submit limit orders. 
                The engine matches bids and asks based on price-time priority, creating an efficient price 
                discovery mechanism for event outcomes.
              </p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-purple-400 mb-2">Conditional Tokens</h3>
              <p className="text-sm text-gray-400 leading-relaxed">
                Markets are built on conditional token frameworks (like Gnosis CTF). Each outcome is a 
                separate ERC-1155 token that can be bought, sold, or redeemed. Upon resolution, winning 
                tokens redeem at $1.00 while losing tokens become worthless.
              </p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-purple-400 mb-2">Oracle Resolution</h3>
              <p className="text-sm text-gray-400 leading-relaxed">
                Markets resolve through decentralized oracle systems. UMA's optimistic oracle allows 
                participants to propose outcomes, with a dispute window where anyone can challenge 
                incorrect resolutions by staking a bond.
              </p>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-800 mt-12">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <p className="text-xs text-gray-600">PredictFlow Analytics — Prediction Market Dashboard</p>
            <p className="text-xs text-gray-600">Data is simulated for demonstration purposes</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

function StatCard({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="bg-gray-900 border border-gray-800 rounded-xl p-4">
      <div className="flex items-center gap-2 mb-2">
        {icon}
        <span className="text-xs text-gray-500">{label}</span>
      </div>
      <div className="text-xl font-bold text-white">{value}</div>
    </div>
  );
}

export default App;
