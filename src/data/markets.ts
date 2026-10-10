export interface Market {
  id: string;
  title: string;
  category: string;
  endDate: string;
  volume: number;
  liquidity: number;
  outcomes: Outcome[];
  priceHistory: PricePoint[];
  orderBook: OrderBookEntry[];
  description: string;
  tags: string[];
}

export interface Outcome {
  name: string;
  price: number;
  change24h: number;
}

export interface PricePoint {
  timestamp: string;
  price: number;
  volume: number;
}

export interface OrderBookEntry {
  price: number;
  size: number;
  total: number;
  side: 'bid' | 'ask';
}

export const markets: Market[] = [
  {
    id: '1',
    title: 'Will Bitcoin exceed $150,000 by end of 2026?',
    category: 'Crypto',
    endDate: '2026-12-31',
    volume: 12450000,
    liquidity: 3200000,
    outcomes: [
      { name: 'Yes', price: 0.34, change24h: 2.1 },
      { name: 'No', price: 0.66, change24h: -2.1 },
    ],
    priceHistory: generatePriceHistory(30, 0.34, 0.05),
    orderBook: generateOrderBook(0.34),
    description: 'This market resolves YES if Bitcoin (BTC) reaches a price above $150,000 USD on any major exchange before December 31, 2026.',
    tags: ['Bitcoin', 'Crypto', 'Price Target'],
  },
  {
    id: '2',
    title: 'US Federal Reserve rate cut in Q3 2026?',
    category: 'Economics',
    endDate: '2026-09-30',
    volume: 8920000,
    liquidity: 2100000,
    outcomes: [
      { name: 'Yes', price: 0.72, change24h: -1.3 },
      { name: 'No', price: 0.28, change24h: 1.3 },
    ],
    priceHistory: generatePriceHistory(30, 0.72, 0.03),
    orderBook: generateOrderBook(0.72),
    description: 'Resolves YES if the Federal Reserve announces at least one 25bp or greater rate cut during Q3 2026 (July-September).',
    tags: ['Fed', 'Interest Rates', 'Monetary Policy'],
  },
  {
    id: '3',
    title: 'Will SpaceX Starship complete orbital flight by July 2026?',
    category: 'Technology',
    endDate: '2026-07-31',
    volume: 5670000,
    liquidity: 1800000,
    outcomes: [
      { name: 'Yes', price: 0.85, change24h: 0.5 },
      { name: 'No', price: 0.15, change24h: -0.5 },
    ],
    priceHistory: generatePriceHistory(30, 0.85, 0.02),
    orderBook: generateOrderBook(0.85),
    description: 'Resolves YES if SpaceX Starship completes a full orbital flight (launch, orbit, and controlled reentry) before July 31, 2026.',
    tags: ['SpaceX', 'Space', 'Technology'],
  },
  {
    id: '4',
    title: 'Will Ethereum flip Bitcoin in market cap by 2027?',
    category: 'Crypto',
    endDate: '2027-01-01',
    volume: 15200000,
    liquidity: 4500000,
    outcomes: [
      { name: 'Yes', price: 0.12, change24h: -0.8 },
      { name: 'No', price: 0.88, change24h: 0.8 },
    ],
    priceHistory: generatePriceHistory(30, 0.12, 0.04),
    orderBook: generateOrderBook(0.12),
    description: 'Resolves YES if Ethereum total market capitalization exceeds Bitcoin total market capitalization at any point before January 1, 2027.',
    tags: ['Ethereum', 'Bitcoin', 'Market Cap'],
  },
  {
    id: '5',
    title: 'Will AI pass the Turing Test by end of 2026?',
    category: 'Technology',
    endDate: '2026-12-31',
    volume: 7340000,
    liquidity: 2800000,
    outcomes: [
      { name: 'Yes', price: 0.45, change24h: 3.2 },
      { name: 'No', price: 0.55, change24h: -3.2 },
    ],
    priceHistory: generatePriceHistory(30, 0.45, 0.06),
    orderBook: generateOrderBook(0.45),
    description: 'Resolves YES if a recognized AI system passes a formal Turing Test administered by a panel of expert judges before December 31, 2026.',
    tags: ['AI', 'Turing Test', 'Technology'],
  },
  {
    id: '6',
    title: 'Will global temperature exceed 1.5°C above pre-industrial in 2026?',
    category: 'Climate',
    endDate: '2026-12-31',
    volume: 4210000,
    liquidity: 1500000,
    outcomes: [
      { name: 'Yes', price: 0.91, change24h: 0.2 },
      { name: 'No', price: 0.09, change24h: -0.2 },
    ],
    priceHistory: generatePriceHistory(30, 0.91, 0.01),
    orderBook: generateOrderBook(0.91),
    description: 'Resolves YES if the annual global mean surface temperature for 2026 exceeds 1.5°C above the pre-industrial baseline (1850-1900) per NASA/NOAA data.',
    tags: ['Climate', 'Temperature', 'Environment'],
  },
  {
    id: '7',
    title: 'Will a major US bank launch a stablecoin in 2026?',
    category: 'Finance',
    endDate: '2026-12-31',
    volume: 3890000,
    liquidity: 1200000,
    outcomes: [
      { name: 'Yes', price: 0.67, change24h: 1.5 },
      { name: 'No', price: 0.33, change24h: -1.5 },
    ],
    priceHistory: generatePriceHistory(30, 0.67, 0.03),
    orderBook: generateOrderBook(0.67),
    description: 'Resolves YES if any of the top 10 US banks by assets launches a publicly available stablecoin before December 31, 2026.',
    tags: ['Banking', 'Stablecoin', 'Finance'],
  },
  {
    id: '8',
    title: 'Will US unemployment fall below 3.5% in 2026?',
    category: 'Economics',
    endDate: '2026-12-31',
    volume: 6100000,
    liquidity: 2300000,
    outcomes: [
      { name: 'Yes', price: 0.28, change24h: -1.1 },
      { name: 'No', price: 0.72, change24h: 1.1 },
    ],
    priceHistory: generatePriceHistory(30, 0.28, 0.04),
    orderBook: generateOrderBook(0.28),
    description: 'Resolves YES if the US Bureau of Labor Statistics reports a seasonally adjusted unemployment rate below 3.5% in any month of 2026.',
    tags: ['Employment', 'Economics', 'US'],
  },
];

