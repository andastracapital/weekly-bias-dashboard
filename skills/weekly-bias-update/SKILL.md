---
name: weekly-bias-update
description: Weekly FX market bias update workflow for TK Trading Dashboard. Use when user requests "Weekly Bias Update" or similar weekly market analysis updates. Scrapes PMT Weekly Smart Bias Reports and Forex Factory Calendar, rebuilds weeklyBias.json with fresh market data, currency biases, and key events.
---

# Weekly Bias Update

Update the TK Trading Dashboard with weekly FX market biases for 8 major currencies (USD, EUR, GBP, JPY, AUD, CAD, CHF, NZD) using PMT Weekly Smart Bias Reports and Forex Factory Calendar.

## When to Execute

- **Frequency:** Weekly (typically Sunday evening or Monday morning)
- **Trigger:** User requests "Weekly Bias Update"
- **Output:** Updated `weeklyBias.json` file in `/home/ubuntu/tudor-dashboard/client/src/data/`

## Data Sources

### PMT Weekly Smart Bias Reports

Access these URLs for each currency:

- **USD:** https://access.primemarket-terminal.com/prime-dashboard?template=smart-bias-text-usd
- **EUR:** https://access.primemarket-terminal.com/prime-dashboard?template=smart-bias-text-eur
- **GBP:** https://access.primemarket-terminal.com/prime-dashboard?template=smart-bias-text-gbp
- **JPY:** https://access.primemarket-terminal.com/prime-dashboard?template=smart-bias-text-jpy
- **AUD:** https://access.primemarket-terminal.com/prime-dashboard?template=smart-bias-text-aud
- **CAD:** https://access.primemarket-terminal.com/prime-dashboard?template=smart-bias-text-cad
- **CHF:** https://access.primemarket-terminal.com/prime-dashboard?template=smart-bias-text-chf
- **NZD:** https://access.primemarket-terminal.com/prime-dashboard?template=smart-bias-text-nzd

**Note:** PMT requires login. User may need to assist with authentication.

### Forex Factory Calendar

- **URL:** https://www.forexfactory.com/calendar?week=this
- **Filter:** High impact events only (red folder)
- **Time Format:** Frankfurt Time (mandatory)
- **Scope:** Current week (Monday-Sunday)

## Workflow Steps

### 1. Collect Data from PMT Smart Bias Reports

For each currency, extract:

- **Bias + Strength Qualifier** (e.g., "Weak Bearish", "Strong Bullish", "Neutral")
- **Key Drivers** (3-5 bullet points)
- **Key Events** (with day and impact level)

**Tip:** If user provides manual input instead of PMT access, accept it directly.

### 2. Scrape Forex Factory Calendar

Extract high-impact events (red folder only) for the current week:

- Event name
- Currency
- Day (MON/TUE/WED/THU/FRI)
- Time (Frankfurt Time)
- Impact level (High/Critical)

### 3. Write Currency Summaries

**CRITICAL:** Summaries must be **concise, professional, and trader-focused** (2-3 sentences).

**Style Guidelines:**

- ✅ **DO:** Start with direct, varied opening sentences
- ✅ **DO:** Use specific data points and technical levels
- ✅ **DO:** Keep language punchy and actionable
- ❌ **DON'T:** Use repetitive patterns like "The dominant driver remains/has shifted..."
- ❌ **DON'T:** Write long-winded explanations
- ❌ **DON'T:** Use bullet points in summaries

**Good Examples:**

```
USD supported by warsh Fed Chair nomination (hawkish, criticizes forward guidance), ISM Manufacturing expansion (52.9, vs exp 50.3), and Michigan Sentiment rebound (77.4). Strong US data, including hotter Core PCE print at 3.0% YoY, combined with Fed Miran's hawkish pivot from 150bps to 100bps of expected cuts have firmed US front end yields.

EUR under pressure from disinflation (Eurozone 1.7%, Core 2.2% below target) and dovish ECB signal despite Rate Hold at 2%. German Manufacturing PMI surged to 50.7 (first expansion in 3.5 years), but EUR could not sustain gains as higher US two year yields and more hawkish Fed tone reasserted dollar support.

CHF as fear gauge: Mid-week safe-haven bid (Tech sell-off, Iran-up geopolitical tensions) quickly faded as Friday risk-on rally (Dow 50k) drove capital rotation. Negative rates only as high-bar tool. Carry disadvantage dominates when risk sentiment stable.
```

**Bad Example (too repetitive):**

```
The dominant driver remains the relative rates channel and safe haven demand tied to geopolitical risk. The dominant driver has shifted back toward a firmer US rates impulse and renewed external risk rather than a stabilized ECB front end.
```

