# TK Trading Fundamentals Dashboard - TODO

## Weekly Bias Summary Style Fix (Current Task)

- [x] Analyze old dashboard screenshots (Feb 3, 8, 10, 16) for preferred summary style
- [x] Rewrite all 8 currency summaries: remove "The dominant driver" pattern
- [x] Make summaries more concise and direct (2-3 sentences, no filler)
- [x] Match professional tone of old dashboards
- [x] Verify Weekly View displays improved summaries
- [ ] Save checkpoint

## Previous Tasks (Completed)

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

### Weekly Bias Update Fix
- [x] Rewrite weeklyBias.json with proper 2-3 sentence summaries (not bullet points)
- [x] Verify all 8 currencies have coherent paragraph-style rationales
- [x] Test dashboard display (Weekly View)
- [x] Save checkpoint with corrected data

### BiasCard Summary Display Fix
- [x] Check old weeklyBias.json structure for correct field name
- [x] Update BiasCard component to support both 'summary' and 'rationale' fields
- [x] Verify Weekly View displays summaries correctly
- [x] Save checkpoint
