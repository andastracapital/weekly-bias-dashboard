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
2. **Scrape PMT Headlines:** Navigate to https://access.primemarket-terminal.com/prime-dashboard?template=headlines and expand 3 wrap-reports
3. **Scrape PMT Calendar:** Navigate to https://access.primemarket-terminal.com/prime-dashboard?template=calendar for Red Folder News (High/Critical only)
4. **Rebuild dailyRecap.json:** Update `/home/ubuntu/weekly-bias-dashboard/client/src/data/dailyRecap.json` with fresh data
5. **Verify and checkpoint:** Check dev server status, mark todo.md as completed, save checkpoint

## Key Guidelines

- **Currency Bias:** Trader-focused rationales (1-3 day horizon, isolated currency view, not vs USD)
- **Red Folder News:** High/Critical Impact only, future events only
- **Quality Check:** All 8 currencies updated, tone field present, risk environment accurate

## Scheduled Execution

Target schedule: Monday-Friday at 07:00 Frankfurt time (06:00 UTC)

## Resources

- PMT Headlines Dashboard: https://access.primemarket-terminal.com/prime-dashboard?template=headlines
- PMT Calendar Dashboard: https://access.primemarket-terminal.com/prime-dashboard?template=calendar
- Skill Documentation: `.skills/daily-recap-update/SKILL.md`
