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
- [x] Save checkpoint

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

## Weekly View Layout Improvement (CURRENT TASK)

- [x] Update Weekly View layout: Market Overview left, Swing Watchlist LONG/SHORT side-by-side right
- [x] Test Weekly View display to verify new layout
- [x] Save checkpoint

## Daily Recap Update: Feb 27, 2026 (CURRENT TASK)

- [x] Analyze PMT Market Wraps (London Opening Preparation, European Opening News, London Session Recap, US Session Recap)
- [x] Extract market focus headlines (3 key points)
- [x] Determine Risk Environment (Risk-On/Risk-Off/Mixed)
- [x] Update all 8 currency biases (directional only: Bullish/Bearish/Neutral/Mixed)
- [x] Write currency summaries (trader-focused, 1-3 day horizon)
- [x] Extract currency drivers (3-5 key points per currency)
- [x] Scrape Forex Factory Calendar for Red Folder News (High Impact only)
- [x] Convert times to GMT+1 Frankfurt Time
- [x] Rebuild dailyRecap.json with all data
- [x] Verify High Conviction Setups alignment (Weekly vs Daily bias)
- [x] Test dashboard display (Weekly View + Daily View)
- [x] Save checkpoint

## Weekly Bias Update: Mar 2 - Mar 8, 2026 (CURRENT TASK)

- [x] Analyze all 8 PMT Smart Bias Reports (USD, EUR, GBP, JPY, AUD, CAD, CHF, NZD)
- [x] Determine bias + strength qualifier for each currency
- [x] Write trader-focused rationales (2-4 sentences per currency)
- [x] Scrape Forex Factory Calendar for weekly key events (High/Critical impact)
- [x] Rebuild weeklyBias.json with all 8 currencies
- [x] Verify Weekly View displays correctly
- [x] Save checkpoint and push to GitHub

## Daily Recap Update: Mar 2, 2026 (COMPLETED)

- [x] Analyze PMT London Opening Preparation + Asia-Pac Opening News + Headlines
- [x] Extract market focus headlines (3 key points)
- [x] Determine Risk Environment (Risk-On/Risk-Off/Mixed)
- [x] Update all 8 currency biases (directional only: Bullish/Bearish/Neutral/Mixed)
- [x] Write currency summaries (trader-focused, 1-3 day horizon)
- [x] Extract currency drivers (3-5 key points per currency)
- [x] Scrape Forex Factory Calendar for Red Folder News (High Impact only, this week)
- [x] Convert times to GMT+1 Frankfurt Time
- [x] Rebuild dailyRecap.json with all data
- [x] Verify High Conviction Setups alignment (Weekly vs Daily bias)
- [x] Test dashboard display
- [x] Save checkpoint and push to GitHub

## Red Folder News Fix: Mar 2, 2026 (CURRENT TASK)

- [ ] Open Forex Factory Calendar and verify GMT+1 Berlin timezone is active
- [ ] Scrape all High Impact (Red Folder) events for the week Mar 2-7 with correct GMT+1 times
- [ ] Update dailyRecap.json redFolderNews section with correct times
- [ ] Verify dashboard Red Folder News display
- [ ] Save checkpoint

## Feature: "Close Pos. Before" Section (COMPLETED)

- [x] Define prop-firm mandatory close events list (USD/EUR/GBP/CAD/AUD/NZD/CHF)
- [x] Implement "Close Pos. Before" section in Home.tsx above Red Folder News
- [x] Style with amber/warning color and countdown timer
- [x] Exclude ADP Non-Farm Employment Change (private report, not official NFP)
- [x] Add CHF/SNB events
- [x] Save checkpoint

## Feature: Overnight Close Warning (CURRENT TASK)

- [x] Show events before 09:00 Frankfurt Time in Close Pos. Before from 16:00 the previous day
- [x] Display "TONIGHT HH:MM" badge with moon icon for overnight events shown the day before
- [x] On the event day itself: show normally with countdown (as before)
- [x] Save checkpoint

## Skills Refresh & GitHub Push

- [x] Write skill_dashboard.md (dashboard layout & architecture) → /home/ubuntu/skills/dashboard-architecture/SKILL.md
- [x] Write skill_dailyrecap.md (daily recap update workflow) → /home/ubuntu/skills/daily-recap-update/SKILL.md
- [x] Write skill_weeklybias.md (weekly bias update workflow) → /home/ubuntu/skills/weekly-bias-update/SKILL.md
- [x] Write skill_redfolder.md (red folder news scraping) → /home/ubuntu/skills/forex-factory-timezone-correction/SKILL.md
- [x] Write skill_positionclose.md (prop-firm close warning feature) → /home/ubuntu/skills/prop-firm-close-warning/SKILL.md
- [x] Save checkpoint
- [x] Push all 5 skill files to GitHub

