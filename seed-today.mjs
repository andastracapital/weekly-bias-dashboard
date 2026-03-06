import { drizzle } from "drizzle-orm/mysql2";
import mysql from "mysql2/promise";
import { historyEntries } from "./drizzle/schema.ts";
import dotenv from "dotenv";
import { eq } from "drizzle-orm";
dotenv.config();

const connection = await mysql.createConnection(process.env.DATABASE_URL);
const db = drizzle(connection);

// Fri Mar 6, 2026 — NFP Day, Iran War Day 7, Risk-Off
// Weekly Bias: USD Strong Bullish, EUR Weak Bearish, GBP Strong Bearish, JPY Strong Bullish
//              AUD Weak Bearish, CAD Neutral, CHF Strong Bullish, NZD Strong Bearish
// Daily Bias:  USD Bullish, EUR Bearish, GBP Bearish, JPY Bullish
//              AUD Bearish, CAD Neutral, CHF Bullish, NZD Bearish

// High Conviction Setups (Weekly + Daily aligned):
// Bullish aligned: USD, JPY, CHF
// Bearish aligned: EUR, GBP, AUD, NZD
// Top 3 pairs (FX convention):
// EUR/USD SHORT (EUR Bear vs USD Bull) — EUR priority 1 vs USD priority 5
// GBP/USD SHORT (GBP Bear vs USD Bull) — GBP priority 2 vs USD priority 5
// EUR/JPY SHORT (EUR Bear vs JPY Bull) — EUR priority 1 vs JPY priority 8

// Intraday Trades (Daily bias only, excluding High Conviction pairs):
// Remaining Bullish: USD, JPY, CHF | Remaining Bearish: EUR, GBP, AUD, NZD
// Pairs excluding EUR/USD, GBP/USD, EUR/JPY:
// GBP/JPY SHORT, AUD/USD SHORT, NZD/USD SHORT, GBP/CHF SHORT, AUD/JPY SHORT, NZD/JPY SHORT

// Swing Watchlist from Weekly Bias (Mar 2 - Mar 8):
// LONG: No long setups (USD, JPY, CHF bullish but no long watchlist pairs visible)
// SHORT: EUR/USD, GBP/USD, AUD/USD, NZD/USD, EUR/JPY, GBP/JPY

const entry = {
  date: "2026-03-06",
  weekRange: "Mar 2 - Mar 8, 2026",
  swingWatchlistLong: JSON.stringify([]),
  swingWatchlistShort: JSON.stringify(["EUR/USD", "GBP/USD", "AUD/USD", "NZD/USD", "EUR/JPY", "GBP/JPY"]),
  swingSetups: JSON.stringify([
    { pair: "EUR/USD", direction: "SHORT" },
    { pair: "GBP/USD", direction: "SHORT" },
    { pair: "EUR/JPY", direction: "SHORT" }
  ]),
  intradayTrades: JSON.stringify([
    { pair: "GBP/JPY", direction: "SHORT" },
    { pair: "AUD/USD", direction: "SHORT" },
    { pair: "NZD/USD", direction: "SHORT" },
    { pair: "GBP/CHF", direction: "SHORT" },
    { pair: "AUD/JPY", direction: "SHORT" },
    { pair: "NZD/JPY", direction: "SHORT" }
  ])
};

// Check if entry already exists for this date
const existing = await db.select().from(historyEntries).where(eq(historyEntries.date, "2026-03-06"));

if (existing.length > 0) {
  // Update existing entry
  await db.update(historyEntries)
    .set(entry)
    .where(eq(historyEntries.date, "2026-03-06"));
  console.log("✅ Updated existing history entry for 2026-03-06 (Fri Mar 6)");
} else {
  // Insert new entry
  await db.insert(historyEntries).values(entry);
  console.log("✅ Inserted new history entry for 2026-03-06 (Fri Mar 6)");
}

await connection.end();
console.log("Done!");