### 4. Update weeklyBias.json

File location: `/home/ubuntu/tudor-dashboard/client/src/data/weeklyBias.json`

**Structure:**

```json
{
  "week": "Mar 2 - Mar 8, 2026",
  "marketOverview": "Global markets navigating complex landscape...",
  "currencies": [
    {
      "code": "USD",
      "name": "US Dollar",
      "bias": "Weak Bullish",
      "rationale": "USD supported by warsh Fed Chair nomination...",
      "drivers": [
        "Warsh Fed Chair Nomination (Hawkish)",
        "ISM Manufacturing PMI 52.9 (vs exp 50.3)",
        "Michigan Sentiment rebound (77.4)"
      ],
      "events": [
        {
          "day": "MON",
          "event": "Manufacturing PMI",
          "impact": "High"
        }
      ]
    }
  ],
  "swingWatchlist": {
    "long": [{ "pair": "USD/JPY", "rationale": "..." }],
    "short": [{ "pair": "EUR/USD", "rationale": "..." }]
  }
}
```

**Field Names:**
- Use `rationale` (not `summary`) for the 2-3 sentence summary
- BiasCard component supports both `rationale` and `summary` for backward compatibility

**Bias Format (Weekly):** MUST include strength qualifier — "Weak Bullish", "Strong Bearish", "Neutral"

### 5. Update Swing Watchlist

The `swingWatchlist` is a curated list of pairs for the week (not auto-calculated):

- **LONG:** Pairs where base currency is Weekly Bullish vs quote currency Weekly Bearish
- **SHORT:** Pairs where base currency is Weekly Bearish vs quote currency Weekly Bullish
- Apply FX pair conventions: EUR(1) > GBP(2) > AUD(3) > NZD(4) > USD(5) > CAD(6) > CHF(7) > JPY(8)
- Typically 5-6 pairs per direction

### 6. Verify Dashboard Display

1. Open dashboard Weekly View
2. Click "WEEKLY VIEW" button
3. Verify all 8 currency cards show:
   - Correct bias + strength qualifier
   - 2-3 sentence summary (not bullet points)
   - Key drivers as tags
   - Key events with impact levels
4. Verify Swing Watchlist LONG/SHORT display correctly

### 7. Commit and Push to GitHub

```bash
cd /home/ubuntu/tudor-dashboard
git add client/src/data/weeklyBias.json
git commit -m "Weekly Bias Update: [Week Range]"
git push origin main
```

**Alternative:** Use `webdev_save_checkpoint` to commit automatically.

## FX Pair Conventions (MANDATORY)

**Base Currency Priority Order (Highest to Lowest):**
1. EUR - Euro
2. GBP - British Pound
3. AUD - Australian Dollar
4. NZD - New Zealand Dollar
5. USD - US Dollar
6. CAD - Canadian Dollar
7. CHF - Swiss Franc
8. JPY - Japanese Yen

**Examples:**
- ✅ **GBP/AUD SHORT** (Bearish GBP vs Bullish AUD)
- ✅ **AUD/JPY LONG** (Bullish AUD vs Bearish JPY)
- ✅ **GBP/NZD SHORT** (Bearish GBP vs Bullish NZD)
- ❌ **AUD/GBP LONG** (WRONG - violates priority order)

## Quality Checklist

Before completing the update, verify:

- ✅ All 8 currencies updated with bias + strength qualifier
- ✅ Summaries are 2-3 sentences (not bullet points)
- ✅ Summaries use varied, direct opening sentences (no "The dominant driver" pattern)
- ✅ Market overview reflects current global themes
- ✅ Key events listed with impact levels (Critical/High/Medium)
- ✅ Rationales are trader-focused and actionable
- ✅ Swing Watchlist LONG/SHORT updated with correct FX pair notation
- ✅ Dashboard Weekly View displays correctly
- ✅ Changes committed to Git

## Troubleshooting

### PMT Login Issues
- User may need to log in manually
- Use `ask` message type with `take_over_browser` suggestion
- Alternatively, accept manual input from user

### Dashboard Not Updating
- Check file path: `/home/ubuntu/tudor-dashboard/client/src/data/weeklyBias.json`
- Verify dev server is running: `webdev_check_status`
- Restart server if needed: `webdev_restart_server`

### Summaries Not Displaying
- BiasCard component expects `currency.summary` or `currency.rationale`
- Verify JSON field names match

## Related Workflows

- **Daily Recap Update:** Separate workflow for daily market updates (Monday: Analyst Reports, Tuesday-Friday: Market Wraps)
- **High Conviction Setups:** Calculated automatically from Weekly + Daily Bias alignment
