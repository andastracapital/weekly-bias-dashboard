# TK Trading Fundamentals Dashboard - Project Instructions

## Project Overview

The TK Trading Fundamentals Dashboard is a professional FX trading analysis tool that displays Weekly Bias and Daily Recap views for 8 major currencies (USD, EUR, GBP, JPY, AUD, CAD, CHF, NZD). The dashboard provides High Conviction Setups, Intraday Trades, and Red Folder News for traders.

**Project Path:** `/home/ubuntu/tudor-dashboard`  
**Data Files:** 
- `/home/ubuntu/tudor-dashboard/client/src/data/weeklyBias.json`
- `/home/ubuntu/tudor-dashboard/client/src/data/dailyRecap.json`

---

## Critical Rules & Conventions

### 1. FX Pair Conventions (MANDATORY)

**All currency pairs MUST follow conventional FX market notation:**

**Base Currency Priority Order (Highest to Lowest):**
1. EUR - Euro
2. GBP - British Pound
3. AUD - Australian Dollar
4. NZD - New Zealand Dollar
5. USD - US Dollar
6. CAD - Canadian Dollar
7. CHF - Swiss Franc
8. JPY - Japanese Yen

**Rules:**
- The currency with **higher priority** (lower number) becomes the **base currency**
- The currency with **lower priority** (higher number) becomes the **quote currency**
- Direction adjusts automatically based on conventional notation

**Examples:**
- ✅ **GBP/AUD SHORT** (Bearish GBP vs Bullish AUD)
- ✅ **AUD/JPY LONG** (Bullish AUD vs Bearish JPY)
- ✅ **GBP/NZD SHORT** (Bearish GBP vs Bullish NZD)
- ❌ **AUD/GBP LONG** (WRONG - violates priority order)

**Implementation:**
```typescript
const basePriority: { [key: string]: number } = {
  "EUR": 1, "GBP": 2, "AUD": 3, "NZD": 4,
  "USD": 5, "CAD": 6, "CHF": 7, "JPY": 8
};
```

**Reference:** See `/home/ubuntu/tudor-dashboard/FX_PAIR_CONVENTIONS.md` for full documentation.

---

### 2. High Conviction Setups Logic

**Alignment Requirements:**
- **MUST** check Weekly Bias vs Daily Bias alignment for all currencies
- **Directional match ONLY** - ignore strength qualifiers (Weak/Strong)
- **Exclude Neutral/Mixed** - only Bullish or Bearish alignment counts

**Matching Logic:**
```typescript
// Extract directional bias only (ignore "weak" or "strong")
const extractDirection = (bias: string) => {
  if (bias.includes("bullish")) return "bullish";
  if (bias.includes("bearish")) return "bearish";
  if (bias.includes("neutral")) return "neutral";
  if (bias.includes("mixed")) return "mixed";
  return bias;
};

// Check for alignment
const wDirection = extractDirection(weeklyBias);
const dDirection = extractDirection(dailyBias);

// MUST be exact directional match
const isBullishAlignment = wDirection === "bullish" && dDirection === "bullish";
const isBearishAlignment = wDirection === "bearish" && dDirection === "bearish";
```

**Pair Generation:**
- Pair **Bullish Aligned** currencies vs **Bearish Aligned** currencies
- Apply FX pair conventions (see Section 1)
- Limit to top 3 setups

**NO FALLBACK** - Only show setups with true Weekly-Daily alignment.

---

### 3. Intraday Trades (Base Hits) Deduplication

**CRITICAL RULE:** Pairs that appear in High Conviction Setups **MUST NOT** appear in Intraday Trades.

**Implementation:**
```typescript
// Filter out pairs already in High Conviction Setups
.filter(trade => !highConvictionSetups.some(hc => hc.pair === trade.pair))
```

**Logic:**
1. Generate all Bullish vs Bearish pairs from Daily Bias
2. Apply FX pair conventions
3. **Filter out** pairs that match High Conviction Setups
4. Display remaining pairs (up to 6)

---

### 4. Red Folder News Filter

**Display Rule:** Show **ONLY** events happening **TODAY** (exact day match).

**Implementation:**
```typescript
const today = new Date();
const daysOfWeek = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];
const currentDay = daysOfWeek[today.getDay()];

// Filter: only show events matching today's day
const todayEvents = dailyData.redFolderNews.filter(news => news.day === currentDay);
```

