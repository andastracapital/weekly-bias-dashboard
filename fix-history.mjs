import { createConnection } from 'mysql2/promise';
import * as dotenv from 'dotenv';
dotenv.config();

const conn = await createConnection(process.env.DATABASE_URL);

// Helper to build JSON string for pairs
const pairs = (arr) => JSON.stringify(arr);

// Complete corrected dataset based on manual screenshot verification
// Weekly Watchlist assignment logic:
//   Jan 26 - Feb 1 week: Jan 27, 28, 29, 30
//   Feb 2 - Feb 8 week: Feb 2, 3, 4, 5, 6
//   Feb 9 - Feb 15 week: Feb 9, 10, 11, 12, 13
//   Feb 16 - Feb 22 week: Feb 16, 17, 18, 19, 20
//   Feb 23 - Mar 1 week: Feb 25, 26, 27
//   Mar 2 - Mar 8 week: Mar 2, 3, 5, 6

const weeklyWatchlists = {
  'Jan 26 - Feb 1, 2026': [
    { pair: 'GBP/USD', direction: 'LONG' },
    { pair: 'USD/JPY', direction: 'SHORT' },
    { pair: 'USD/CHF', direction: 'SHORT' },
  ],
  'Feb 2 - Feb 8, 2026': [],
  'Feb 9 - Feb 15, 2026': [
    { pair: 'AUD/USD', direction: 'LONG' },
    { pair: 'AUD/JPY', direction: 'LONG' },
    { pair: 'AUD/CAD', direction: 'LONG' },
    { pair: 'AUD/CHF', direction: 'LONG' },
    { pair: 'NZD/USD', direction: 'LONG' },
    { pair: 'NZD/JPY', direction: 'LONG' },
    { pair: 'EUR/AUD', direction: 'SHORT' },
    { pair: 'GBP/AUD', direction: 'SHORT' },
    { pair: 'EUR/NZD', direction: 'SHORT' },
    { pair: 'GBP/NZD', direction: 'SHORT' },
  ],
  'Feb 16 - Feb 22, 2026': [
    { pair: 'EUR/USD', direction: 'LONG' },
    { pair: 'EUR/GBP', direction: 'LONG' },
    { pair: 'EUR/CAD', direction: 'LONG' },
    { pair: 'EUR/CHF', direction: 'LONG' },
    { pair: 'AUD/USD', direction: 'LONG' },
    { pair: 'AUD/CAD', direction: 'LONG' },
    { pair: 'USD/JPY', direction: 'SHORT' },
    { pair: 'GBP/JPY', direction: 'SHORT' },
    { pair: 'CAD/JPY', direction: 'SHORT' },
    { pair: 'CHF/JPY', direction: 'SHORT' },
    { pair: 'GBP/AUD', direction: 'SHORT' },
    { pair: 'GBP/NZD', direction: 'SHORT' },
  ],
  'Feb 23 - Mar 1, 2026': [
    { pair: 'USD/JPY', direction: 'LONG' },
    { pair: 'USD/CAD', direction: 'LONG' },
    { pair: 'USD/CHF', direction: 'LONG' },
    { pair: 'AUD/JPY', direction: 'LONG' },
    { pair: 'AUD/CAD', direction: 'LONG' },
    { pair: 'AUD/CHF', direction: 'LONG' },
    { pair: 'EUR/USD', direction: 'SHORT' },
    { pair: 'GBP/USD', direction: 'SHORT' },
    { pair: 'NZD/USD', direction: 'SHORT' },
    { pair: 'EUR/AUD', direction: 'SHORT' },
    { pair: 'GBP/AUD', direction: 'SHORT' },
  ],
  'Mar 2 - Mar 8, 2026': [
    { pair: 'EUR/USD', direction: 'SHORT' },
    { pair: 'GBP/USD', direction: 'SHORT' },
    { pair: 'AUD/USD', direction: 'SHORT' },
    { pair: 'NZD/USD', direction: 'SHORT' },
    { pair: 'EUR/JPY', direction: 'SHORT' },
    { pair: 'GBP/JPY', direction: 'SHORT' },
  ],
};

