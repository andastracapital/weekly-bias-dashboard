---
name: daily-recap-update
description: Daily FX market recap update workflow for trading dashboards. Use when user requests "Daily Recap Update" or similar daily market analysis updates. Scrapes PMT Analyst Reports and Forex Factory Calendar, rebuilds dailyRecap.json with fresh market data, currency biases, and Red Folder news.
---

# Daily Recap Update Skill

Automates the daily FX market recap update workflow by scraping PMT Reports (day-specific), PMT Headlines, and Forex Factory Calendar to rebuild the dailyRecap.json file with fresh market analysis.

## When to Use

- User explicitly requests "Daily Recap Update"
- Scheduled task triggers daily market recap (typically 07:00 Frankfurt time, Monday-Friday)
- User asks to "update daily bias" or "refresh market recap"

## Data Sources (Day-Specific)

### MONDAY

#### 1. PMT Analyst Reports (Primary Source)
**URL:** https://access.primemarket-terminal.com/prime-dashboard?template=analyst-reports

**Target Reports:**
1. **London Opening Preparation** (latest)
2. **Asia Opening Preparation** (latest)

**Scraping Method:**
- Navigate to Analyst Reports dashboard
- Login if needed (credentials pre-filled)
- Locate reports by title
- **Open with double-click** (user assistance may be needed)
- Read full content (300-1500 words per report)
- Extract via screenshot if markdown extraction incomplete
- Save to temp files:
  - `/home/ubuntu/pmt_london_opening_prep_MMDD_full.txt`
  - `/home/ubuntu/pmt_asia_opening_prep_MMDD_full.txt`

#### 2. PMT Headlines (Secondary Source)
**URL:** https://access.primemarket-terminal.com/prime-dashboard?template=headlines

**Goal:** Read and interpret last 24 hours headlines

**IMPORTANT RULE:** Bullish for China = Bullish for AUD and NZD

**Scraping Method:**
- Scroll through "Realtime News Ticker" list
- Read titles/snippets of last 24 hours
- Focus on market-moving events
- Interpret China sentiment → AUD/NZD impact
- Save 5-10 key headlines to: `/home/ubuntu/pmt_headlines_context_MMDD.txt`

#### 3. Forex Factory Calendar
**URL:** https://www.forexfactory.com/calendar?week=this

**Target:** Red Folder News (High Impact only, exclude Medium/Low)
**Time:** Current week events in Frankfurt Time

---

### TUESDAY - FRIDAY

#### 1. PMT Market Wraps (Primary Source)
**URL:** https://access.primemarket-terminal.com/prime-dashboard?template=headlines

**Target Reports (from previous 24 hours):**
1. **PMT US Market Wrap**
2. **PMT European Market Wrap**
3. **PMT Daily Asia-Pac Opening News**
4. **PMT Daily European Opening News**

**CRITICAL:** Most weight to the most recent articles

**Scraping Method:**
- Navigate to Headlines dashboard
- Locate reports from previous 24 hours
- **Open with double-click or expand with + button** (user assistance may be needed)
- Read full content
- Extract via screenshot if needed
- Save to temp files:
  - `/home/ubuntu/pmt_us_wrap_MMDD_full.txt`
  - `/home/ubuntu/pmt_european_wrap_MMDD_full.txt`
  - `/home/ubuntu/pmt_asia_pac_opening_MMDD_full.txt`
  - `/home/ubuntu/pmt_european_opening_MMDD_full.txt`

#### 2. PMT Headlines (Secondary Source)
**URL:** https://access.primemarket-terminal.com/prime-dashboard?template=headlines

**Goal:** Read and interpret last 24 hours headlines

**IMPORTANT RULE:** Bullish for China = Bullish for AUD and NZD

**Scraping Method:**
- Same as Monday (see above)

#### 3. Forex Factory Calendar
**URL:** https://www.forexfactory.com/calendar?week=this

**Target:** Red Folder News (High Impact only, exclude Medium/Low)
**Time:** Current week events in Frankfurt Time

---

## Output Structure

Update `/home/ubuntu/tudor-dashboard/client/src/data/dailyRecap.json` with this structure:

