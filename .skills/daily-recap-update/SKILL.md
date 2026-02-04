---
name: daily-recap-update
description: Daily FX market recap update workflow for trading dashboards. Use when user requests "Daily Recap Update" or similar daily market analysis updates. Scrapes PMT (PrimeMarket Terminal) Headlines and Calendar dashboards, rebuilds dailyRecap.json with fresh market data, currency biases, and Red Folder news.
---

# Daily Recap Update Skill

Automates the daily FX market recap update workflow by scraping PMT data sources and rebuilding the dailyRecap.json file with fresh market analysis.

## When to Use

- User explicitly requests "Daily Recap Update"
- Scheduled task triggers daily market recap (typically 07:00 Frankfurt time, Monday-Friday)
- User asks to "update daily bias" or "refresh market recap"

## Data Sources

### PMT Headlines Dashboard
**URL:** https://access.primemarket-terminal.com/prime-dashboard?template=headlines

**Target Articles (expand with + button):**
1. PMT Daily European Opening News
2. PMT Daily Asia-Pac Opening News  
3. US FX WRAP

**Scraping Method:**
- Navigate to Headlines dashboard
- Click Login button (credentials pre-filled, click orange button)
- Locate articles by searching for titles containing "PMT Daily" or "US FX WRAP"
- Click the 📄 icon (role="button") next to each article to expand full content
- If + button expansion fails, retry once; if still fails, use Daily Dashboard (template=daily) with Realtime News Ticker as fallback

### PMT Calendar Dashboard
**URL:** https://access.primemarket-terminal.com/prime-dashboard?template=calendar

**Target Data:**
- Red Folder News (High/Critical Impact events only)
- Filter: Exclude Medium/Low impact events
- Time range: Current week (Sunday-Saturday)
- Future events only (exclude past events)

## Output Structure

Update `/home/ubuntu/weekly-bias-dashboard/client/src/data/dailyRecap.json` with this structure:

```json
{
  "date": "Wednesday, Feb 4",
  "marketFocus": {
    "riskEnvironment": "Risk-On | Risk-Off | Mixed",
    "focus": "3-5 word headline theme",
    "volatility": "Low | Moderate | Elevated | High",
    "headlines": [
      "4 key market-moving headlines from PMT wraps"
    ],
    "macroContext": "2-3 sentence macro summary from PMT wraps"
  },
  "tradingSummary": "2-3 sentence trading summary (DXY, FX pairs, metals, stocks, bonds, oil)",
  "redFolderNews": [
    {
      "time": "14:30",
      "currency": "USD",
      "event": "Nonfarm Payrolls",
      "impact": "Critical"
    }
  ],
  "currencies": {
    "USD": {
      "bias": "Bullish | Bearish | Neutral",
      "tone": "2-4 word sentiment (e.g., 'Warsh Premium Intact', 'Data-Dependent')",
      "summary": "Trader-focused rationale (1-3 day horizon, isolated currency view, not vs USD)",
      "drivers": ["4 key drivers"],
      "headlines": ["4 key headlines"],
      "events": [
        {"day": "Wed", "event": "Event name (time)", "impact": "High"}
      ]
    }
  }
}
```

## Currency Bias Guidelines

**Trader-Focused Rationales (1-3 Day Horizon):**
- **Isolated currency view**: Analyze currency strength/weakness independently, not relative to USD
- **Concise style**: 3-4 sentences max, focus on actionable drivers
- **Cover**: Narratives, fundamentals, yields/CB rhetoric, commodities, headlines
- **Tone field**: 2-4 word sentiment summary (e.g., "Hawkish Premium", "Data-Dependent", "Safe-Haven Bid Fades")

**Bias Interpretation:**
- Bullish = Currency strengthening (buying pressure)
- Bearish = Currency weakening (selling pressure)  
- Neutral = Rangebound, data-dependent, or mixed signals

