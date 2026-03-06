/**
 * Seed script: populates history_entries table with historical data
 * extracted from screenshots.
 * Run: node seed-history.mjs
 */

import mysql from "mysql2/promise";
import dotenv from "dotenv";
dotenv.config();

const DATABASE_URL = process.env.DATABASE_URL;
if (!DATABASE_URL) {
  console.error("DATABASE_URL not set");
  process.exit(1);
}

// ─── Weekly Watchlist data (from weekly screenshots) ─────────────────────────
// Mapped by week range: dates that fall within that week get this watchlist
const weeklyWatchlists = [
  {
    weekRange: "Jan 26 - Feb 1, 2026",
    dates: ["2026-01-27", "2026-01-28", "2026-01-29", "2026-01-30"],
    // Jan 27 screenshot: GBP/USD LONG, USD/JPY SHORT, USD/CHF SHORT
    // Jan 28 screenshot shows weekly: GBP/CAD LONG (different day, slightly different)
    // Jan 29 screenshot: GBP/USD LONG, GBP/CAD LONG, AUD/USD LONG
    // Use per-date data from screenshots
    perDate: {
      "2026-01-27": "GBP/USD LONG, USD/JPY SHORT, USD/CHF SHORT",
      "2026-01-28": "GBP/CAD LONG",
      "2026-01-29": "GBP/USD LONG, GBP/CAD LONG, AUD/USD LONG",
      "2026-01-30": "",
    },
  },
  {
    weekRange: "Feb 2 - Feb 8, 2026",
    dates: ["2026-02-02", "2026-02-03", "2026-02-04", "2026-02-05", "2026-02-06"],
    perDate: {
      "2026-02-02": "",
      "2026-02-03": "",
      "2026-02-04": "",
      "2026-02-05": "",
      "2026-02-06": "",
    },
  },
  {
    weekRange: "Feb 9 - Feb 15, 2026",
    dates: ["2026-02-09", "2026-02-10", "2026-02-11", "2026-02-12", "2026-02-13"],
    perDate: {
      "2026-02-09": "AUD/USD LONG, AUD/JPY LONG, AUD/CAD LONG, AUD/CHF LONG, NZD/USD LONG, NZD/JPY LONG, EUR/AUD SHORT, GBP/AUD SHORT, EUR/NZD SHORT, GBP/NZD SHORT",
      "2026-02-10": "AUD/USD LONG, AUD/JPY LONG, AUD/CAD LONG, AUD/CHF LONG, NZD/USD LONG, NZD/JPY LONG, EUR/AUD SHORT, GBP/AUD SHORT, EUR/NZD SHORT, GBP/NZD SHORT",
      "2026-02-11": "AUD/USD LONG, AUD/JPY LONG, AUD/CAD LONG, AUD/CHF LONG, NZD/USD LONG, NZD/JPY LONG, EUR/AUD SHORT, GBP/AUD SHORT, EUR/NZD SHORT, GBP/NZD SHORT",
      "2026-02-12": "AUD/USD LONG, AUD/JPY LONG, AUD/CAD LONG, AUD/CHF LONG, NZD/USD LONG, NZD/JPY LONG, EUR/AUD SHORT, GBP/AUD SHORT, EUR/NZD SHORT, GBP/NZD SHORT",
      "2026-02-13": "AUD/USD LONG, AUD/JPY LONG, AUD/CAD LONG, AUD/CHF LONG, NZD/USD LONG, NZD/JPY LONG, EUR/AUD SHORT, GBP/AUD SHORT, EUR/NZD SHORT, GBP/NZD SHORT",
    },
  },
  {
    weekRange: "Feb 16 - Feb 22, 2026",
    dates: ["2026-02-16", "2026-02-17", "2026-02-18", "2026-02-19", "2026-02-20"],
    perDate: {
      "2026-02-16": "EUR/USD LONG, EUR/GBP LONG, EUR/CAD LONG, EUR/CHF LONG, AUD/USD LONG, AUD/CAD LONG, USD/JPY SHORT, GBP/JPY SHORT, CAD/JPY SHORT, CHF/JPY SHORT, GBP/AUD SHORT, GBP/NZD SHORT",
      "2026-02-17": "EUR/USD LONG, EUR/GBP LONG, EUR/CAD LONG, EUR/CHF LONG, AUD/USD LONG, AUD/CAD LONG, USD/JPY SHORT, GBP/JPY SHORT, CAD/JPY SHORT, CHF/JPY SHORT, GBP/AUD SHORT, GBP/NZD SHORT",
      "2026-02-18": "EUR/USD LONG, EUR/GBP LONG, EUR/CAD LONG, EUR/CHF LONG, AUD/USD LONG, AUD/CAD LONG, USD/JPY SHORT, GBP/JPY SHORT, CAD/JPY SHORT, CHF/JPY SHORT, GBP/AUD SHORT, GBP/NZD SHORT",
      "2026-02-19": "EUR/USD LONG, EUR/GBP LONG, EUR/CAD LONG, EUR/CHF LONG, AUD/USD LONG, AUD/CAD LONG, USD/JPY SHORT, GBP/JPY SHORT, CAD/JPY SHORT, CHF/JPY SHORT, GBP/AUD SHORT, GBP/NZD SHORT",
      "2026-02-20": "EUR/USD LONG, EUR/GBP LONG, EUR/CAD LONG, EUR/CHF LONG, AUD/USD LONG, AUD/CAD LONG, USD/JPY SHORT, GBP/JPY SHORT, CAD/JPY SHORT, CHF/JPY SHORT, GBP/AUD SHORT, GBP/NZD SHORT",
    },
  },
  {
    weekRange: "Feb 23 - Mar 1, 2026",
    dates: ["2026-02-25", "2026-02-26", "2026-02-27"],
    perDate: {
      "2026-02-25": "USD/JPY LONG, USD/CAD LONG, USD/CHF LONG, AUD/JPY LONG, AUD/CAD LONG, AUD/CHF LONG, EUR/USD SHORT, GBP/USD SHORT, NZD/USD SHORT, EUR/AUD SHORT, GBP/AUD SHORT",
      "2026-02-26": "USD/JPY LONG, USD/CAD LONG, USD/CHF LONG, AUD/JPY LONG, AUD/CAD LONG, AUD/CHF LONG, EUR/USD SHORT, GBP/USD SHORT, NZD/USD SHORT, EUR/AUD SHORT, GBP/AUD SHORT",
      "2026-02-27": "USD/JPY LONG, USD/CAD LONG, USD/CHF LONG, AUD/JPY LONG, AUD/CAD LONG, AUD/CHF LONG, EUR/USD SHORT, GBP/USD SHORT, NZD/USD SHORT, EUR/AUD SHORT, GBP/AUD SHORT",
    },
  },
  {
    weekRange: "Mar 2 - Mar 8, 2026",
    dates: ["2026-03-02", "2026-03-03", "2026-03-05"],
    perDate: {
      "2026-03-02": "EUR/USD SHORT, GBP/USD SHORT, AUD/USD SHORT, NZD/USD SHORT, EUR/JPY SHORT, GBP/JPY SHORT",
      "2026-03-03": "EUR/USD SHORT, GBP/USD SHORT, AUD/USD SHORT, NZD/USD SHORT, EUR/JPY SHORT, GBP/JPY SHORT",
      "2026-03-05": "EUR/USD SHORT, GBP/USD SHORT, AUD/USD SHORT, NZD/USD SHORT, EUR/JPY SHORT, GBP/JPY SHORT",
    },
  },
];

