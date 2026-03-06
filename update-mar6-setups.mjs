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
//
// ALL High Conviction Setups (Weekly + Daily aligned, ALL combinations):
// Bullish aligned: USD, JPY, CHF
// Bearish aligned: EUR, GBP, AUD, NZD
// Full matrix (3 bullish × 4 bearish = 12 pairs):
//   EUR/USD SHORT, GBP/USD SHORT, AUD/USD SHORT, NZD/USD SHORT
//   EUR/JPY SHORT, GBP/JPY SHORT, AUD/JPY SHORT, NZD/JPY SHORT
//   EUR/CHF SHORT, GBP/CHF SHORT, AUD/CHF SHORT, NZD/CHF SHORT

const allSwingSetups = JSON.stringify([
  { pair: "EUR/USD", direction: "SHORT" },
  { pair: "GBP/USD", direction: "SHORT" },
  { pair: "AUD/USD", direction: "SHORT" },
  { pair: "NZD/USD", direction: "SHORT" },
  { pair: "EUR/JPY", direction: "SHORT" },
  { pair: "GBP/JPY", direction: "SHORT" },
  { pair: "AUD/JPY", direction: "SHORT" },
  { pair: "NZD/JPY", direction: "SHORT" },
  { pair: "EUR/CHF", direction: "SHORT" },
  { pair: "GBP/CHF", direction: "SHORT" },
  { pair: "AUD/CHF", direction: "SHORT" },
  { pair: "NZD/CHF", direction: "SHORT" },
]);

// Intraday Trades: Daily bias only, deduplicated from High Conviction
// Daily Bullish: USD, JPY, CHF | Daily Bearish: EUR, GBP, AUD, NZD
// All daily pairs = same 12 as High Conviction → ALL excluded from intraday
// NFP day: no intraday trades (prop firm close warning active)
const intradayTrades = JSON.stringify([]);

await db.update(historyEntries)
  .set({
    swingSetups: allSwingSetups,
    intradayTrades: intradayTrades,
  })
  .where(eq(historyEntries.date, "2026-03-06"));

console.log("✅ Updated Mar 6 with all 12 swing setups");
console.log("   EUR/USD SHORT, GBP/USD SHORT, AUD/USD SHORT, NZD/USD SHORT");
console.log("   EUR/JPY SHORT, GBP/JPY SHORT, AUD/JPY SHORT, NZD/JPY SHORT");
console.log("   EUR/CHF SHORT, GBP/CHF SHORT, AUD/CHF SHORT, NZD/CHF SHORT");

await connection.end();
console.log("Done!");