## JPY/BoJ Close Warning Addition

- [x] Add JPY/BoJ to PROP_FIRM_CLOSE_EVENTS in Home.tsx
- [x] Update prop-firm-close-warning skill with JPY/BoJ

## Feature: History Page (3rd Tab) (COMPLETED)

- [x] Add history_entries table to drizzle schema (date, weekRange, swingWatchlist, swingSetups, intradayTrades)
- [x] Run db:push migration to create table in TiDB
- [x] Add getAllHistoryEntries + upsertHistoryEntry DB helpers to server/db.ts
- [x] Add history.list + history.upsert tRPC procedures to server/routers.ts
- [x] Build History.tsx page with descending date table (newest first)
- [x] Add HISTORY tab to Home.tsx viewMode state and tab navigation
- [x] Seed 24 historical entries from screenshots (Jan 28 - Mar 5, 2026)
- [x] Write 12 Vitest tests for history endpoints and FX pair validation
- [x] Update daily-recap-update skill with auto-write step (step 8)
- [x] Save checkpoint
- [x] Push to GitHub

## Bug Fix: History - Store ALL Swing Setups (not just Top 3) (CURRENT TASK)

- [x] Update Home.tsx: pass all swing setups (not slice(0,3)) to history upsert
- [x] Update all existing DB entries to store full swing setup lists (Mar 6: 12 setups)
- [x] Update History.tsx display to show all setups cleanly (PairList flex-wrap already handles it)
- [x] Save checkpoint and push to GitHub

## Bug Fix: History Page Data Accuracy (COMPLETED)

- [ ] Understand the bug: check what Intraday Trades were actually shown vs auto-generated
- [ ] Re-extract all 24+ historical entries from screenshots with strict accuracy
- [ ] Fix all incorrect DB entries (no auto-generated Intraday Trades if not shown)
- [ ] Add correct Swing Watchlist for Mar 6, 2026
- [x] Save checkpoint and push to GitHub

## Bug Fix: Swing Watchlist Missing from History Entries (COMPLETED)

- [x] Check current DB entries for Mar 9, 10, 11 — verify swingWatchlist field is empty
- [x] Update Mar 9 history entry with swing watchlist (from weeklyBias.json Mar 9-15)
- [x] Update Mar 10 history entry with swing watchlist
- [x] Update Mar 11 history entry with swing watchlist
- [x] Update daily-recap-update skill: document swing watchlist MUST be included in every history upsert (MANDATORY rule + weekly persistence note)
- [ ] Save checkpoint and push to GitHub

## Bug Fix: Swing Watchlist FX Convention (CURRENT TASK)
- [ ] Remove GBP/EUR LONG from all history entries (wrong notation — EUR/GBP SHORT is correct per priority rule)
- [ ] Fix Mar 9, 10, 11, 12 DB entries: remove duplicate/wrong pairs, keep only conventional notation
- [ ] Also fix weeklyBias.json swing watchlist if GBP/EUR appears there
- [ ] Update skill: Swing Watchlist must ONLY use conventional FX notation — no duplicate crosses allowed
- [ ] Save checkpoint and push to GitHub

## History Page UI Fixes (CURRENT TASK)
- [x] Add missing weekRange to Mar 12 DB entry ("Mar 9 - Mar 15, 2026")
- [x] Rename "Swing Watchlist" → "Weekly Bias" in History.tsx
- [x] Rename "Swing Setups" → "Weekly Bias + Daily Narrative aligned" in History.tsx
- [x] Make all 3 section titles white and larger (text-white, text-sm or text-base)
- [x] Save checkpoint and push to GitHub

## History: Highlight Middle Column (CURRENT TASK)
- [x] Visually highlight "Weekly Bias + Daily Narrative aligned" column as primary — orange accent header, brighter cell background, larger pair text
- [x] Dim the other two columns (Weekly Bias, Intraday Trades) as secondary info
- [x] Save checkpoint and push to GitHub

## Remove Bond Market Bias Section (COMPLETED)
- [x] Remove bonds UI block from Home.tsx (Bond Market Bias section)
- [x] Remove bonds field from dailyRecap.json
- [x] Save checkpoint and push to GitHub