// ─── Daily data from screenshots ─────────────────────────────────────────────
const dailyData = [
  { date: "2026-01-28", swingSetups: "", intradayTrades: "USD/JPY LONG, USD/CAD LONG, EUR/JPY LONG, EUR/CAD LONG, GBP/JPY LONG, GBP/CAD LONG" },
  { date: "2026-01-29", swingSetups: "", intradayTrades: "EUR/USD LONG, EUR/JPY LONG, EUR/CAD LONG, GBP/USD LONG, GBP/JPY LONG, GBP/CAD LONG" },
  { date: "2026-01-30", swingSetups: "", intradayTrades: "CHF/JPY LONG, CAD/CHF SHORT" },
  { date: "2026-02-02", swingSetups: "", intradayTrades: "EUR/USD SHORT, AUD/USD SHORT, USD/CAD LONG, NZD/USD SHORT, EUR/JPY SHORT, AUD/JPY SHORT" },
  { date: "2026-02-03", swingSetups: "", intradayTrades: "" },
  { date: "2026-02-04", swingSetups: "", intradayTrades: "" },
  { date: "2026-02-05", swingSetups: "", intradayTrades: "EUR/USD SHORT, GBP/USD SHORT, AUD/USD SHORT, USD/CAD LONG, NZD/USD LONG" },
  { date: "2026-02-06", swingSetups: "", intradayTrades: "GBP/USD SHORT, NZD/USD SHORT" },
  { date: "2026-02-09", swingSetups: "GBP/AUD SHORT, AUD/JPY LONG, GBP/NZD SHORT", intradayTrades: "NZD/JPY LONG" },
  { date: "2026-02-10", swingSetups: "NZD/USD LONG", intradayTrades: "EUR/USD LONG, USD/JPY SHORT, USD/CHF SHORT" },
  { date: "2026-02-11", swingSetups: "AUD/USD LONG, NZD/USD LONG", intradayTrades: "EUR/USD LONG, USD/JPY SHORT, USD/CHF SHORT" },
  { date: "2026-02-12", swingSetups: "GBP/AUD SHORT, AUD/CAD LONG, GBP/NZD SHORT", intradayTrades: "GBP/JPY SHORT, CAD/JPY SHORT, NZD/CAD LONG" },
  { date: "2026-02-13", swingSetups: "GBP/AUD SHORT, AUD/CAD LONG, GBP/NZD SHORT", intradayTrades: "CAD/JPY SHORT, NZD/CAD LONG" },
  { date: "2026-02-16", swingSetups: "GBP/JPY SHORT, CAD/JPY SHORT, GBP/AUD SHORT, AUD/CAD LONG, GBP/NZD SHORT, NZD/CAD LONG", intradayTrades: "" },
  { date: "2026-02-17", swingSetups: "GBP/JPY SHORT, CAD/JPY SHORT, GBP/AUD SHORT, AUD/CAD LONG, GBP/NZD SHORT, NZD/CAD LONG", intradayTrades: "" },
  { date: "2026-02-18", swingSetups: "GBP/JPY SHORT, CAD/JPY SHORT, GBP/AUD SHORT, AUD/CAD LONG, GBP/NZD SHORT, NZD/CAD LONG", intradayTrades: "" },
  { date: "2026-02-19", swingSetups: "", intradayTrades: "EUR/USD SHORT, GBP/USD SHORT, USD/JPY LONG, NZD/USD SHORT" },
  { date: "2026-02-20", swingSetups: "", intradayTrades: "EUR/USD SHORT, GBP/USD SHORT, USD/JPY LONG, USD/CAD LONG, NZD/USD SHORT" },
  { date: "2026-02-25", swingSetups: "USD/JPY LONG, USD/CAD LONG, AUD/JPY LONG, AUD/CAD LONG", intradayTrades: "NZD/JPY LONG, NZD/CAD LONG" },
  { date: "2026-02-26", swingSetups: "AUD/CAD LONG", intradayTrades: "CAD/JPY SHORT, NZD/CAD LONG" },
  { date: "2026-02-27", swingSetups: "", intradayTrades: "GBP/JPY SHORT, CAD/JPY SHORT" },
  { date: "2026-03-02", swingSetups: "EUR/USD SHORT, GBP/USD SHORT, AUD/USD SHORT, NZD/USD SHORT, EUR/JPY SHORT, GBP/JPY SHORT, AUD/JPY SHORT, NZD/JPY SHORT, EUR/CHF SHORT, GBP/CHF SHORT, AUD/CHF SHORT, NZD/CHF SHORT", intradayTrades: "" },
  { date: "2026-03-03", swingSetups: "EUR/USD SHORT, GBP/USD SHORT, AUD/USD SHORT, NZD/USD SHORT, EUR/CHF SHORT, GBP/CHF SHORT, AUD/CHF SHORT, NZD/CHF SHORT", intradayTrades: "" },
  { date: "2026-03-05", swingSetups: "EUR/USD SHORT, GBP/USD SHORT, EUR/JPY SHORT", intradayTrades: "AUD/USD SHORT, GBP/AUD SHORT, EUR/NZD SHORT, GBP/NZD SHORT" },
];