function generatePriceHistory(days: number, currentPrice: number, volatility: number): PricePoint[] {
  const history: PricePoint[] = [];
  let price = currentPrice + (Math.random() - 0.5) * volatility * 3;
  
  for (let i = days; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    
    const change = (Math.random() - 0.48) * volatility;
    price = Math.max(0.01, Math.min(0.99, price + change));
    
    if (i === 0) price = currentPrice;
    
    history.push({
      timestamp: date.toISOString().split('T')[0],
      price: Math.round(price * 100) / 100,
      volume: Math.round(Math.random() * 500000 + 100000),
    });
  }
  
  return history;
}

function generateOrderBook(midPrice: number): OrderBookEntry[] {
  const entries: OrderBookEntry[] = [];
  const spread = 0.02;
  
  // Bids (below mid price)
  let bidTotal = 0;
  for (let i = 0; i < 8; i++) {
    const price = midPrice - spread / 2 - i * 0.01;
    if (price <= 0) break;
    const size = Math.round(Math.random() * 50000 + 5000);
    bidTotal += size;
    entries.push({
      price: Math.round(price * 100) / 100,
      size,
      total: bidTotal,
      side: 'bid',
    });
  }
  
  // Asks (above mid price)
  let askTotal = 0;
  for (let i = 0; i < 8; i++) {
    const price = midPrice + spread / 2 + i * 0.01;
    if (price >= 1) break;
    const size = Math.round(Math.random() * 50000 + 5000);
    askTotal += size;
    entries.push({
      price: Math.round(price * 100) / 100,
      size,
      total: askTotal,
      side: 'ask',
    });
  }
  
  return entries;
}

export const categories = ['All', 'Crypto', 'Economics', 'Technology', 'Finance', 'Climate'];