```json
{
  "date": "Monday, February 9, 2026",
  "lastUpdate": "07:00 Frankfurt Time",
  "riskEnvironment": "Risk-On Recovery | Risk-Off | Mixed",
  "marketFocus": [
    "Headline 1 from PMT Reports",
    "Headline 2 from PMT Reports",
    "Headline 3 from PMT Reports"
  ],
  "currencies": {
    "USD": {
      "bias": "Bullish | Bearish | Neutral | Mixed",
      "tone": "Hawkish Premium | Dovish Fade | Range-Bound | Event-Driven",
      "summary": "1-3 sentence trader-focused rationale (isolated currency view, 1-3d horizon)",
      "drivers": ["Driver 1", "Driver 2", "Driver 3"],
      "reaction": "Market reaction to key events (optional)",
      "headlines": ["Headline 1", "Headline 2"]
    }
  },
  "redFolderNews": [
    {
      "day": "TUE",
      "time": "14:00",
      "event": "US Retail Sales",
      "impact": "High",
      "currency": "USD"
    }
  ]
}
```

## Critical Rules & Conventions

### 1. FX Pair Conventions (MANDATORY)

**Base Currency Priority Order (Highest to Lowest):**
EUR(1) > GBP(2) > AUD(3) > NZD(4) > USD(5) > CAD(6) > CHF(7) > JPY(8)

**Examples:**
- ✅ **GBP/AUD SHORT** (Bearish GBP vs Bullish AUD)
- ✅ **AUD/JPY LONG** (Bullish AUD vs Bearish JPY)
- ❌ **AUD/GBP LONG** (WRONG - violates priority order)

**⚠️ SWING WATCHLIST DUPLICATE PREVENTION (CRITICAL):**
Each currency cross must appear EXACTLY ONCE in the swing watchlist. Since the priority rule determines the base/quote, the same cross can NEVER appear as both a LONG and a SHORT.
- ❌ **GBP/EUR LONG** + **EUR/GBP SHORT** = DUPLICATE (same cross, two entries)
- ✅ **EUR/GBP SHORT** only (EUR has higher priority than GBP → EUR is always base)
- Rule: Apply priority order first → if EUR is base, the pair is always EUR/GBP — never GBP/EUR
- After building the watchlist, scan for duplicates: if pair A/B and B/A both appear, remove the one that violates the priority order

### 2. High Conviction Setups Logic

**MANDATORY:** Recalculate with every Daily Recap Update.

**Matching Logic:**
```
Weekly: "Weak Bearish" + Daily: "Bearish" = ✅ ALIGNED (both bearish)
Weekly: "Strong Bullish" + Daily: "Bullish" = ✅ ALIGNED (both bullish)
Weekly: "Weak Bearish" + Daily: "Neutral" = ❌ NOT ALIGNED
```

### 3. Intraday Trades — Pairing Rule (MANDATORY)

**CRITICAL RULE: Intraday Trades MUST ALWAYS be Bullish vs Bearish pairs ONLY.**

- ✅ **VALID:** Bullish currency vs Bearish currency
- ❌ **INVALID:** Bearish vs Bearish (same direction — not a trade)
- ❌ **INVALID:** Bullish vs Bullish (same direction — not a trade)
- ❌ **INVALID:** Neutral vs anything (no directional conviction)

**When there are no Bullish currencies:** `intradayTrades` MUST be an empty array `[]`. Do NOT invent pairs by pairing Bearish vs Bearish or Neutral currencies.

**When there are no Bearish currencies:** Same rule — `intradayTrades` MUST be empty `[]`.

**Deduplication:** Pairs already in High Conviction Setups MUST NOT appear in Intraday Trades.

### 4. Red Folder News Filter

**Display Rule:** Dashboard UI shows ONLY events happening TODAY (exact day match).

**Data Storage:** `dailyRecap.json` contains all week's events, but UI filters to today only.

### 5. China-AUD/NZD Correlation

**MANDATORY RULE:** When interpreting PMT Headlines:
- Bullish for China = Bullish for AUD and NZD
- Bearish for China = Bearish for AUD and NZD

## Currency Bias Guidelines

**Trader-Focused Rationales (1-3 Day Horizon):**
- **Isolated currency view**: Analyze currency strength/weakness independently, not relative to USD
- **Concise style**: 1-3 sentences max, focus on actionable drivers
- **Cover**: Central bank policy, economic data, geopolitics, risk sentiment
- **Tone field**: 2-4 word sentiment summary (e.g., "Hawkish Premium", "Dovish Fade")

**Bias Format:**
- **Daily Bias:** Directional only (Bullish/Bearish/Neutral/Mixed) - NO strength qualifiers
- **Weekly Bias:** Includes strength qualifiers (Weak Bullish, Strong Bearish, etc.)

