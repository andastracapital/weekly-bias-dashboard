# TK Trading Fundamentals Dashboard - TODO

## Red Folder News Timezone Fix (Current Task)

- [x] Check current dailyRecap.json Red Folder News times
- [x] Identify timezone issue (incorrect conversion from Forex Factory)
- [x] Access Forex Factory Calendar with Frankfurt Time (GMT+1 / CET)
- [x] Extract correct Frankfurt Time for all Red Folder events (High impact only)
- [x] Update dailyRecap.json with correct times
- [x] Verify Red Folder News display in Daily View
- [ ] Save checkpoint

## Previous Tasks (Completed)

### Swing Setup Number Formatting Fix
- [x] Fixed number breaks in rationales (3.8% → 3, 8%)
- [x] Added [word-break:keep-all] hyphens-none CSS

### Daily Recap Update (Feb 25, 2026)
- [x] Analyzed PMT data and Forex Factory
- [x] Updated all 8 currency biases
- [x] Recalculated High Conviction Setups

### Weekly Bias Update (Feb 23 - Mar 1, 2026)
- [x] Updated weeklyBias.json with PMT Smart Bias Reports
- [x] Improved summaries (removed "The dominant driver" pattern)

### File Storage Integration
- [x] Backend: files table + tRPC procedures
- [x] Frontend: FileUpload component + File Library page
- [x] Vitest tests (14/14 passed)

### Full-Stack Upgrade
- [x] Upgraded from web-static to web-db-user
- [x] Database schema + tRPC + Auth
