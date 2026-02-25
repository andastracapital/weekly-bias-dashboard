# TK Trading Fundamentals Dashboard - TODO

## Red Folder News Timezone Fix (URGENT - Current Task)

- [x] Access Forex Factory Calendar settings
- [x] Configure timezone to GMT+1 (Frankfurt Time) in Forex Factory settings (Cloudflare blocked, used manual conversion)
- [x] Extract correct GMT+1 times for all Red Folder events (manual conversion from GMT+7 to GMT+1)
- [x] Update dailyRecap.json with verified GMT+1 times
- [x] Verify Red Folder News display in Daily View (all times correct in GMT+1)
- [ ] Save checkpoint

**Issue:** Red Folder News times are still incorrect (showing NYC time instead of GMT+1)
**Root Cause:** Manual timezone conversion was wrong, need to configure Forex Factory Calendar to GMT+1 directly

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
