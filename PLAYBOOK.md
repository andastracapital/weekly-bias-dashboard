# TK Trading Fundamentals Dashboard — Project Playbook

**Version:** April 2026  
**Repository:** `andastracapital/weekly-bias-dashboard`  
**Live Site:** [tudordashboard.com](https://tudordashboard.com)  
**Manus Project:** TK Trading Fundamentals (im6UjHgRgZEzTBab663prk)

---

## Table of Contents

1. [Project Overview](#1-project-overview)
2. [Architecture & File Structure](#2-architecture--file-structure)
3. [Data Structures](#3-data-structures)
4. [Critical Rules & Conventions](#4-critical-rules--conventions)
5. [Weekly Bias Update Workflow](#5-weekly-bias-update-workflow)
6. [Daily Recap Update Workflow](#6-daily-recap-update-workflow)
7. [History Auto-Sync Mechanism](#7-history-auto-sync-mechanism)
8. [Red Folder News & Timezone Rules](#8-red-folder-news--timezone-rules)
9. [Prop-Firm Close Warning Feature](#9-prop-firm-close-warning-feature)
10. [Dashboard UI Components](#10-dashboard-ui-components)
11. [Deployment & Publishing](#11-deployment--publishing)
12. [Troubleshooting Guide](#12-troubleshooting-guide)

---

## 1. Project Overview

The **TK Trading Fundamentals Dashboard** is a professional FX trading analysis tool displaying Weekly Bias and Daily Recap for 8 major currencies: **USD, EUR, GBP, JPY, AUD, CAD, CHF, NZD**.

The dashboard has three views:
- **Weekly View** — Weekly bias per currency with swing watchlist, key events, and rationales
- **Daily View** — Daily recap with risk environment, market focus, High Conviction Setups, Intraday Trades, and Red Folder News
- **History** — Archive of all past daily recap entries (swing setups + intraday trades per day)

**Technology Stack:**
- Frontend: React 19 + Tailwind CSS 4 + TypeScript
- Backend: Express 4 + tRPC 11
- Database: MySQL/TiDB (via Drizzle ORM)
- Data files: `weeklyBias.json` + `dailyRecap.json` (static JSON, served from client)
- Hosting: Manus webdev platform (tudordashboard.com)

---

## 2. Architecture & File Structure

```
tudor-dashboard/
├── client/
│   └── src/
│       ├── data/
│       │   ├── weeklyBias.json        ← Weekly bias data (updated weekly)
│       │   └── dailyRecap.json        ← Daily recap data (updated daily)
│       └── pages/
│           ├── Home.tsx               ← Main dashboard (all 3 views)
│           └── History.tsx            ← History page
├── server/
│   └── routers.ts                     ← tRPC procedures (includes history.upsert)
├── drizzle/
│   └── schema.ts                      ← Database schema (history table)
├── PLAYBOOK.md                        ← This file
└── todo.md                            ← Task tracking
```

**Key data files:**
- `client/src/data/weeklyBias.json` — Updated every Sunday/Monday with weekly currency biases
- `client/src/data/dailyRecap.json` — Updated every weekday morning with daily recap

---

## 3. Data Structures

### 3.1 weeklyBias.json

```json
{
  "week": "Mar 30 - Apr 5, 2026",
  "marketOverview": "Global markets enter the week under a stagflation framework...",
  "currencies": [
    {
      "code": "USD",
      "name": "US Dollar",
      "bias": "Strong Bullish",
      "rationale": "2-3 sentence trader-focused summary (NOT bullet points)",
      "drivers": [
        "Driver 1 — specific data point or event",
        "Driver 2 — specific data point or event",
        "Driver 3 — specific data point or event",
        "Driver 4 — optional",
        "Driver 5 — optional"
      ],
      "events": [
        { "day": "MON", "event": "Powell Speech", "impact": "High" },
        { "day": "FRI", "event": "NFP + Unemployment Rate", "impact": "Critical" }
      ]
    }
  ]
}
```

**Field rules:**
- `bias` must include strength qualifier: `"Weak Bullish"`, `"Strong Bullish"`, `"Weak Bearish"`, `"Strong Bearish"`, `"Neutral"`
- `rationale` uses field name `rationale` (not `summary`) — backward compat: BiasCard supports both
- `events.impact` values: `"Critical"`, `"High"`, `"Medium"` (only High/Critical in practice)

### 3.2 dailyRecap.json

```json
{
  "date": "Thursday, April 2, 2026",
  "lastUpdate": "08:00 FFT",
  "riskEnvironment": "Risk-Off",
  "marketFocus": [
    "Paragraph 1 — dominant macro theme (2-4 sentences)",
    "Paragraph 2 — key data releases from yesterday/overnight",
    "Paragraph 3 — key events today + forward-looking catalysts"
  ],
  "currencies": {
    "USD": {
      "bias": "Bullish",
      "tone": "Short descriptor — key theme in 10 words max",
      "summary": "2-4 sentence trader-focused rationale (isolated currency view, 1-3d horizon)",
      "drivers": [
        "Driver 1 — specific data point",
        "Driver 2 — specific data point",
        "Driver 3 — specific data point",
        "Driver 4 — optional",
        "Driver 5 — optional"
      ]
    },
    "EUR": { "...same structure..." },
    "GBP": { "...same structure..." },
    "JPY": { "...same structure..." },
    "AUD": { "...same structure..." },
    "CAD": { "...same structure..." },
    "CHF": { "...same structure..." },
    "NZD": { "...same structure..." }
  },
  "highConvictionSetups": [
    {
      "pair": "NZD/USD",
      "direction": "SHORT",
      "reason": {
        "line1": "USD: Weekly Strong Bullish + Daily Bullish — key reason",
        "line2": "NZD: Weekly Weak Bearish + Daily Bearish — key reason"
      }
    }
  ],
  "intradayTrades": [
    { "pair": "EUR/AUD", "direction": "SHORT" },
    { "pair": "AUD/JPY", "direction": "LONG" }
  ],
  "historyEntry": {
    "date": "2026-04-02",
    "weekRange": "Mar 30 - Apr 5, 2026",
    "swingWatchlist": [
      { "pair": "EUR/AUD", "direction": "LONG" },
      { "pair": "AUD/USD", "direction": "SHORT" }
    ],
    "swingSetups": [
      { "pair": "NZD/USD", "direction": "SHORT" },
      { "pair": "USD/CHF", "direction": "LONG" }
    ],
    "intradayTrades": [
      { "pair": "EUR/AUD", "direction": "SHORT" },
      { "pair": "AUD/JPY", "direction": "LONG" }
    ]
  },
  "redFolderNews": [
    {
      "day": "TUE",
      "date": "Mar 31",
      "currency": "GBP",
      "event": "Final GDP q/q",
      "time": "08:00 FFT",
      "impact": "High"
    }
  ]
}
```

**Field rules:**
- `riskEnvironment`: `"Risk-On Recovery"`, `"Risk-Off"`, `"Mixed"`
- `bias` (daily): Directional only — `"Bullish"`, `"Bearish"`, `"Neutral"`, `"Mixed"` — **NO strength qualifiers**
- `tone`: 8-12 word summary of the dominant currency driver today
- `historyEntry.date`: ISO format `"YYYY-MM-DD"` — used as the database primary key
- `historyEntry.swingWatchlist`: Copied from `weeklyBias.json` swing watchlist for that week
- `redFolderNews`: Contains **all week's events** (Mon-Sun); UI filters to today only

---

## 4. Critical Rules & Conventions

### 4.1 FX Pair Conventions (MANDATORY)

All currency pairs **must** follow conventional FX market notation. The currency with higher priority becomes the **base currency**.

**Base Currency Priority Order (Highest → Lowest):**

| Priority | Currency | Code |
|----------|----------|------|
| 1 | Euro | EUR |
| 2 | British Pound | GBP |
| 3 | Australian Dollar | AUD |
| 4 | New Zealand Dollar | NZD |
| 5 | US Dollar | USD |
| 6 | Canadian Dollar | CAD |
| 7 | Swiss Franc | CHF |
| 8 | Japanese Yen | JPY |

**Application logic:**
- Bullish EUR vs Bearish JPY → EUR priority 1 > JPY priority 8 → **EUR/JPY LONG** ✅
- Bearish GBP vs Bullish AUD → GBP priority 2 > AUD priority 3 → **GBP/AUD SHORT** ✅
- Bullish AUD vs Bearish USD → AUD priority 3 > USD priority 5 → **AUD/USD LONG** ✅
- Bullish USD vs Bearish CHF → USD priority 5 > CHF priority 7 → **USD/CHF LONG** ✅
- Bullish CAD vs Bearish JPY → CAD priority 6 > JPY priority 8 → **CAD/JPY LONG** ✅

**Never write:** AUD/GBP, JPY/USD, JPY/CHF, CAD/AUD, etc.

### 4.2 High Conviction Setups Logic

High Conviction Setups **must** be recalculated with every Daily Recap Update. They represent the highest-quality trade ideas where both the weekly and daily bias are directionally aligned.

**Step 1 — Alignment check (all 8 currencies):**

```
Extract direction from weekly bias (ignore strength qualifiers):
  "Weak Bearish"  → "bearish"
  "Strong Bullish" → "bullish"
  "Neutral"       → excluded

Compare with daily bias:
  Weekly "bullish" + Daily "Bullish" → ✅ BULLISH ALIGNED
  Weekly "bearish" + Daily "Bearish" → ✅ BEARISH ALIGNED
  Weekly "bullish" + Daily "Neutral" → ❌ NOT ALIGNED
  Weekly "bearish" + Daily "Bullish" → ❌ NOT ALIGNED (mismatch)
  Any "Neutral" or "Mixed"           → ❌ EXCLUDED
```

**Step 2 — Pair generation:**
1. List all **Bullish Aligned** currencies
2. List all **Bearish Aligned** currencies
3. Pair each Bullish vs each Bearish currency
4. Apply FX pair conventions (Section 4.1) to determine base/quote and direction
5. Display top 3-6 setups (maximum 6)

**Step 3 — No fallback rule:**
If no alignment exists (e.g., only one side has aligned currencies), show **no setups**. Never fabricate setups from partial alignment.

**Reason format in JSON:**
```json
{
  "pair": "EUR/CHF",
  "direction": "LONG",
  "reason": {
    "line1": "EUR: Weekly Weak Bullish + Daily Bullish — ECB hike repricing, CPI beat",
    "line2": "CHF: Weekly Bearish + Daily Bearish — CPI missed, SNB cap, USD preferred haven"
  }
}
```

### 4.3 Intraday Trades (Base Hits) Deduplication

Intraday Trades are generated from **daily bias only** (no weekly alignment required). They represent shorter-term opportunities for the current session.

**Generation logic:**
1. List all Daily Bullish currencies
2. List all Daily Bearish currencies
3. Pair each Bullish vs each Bearish currency
4. Apply FX pair conventions
5. **Remove any pair that already appears in High Conviction Setups**
6. Display up to 6 remaining pairs

**Example:**
- High Conviction: NZD/USD SHORT, USD/CHF LONG
- All daily pairs: EUR/AUD SHORT, EUR/CAD SHORT, AUD/JPY LONG, AUD/CHF LONG, CAD/JPY LONG, USD/JPY LONG, NZD/USD SHORT (duplicate → remove), USD/CHF LONG (duplicate → remove)
- Intraday result: EUR/AUD SHORT, EUR/CAD SHORT, AUD/JPY LONG, AUD/CHF LONG, CAD/JPY LONG, USD/JPY LONG

### 4.4 Daily vs Weekly Bias Format

| Context | Format | Examples |
|---------|--------|---------|
| Weekly Bias | With strength qualifier | `"Weak Bullish"`, `"Strong Bearish"`, `"Neutral"` |
| Daily Bias | Directional only | `"Bullish"`, `"Bearish"`, `"Neutral"`, `"Mixed"` |

**Never use** `"Weak Bullish"` or `"Strong Bearish"` in daily bias fields.

### 4.5 China–AUD/NZD Correlation (MANDATORY)

When interpreting PMT Headlines or any China-related news:
- **Bullish for China** (PMI beats, stimulus, CNY strengthening, PBoC easing) → **Bullish for AUD and NZD**
- **Bearish for China** (PMI misses, trade restrictions, CNY weakening, slowdown) → **Bearish for AUD and NZD**

This rule is mandatory and must be applied when setting AUD and NZD biases.

---

## 5. Weekly Bias Update Workflow

**Trigger:** User requests "Weekly Bias Update"  
**Frequency:** Weekly — typically Sunday evening or Monday morning  
**Output:** Updated `weeklyBias.json`

### 5.1 Data Sources

**PMT Weekly Smart Bias Reports** (one per currency):
- USD: `https://access.primemarket-terminal.com/prime-dashboard?template=smart-bias-text-usd`
- EUR: `https://access.primemarket-terminal.com/prime-dashboard?template=smart-bias-text-eur`
- GBP: `https://access.primemarket-terminal.com/prime-dashboard?template=smart-bias-text-gbp`
- JPY: `https://access.primemarket-terminal.com/prime-dashboard?template=smart-bias-text-jpy`
- AUD: `https://access.primemarket-terminal.com/prime-dashboard?template=smart-bias-text-aud`
- CAD: `https://access.primemarket-terminal.com/prime-dashboard?template=smart-bias-text-cad`
- CHF: `https://access.primemarket-terminal.com/prime-dashboard?template=smart-bias-text-chf`
- NZD: `https://access.primemarket-terminal.com/prime-dashboard?template=smart-bias-text-nzd`

**Forex Factory Calendar:** `https://www.forexfactory.com/calendar?week=this`  
Filter: High impact only (red folder), Frankfurt Time (CEST = GMT+2 in summer, CET = GMT+1 in winter)

### 5.2 Workflow Steps

1. **Read all 8 PMT Smart Bias Reports** — extract bias, strength qualifier, key drivers, key events
2. **Scrape Forex Factory** — extract all red folder events for the week (see Section 8)
3. **Write currency summaries** — 2-3 sentences, trader-focused, varied opening sentences (no "The dominant driver remains..." pattern)
4. **Determine swing watchlist** — pair all Bullish vs Bearish currencies using FX conventions; max 6 LONG + 6 SHORT
5. **Write `weeklyBias.json`** — full file replacement
6. **Update `dailyRecap.json` `redFolderNews`** — replace with the new week's events
7. **Verify Weekly View** in dashboard
8. **Save checkpoint** + push to GitHub

### 5.3 Bias Strength Qualifiers

| Qualifier | Meaning |
|-----------|---------|
| `"Strong Bullish"` | Clear upside momentum, multiple confirming factors |
| `"Weak Bullish"` | Mild bullish lean, some headwinds present |
| `"Neutral"` | No clear directional bias, balanced risks |
| `"Weak Bearish"` | Mild bearish lean, some support present |
| `"Strong Bearish"` | Clear downside momentum, multiple confirming factors |

### 5.4 Quality Checklist

- [ ] All 8 currencies updated with bias + strength qualifier
- [ ] Rationales are 2-3 sentences, trader-focused, no bullet points
- [ ] Varied opening sentences (no "The dominant driver" repetition)
- [ ] Market overview reflects current global themes
- [ ] Key events listed with correct impact levels
- [ ] Swing watchlist uses correct FX pair conventions
- [ ] `redFolderNews` in `dailyRecap.json` updated with new week's events
- [ ] Dashboard Weekly View displays correctly
- [ ] Checkpoint saved + pushed to GitHub

---

## 6. Daily Recap Update Workflow

**Trigger:** User requests "Daily Recap Update"  
**Frequency:** Daily, Monday–Friday  
**Time:** Typically 07:00–09:00 Frankfurt Time  
**Output:** Updated `dailyRecap.json`

### 6.1 Data Sources (Day-Specific)

#### Monday

| Source | URL | Content |
|--------|-----|---------|
| PMT London Opening Preparation | `https://access.primemarket-terminal.com/prime-dashboard?template=analyst-reports` | Pre-market analysis for London open |
| PMT Asia Opening Preparation | Same URL | Overnight Asia session recap |
| PMT Headlines | `https://access.primemarket-terminal.com/prime-dashboard?template=headlines` | Last 24h headlines |
| Forex Factory | `https://www.forexfactory.com/calendar?week=this` | Red folder events (High impact only) |

#### Tuesday – Friday

| Source | URL | Content |
|--------|-----|---------|
| PMT US Market Wrap | `https://access.primemarket-terminal.com/prime-dashboard?template=headlines` | US session recap |
| PMT European Market Wrap | Same URL | European session recap |
| PMT Daily Asia-Pac Opening News | Same URL | Asia-Pac opening analysis |
| PMT Daily European Opening News | Same URL | European opening analysis |
| PMT Headlines | Same URL | Last 24h headlines |
| Forex Factory | `https://www.forexfactory.com/calendar?week=this` | Red folder events (High impact only) |

**Critical:** Give **most weight to the most recent articles**. The US Market Wrap (published ~23:00 FFT) typically contains the most up-to-date information.

### 6.2 Workflow Steps

1. **Read PMT Reports** (day-specific — see Section 6.1)
   - User assistance may be needed to open reports (double-click or + button)
   - Extract: risk environment, key themes, currency-specific data points

2. **Read PMT Headlines** (last 24 hours)
   - Scroll through Realtime News Ticker
   - Identify China-related headlines → apply AUD/NZD correlation rule
   - Note any breaking geopolitical or macro events

3. **Determine Risk Environment**
   - `"Risk-On Recovery"` — equities rallying, oil falling, haven currencies weakening
   - `"Risk-Off"` — equities falling, oil rising, USD/JPY/CHF strengthening as havens
   - `"Mixed"` — contradictory signals, no clear directional risk tone

4. **Set 8 currency biases** (directional only: Bullish/Bearish/Neutral/Mixed)
   - Base on: PMT reports + data releases + central bank rhetoric + risk environment
   - Write tone (8-12 words) + summary (2-4 sentences, isolated currency view)
   - List 3-5 specific drivers

5. **Calculate High Conviction Setups** (see Section 4.2)
   - Check weekly vs daily directional alignment for all 8 currencies
   - Generate pairs from Bullish Aligned vs Bearish Aligned
   - Apply FX pair conventions
   - Write 2-line reason for each setup

6. **Calculate Intraday Trades** (see Section 4.3)
   - Generate all daily bullish vs daily bearish pairs
   - Remove duplicates from High Conviction Setups
   - Apply FX pair conventions

7. **Build `historyEntry` block** (MANDATORY — see Section 7)
   - `date`: today's date in ISO format (`"YYYY-MM-DD"`)
   - `weekRange`: current week range from `weeklyBias.json`
   - `swingWatchlist`: copy from `weeklyBias.json` swing watchlist
   - `swingSetups`: today's High Conviction Setups
   - `intradayTrades`: today's Intraday Trades

8. **Write `dailyRecap.json`** — full file replacement

9. **Verify dashboard** — check Daily View displays correctly, Red Folder News shows today only

10. **Save checkpoint** + push to GitHub

### 6.3 Currency Summary Style Guide

**Isolated currency view** — analyze the currency's own strength/weakness, not relative to USD.

**Good example:**
> "USD is Bullish today. DXY strengthened as Trump's primetime address dashed hopes of a near-term Iran ceasefire and reignited risk-off flows. Wednesday's data was broadly USD-positive: ADP beat (62K vs 40K exp), Retail Sales beat (0.6% vs 0.4% exp), ISM Manufacturing beat (52.7 vs 52.4 exp) with the Prices Paid component surging — a clear stagflation signal."

**Bad examples:**
> "USD/JPY is bullish, targeting 160.00" ❌ (pair-focused, not currency-focused)  
> "USD is strong due to risk-off flows" ❌ (too vague, no specific data)

**Coverage framework (use as checklist, not template):**
- Central bank policy / rhetoric
- Economic data releases (with actual vs expected figures)
- Geopolitical / macro themes
- Yield / rate differentials
- Risk sentiment impact

### 6.4 Quality Checklist

- [ ] Day-specific PMT reports read (Monday: 2 reports; Tue-Fri: 4 reports)
- [ ] PMT Headlines read; China → AUD/NZD correlation applied
- [ ] Risk Environment set accurately
- [ ] All 8 currencies updated (bias, tone, summary, drivers)
- [ ] Daily biases are directional only (no Weak/Strong)
- [ ] High Conviction Setups recalculated (weekly-daily alignment verified)
- [ ] Intraday Trades deduplicated (no overlap with High Conviction)
- [ ] FX pair conventions applied correctly throughout
- [ ] `historyEntry` block included with correct date, weekRange, swingWatchlist
- [ ] Red Folder News contains all week's events (not just today)
- [ ] Dashboard Daily View displays correctly
- [ ] Checkpoint saved + pushed to GitHub

---

## 7. History Auto-Sync Mechanism

The History tab shows an archive of all past daily recap entries. The mechanism works as follows:

### 7.1 How It Works

1. Every `dailyRecap.json` contains a `historyEntry` block with the current day's data
2. When `Home.tsx` mounts, it calls `trpc.history.upsert` with the `historyEntry` data
3. The server upserts the entry into the `history` database table (keyed on `date`)
4. The History page reads from the database and displays all entries

This means: **as long as `historyEntry` is present in `dailyRecap.json`, the history updates automatically on page load.**

### 7.2 historyEntry Block (MANDATORY in every Daily Recap Update)

```json
"historyEntry": {
  "date": "2026-04-02",
  "weekRange": "Mar 30 - Apr 5, 2026",
  "swingWatchlist": [
    { "pair": "EUR/AUD", "direction": "LONG" },
    { "pair": "EUR/CHF", "direction": "LONG" },
    { "pair": "EUR/NZD", "direction": "LONG" },
    { "pair": "AUD/USD", "direction": "SHORT" },
    { "pair": "NZD/USD", "direction": "SHORT" }
  ],
  "swingSetups": [
    { "pair": "NZD/USD", "direction": "SHORT" },
    { "pair": "USD/CHF", "direction": "LONG" }
  ],
  "intradayTrades": [
    { "pair": "EUR/AUD", "direction": "SHORT" },
    { "pair": "EUR/CAD", "direction": "SHORT" },
    { "pair": "AUD/JPY", "direction": "LONG" },
    { "pair": "AUD/CHF", "direction": "LONG" },
    { "pair": "CAD/JPY", "direction": "LONG" },
    { "pair": "USD/JPY", "direction": "LONG" }
  ]
}
```

**Rules:**
- `date` must be ISO format `"YYYY-MM-DD"` — this is the database primary key (upsert key)
- `swingWatchlist` = copy of the current week's swing watchlist from `weeklyBias.json`
- `swingSetups` = today's High Conviction Setups (same as `highConvictionSetups` in the JSON)
- `intradayTrades` = today's Intraday Trades (same as `intradayTrades` in the JSON)

### 7.3 Database Schema

```typescript
// drizzle/schema.ts
export const history = mysqlTable("history", {
  id: int("id").autoincrement().primaryKey(),
  date: varchar("date", { length: 10 }).notNull().unique(),  // "YYYY-MM-DD"
  weekRange: varchar("week_range", { length: 50 }),
  swingWatchlist: json("swing_watchlist"),
  swingSetups: json("swing_setups"),
  intradayTrades: json("intraday_trades"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow().onUpdateNow(),
});
```

---

## 8. Red Folder News & Timezone Rules

### 8.1 Data Source

**Forex Factory Calendar:** `https://www.forexfactory.com/calendar?week=this`

**Filter criteria:**
- **Impact:** High only (red folder icon) — exclude Medium (yellow) and Low
- **Scope:** Current week (Monday–Sunday)
- **Time format:** Frankfurt Time (see Section 8.2)

### 8.2 Frankfurt Timezone (CRITICAL)

Frankfurt follows **Central European Time**:
- **Winter (last Sun Oct → last Sun Mar):** CET = **GMT+1**
- **Summer (last Sun Mar → last Sun Oct):** CEST = **GMT+2**

**As of March 29, 2026 (European DST switch), Frankfurt is on CEST = GMT+2.**

**Conversion from common source timezones to Frankfurt (CEST = GMT+2):**

| Source Timezone | Offset | Conversion |
|----------------|--------|-----------|
| UTC / GMT+0 | +0 | Add 2 hours |
| US Eastern (EDT) | -4 | Add 6 hours |
| US Eastern (EST) | -5 | Add 7 hours |
| London (BST) | +1 | Add 1 hour |
| London (GMT) | +0 | Add 2 hours |
| Tokyo (JST) | +9 | Subtract 7 hours |
| Sydney (AEST) | +10 | Subtract 8 hours |

**Practical method:** Set Forex Factory timezone to `(GMT+02:00) Bern, Zurich` in the calendar settings — times will display directly in Frankfurt time.

**Typical Frankfurt times for major events:**

| Event | Currency | Frankfurt Time |
|-------|----------|---------------|
| Asian session data (JPY, AUD, NZD) | JPY/AUD/NZD | 00:00–03:00 FFT |
| European morning data (EUR, GBP, CHF) | EUR/GBP/CHF | 07:00–11:00 FFT |
| US afternoon data (USD) | USD | 14:00–16:30 FFT |
| NFP / Retail Sales / CPI | USD | 14:30 FFT |
| FOMC Rate Decision | USD | 20:00 FFT |
| ECB Rate Decision | EUR | 14:15 FFT |
| BOE Rate Decision | GBP | 13:00 FFT |

### 8.3 Red Folder News JSON Format

```json
{
  "day": "FRI",
  "date": "Apr 3",
  "currency": "USD",
  "event": "Non-Farm Employment Change",
  "time": "14:30 FFT",
  "impact": "Critical"
}
```

**`impact` values:** `"Critical"` (for NFP, Rate Decisions, FOMC) or `"High"` (for all other red folder events)

### 8.4 UI Display Rule

The dashboard UI shows **only today's events** from the `redFolderNews` array. The JSON contains all week's events — the UI filters by matching `day` to the current day of the week.

**Never store only today's events in the JSON** — always store the full week so the UI can display the correct events regardless of when the page is loaded.

---

## 9. Prop-Firm Close Warning Feature

### 9.1 Overview

The "Close Pos. Before" section appears **above** Red Folder News in the Daily View. It automatically highlights events where prop-firm rules require positions to be closed before the event.

### 9.2 Trigger Logic

**Same-day events:** If today has a prop-firm event → show with amber CLOSE badge + countdown timer

**Overnight events (early warning):** If current Frankfurt time ≥ 16:00 AND tomorrow has a prop-firm event before 09:00 FFT → show with yellow TONIGHT badge

### 9.3 Prop-Firm Event List

Defined in `Home.tsx` as `PROP_FIRM_CLOSE_EVENTS`:

| Currency | Keywords |
|----------|---------|
| USD | Federal Funds Rate, Non-Farm Employment Change, Unemployment Rate, Advance GDP, FOMC Meeting Minutes, CPI y/y |
| EUR | Main Refinancing Rate, ECB Rate |
| GBP | Official Bank Rate, MPC, CPI y/y |
| CAD | Overnight Rate, BOC Rate, CPI m/m, Employment Change, Unemployment Rate |
| AUD | Cash Rate, RBA Statement, Employment Change, Unemployment Rate, CPI q/q, GDP q/q |
| NZD | Official Cash Rate, RBNZ, Employment Change, Unemployment Rate, CPI q/q, GDP q/q |
| CHF | SNB Policy Rate, SNB Rate, SNB Monetary Policy, Swiss National Bank, Libor Rate, SNB Press Conference |

**ADP exclusion rule:** ADP Non-Farm Employment Change is explicitly excluded (private report, not official NFP). The `isPropFirmEvent()` function checks `if (news.event?.toLowerCase().includes("adp")) return false` before any other matching.

---

## 10. Dashboard UI Components

### 10.1 Views

| View | Tab | Content |
|------|-----|---------|
| Daily View | `DAILY VIEW` (default) | Risk environment, market focus, High Conviction Setups, Intraday Trades, Close Pos. Before, Red Folder News |
| Weekly View | `WEEKLY VIEW` | 8 currency bias cards with rationale, drivers, events; Swing Watchlist |
| History | `HISTORY` | Table of past daily entries (date, week range, swing setups, intraday trades) |

### 10.2 Color Coding

| Signal | Color |
|--------|-------|
| Bullish / Long | Orange (`text-orange-500`, `border-orange-500`) |
| Bearish / Short | Red (`text-red-500`, `border-red-600`) |
| Neutral / Mixed | Gray (`text-gray-400`, `border-gray-600`) |
| Risk-Off | Red label |
| Risk-On Recovery | Green label |
| Mixed | Yellow label |

### 10.3 Live Clock

The header shows the current Frankfurt time (`FRA HH:MM`) with a live `LIVE` indicator. This is calculated using `Europe/Berlin` timezone in JavaScript.

---

## 11. Deployment & Publishing

### 11.1 Development Workflow

```bash
# Start dev server
cd /home/ubuntu/tudor-dashboard
pnpm dev

# Check status
webdev_check_status

# Save checkpoint (required before publish)
webdev_save_checkpoint

# Push to GitHub
git add -A && git commit -m "Daily Recap Update - [Date]" && git push origin main
```

### 11.2 Publishing

1. Save a checkpoint using `webdev_save_checkpoint`
2. Click the **Publish** button in the Manus Management UI (top-right header)
3. The live site at `tudordashboard.com` updates automatically

**Never attempt to deploy via CLI** — always use the Manus Publish button.

### 11.3 GitHub Repository

- **Repo:** `andastracapital/weekly-bias-dashboard`
- **Branch:** `main`
- **Auto-commit:** Every checkpoint triggers a git commit

---

## 12. Troubleshooting Guide

### 12.1 History Not Updating

**Symptom:** New daily recap entries not appearing in History tab.

**Cause:** `historyEntry` block missing from `dailyRecap.json`.

**Fix:** Ensure every `dailyRecap.json` write includes the complete `historyEntry` block (see Section 7.2). The auto-sync fires on page load.

### 12.2 Wrong Red Folder Times

**Symptom:** Countdown timers show wrong time remaining, or events show PASSED when they haven't happened yet.

**Cause:** Times stored in wrong timezone (e.g., US Eastern instead of Frankfurt).

**Fix:** 
1. Navigate to `https://www.forexfactory.com/calendar?week=this`
2. Change timezone to `(GMT+02:00) Bern, Zurich` (summer) or `(GMT+01:00) Berlin` (winter)
3. Read times directly from the calendar — no conversion needed
4. Update `redFolderNews` in `dailyRecap.json`

### 12.3 High Conviction Setups Showing Wrong Pairs

**Symptom:** Pairs violate FX convention (e.g., JPY/USD instead of USD/JPY).

**Fix:** Apply the priority order: EUR > GBP > AUD > NZD > USD > CAD > CHF > JPY. The currency with the lower priority number is always the base currency.

### 12.4 Intraday Trades Duplicating High Conviction Pairs

**Symptom:** Same pair appears in both High Conviction Setups and Intraday Trades.

**Fix:** After generating all daily bullish vs bearish pairs, explicitly filter out any pair that matches a High Conviction Setup (same pair + same direction).

### 12.5 Dashboard Not Reflecting JSON Changes

**Symptom:** Dashboard still shows old data after updating JSON files.

**Fix:**
```bash
webdev_check_status   # Check for TypeScript errors
webdev_restart_server # Restart if needed
```
Vite HMR should pick up JSON changes automatically. If not, a server restart resolves it.

### 12.6 PMT Reports Won't Open

**Symptom:** Cannot access PMT report content.

**Fix:** Ask the user to take over the browser and open the reports manually (double-click or + button). The user can also paste the report content directly into the chat.

---

## Appendix A: Swing Watchlist Generation

The Weekly View Swing Watchlist pairs all **Bullish** currencies against all **Bearish** currencies from the weekly bias, applying FX conventions. Maximum 6 LONG + 6 SHORT pairs.

**Example (Mar 30 – Apr 5, 2026):**
- Weekly Bullish: USD (Strong), EUR (Weak)
- Weekly Bearish: AUD (Weak), CHF, NZD (Weak)
- Weekly Neutral: GBP, JPY, CAD

Generated pairs:
- EUR/AUD LONG (EUR priority 1 > AUD priority 3)
- EUR/CHF LONG (EUR priority 1 > CHF priority 7)
- EUR/NZD LONG (EUR priority 1 > NZD priority 4)
- AUD/USD SHORT (AUD priority 3 > USD priority 5 → AUD/USD; USD bullish so SHORT)
- NZD/USD SHORT (NZD priority 4 > USD priority 5 → NZD/USD; USD bullish so SHORT)
- AUD/NZD LONG (AUD priority 3 > NZD priority 4; USD bullish vs NZD bearish → but both bearish? No — AUD is bearish, NZD is bearish → skip same-direction pairs)

**Rule:** Only pair currencies with **opposite** biases (Bullish vs Bearish). Never pair two Bullish or two Bearish currencies.

---

## Appendix B: Timezone Quick Reference

Frankfurt Time (CEST = GMT+2, active Mar 29 – Oct 25, 2026):

| US Eastern (EDT) | Frankfurt (CEST) |
|-----------------|-----------------|
| 02:30 AM | 08:30 FFT |
| 08:00 AM | 14:00 FFT |
| 08:15 AM | 14:15 FFT |
| 08:30 AM | 14:30 FFT |
| 10:00 AM | 16:00 FFT |
| 02:00 PM | 20:00 FFT |

---

*Last updated: April 2, 2026. Maintained by Manus AI for TK Trading.*
