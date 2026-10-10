# PredictFlow AI

Prediction market intelligence dashboard. CLOB analytics, oracle resolution tracking, AI-generated signals, and US regulatory compliance mapping — all in one place.

Built for quant traders, AI agents, and anyone who actually reads the order book before clicking buy.

---

## About the Author

**Ais Fang**

I've been living inside prediction markets for years now. Started with Polymarket back when the UI looked like it was built in a weekend and the liquidity was mostly bots talking to each other. Watched it grow into the venue it is today — and watched everyone else try (and mostly fail) to build tooling that doesn't suck.

My background is split between three things I care about:

- **Polymarket internals** — the CLOB matching engine, how conditional tokens actually settle, where the latency lives, which oracle paths are slow enough to trade against. I've read the smart contracts more times than I'd like to admit.
- **Deterministic arbitrage** — the boring kind that prints money if you're patient. Cross-market mispricing between Polymarket and Kalshi, between prediction markets and sportsbook props, between binary outcomes and their vanilla options equivalents. No ML, no vibes, just math and execution speed.
- **pUSD mechanics** — the stablecoin layer that most people ignore until it breaks. How collateral flows through the system, where the depeg risk actually lives, and how to position around redemption windows.

I built PredictFlow because I was tired of opening six tabs every time I wanted to check whether a market was worth touching. The order book on one screen, the oracle status on another, the AI signal somewhere else, and state-level compliance info nowhere at all. So I put it in one dashboard.

---

## What This Does

- **Market browsing** — filter by category, sort by volume/liquidity/AI confidence
- **CLOB depth visualization** — bid/ask ladder with cumulative size, spread tracking
- **AI signal feed** — confidence scores and directional bias from multiple models (GPT-4, Claude, Llama, Gemini)
- **Oracle tracking** — resolution provider, dispute window, bond requirements, status
- **US geo-compliance** — state-by-state access map, CFTC status, KYC requirements, geo-fencing indicators
- **Price history** — area charts with volume bars, 7D/30D/all ranges

## Stack

- React 18 + TypeScript
- Vite
- Tailwind CSS v4
- Recharts for visualization
- Lucide icons

## Run It

```bash
npm install
npm run dev
```

Build for production:

```bash
npm run build
```

---

## Notes

All data in this demo is simulated. No real market feeds, no real oracle calls, no real money. If you want to wire this up to actual Polymarket CLOB endpoints or UMA oracle events, the architecture is there — just swap the data layer.

This is not financial advice. It's a tool. What you do with it is your problem.

---

**Ais Fang** · Prediction markets, deterministic arb, pUSD infrastructure
