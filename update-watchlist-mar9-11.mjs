import { config } from 'dotenv';
config();

const BASE_URL = 'http://localhost:3000/api/trpc/history.upsert';

const SWING_WATCHLIST = [
  { pair: 'CAD/JPY', direction: 'LONG' },
  { pair: 'CHF/JPY', direction: 'LONG' },
  { pair: 'GBP/EUR', direction: 'LONG' },
  { pair: 'GBP/JPY', direction: 'LONG' },
  { pair: 'GBP/NZD', direction: 'LONG' },
  { pair: 'USD/JPY', direction: 'LONG' },
  { pair: 'EUR/CAD', direction: 'SHORT' },
  { pair: 'EUR/GBP', direction: 'SHORT' },
  { pair: 'EUR/USD', direction: 'SHORT' },
  { pair: 'NZD/CAD', direction: 'SHORT' },
  { pair: 'NZD/USD', direction: 'SHORT' },
];

const ENTRIES = [
  {
    date: '2026-03-09',
    weekRange: 'Mar 9 - Mar 15, 2026',
    swingSetups: [
      { pair: 'EUR/USD', direction: 'SHORT' },
      { pair: 'EUR/CAD', direction: 'SHORT' },
      { pair: 'EUR/CHF', direction: 'SHORT' },
      { pair: 'USD/JPY', direction: 'LONG' },
      { pair: 'CAD/JPY', direction: 'LONG' },
      { pair: 'CHF/JPY', direction: 'LONG' },
      { pair: 'NZD/USD', direction: 'SHORT' },
      { pair: 'NZD/CAD', direction: 'SHORT' },
      { pair: 'NZD/CHF', direction: 'SHORT' },
    ],
    intradayTrades: [
      { pair: 'GBP/USD', direction: 'SHORT' },
      { pair: 'GBP/CAD', direction: 'SHORT' },
      { pair: 'GBP/CHF', direction: 'SHORT' },
    ],
  },
  {
    date: '2026-03-10',
    weekRange: 'Mar 9 - Mar 15, 2026',
    swingSetups: [
      { pair: 'EUR/GBP', direction: 'SHORT' },
      { pair: 'GBP/JPY', direction: 'LONG' },
      { pair: 'EUR/CAD', direction: 'SHORT' },
      { pair: 'CAD/JPY', direction: 'LONG' },
    ],
    intradayTrades: [
      { pair: 'AUD/JPY', direction: 'LONG' },
      { pair: 'NZD/JPY', direction: 'LONG' },
      { pair: 'EUR/AUD', direction: 'SHORT' },
      { pair: 'EUR/NZD', direction: 'SHORT' },
    ],
  },
  {
    date: '2026-03-11',
    weekRange: 'Mar 9 - Mar 15, 2026',
    swingSetups: [
      { pair: 'EUR/USD', direction: 'SHORT' },
      { pair: 'USD/JPY', direction: 'LONG' },
      { pair: 'EUR/CAD', direction: 'SHORT' },
      { pair: 'CAD/JPY', direction: 'LONG' },
    ],
    intradayTrades: [
      { pair: 'AUD/JPY', direction: 'LONG' },
      { pair: 'EUR/AUD', direction: 'SHORT' },
    ],
  },
];

async function updateEntry(entry) {
  const payload = {
    json: {
      date: entry.date,
      weekRange: entry.weekRange,
      swingWatchlist: SWING_WATCHLIST,
      swingSetups: entry.swingSetups,
      intradayTrades: entry.intradayTrades,
    },
  };

  const res = await fetch(BASE_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  const data = await res.json();
  console.log(`${entry.date}: ${JSON.stringify(data).substring(0, 100)}`);
}

for (const entry of ENTRIES) {
  await updateEntry(entry);
}
console.log('Done — all 3 entries updated with full swing watchlist.');