**Behavior:**
- **Monday:** Show only MON events
- **Tuesday:** Show only TUE events
- **No events today:** Display "No high impact events remaining today"

**DO NOT** show:
- Past events from earlier in the week
- Future events from later in the week

---

## Data Structure

### weeklyBias.json
```json
{
  "week": "Feb 9 - Feb 15, 2026",
  "marketOverview": "...",
  "currencies": [
    {
      "code": "USD",
      "name": "US Dollar",
      "bias": "Weak Bearish",  // Note: includes strength qualifier
      "rationale": "...",
      "drivers": ["..."],
      "keyEvents": [...]
    }
  ]
}
```

### dailyRecap.json
```json
{
  "date": "Monday, February 9, 2026",
  "lastUpdate": "07:00 Frankfurt Time",
  "marketFocus": {
    "riskEnvironment": "Risk-On Recovery",
    "headlines": ["..."]
  },
  "currencies": {
    "USD": {
      "bias": "Mixed",  // Note: no strength qualifier
      "tone": "Neutral Stance",
      "summary": "...",
      "drivers": ["..."]
    }
  },
  "redFolderNews": [
    {
      "day": "TUE",
      "event": "US Retail Sales",
      "impact": "High",
      "currency": "USD"
    }
  ]
}
```

---

## Daily Recap Update Workflow

### When to Update:
- **Frequency:** Daily (Monday-Friday)
- **Time:** 07:00 Frankfurt Time
- **Trigger:** User requests "Daily Recap Update"

### Data Sources:
1. **PMT Analyst Reports:**
   - London Opening Preparation (latest)
   - Asia Opening Preparation (latest)

2. **Forex Factory Calendar:**
   - Red Folder News (High/Critical impact only)
   - Current week events

### Update Process:
1. Scrape PMT Analyst Reports (with user assistance if needed)
2. Scrape Forex Factory Calendar for Red Folder events
3. Rebuild `dailyRecap.json` with:
   - Updated market focus and risk environment
   - 8 currency biases (directional only, no strength qualifiers)
   - Currency summaries (trader-focused, 1-3 day horizon)
   - Red Folder events (all days of the week)
4. Verify High Conviction Setups alignment
5. Test dashboard (Weekly View + Daily View)
6. Commit to Git and push to GitHub

### Quality Checklist:
- ✅ All 8 currencies updated (USD, EUR, GBP, JPY, AUD, CAD, CHF, NZD)
- ✅ High Conviction Setups use correct FX pair notation
- ✅ Intraday Trades deduplicated (no overlap with High Conviction)
- ✅ Red Folder News filtered to today only
- ✅ Risk Environment accurate (Risk-On/Risk-Off/Mixed)
- ✅ Dev server error-free

---

## Design & Styling

**Theme:** Bloomberg/PMT-inspired professional trading terminal