**Good Summary Example:**
> "USD supported by hawkish Fed Chair Warsh nomination, criticizes forward guidance. ISM Manufacturing expansion (52.6 vs exp. 48.5) adds to hawkish narrative. DXY rangebound 97.08."

**Bad Summary Example:**
> "USD/JPY bullish, target 150.00" ❌ (pair-focused, not isolated currency view)

## Red Folder News Formatting

**Include only:**
- Impact: High (red icons only)
- Time: All week's events (Monday-Sunday)
- Time format: Frankfurt Time (GMT+1) in HH:MM format

**Format:**
```json
{
  "day": "TUE",
  "time": "14:00",
  "event": "US Retail Sales",
  "impact": "High",
  "currency": "USD"
}
```

## Workflow Steps

**0. Check project availability**:
- Check if project directory exists (`/home/ubuntu/tudor-dashboard/`)
- If NO: Clone from GitHub (`gh repo clone andastracapital/weekly-bias-dashboard tudor-dashboard`)
- If YES: Skip to step 1

**1. Update todo.md**: Add unchecked task "Daily Recap Update (MMM D, YYYY): Scrape PMT Reports, Forex Factory Calendar, rebuild dailyRecap.json"

**2. Scrape PMT Reports (day-specific)**:
- **Monday:** Navigate to Analyst Reports, open London Opening Preparation + Asia Opening Preparation
- **Tuesday-Friday:** Navigate to Headlines, open 4 Market Wraps (US, European, Asia-Pac Opening, European Opening)
- User assistance may be needed to open reports
- Extract full content (use screenshot if needed)
- Save to temp files

**3. Scrape PMT Headlines**:
- Navigate to https://access.primemarket-terminal.com/prime-dashboard?template=headlines
- Scroll through Realtime News Ticker (last 24h)
- Read headlines (do NOT open articles)
- **Interpret China sentiment → AUD/NZD impact**
- Save 5-10 key headlines to temp file

**4. Scrape Forex Factory Calendar**:
- Navigate to https://www.forexfactory.com/calendar?week=this
- Identify events with red icons only (exclude yellow/orange)
- Convert times to Frankfurt Time (GMT+1) — use `forex-factory-timezone-correction` skill
- Save all week's events to temp file

