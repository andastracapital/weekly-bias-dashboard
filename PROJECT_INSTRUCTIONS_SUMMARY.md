# TK Trading Fundamentals - Project Instructions Summary

**Last Updated:** February 18, 2026

This document summarizes the current state of the TK Trading Fundamentals Dashboard project and all critical workflows.

---

## Project Overview

**Dashboard Location:** `/home/ubuntu/tudor-dashboard` (Manus webdev project)  
**GitHub Repository:** `andastracapital/weekly-bias-dashboard`  
**Purpose:** Professional FX trading analysis tool displaying Weekly Bias and Daily Recap for 8 major currencies

**Currencies:** USD, EUR, GBP, JPY, AUD, CAD, CHF, NZD

---

## Update Workflows

### 1. Weekly Bias Update

**Frequency:** Weekly (typically Sunday evening or Monday morning)  
**Trigger:** User requests "Weekly Bias Update"

**Data Sources:**
- PMT Analyst Reports (Weekly Outlook)
- Forex Factory Calendar (upcoming week's high-impact events)
- Market analysis from financial news sources

**Update Process:**
1. Analyze market overview and key themes for the week
2. Update all 8 currency biases with strength qualifiers:
   - Format: "Weak Bearish", "Weak Bullish", "Strong Bearish", "Strong Bullish", "Neutral"
3. Write trader-focused rationales (2-4 sentences per currency)
4. List key drivers and events for each currency
5. **Extract Key Risk Events from Smart Bias texts** and add to events arrays
6. Update `weeklyBias.json` file
7. Verify Weekly View displays correctly
8. Commit to Git and push to GitHub

**Quality Checklist:**
- ✅ All 8 currencies updated with bias + strength qualifier
- ✅ Market overview reflects current global themes
- ✅ Key events listed with impact levels (Critical/High/Medium)
- ✅ **Key Risk Events from Smart Bias texts added to events arrays**
- ✅ Rationales are trader-focused and actionable

---

### 2. Daily Recap Update

**Frequency:** Daily (Monday-Friday)  
**Time:** 07:00 Frankfurt Time  
**Trigger:** User requests "Daily Recap Update"

**Data Sources (Day-Specific):**

**MONDAY:**
1. **PMT Analyst Reports** (https://access.primemarket-terminal.com/prime-dashboard?template=analyst-reports)
   - London Opening Preparation (latest)
   - Asia Opening Preparation (latest)
   - Open reports with double-click
   - User assistance may be needed to open reports

2. **PMT Headlines** (https://access.primemarket-terminal.com/prime-dashboard?template=headlines)
   - Read and interpret last 24 hours headlines
   - **IMPORTANT:** Bullish for China = Bullish for AUD and NZD

3. **Forex Factory Calendar** (https://www.forexfactory.com/calendar?week=this)
   - Red Folder News (High impact only, exclude Medium/Low)
   - Current week events
   - Times must be in Frankfurt Time

**TUESDAY - FRIDAY:**
1. **PMT Market Wraps** (https://access.primemarket-terminal.com/prime-dashboard?template=headlines)
   - Use reports available from previous 24 hours:
     * PMT US Market Wrap
     * PMT European Market Wrap
     * PMT Daily Asia-Pac Opening News
     * PMT Daily European Opening News
   - **Most weight to the most recent articles**
   - Open reports with double-click or expand with + button
   - User assistance may be needed to open reports

2. **PMT Headlines** (https://access.primemarket-terminal.com/prime-dashboard?template=headlines)
   - Read and interpret last 24 hours headlines
   - **IMPORTANT:** Bullish for China = Bullish for AUD and NZD

3. **Forex Factory Calendar** (https://www.forexfactory.com/calendar?week=this)
   - Red Folder News (High impact only, exclude Medium/Low)
   - Current week events
   - Times must be in Frankfurt Time

**Update Process:**
1. **Scrape PMT Reports** (day-specific, see above)
   - Monday: Analyst Reports (London + Asia Opening Preparation)
   - Tuesday-Friday: Market Wraps (US, European, Asia-Pac, European Opening)
   - User assistance may be needed to open reports
2. **Scrape PMT Headlines** (last 24 hours)
   - Interpret China sentiment → AUD/NZD impact
3. **Scrape Forex Factory Calendar** for Red Folder events (High impact only)
4. Rebuild `dailyRecap.json` with:
   - Updated date and last update time
   - Risk environment (Risk-On Recovery / Risk-Off / Mixed)
   - Market focus headlines (3-5 key points from reports)
   - 8 currency biases (directional only: Bullish/Bearish/Neutral/Mixed - NO strength qualifiers)
   - Currency summaries (trader-focused, 1-3 day horizon, isolated currency view)
   - Currency drivers (3-5 key points)
   - Red Folder events for the entire week (all days with "day" field: MON/TUE/WED/THU/FRI)
   - **Bond Market Bias** (4 major bonds with bias, yield, summary, drivers)
5. Verify High Conviction Setups alignment (mandatory check)
6. Test dashboard (Weekly View + Daily View)
7. Commit to Git and push to GitHub

**Quality Checklist:**
- ✅ All 8 currencies updated (USD, EUR, GBP, JPY, AUD, CAD, CHF, NZD)
- ✅ Currency biases are directional only (no "Weak"/"Strong")
- ✅ High Conviction Setups use correct FX pair notation
- ✅ **High Conviction Setups show ALL aligned pairs (no limit)**
- ✅ **High Conviction Setups use 2-line fundamental reasoning (NO Line 3)**
- ✅ Intraday Trades deduplicated (no overlap with High Conviction)
- ✅ Red Folder News filtered to today only (in UI display)
- ✅ **Red Folder News has "day" field for all events**
- ✅ **Bond Market Bias section populated (4 bonds)**
- ✅ Risk Environment accurate
- ✅ Dev server error-free

---

## Critical Rules & Conventions

### 1. FX Pair Conventions (MANDATORY)

**All currency pairs MUST follow conventional FX market notation.**

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
- Currency with **higher priority** becomes **base currency**
- Currency with **lower priority** becomes **quote currency**
- Direction adjusts automatically based on conventional notation

**Examples:**
- ✅ **GBP/AUD SHORT** (Bearish GBP vs Bullish AUD)
- ✅ **AUD/JPY LONG** (Bullish AUD vs Bearish JPY)
- ✅ **GBP/NZD SHORT** (Bearish GBP vs Bullish NZD)
- ❌ **AUD/GBP LONG** (WRONG - violates priority order)

**This convention applies to:**
- High Conviction Setups
- Intraday Trades (Base Hits)
- Any currency pair display in the dashboard

---

### 2. High Conviction Setups Logic

**Alignment Requirements:**
- **MUST** check Weekly Bias vs Daily Bias alignment for all currencies
- **Directional match ONLY** - ignore strength qualifiers (Weak/Strong)
- **Exclude Neutral/Mixed** - only Bullish or Bearish alignment counts

**Matching Logic:**
```
Weekly Bias: "Weak Bearish" + Daily Bias: "Bearish" = ✅ ALIGNED (both bearish)
Weekly Bias: "Strong Bullish" + Daily Bias: "Bullish" = ✅ ALIGNED (both bullish)
Weekly Bias: "Weak Bearish" + Daily Bias: "Neutral" = ❌ NOT ALIGNED
```

**Pair Generation:**
1. Identify all Bullish Aligned currencies (Weekly + Daily both bullish)
2. Identify all Bearish Aligned currencies (Weekly + Daily both bearish)
3. Pair Bullish vs Bearish currencies
4. Apply FX pair conventions (see Section 1)
5. **Display ALL aligned setups (no limit to 3)**

**NO FALLBACK** - Only show setups with true Weekly-Daily directional alignment.

**Mandatory Update:** High Conviction Setups MUST be recalculated with every Daily Recap Update.

**Reasoning Format (2 Lines):**
- **Line 1:** Base Currency - 2 key drivers (narrative + Key Event if available)
- **Line 2:** Quote Currency - 2 key drivers (narrative + Key Event if available)
- **NO Line 3** (removed for brevity)

**Reasoning Text Rules:**
- **Remove:** GDP numbers, "from X to Y", "vs exp" phrases
- **Keep:** Percentages (e.g., "60%", "at 60%"), Key Events (e.g., "Tuesday: Job Report")
- **Focus:** Narrative/Fundamentals + possible Key Events

**Examples:**
- ✅ "BoJ March hike odds at 60%" (keeps percentage)
- ✅ "Weak GDP weighs on sentiment, Tuesday: Job Report" (adds Key Event)
- ❌ "Weak GDP (0.7% vs exp 1.1%)" (remove GDP numbers)

---

### 3. Intraday Trades (Base Hits) Deduplication

**CRITICAL RULE:** Pairs that appear in High Conviction Setups **MUST NOT** appear in Intraday Trades.

**Logic:**
1. Generate all Bullish vs Bearish pairs from Daily Bias only
2. Apply FX pair conventions
3. **Filter out** pairs that match High Conviction Setups
4. Display remaining pairs (up to 6)

**Example:**
- High Conviction: GBP/AUD SHORT, AUD/JPY LONG, GBP/NZD SHORT
- Intraday Trades: NZD/JPY LONG (only unique pairs shown)

---

### 4. Red Folder News Filter

**Data Source:** Forex Factory Calendar (https://www.forexfactory.com/calendar?week=this)

**Filter Criteria:**
- **Impact:** High only (red folder) - exclude Medium/Low
- **Time Format:** Frankfurt Time (mandatory)
- **Scope:** Current week (Monday-Sunday)

**Display Rule in Dashboard:** Show **ONLY** events happening **TODAY** (exact day match).

**Behavior:**
- Monday: Show only MON events
- Tuesday: Show only TUE events
- No events today: Display "No high impact events remaining today"

**DO NOT show:**
- Past events from earlier in the week
- Future events from later in the week

**Data Storage:** `dailyRecap.json` contains all week's events with "day" field (MON/TUE/WED/THU/FRI), but UI filters to today only.

---

### 5. Bond Market Bias

**MANDATORY:** Bond Market Bias section MUST be included in every Daily Recap Update.

**4 Major Bonds:**
1. **US 10Y Treasury** - Fed policy, USD positioning, US data
2. **German 10Y Bund** - ECB policy, EUR sentiment, German data
3. **Japan 10Y JGB** - BoJ policy, JPY carry trade, Japan data
4. **UK 10Y Gilt** - BoE policy, GBP sentiment, UK data

**For Each Bond:**
- **Bias:** Bullish (yields falling, bond prices rising) | Bearish (yields rising, bond prices falling) | Neutral
- **Yield:** "Yields rising" | "Yields falling" | "Yields steady" | "Range-bound"
- **Summary:** 2-3 sentence summary (focus on yield direction, central bank policy, upcoming data)
- **Drivers:** 3 key factors (e.g., "Fed pause pricing", "ECB pushback on cuts", "BoJ hike odds at 60%")

**Extract from PMT Reports:**
- Yield movements ("UST yields soften", "Bunds range-bound", "JGB yields fall")
- Central bank commentary (Fed speakers, ECB/BoE minutes, BoJ policy expectations)
- Risk sentiment impact on bonds (risk-off = bullish bonds, risk-on = bearish bonds)

---

## Data Structure

### weeklyBias.json
```json
{
  "week": "Feb 16 - Feb 22, 2026",
  "marketOverview": "Global markets navigating...",
  "currencies": [
    {
      "name": "USD",
      "bias": "Weak Bullish",
      "rationale": "2-4 sentence trader-focused analysis...",
      "drivers": ["Driver 1", "Driver 2", "Driver 3"],
      "events": [
        { "day": "Tuesday", "event": "CB Consumer Confidence", "impact": "High" }
      ]
    }
  ]
}
```

### dailyRecap.json
```json
{
  "date": "Wednesday, February 18, 2026",
  "lastUpdate": "07:00 Frankfurt Time",
  "riskEnvironment": "Mixed",
  "marketFocus": [
    "UK CPI in line at 3.0% y/y, BoE April cut pricing remains on table",
    "RBNZ holds OCR at 2.25%, signals possible Q4 hike but not fully priced"
  ],
  "currencies": {
    "USD": {
      "name": "USD",
      "bias": "Neutral",
      "summary": "1-3 sentence trader-focused rationale...",
      "drivers": ["Driver 1", "Driver 2", "Driver 3"]
    }
  },
  "redFolderNews": [
    {
      "day": "WED",
      "time": "08:00",
      "event": "GBP CPI y/y",
      "impact": "High",
      "currency": "GBP"
    }
  ],
  "bonds": [
    {
      "name": "US 10Y Treasury",
      "bias": "Neutral",
      "yield": "Yields steady",
      "summary": "2-3 sentence summary of bond market sentiment...",
      "drivers": ["Driver 1", "Driver 2", "Driver 3"]
    }
  ]
}
```

---

## PMT Smart Bias URLs

**Individual Currency Smart Bias Text Pages:**
1. **USD:** https://access.primemarket-terminal.com/prime-dashboard?template=smart-bias-text-usd
2. **EUR:** https://access.primemarket-terminal.com/prime-dashboard?template=smart-bias-text-eur
3. **GBP:** https://access.primemarket-terminal.com/prime-dashboard?template=smart-bias-text-gbp
4. **JPY:** https://access.primemarket-terminal.com/prime-dashboard?template=smart-bias-text-jpy
5. **AUD:** https://access.primemarket-terminal.com/prime-dashboard?template=smart-bias-text-aud
6. **CAD:** https://access.primemarket-terminal.com/prime-dashboard?template=smart-bias-text-cad
7. **CHF:** https://access.primemarket-terminal.com/prime-dashboard?template=smart-bias-text-chf
8. **NZD:** https://access.primemarket-terminal.com/prime-dashboard?template=smart-bias-text-nzd

**Extract "Key Risk Events for the Week Ahead" from each Smart Bias text and add to weeklyBias.json events arrays.**

---

## Skills

### daily-recap-update
**Location:** `/home/ubuntu/skills/daily-recap-update/SKILL.md`  
**Status:** ✅ Complete and up-to-date  
**Last Updated:** February 18, 2026

**Includes:**
- Day-specific data sources (Monday: Analyst Reports, Tue-Fri: Market Wraps)
- Bond Market Bias extraction (Step 6)
- Swing Setups 2-line reasoning format
- Reasoning text rules (remove GDP numbers, keep percentages, add Key Events)
- ALL aligned pairs display (no limit)
- FX Pair Conventions
- China-AUD/NZD Correlation
- Quality Checklist with all requirements

---

## Common Issues & Solutions

### Swing Setups not showing all pairs
- Verify ALL aligned pairs are generated (no .slice(0, 3) limit)
- Verify Weekly-Daily directional alignment exists
- Check strength qualifiers are ignored
- Verify fundamental reasoning extracts from currency drivers
- Verify FX pair conventions applied

### Red Folder News showing wrong days
- Verify UI filter shows only today's events
- Confirm `dailyRecap.json` has all week's events with correct day codes (MON/TUE/WED/THU/FRI)
- Verify "day" field exists for all events

### Bond Market Bias missing or incomplete
- Verify bonds array exists in dailyRecap.json
- Verify each bond has: name, bias, yield, summary, drivers
- Verify summary field (not rationale) is used in JSON
- Extract from PMT Reports (yield movements, central bank commentary, risk sentiment)

### TypeScript errors
- Check field names match between JSON and code (e.g., marketFocus vs focus, summary vs rationale)
- Verify all required fields exist in JSON structure
- Restart dev server after JSON structure changes

---

## Next Steps & Future Enhancements

1. **Intraday Trades Population** - Füge Daily-only Paare hinzu (NZD/JPY LONG, AUD/JPY LONG) die nicht in Swing Setups erscheinen
2. **Swing Setup Conviction Score** - Füge 0-100 Score Badge hinzu basierend auf Event-Proximity, Driver-Stärke, Volatilität
3. **Event Outcome Tracking** - Implementiere "Actual vs Forecast" Display für vergangene Events mit Impact-Analyse
4. **Bond Yield Levels** - Ergänze aktuelle Yield-Levels (z.B. "4.25%") statt nur "Yields softening"
5. **Historical Performance Tracker** - Speichere vergangene Setups mit Entry-Zeitpunkt, zeige Win-Rate nach 1/3/5 Tagen
6. **Quick Copy Button** - Füge "Copy Setup" Icon hinzu zum schnellen Teilen von Setup + Reasoning via Clipboard

---

**Document Version:** 1.0  
**Last Verified:** February 18, 2026  
**Status:** All workflows operational, all skills up-to-date