// ─── Helper: parse comma-separated pairs ─────────────────────────────────────
function parsePairs(str) {
  if (!str || !str.trim()) return [];
  return str.split(",").map(s => {
    const parts = s.trim().split(" ");
    return { pair: parts[0] || "", direction: parts[1] || "" };
  }).filter(p => p.pair);
}

// ─── Build lookup: date → weekRange + swingWatchlist ─────────────────────────
const weeklyLookup = {};
for (const week of weeklyWatchlists) {
  for (const date of week.dates) {
    weeklyLookup[date] = {
      weekRange: week.weekRange,
      swingWatchlist: week.perDate[date] || "",
    };
  }
}

// ─── Combine and seed ─────────────────────────────────────────────────────────
async function seed() {
  const conn = await mysql.createConnection(DATABASE_URL);
  console.log("Connected to database");

  for (const day of dailyData) {
    const weekly = weeklyLookup[day.date] || { weekRange: null, swingWatchlist: "" };
    
    const swingWatchlist = JSON.stringify(parsePairs(weekly.swingWatchlist));
    const swingSetups = JSON.stringify(parsePairs(day.swingSetups));
    const intradayTrades = JSON.stringify(parsePairs(day.intradayTrades));
    const weekRange = weekly.weekRange || null;

    await conn.execute(
      `INSERT INTO history_entries (date, weekRange, swingWatchlist, swingSetups, intradayTrades, createdAt, updatedAt)
       VALUES (?, ?, ?, ?, ?, NOW(), NOW())
       ON DUPLICATE KEY UPDATE
         weekRange = VALUES(weekRange),
         swingWatchlist = VALUES(swingWatchlist),
         swingSetups = VALUES(swingSetups),
         intradayTrades = VALUES(intradayTrades),
         updatedAt = NOW()`,
      [day.date, weekRange, swingWatchlist, swingSetups, intradayTrades]
    );
    console.log(`✓ Seeded ${day.date}`);
  }

  await conn.end();
  console.log("\nDone! Seeded", dailyData.length, "entries.");
}

seed().catch(err => {
  console.error("Seed failed:", err);
  process.exit(1);
});