**Base vs Quote Currency Rule:**
- USD/JPY rising = USD strong (Bullish USD), JPY weak (Bearish JPY)
- EUR/USD rising = EUR strong (Bullish EUR), USD weak (Bearish USD)

## Red Folder News Filtering

**Include only:**
- Impact: High or Critical
- Time: Future events only (exclude past events)
- Week: Current week (Sunday-Saturday)

**Format:**
- Today's events: Show time only (e.g., "14:30")
- Future events: Show day + time (e.g., "Thu 12:00" or "Fri 14:30")

## Workflow Steps

0. **Check project availability** (cross-task persistence):
   - Check if `/home/ubuntu/weekly-bias-dashboard/` exists
   - If **NO** (new task scenario):
     - Clone from GitHub: `gh repo clone user_github /home/ubuntu/weekly-bias-dashboard` (use `user_github` remote, not URL)
     - Wait for clone to complete
     - Verify project files exist
   - If **YES** (same task scenario): Skip to step 1

1. **Update todo.md**: Add unchecked task "Daily Recap Update: Scrape PMT Headlines + Calendar, rebuild dailyRecap.json"

2. **Scrape PMT Headlines**:
   - Navigate to https://access.primemarket-terminal.com/prime-dashboard?template=headlines
   - Click Login (orange button, credentials pre-filled)
   - Expand 3 target articles with + button (📄 icon)
   - Save content to temp files: `/home/ubuntu/pmt_european_wrap_MMDD.txt`, `/home/ubuntu/pmt_asiapac_wrap_MMDD.txt`, `/home/ubuntu/pmt_us_fx_wrap_MMDD.txt`

3. **Scrape PMT Calendar**:
   - Navigate to https://access.primemarket-terminal.com/prime-dashboard?template=calendar
   - Extract High/Critical Impact events for current week
   - Filter future events only
   - Save to temp file: `/home/ubuntu/pmt_red_folder_MMDD.txt`

4. **Rebuild dailyRecap.json**:
   - Read current structure from `/home/ubuntu/weekly-bias-dashboard/client/src/data/dailyRecap.json`
   - Update all fields with fresh PMT data
   - Write new JSON (full file replacement)

5. **Verify and checkpoint**:
   - Wait 3-5 seconds for dev server restart
   - Run `webdev_check_status` to verify no errors
   - Mark todo.md task as [x] completed
   - Run `webdev_save_checkpoint` with description: "Daily Recap Update (MMM D, YYYY): [key market themes]"

## Common Issues

**Project not found in new task:**
- Verify GitHub connection: `gh repo view` should show the repository
- If clone fails, check GitHub authentication: `gh auth status`
- Alternative: Use `gh repo clone <owner>/<repo> /home/ubuntu/weekly-bias-dashboard` with explicit repo name

**+ Button expansion fails:**
- Retry once with same article
- If still fails, switch to Daily Dashboard (template=daily) and use Realtime News Ticker
- Fallback: Use visible headlines + previously scraped wrap content

**JSX errors after JSON update:**
- Wait 5 seconds for dev server restart
- Run `webdev_check_status` to verify errors cleared
- If persists, check Home.tsx for structural issues (ternary conditionals, closing tags)

**Scheduler not running:**
- Verify cron expression: `0 0 6 * * 1-5` (06:00 UTC = 07:00 Frankfurt time)
- Check scheduler status with `schedule` tool
- Ensure `repeat: true` is set for recurring execution

## Quality Checklist

Before saving checkpoint, verify:
- [ ] All 8 currencies updated (USD, EUR, GBP, JPY, AUD, NZD, CAD, CHF)
- [ ] Red Folder News filtered (High/Critical only, future events only)
- [ ] Trader-focused rationales (1-3d horizon, isolated currency view)
- [ ] Tone field present for each currency (2-4 words)
- [ ] Risk Environment accurate (Risk-On/Risk-Off/Mixed)
- [ ] Dev server running without errors
- [ ] todo.md task marked as [x] completed
