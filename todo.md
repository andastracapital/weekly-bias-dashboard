
- [x] Upgrade project to full-stack (web-db-user) with File Storage capability
- [x] Resolve Home.tsx merge conflict after upgrade
- [x] Verify full-stack features are working (auth, database, S3 storage)
- [x] Enhance Daily Bias currency rationales: Focus on isolated currency view (not vs USD), 1-3 day swing horizon, covering narratives, fundamentals, yields/CB rhetoric, commodities, headlines in concise trader style
- [x] Perform Daily Recap update: Scrape current PMT data (News Ticker, US/EU/Asia Wraps, Red Folder) and rebuild dailyRecap.json from scratch
- [x] Correct Red Folder News filter: Only include High and Critical Impact events (exclude Medium/Low)
- [x] Daily Recap Update: Scrape PMT (News Ticker, US/EU/Asia Wraps, Red Folder High/Critical) and rebuild dailyRecap.json
- [x] Move High Conviction Setups from Weekly View to Daily View (above Intraday Trades) and auto-recalculate on Daily Recap Update
- [x] Fix High Conviction Setups alignment logic: Strictly verify Weekly-Daily Bias match (exclude Neutral/Mixed) and document verification process for Daily Recap Update
- [x] Weekly Bias Update: Access PMT Smart Bias Text, scrape all 8 currency biases with rationales/events, update weeklyBias.json
- [x] Daily Recap Update (Feb 2) with new PMT URLs: Headlines dashboard (https://access.primemarket-terminal.com/prime-dashboard?template=headlines) for market wraps, Calendar dashboard (https://access.primemarket-terminal.com/prime-dashboard?template=calendar) for Red Folder News
- [x] Scrape missing US FX WRAP article from PMT Headlines dashboard and integrate into dailyRecap.json
- [x] Daily Recap Update: Scrape PMT Headlines (3 wrap-reports with + button), Calendar (Red Folder News), rebuild dailyRecap.json
- [ ] Set up scheduler for Daily Recap Update: Monday-Friday at 07:00 Frankfurt time (GMT+1), scrape PMT Headlines + Calendar, rebuild dailyRecap.json, save checkpoint
- [x] Update "Next Update" time in Daily Recap view from 23:15 to 07:00 Frankfurt time
- [x] Daily Recap Update: Scrape PMT Headlines (3 wrap-reports with + button), Calendar (Red Folder News), rebuild dailyRecap.json
- [x] Move daily-recap-update skill to project directory (.skills/) and create project instructions for cross-task persistence
- [x] Update daily-recap-update skill with GitHub clone logic for cross-task persistence
- [x] Update daily-recap-update skill with explicit GitHub URL (andastracapital/weekly-bias-dashboard)
- [x] Create comprehensive Project Instructions version of Daily Recap Update workflow for cross-task execution
- [x] Create comprehensive Daily Recap Update workflow document (standalone, for new tasks)
- [x] Create comprehensive Weekly Bias Update workflow document (standalone, for new tasks)
- [x] Answer GitHub template question
- [x] Create manual backup guide
- [x] Create GitHub checkpoint verification guide
- [x] Create dashboard restoration guide for new Manus accounts
- [x] Create complete ZIP backup of Weekly Bias Dashboard project
<<<<<<< Updated upstream
- [x] Daily Recap Update: Scrape PMT Headlines (3 wrap-reports with + button), Calendar (Red Folder News), rebuild dailyRecap.json
- [x] Update workflow documentation: Change Red Folder News source from PMT Calendar to Forex Factory Calendar (https://www.forexfactory.com/calendar?week=this)
- [x] Scrape Forex Factory Calendar for Red Folder News (High/Critical impact only, future events only)
- [x] Update dailyRecap.json with fresh Red Folder News including Frankfurt Time (HH:MM format)
- [x] Correct workflow documentation: Specify ONLY red icons (High Impact Expected) from Forex Factory, exclude yellow/orange (Medium Impact)
- [x] Re-scrape Forex Factory Calendar for red icon events only (exclude yellow/orange)
- [x] Update dailyRecap.json: Remove yellow/medium impact events, keep only red icon events
=======
>>>>>>> Stashed changes
- [x] Daily Recap Update (Feb 6, 2026): Scrape PMT Headlines (3 wrap-reports), Forex Factory Calendar (red icons only), rebuild dailyRecap.json