// All entries with corrected data from screenshot verification
const correctedEntries = [
  {
    date: '2026-01-28',
    weekRange: 'Jan 26 - Feb 1, 2026',
    swingSetups: [], // Weekly view screenshot - no daily data
    intradayTrades: [],
  },
  {
    date: '2026-01-29',
    weekRange: 'Jan 26 - Feb 1, 2026',
    swingSetups: [], // Weekly view screenshot - no daily data
    intradayTrades: [],
  },
  {
    date: '2026-01-30',
    weekRange: 'Jan 26 - Feb 1, 2026',
    swingSetups: [], // Weekly view screenshot - no daily data
    intradayTrades: [],
  },
  {
    date: '2026-02-02',
    weekRange: 'Feb 2 - Feb 8, 2026',
    swingSetups: [], // Weekly view screenshot - no daily data
    intradayTrades: [],
  },
  {
    date: '2026-02-03',
    weekRange: 'Feb 2 - Feb 8, 2026',
    swingSetups: [], // Screenshot shows daily but no setups found
    intradayTrades: [],
  },
  {
    date: '2026-02-04',
    weekRange: 'Feb 2 - Feb 8, 2026',
    swingSetups: [], // No setups found
    intradayTrades: [],
  },
  {
    date: '2026-02-05',
    weekRange: 'Feb 2 - Feb 8, 2026',
    swingSetups: [], // No high conviction setups
    intradayTrades: [
      { pair: 'EUR/USD', direction: 'SHORT' },
      { pair: 'GBP/USD', direction: 'SHORT' },
      { pair: 'AUD/USD', direction: 'SHORT' },
      { pair: 'USD/CAD', direction: 'LONG' },
      { pair: 'NZD/USD', direction: 'SHORT' },
    ],
  },
  {
    date: '2026-02-06',
    weekRange: 'Feb 2 - Feb 8, 2026',
    swingSetups: [], // No high conviction setups
    intradayTrades: [
      { pair: 'GBP/USD', direction: 'SHORT' },
      { pair: 'NZD/USD', direction: 'SHORT' },
    ],
  },
  {
    date: '2026-02-09',
    weekRange: 'Feb 9 - Feb 15, 2026',
    swingSetups: [
      { pair: 'GBP/AUD', direction: 'SHORT' },
      { pair: 'AUD/JPY', direction: 'LONG' },
      { pair: 'GBP/NZD', direction: 'SHORT' },
    ],
    intradayTrades: [
      // Screenshot shows GBP/AUD, AUD/JPY, GBP/NZD also in intraday + NZD/JPY
      // The dashboard at the time showed these in both sections
      { pair: 'GBP/AUD', direction: 'SHORT' },
      { pair: 'AUD/JPY', direction: 'LONG' },
      { pair: 'GBP/NZD', direction: 'SHORT' },
      { pair: 'NZD/JPY', direction: 'LONG' },
    ],
  },
  {
    date: '2026-02-10',
    weekRange: 'Feb 9 - Feb 15, 2026',
    swingSetups: [], // Weekly view screenshot - no daily data
    intradayTrades: [],
  },
  {
    date: '2026-02-11',
    weekRange: 'Feb 9 - Feb 15, 2026',
    swingSetups: [
      { pair: 'AUD/USD', direction: 'LONG' },
      { pair: 'NZD/USD', direction: 'LONG' },
    ],
    intradayTrades: [
      { pair: 'EUR/USD', direction: 'LONG' },
      { pair: 'USD/JPY', direction: 'SHORT' },
      { pair: 'USD/CHF', direction: 'SHORT' },
    ],
  },
  {
    date: '2026-02-12',
    weekRange: 'Feb 9 - Feb 15, 2026',
    swingSetups: [
      { pair: 'GBP/AUD', direction: 'SHORT' },
      { pair: 'AUD/CAD', direction: 'LONG' },
      { pair: 'GBP/NZD', direction: 'SHORT' },
    ],
    intradayTrades: [
      { pair: 'GBP/JPY', direction: 'SHORT' },
      { pair: 'CAD/JPY', direction: 'SHORT' },
      { pair: 'NZD/CAD', direction: 'LONG' },
    ],
  },
  {
    date: '2026-02-13',
    weekRange: 'Feb 9 - Feb 15, 2026',
    // Screenshot shows same data as Feb 12 (taken on Feb 13 but showing Feb 12 data)
    swingSetups: [
      { pair: 'GBP/AUD', direction: 'SHORT' },
      { pair: 'AUD/CAD', direction: 'LONG' },
      { pair: 'GBP/NZD', direction: 'SHORT' },
    ],
    intradayTrades: [
      { pair: 'GBP/JPY', direction: 'SHORT' },
      { pair: 'CAD/JPY', direction: 'SHORT' },
      { pair: 'NZD/CAD', direction: 'LONG' },
    ],
  },
  {
    date: '2026-02-16',
    weekRange: 'Feb 16 - Feb 22, 2026',
    swingSetups: [], // Weekly view screenshot - no daily data
    intradayTrades: [],
  },
  {
    date: '2026-02-17',
    weekRange: 'Feb 16 - Feb 22, 2026',
    swingSetups: [
      { pair: 'GBP/JPY', direction: 'SHORT' },
      { pair: 'CAD/JPY', direction: 'SHORT' },
      { pair: 'GBP/AUD', direction: 'SHORT' },
      { pair: 'AUD/CAD', direction: 'LONG' },
      { pair: 'GBP/NZD', direction: 'SHORT' },
      { pair: 'NZD/CAD', direction: 'LONG' },
    ],
    intradayTrades: [], // Intraday section visible but empty
  },
  {
    date: '2026-02-18',
    weekRange: 'Feb 16 - Feb 22, 2026',
    swingSetups: [
      { pair: 'GBP/JPY', direction: 'SHORT' },
      { pair: 'CAD/JPY', direction: 'SHORT' },
      { pair: 'GBP/AUD', direction: 'SHORT' },
      { pair: 'AUD/CAD', direction: 'LONG' },
      { pair: 'GBP/NZD', direction: 'SHORT' },
      { pair: 'NZD/CAD', direction: 'LONG' },
    ],
    intradayTrades: [], // Intraday section visible but empty
  },
  {
    date: '2026-02-19',
    weekRange: 'Feb 16 - Feb 22, 2026',
    swingSetups: [], // No high conviction setups
    intradayTrades: [
      { pair: 'EUR/USD', direction: 'SHORT' },
      { pair: 'GBP/USD', direction: 'SHORT' },
      { pair: 'USD/JPY', direction: 'LONG' },
      { pair: 'NZD/USD', direction: 'SHORT' },
    ],
  },
  {
    date: '2026-02-20',
    weekRange: 'Feb 16 - Feb 22, 2026',
    swingSetups: [], // No high conviction setups
    intradayTrades: [
      { pair: 'EUR/USD', direction: 'SHORT' },
      { pair: 'GBP/USD', direction: 'SHORT' },
      { pair: 'USD/JPY', direction: 'LONG' },
      { pair: 'USD/CAD', direction: 'LONG' },
      { pair: 'NZD/USD', direction: 'SHORT' },
    ],
  },
  {
    date: '2026-02-25',
    weekRange: 'Feb 23 - Mar 1, 2026',
    swingSetups: [], // Weekly view screenshot - no daily data
    intradayTrades: [],
  },
  {
    date: '2026-02-26',
    weekRange: 'Feb 23 - Mar 1, 2026',
    swingSetups: [
      { pair: 'AUD/CAD', direction: 'LONG' },
    ],
    intradayTrades: [
      { pair: 'CAD/JPY', direction: 'SHORT' },
      { pair: 'NZD/CAD', direction: 'LONG' },
    ],
  },
  {
    date: '2026-02-27',
    weekRange: 'Feb 23 - Mar 1, 2026',
    swingSetups: [], // No high conviction setups
    intradayTrades: [
      { pair: 'GBP/JPY', direction: 'SHORT' },
      { pair: 'CAD/JPY', direction: 'SHORT' },
    ],
  },
  {
    date: '2026-03-02',
    weekRange: 'Mar 2 - Mar 8, 2026',
    swingSetups: [], // Weekly view screenshot - no daily data
    intradayTrades: [],
  },
  {
    date: '2026-03-03',
    weekRange: 'Mar 2 - Mar 8, 2026',
    swingSetups: [
      { pair: 'EUR/USD', direction: 'SHORT' },
      { pair: 'GBP/USD', direction: 'SHORT' },
      { pair: 'AUD/USD', direction: 'SHORT' },
      { pair: 'NZD/USD', direction: 'SHORT' },
      { pair: 'EUR/CHF', direction: 'SHORT' },
      { pair: 'GBP/CHF', direction: 'SHORT' },
      { pair: 'AUD/CHF', direction: 'SHORT' },
      { pair: 'NZD/CHF', direction: 'SHORT' },
    ],
    intradayTrades: [], // Intraday section visible but empty
  },
  {
    date: '2026-03-05',
    weekRange: 'Mar 2 - Mar 8, 2026',
    swingSetups: [
      { pair: 'EUR/USD', direction: 'SHORT' },
      { pair: 'GBP/USD', direction: 'SHORT' },
      { pair: 'EUR/JPY', direction: 'SHORT' },
      { pair: 'GBP/JPY', direction: 'SHORT' },
      { pair: 'EUR/CHF', direction: 'SHORT' },
      { pair: 'GBP/CHF', direction: 'SHORT' },
    ],
    intradayTrades: [
      { pair: 'EUR/AUD', direction: 'SHORT' },
      { pair: 'GBP/AUD', direction: 'SHORT' },
      { pair: 'EUR/NZD', direction: 'SHORT' },
      { pair: 'GBP/NZD', direction: 'SHORT' },
    ],
  },
  {
    date: '2026-03-06',
    weekRange: 'Mar 2 - Mar 8, 2026',
    // ALL 12 High Conviction Setups: Bullish (USD, JPY, CHF) x Bearish (EUR, GBP, AUD, NZD)
    swingSetups: [
      { pair: 'EUR/USD', direction: 'SHORT' },
      { pair: 'GBP/USD', direction: 'SHORT' },
      { pair: 'AUD/USD', direction: 'SHORT' },
      { pair: 'NZD/USD', direction: 'SHORT' },
      { pair: 'EUR/JPY', direction: 'SHORT' },
      { pair: 'GBP/JPY', direction: 'SHORT' },
      { pair: 'AUD/JPY', direction: 'SHORT' },
      { pair: 'NZD/JPY', direction: 'SHORT' },
      { pair: 'EUR/CHF', direction: 'SHORT' },
      { pair: 'GBP/CHF', direction: 'SHORT' },
      { pair: 'AUD/CHF', direction: 'SHORT' },
      { pair: 'NZD/CHF', direction: 'SHORT' },
    ],
    intradayTrades: [], // NFP day - no intraday trades (prop firm close warning active)
  },
];

// Delete all existing entries and re-insert with correct data
console.log('Deleting all existing history entries...');
await conn.execute('DELETE FROM history_entries');

let inserted = 0;
for (const entry of correctedEntries) {
  const weekWatchlist = weeklyWatchlists[entry.weekRange] || [];
  
  await conn.execute(
    `INSERT INTO history_entries 
     (date, weekRange, swingWatchlist, swingSetups, intradayTrades, createdAt, updatedAt)
     VALUES (?, ?, ?, ?, ?, NOW(), NOW())`,
    [
      entry.date,
      entry.weekRange,
      pairs(weekWatchlist),
      pairs(entry.swingSetups),
      pairs(entry.intradayTrades),
    ]
  );
  inserted++;
  console.log(`✅ ${entry.date} — Swing: ${entry.swingSetups.length}, Intraday: ${entry.intradayTrades.length}, Watchlist: ${weekWatchlist.length}`);
}

console.log(`\n✅ Done! Inserted ${inserted} entries.`);
await conn.end();
