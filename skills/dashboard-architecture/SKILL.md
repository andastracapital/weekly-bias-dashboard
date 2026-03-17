---
name: dashboard-architecture
description: >-
  Complete architecture reference for the TK Trading Fundamentals Dashboard.
  Documents layout structure, component hierarchy, data flow, JSON schemas, and calculation logic.
  Use when making structural changes to the dashboard, adding new views, debugging rendering issues,
  or onboarding to the codebase for the first time.
---

# TK Trading Fundamentals Dashboard — Architecture Reference

## Project Overview

**Stack:** React 19 + TypeScript + Vite + TailwindCSS 4 + Framer Motion  
**Project Path:** `/home/ubuntu/tudor-dashboard`  
**Main Component:** `client/src/pages/Home.tsx`  
**Data Files:** `client/src/data/weeklyBias.json`, `client/src/data/dailyRecap.json`  
**GitHub:** `andastracapital/weekly-bias-dashboard`  
**Live Domains:** `tudordashboard.com`, `www.tudordashboard.com`, `tudordashboard1.manus.space`

---

## View Modes

The dashboard has two view modes toggled via the header buttons:

| Mode | Trigger | Data Source |
|------|---------|-------------|
| `DAILY` | Default | `dailyRecap.json` |
| `WEEKLY` | "WEEKLY VIEW" button | `weeklyBias.json` |

---

## Layout Structure

### Daily View (Default)

```
Header (sticky, Bloomberg-style, orange border)
├── Status Bar (4 columns: Risk Sentiment, Focus, Risk Environment, Next Update)
└── Main Grid (lg:grid-cols-4)
    ├── Market Context (col-span-2)
    │   ├── Market Overview (orange accent bar)
    │   └── Market Focus + Risk Environment cards
    ├── Swing Setups + Intraday Trades (col-span-1)
    │   ├── Swing Setups (High Conviction, Weekly+Daily aligned)
    │   └── Intraday Trades / Base Hits (Daily-only, deduplicated)
    └── Red Folder News (col-span-1)
        ├── Close Pos. Before (amber section, prop-firm events)
        └── Red Folder News (today-only filter)
Filter Bar (All / Bullish / Bearish / Neutral)
Currency Grid (4 columns: 8 BiasCard components)
Bond Market Bias (2 columns, optional)
```

### Weekly View

```
Header (same)
└── Main Grid (lg:grid-cols-3)
    ├── Market Overview (col-span-1, left 1/3)
    └── Swing Watchlists (col-span-2, right 2/3)
        ├── Swing Watchlist LONG (orange theme)
        └── Swing Watchlist SHORT (red theme)
Filter Bar
Currency Grid (same 8 BiasCards, weekly data)
```

---

## Key Components

### `BiasCard`
Renders a single currency card. Props: `{ currency: any, weeklyBias?: string }`.

**Color Logic (Bloomberg Style):**
- Bullish → orange border + glow (`border-orange-500`, `shadow-[0_0_15px_rgba(249,115,22,0.15)]`)
- Bearish → red border + glow (`border-red-600`, `shadow-[0_0_15px_rgba(220,38,38,0.15)]`)
- Neutral/Mixed → gray border, no glow

**Alignment Badge:** Dynamically calculated when `weeklyBias` prop provided:
- "Perfect" = exact same bias string
- "Strong" = same directional component (both bullish or both bearish)
- "Mismatch" = opposite directions

### `TradeCard`
Renders a trade setup row. Props: `{ trade: any, index: number }`.

**Reason Format:** Supports both string (legacy) and object `{ line1, line2 }` (current).

### `CountdownTimer`
Live countdown to event time. Props: `{ eventTime: string }` (HH:MM format).
Updates every 60 seconds. Shows "PASSED" when event time has elapsed.

---

## Calculation Logic

### High Conviction Setups (`getHighConvictionSetups`)

