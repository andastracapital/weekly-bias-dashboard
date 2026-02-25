# TK Trading Fundamentals Dashboard - TODO

## Daily Recap Update (Current Task - Feb 25, 2026)

- [x] Read daily-recap-update skill documentation
- [x] Analyze PMT data (4 files provided by user)
- [x] Access Forex Factory Calendar for Red Folder News (High impact only, Frankfurt Time)
- [x] Determine Risk Environment (Risk-On Recovery / Risk-Off / Mixed)
- [x] Write Market Focus headlines (3 key points from PMT reports)
- [x] Update all 8 currency biases (directional only: Bullish/Bearish/Neutral/Mixed - NO strength qualifiers)
- [x] Write currency summaries (trader-focused, 1-3 day horizon, isolated currency view)
- [x] Extract currency drivers (3-5 key points per currency)
- [x] Rebuild dailyRecap.json with updated data
- [x] Recalculate High Conviction Setups (Weekly-Daily alignment check - MANDATORY)
- [x] Verify Daily View displays correctly
- [ ] Save checkpoint and commit to Git

## Previous Tasks (Completed)

### Weekly Bias Update Skill Creation
- [x] Read skill-creator skill to understand documentation structure
- [x] Create `/home/ubuntu/skills/weekly-bias-update/` directory
- [x] Write SKILL.md with complete workflow documentation
- [x] Include data sources (PMT Smart Bias Reports URLs)
- [x] Document summary writing best practices (concise, no "The dominant driver" pattern)
- [x] Include FX pair conventions and High Conviction Setups logic
- [x] Test skill by reading it and verifying completeness

### Weekly Bias Summary Style Improvement
- [x] Analyze old dashboard screenshots (Feb 3, 8, 10, 16) for preferred summary style
- [x] Rewrite all 8 currency summaries: remove "The dominant driver" pattern
- [x] Make summaries more concise and direct (2-3 sentences, no filler)
- [x] Match professional tone of old dashboards
- [x] Verify Weekly View displays improved summaries
- [x] Save checkpoint

### BiasCard Summary Display Fix
- [x] Check old weeklyBias.json structure for correct field name
- [x] Update BiasCard component to support both 'summary' and 'rationale' fields
- [x] Verify Weekly View displays summaries correctly
- [x] Save checkpoint

### Weekly Bias Update (Feb 23 - Mar 1, 2026)
- [x] Access PMT Weekly Smart Bias Reports for all 8 currencies
- [x] Extract bias + strength qualifiers (e.g. "Weak Bearish", "Strong Bullish")
- [x] Extract rationales (2-3 sentences per currency)
- [x] Extract key drivers (3-5 points per currency)
- [x] Extract key events with impact levels
- [x] Access Forex Factory Calendar for high-impact events
- [x] Update weeklyBias.json with new data
- [x] Verify Weekly View displays correctly
- [x] Commit changes to Git and push to GitHub

### File Storage Integration
- [x] Create database schema for file uploads (files table)
- [x] Add tRPC procedures for file upload/list/delete
- [x] Implement file upload endpoint with S3 storage
- [x] Add file metadata tracking (filename, size, type, uploadedBy, uploadedAt)
- [x] Create File Upload component with drag-and-drop
- [x] Add File Library page to view uploaded files
- [x] Implement file preview for images/PDFs
- [x] Add file download functionality
- [x] Add file deletion with confirmation
- [x] Test file upload (images, PDFs, JSON)
- [x] Test file listing and filtering
- [x] Test file download
- [x] Test file deletion
- [x] Test error handling (file size limits, invalid types)
