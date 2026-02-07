# TK Trading Fundamentals - Project Instructions

This project contains the Weekly Bias Dashboard for FX trading analysis.

## Project Structure

- **Project Path:** `/home/ubuntu/weekly-bias-dashboard`
- **Project Skills:** `.skills/daily-recap-update/`
- **Data Files:** 
  - `client/src/data/weeklyBias.json` - Weekly currency biases
  - `client/src/data/dailyRecap.json` - Daily market recap

## Daily Recap Update Workflow

When user requests "Daily Recap Update":

1. **Load the skill:** Read `/home/ubuntu/weekly-bias-dashboard/.skills/daily-recap-update/SKILL.md` for complete workflow
2. **Scrape PMT Headlines Dashboard (Wrap-Reports):** 
   - Navigate to https://access.primemarket-terminal.com/prime-dashboard?template=headlines
   - Click **+ button** to expand 3 wrap-reports (PMT US Market Wrap, US FX WRAP, PMT European Market Wrap)
   - Extract full content (200-800 words each)
3. **Collect Headlines Context (Last 24h):**
   - Scroll through PMT Headlines Dashboard "Realtime News Ticker"
   - **DO NOT** click on any + buttons or article titles
   - Read only titles/snippets of last 24h headlines
   - Save 5-10 key headlines as context for Daily Bias picture
4. **Scrape Forex Factory Calendar:**
   - Navigate to https://www.forexfactory.com/calendar
   - Extract events with red icons only (High Impact)
   - Filter for future events only (exclude past)
5. **Rebuild dailyRecap.json:** 
   - Update `/home/ubuntu/weekly-bias-dashboard/client/src/data/dailyRecap.json`
   - Use wrap-reports as primary source
   - Use headlines context as secondary source for additional insights
   - Include Red Folder News (High Impact only)
6. **Verify and checkpoint:** Check dev server status, mark todo.md as completed, save checkpoint

## Key Guidelines

- **Currency Bias:** Trader-focused rationales (1-3 day horizon, isolated currency view, not vs USD)
- **Headlines Context:** Additional context for Daily Bias picture, NOT primary data source
- **Red Folder News:** High Impact only (red icons), future events only
- **Quality Check:** All 8 currencies updated, tone field present, risk environment accurate

## Data Sources

- **PMT Headlines Dashboard:** https://access.primemarket-terminal.com/prime-dashboard?template=headlines
  - Wrap-Reports: PMT US Market Wrap, US FX WRAP, PMT European Market Wrap (click + button to expand)
  - Headlines Context: Last 24h titles/snippets (NO clicking/expanding)
- **Forex Factory Calendar:** https://www.forexfactory.com/calendar
  - Red Folder News: High Impact events only (red icons)

## Scheduled Execution

Target schedule: Monday-Friday at 07:00 Frankfurt time (06:00 UTC)

## Resources

- Skill Documentation: `.skills/daily-recap-update/SKILL.md`
- PMT Login: Pre-filled credentials, click orange "Login" button