1. Compare each currency's Weekly Bias vs Daily Bias
2. Extract directional component only (strip "Weak"/"Strong" qualifiers)
3. Classify as `bullishAligned` or `bearishAligned` (Neutral/Mixed excluded)
4. Generate all Bullish × Bearish pairs
5. Apply FX pair convention (see below)
6. Auto-generate `reason` object with `line1` (base currency drivers) and `line2` (quote currency drivers)

**FX Pair Priority (Base Currency):** EUR(1) > GBP(2) > AUD(3) > NZD(4) > USD(5) > CAD(6) > CHF(7) > JPY(8)

### Intraday Trades (`getIntradayPotentials`)

1. Collect all Daily Bullish and Daily Bearish currencies
2. Generate all Bullish × Bearish pairs with FX convention
3. **Filter out** pairs already in High Conviction Setups
4. Display up to 6 remaining pairs

### Close Pos. Before (IIFE in JSX)

1. Filter `redFolderNews` for today's prop-firm events → `todayCloseEvents`
2. If `currentHour >= 16`: filter tomorrow's prop-firm events before 09:00 → `overnightEvents`
3. Merge and render with amber styling + countdown timers

---

## Data File Schemas

### `weeklyBias.json`

```json
{
  "week": "Mar 2 - Mar 8, 2026",
  "marketOverview": "...",
  "currencies": [
    {
      "code": "USD",
      "name": "US Dollar",
      "bias": "Strong Bullish",
      "rationale": "2-3 sentence trader rationale",
      "drivers": ["Driver 1", "Driver 2"],
      "events": [{ "day": "MON", "event": "ISM PMI", "impact": "High" }]
    }
  ],
  "swingWatchlist": {
    "long": [{ "pair": "USD/JPY", "rationale": "..." }],
    "short": [{ "pair": "EUR/USD", "rationale": "..." }]
  }
}
```

**Bias Format (Weekly):** Includes strength qualifier — "Weak Bullish", "Strong Bearish", "Neutral"

### `dailyRecap.json`

```json
{
  "date": "Wednesday, March 4, 2026",
  "lastUpdate": "07:30 Frankfurt Time",
  "riskEnvironment": "Risk-Off",
  "marketFocus": ["Headline 1", "Headline 2", "Headline 3"],
  "currencies": {
    "USD": {
      "bias": "Bullish",
      "tone": "Haven Bid",
      "summary": "1-3 sentence rationale",
      "drivers": ["Driver 1", "Driver 2", "Driver 3"],
      "reaction": "Optional market reaction note",
      "headlines": ["Optional headline 1"]
    }
  },
  "redFolderNews": [
    { "day": "FRI", "time": "14:30", "currency": "USD", "event": "Non-Farm Employment Change", "impact": "High" }
  ],
  "bonds": [
    { "name": "US 10Y Treasury", "bias": "Bearish", "yield": "Higher", "summary": "...", "drivers": [] }
  ]
}
```

**Bias Format (Daily):** Directional only — "Bullish", "Bearish", "Neutral", "Mixed" (NO Weak/Strong)

---

## Design System

**Theme:** Dark (Bloomberg Terminal aesthetic)  
**Background:** `#000000` (page), `#0a0a0a` (header), `#121212` (cards)  
**Accent:** Orange (`orange-500`) for Bullish/Long, Red (`red-500`/`red-600`) for Bearish/Short  
**Typography:** `font-mono` for data, `font-sans` for labels  
**Font Sizes:** `text-[9px]` (micro labels), `text-[10px]` (tags), `text-xs` (body), `text-sm` (headings)

---

## Common Pitfalls

**Number formatting in trade rationales:** Use `[word-break:keep-all] hyphens-none` CSS classes on text elements containing percentages to prevent mid-number line breaks.

**BiasCard field names:** Component supports both `currency.summary` and `currency.rationale` — use `rationale` in `weeklyBias.json` and `summary` in `dailyRecap.json`.

**Red Folder today-filter:** The JSON stores all week's events; the UI filters to `currentDay` only. Never pre-filter in JSON.

**Alignment calculation:** Directional match ignores "Weak"/"Strong" — `"Weak Bearish"` aligns with `"Bearish"`.