## Weekly Bias Update: Mar 16 - Mar 22, 2026 (CURRENT TASK)
- [x] Analyze all 8 PMT Smart Bias Reports (USD, EUR, GBP, JPY, AUD, CAD, CHF, NZD)
- [x] Determine bias + strength qualifier for each currency
- [x] Write trader-focused rationales (2-4 sentences per currency)
- [x] Scrape key events for the week (FOMC, ECB, BOE, SNB, BOJ, RBA, BOC + data)
- [x] Rebuild weeklyBias.json with all 8 currencies
- [x] Update Swing Watchlist (5 LONG + 5 SHORT)
- [x] Verify Weekly View displays correctly
- [x] Save checkpoint and push to GitHub

## Red Folder News UI Fixes (COMPLETED)
- [x] Fix countdown timer bug (shows NaNh NaNm instead of actual countdown)
- [x] Abbreviate "Frankfurt" to "FFT" in Red Folder News time display to prevent text overflow
- [x] Save checkpoint and push to GitHub

## Swing Setups Rewrite: Mar 16, 2026 (CURRENT TASK)
- [ ] Rewrite all 3 Swing Setup rationale lines with full figures (no truncation)
- [ ] Save checkpoint and push to GitHub

## FFT Abbreviation: Next Update Header (COMPLETED)
- [x] Replace "Frankfurt Time" with "FFT" in Next Update header (Home.tsx + dailyRecap.json lastUpdate field)
- [x] Save checkpoint and push to GitHub

## Swing Setup Card Text Fix (COMPLETED)
- [x] Find the truncation logic in Home.tsx that cuts Swing Setup rationale text mid-phrase
- [x] Fix so full sentences display without mid-phrase cuts — now reads directly from dailyRecap.json
- [x] Save checkpoint and push to GitHub

## Swing Setups + Intraday Trades Fix (COMPLETED)
- [x] Remove .slice(0,3) limit from Swing Setups — show ALL Weekly+Daily aligned pairs
- [x] Restore Intraday Trades to pair+direction only (no reason text) — old compact format
- [x] Deduplication handled via JSON (intradayTrades already excludes Swing Setup pairs)
- [x] Save checkpoint and push to GitHub

## Daily Recap Update: Mar 17, 2026 (CURRENT TASK)
- [ ] Analyze 4 PMT reports (US Market Wrap, European Opening News, London Session Recap, Asia-Pac Opening News)
- [ ] Determine 8 currency biases for Tuesday Mar 17
- [ ] Calculate High Conviction Setups (Weekly + Daily alignment)
- [ ] Calculate Intraday Trades (Daily only, deduplicated)
- [ ] Rebuild dailyRecap.json
- [ ] Save checkpoint and push to GitHub

## Market Focus Length Fix: Mar 20, 2026 (COMPLETED)
- [x] Rewrite 3 marketFocus headlines at ~50% length (concise, punchy, trader-focused)
- [x] Save checkpoint and push to GitHub

## Weekly Bias Update: Mar 23 - Mar 29, 2026 (COMPLETED)
- [x] Analyze all 8 PMT Smart Bias Reports (USD, EUR, GBP, JPY, AUD, CAD, CHF, NZD)
- [x] Determine bias + strength qualifier for each currency
- [x] Write trader-focused rationales (2-4 sentences per currency)
- [x] Scrape Forex Factory Calendar for weekly key events (High/Critical impact)
- [x] Rebuild weeklyBias.json with all 8 currencies + Swing Watchlist
- [x] Verify Weekly View displays correctly
- [x] Save checkpoint and push to GitHub

## Daily Recap Update: Mar 23, 2026 (COMPLETED)
- [x] Analyze PMT Asia Opening Preparation + Headlines reports
- [x] Determine 8 currency biases + High Conviction Setups
- [x] Rebuild dailyRecap.json with Red Folder events for full week
- [x] Verify dashboard and push to GitHub

## Daily Recap Update: Mar 24, 2026 (CURRENT TASK)
- [ ] Analyze 4 PMT reports (US Market Wrap, European Opening News, Asia-Pac Opening News, London Session Recap)
- [ ] Determine 8 currency biases + High Conviction Setups for Tue Mar 24
- [ ] Rebuild dailyRecap.json with Red Folder events for full week
- [ ] Verify dashboard and push to GitHub

## Intraday Trades Logic Fix (COMPLETED)
- [x] Fix dailyRecap.json: remove invalid Bearish vs Bearish intraday trades (empty array when no bullish currency exists)
- [x] Update daily-recap-update skill: document that Intraday Trades MUST be Bullish vs Bearish only — empty when no valid pairs exist
- [x] Save checkpoint and push to GitHub