**5. Rebuild dailyRecap.json**:
- Read current structure from project data directory
- Update all fields with fresh data from:
  - PMT Reports (primary source, most weight to recent articles)
  - PMT Headlines (secondary source, interpret China → AUD/NZD)
  - Forex Factory Red Folder News (all week's events)
- Write new JSON (full file replacement)
- **IMPORTANT:** Currency biases must be directional only (no strength qualifiers)

**6. Verify High Conviction Setups alignment**:
- Check Weekly-Daily directional alignment for all currencies
- Ignore strength qualifiers (Weak/Strong)
- Verify FX pair conventions applied correctly
- Verify Intraday Trades deduplicated

**7. Test dashboard**:
- Check Weekly View displays correctly
- Check Daily View displays correctly
- Verify Red Folder News shows only today's events in UI
- Verify High Conviction Setups use correct FX pair notation

**8. Write to History database** ⚠️ MANDATORY — NEVER SKIP:
After rebuilding `dailyRecap.json`, call the tRPC endpoint to persist today's entry:

> **SWING WATCHLIST RULE:** The `swingWatchlist` comes from `weeklyBias.json` → `swingWatchlist` and is the SAME every day of the week (Monday through Friday). It is set by the Weekly Bias Update and does NOT change during the week. Always read it fresh from `weeklyBias.json` — do NOT leave it empty.

```
POST http://localhost:3000/api/trpc/history.upsert
Body: {
  "date": "YYYY-MM-DD",  // ISO date of today
  "weekRange": "Mar 9 - Mar 15, 2026",  // from weeklyBias.json week field
  "swingWatchlist": [...],  // ⚠️ MANDATORY: ALL pairs from weeklyBias.json → swingWatchlist (both LONG and SHORT) — same every day Mon-Fri
  "swingSetups": [...],    // ALL computed High Conviction Setups (Weekly+Daily aligned) — store ALL pairs, NOT just Top 3
  "intradayTrades": [...]  // computed Intraday Trades (Daily only, deduplicated)
}
```

**Alternatively via curl:**
```bash
curl -X POST http://localhost:3000/api/trpc/history.upsert \
  -H "Content-Type: application/json" \
  -d '{"json":{"date":"YYYY-MM-DD","weekRange":"...","swingWatchlist":[...],"swingSetups":[...],"intradayTrades":[...]}}'
```

**Data to extract from dailyRecap.json + weeklyBias.json:**
- `date`: Today's ISO date (e.g., "2026-03-05")
- `weekRange`: `weeklyBias.json` → `week` field
- `swingWatchlist`: All pairs from `weeklyBias.json` → `swingWatchlist` (both LONG and SHORT)
- `swingSetups`: ALL Computed High Conviction Setups (Weekly+Daily directional alignment) — store EVERY aligned pair (e.g. 3 bullish × 4 bearish = 12 pairs → store all 12, not just top 3)
- `intradayTrades`: Computed Intraday Trades (Daily only, after deduplication)

**9. Commit and checkpoint**:
- Mark todo.md task as [x] completed
- Commit to Git: `git add -A && git commit -m "Daily Recap Update - [Date]" && git push origin main`
- Save checkpoint if using Manus webdev project

## Common Issues

**Reports won't open:**
- Ask user to take over browser and open reports manually
- User can double-click or use + button to expand reports

**Missing Market Wraps (Tuesday-Friday):**
- Check if reports exist from previous 24 hours
- Use most recent available reports
- Document missing reports in dailyRecap.json

**High Conviction Setups not showing:**
- Verify Weekly-Daily directional alignment exists
- Check strength qualifiers are ignored
- Verify FX pair conventions applied

**Red Folder News showing wrong days:**
- Verify UI filter shows only today's events
- Confirm `dailyRecap.json` has all week's events with correct day codes

## Quality Checklist

Before committing, verify:
- [ ] Day-specific PMT Reports scraped (Monday: 2 reports, Tue-Fri: 4 reports)
- [ ] PMT Headlines interpreted (China → AUD/NZD correlation applied)
- [ ] Red Folder News filtered (red icons only, Frankfurt Time, all week's events)
- [ ] All 8 currencies updated (USD, EUR, GBP, JPY, AUD, CAD, CHF, NZD)
- [ ] Currency biases are directional only (no Weak/Strong)
- [ ] Trader-focused rationales (1-3d horizon, isolated currency view)
- [ ] Risk Environment accurate (Risk-On/Risk-Off/Mixed)
- [ ] High Conviction Setups use correct FX pair notation
- [ ] Intraday Trades: ONLY Bullish vs Bearish pairs — if no valid pairs exist, array is empty []
- [ ] Intraday Trades deduplicated (no overlap with High Conviction)
- [ ] Dashboard UI shows only today's Red Folder events
- [ ] Dev server error-free (if using webdev project)
- [ ] todo.md task marked [x]
- [ ] History entry written to database (date, weekRange, swingWatchlist, swingSetups, intradayTrades)
  - swingWatchlist: read from weeklyBias.json → swingWatchlist (MANDATORY, same every day Mon-Fri, NEVER empty)
- [ ] Committed to Git and pushed to GitHub

## Key Reminders

1. **Day-Specific Sources:** Monday uses Analyst Reports, Tuesday-Friday use Market Wraps
2. **China Correlation:** Bullish for China = Bullish for AUD and NZD
3. **FX Pairs:** Always use conventional notation (EUR > GBP > AUD > NZD > USD > CAD > CHF > JPY)
4. **High Conviction:** Directional alignment only, ignore strength qualifiers
5. **Intraday Trades Pairing:** ONLY Bullish vs Bearish pairs are valid. If no Bullish or no Bearish currencies exist, `intradayTrades` = `[]`. NEVER pair Bearish vs Bearish or Bullish vs Bullish.
6. **Deduplication:** No overlap between High Conviction and Intraday Trades
7. **Red Folder:** UI shows today only, JSON contains all week
8. **Daily Bias:** Directional only (Bullish/Bearish/Neutral/Mixed - NO Weak/Strong)
9. **Most Recent:** Give most weight to the most recent PMT articles
10. **⚠️ Swing Watchlist (MANDATORY):** Always read from `weeklyBias.json` → `swingWatchlist`. It is set once per week (Weekly Bias Update) and stays the SAME every day Mon-Fri. NEVER write a history entry with an empty swingWatchlist.
11. **⚠️ Time Check (MANDATORY):** After writing dailyRecap.json, run `grep -n ":[0-9][0-9]:" dailyRecap.json` to verify all time references in free-text fields match the structured redFolderNews times. US DST active Mar-Nov: ET+5h = Frankfurt time.
