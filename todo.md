# TK Trading Fundamentals Dashboard - TODO

## Daily Recap Update: Feb 26, 2026 (CURRENT TASK)

- [ ] Read Daily Recap Update skill
- [x] Analyze PMT Market Wraps (European Opening News, Asia Opening Preparation, London Session Recap)
- [x] Extract market focus headlines (3 key points)
- [x] Determine Risk Environment (Risk-On/Risk-Off/Mixed)
- [x] Update all 8 currency biases (directional only: Bullish/Bearish/Neutral/Mixed)
- [x] Write currency summaries (trader-focused, 1-3 day horizon)
- [x] Extract currency drivers (3-5 key points per currency)
- [x] Scrape Forex Factory Calendar for Red Folder News (High Impact only)
- [x] Convert times to GMT+1 Frankfurt Time using forex-factory-timezone-correction skill
- [x] Rebuild dailyRecap.json with all data
- [x] Verify High Conviction Setups alignment (Weekly vs Daily bias)
- [x] Test dashboard display (Weekly View + Daily View)
- [ ] Save checkpoint

---

## Previous Tasks (Completed)

### Weekly Bias Update (Feb 23 - Mar 1, 2026)
- [x] All 8 currencies updated with PMT Smart Bias Reports
- [x] Summaries rewritten (concise, no "The dominant driver" pattern)
- [x] BiasCard component supports both `summary` and `rationale` fields

### Daily Recap Update (Feb 25, 2026)
- [x] PMT Market Wraps, Headlines, Forex Factory analyzed
- [x] All 8 currency biases updated (directional only)
- [x] High Conviction Setups recalculated (Weekly-Daily alignment)

### Swing Setup Number Formatting Fix
- [x] Added `[word-break:keep-all]` and `hyphens-none` CSS to prevent number breaks

### File Storage Integration
- [x] Database schema, tRPC procedures, FileUpload component, File Library page
- [x] 14 Vitest tests (all passed)

### Skills Created
- [x] Weekly Bias Update Skill (`/home/ubuntu/skills/weekly-bias-update/SKILL.md`)
- [x] Daily Recap Update Skill (already exists)