**Color Scheme:**
- **Background:** Black (#000000) and dark gray (#121212)
- **Bullish:** Orange (#f97316)
- **Bearish:** Red (#dc2626)
- **Neutral/Mixed:** Gray (#6b7280)
- **Accent:** Orange (#f97316)

**Typography:**
- **Headers:** Bold, uppercase, tracking-wide
- **Data:** Monospace font (font-mono)
- **Sizes:** Small (10px-12px) for labels, medium (14px-16px) for content

**Components:**
- Currency cards with border glow effects
- High Conviction Setups with numbered badges
- Intraday Trades with color-coded direction indicators
- Red Folder News with impact badges (Critical/High/Medium)

---

## Deployment

**Platform:** Manus webdev (manus.space)

**Management UI Access:**
1. Click checkpoint card to open Management UI
2. Navigate to Preview panel to see live dashboard
3. Use Publish button to deploy to permanent URL

**GitHub Integration:**
- Repository: `andastracapital/weekly-bias-dashboard`
- Auto-sync enabled
- Commits pushed automatically on checkpoint save

---

## File Structure

```
/home/ubuntu/tudor-dashboard/
├── client/
│   ├── src/
│   │   ├── data/
│   │   │   ├── weeklyBias.json      # Weekly bias data
│   │   │   └── dailyRecap.json      # Daily recap data
│   │   ├── pages/
│   │   │   └── Home.tsx             # Main dashboard component
│   │   ├── App.tsx                  # App entry point
│   │   └── index.css                # Global styles
│   └── index.html
├── FX_PAIR_CONVENTIONS.md           # FX pair notation reference
├── HIGH_CONVICTION_SETUPS_LOGIC.md  # Alignment logic documentation
└── PROJECT_INSTRUCTIONS.md          # This file
```

---

## Key Implementation Details

### High Conviction Setups Calculation (Home.tsx)
```typescript
const getHighConvictionSetups = () => {
  const bullishAligned: string[] = [];
  const bearishAligned: string[] = [];

  // Check alignment for each currency
  weeklyData.currencies.forEach((wCurrency: any) => {
    const dCurrency = dailyData.currencies[wCurrency.code];
    if (!dCurrency) return;

    // Extract directional bias only
    const wDirection = extractDirection(wCurrency.bias.toLowerCase());
    const dDirection = extractDirection(dCurrency.bias.toLowerCase());

    // Check for exact directional match
    if (wDirection === "bullish" && dDirection === "bullish") {
      bullishAligned.push(wCurrency.code);
    } else if (wDirection === "bearish" && dDirection === "bearish") {
      bearishAligned.push(wCurrency.code);
    }
  });

  // Generate pairs with FX conventions
  const setups: any[] = [];
  bullishAligned.forEach(bull => {
    bearishAligned.forEach(bear => {
      const { pair, direction } = getConventionalPair(bull, bear);
      setups.push({ pair, direction, ... });
    });
  });

  return setups.slice(0, 3);
};
```

### Intraday Trades Deduplication (Home.tsx)
```typescript
intradayPotentials.bullish.flatMap(bull => 
  intradayPotentials.bearish.map(bear => {
    const { pair, direction } = getConventionalPair(bull, bear);
    return { pair, direction, bull, bear };
  })
)
// Filter out High Conviction pairs
.filter(trade => !highConvictionSetups.some(hc => hc.pair === trade.pair))
.slice(0, 6)
```

### Red Folder News Filter (Home.tsx)
```typescript
const today = new Date();
const daysOfWeek = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];
const currentDay = daysOfWeek[today.getDay()];

const todayEvents = dailyData.redFolderNews.filter(
  news => news.day === currentDay
);
```

---

## Troubleshooting

### High Conviction Setups Not Showing
- **Check:** Weekly-Daily alignment exists for at least one Bullish and one Bearish currency
- **Verify:** Directional extraction logic ignores "Weak"/"Strong" qualifiers
- **Confirm:** FX pair conventions applied correctly

### Intraday Trades Still Showing Duplicates
- **Check:** Deduplication filter is applied before `.slice(0, 6)`
- **Verify:** Pair matching uses exact string comparison (`hc.pair === trade.pair`)

### Red Folder News Showing Wrong Days
- **Check:** Current day calculation uses correct timezone
- **Verify:** Filter condition is `news.day === currentDay` (exact match)
- **Confirm:** `dailyRecap.json` has events with correct day codes (MON, TUE, etc.)

### FX Pairs Showing Incorrect Notation
- **Check:** `basePriority` object has correct priority order
- **Verify:** `getConventionalPair()` function returns correct base/quote and direction
- **Confirm:** Both High Conviction and Intraday Trades use same convention logic

---

## Maintenance

### Regular Updates:
- **Daily:** Update `dailyRecap.json` with fresh market data
- **Weekly:** Update `weeklyBias.json` with new week's analysis
- **As Needed:** Adjust FX pair conventions if market standards change

### Code Updates:
- **Always:** Test both Weekly View and Daily View after changes
- **Always:** Verify High Conviction Setups alignment logic
- **Always:** Check FX pair notation correctness
- **Always:** Commit to Git and push to GitHub

### Documentation:
- **Update:** `FX_PAIR_CONVENTIONS.md` if priority order changes
- **Update:** `HIGH_CONVICTION_SETUPS_LOGIC.md` if alignment rules change
- **Update:** This file (`PROJECT_INSTRUCTIONS.md`) for any workflow changes

---

## Contact & Support

**Project Owner:** TK Trading Fundamentals  
**Repository:** https://github.com/andastracapital/weekly-bias-dashboard  
**Dashboard URL:** https://tudordashboard.manus.space (after publishing)

For technical issues or questions, refer to the Manus support at https://help.manus.im
