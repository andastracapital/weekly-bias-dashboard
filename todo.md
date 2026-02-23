# TK Trading Fundamentals Dashboard - TODO

## File Storage Integration

### Backend Implementation
- [x] Create database schema for file uploads (files table)
- [x] Add tRPC procedures for file upload/list/delete
- [x] Implement file upload endpoint with S3 storage
- [x] Add file metadata tracking (filename, size, type, uploadedBy, uploadedAt)

### Frontend Implementation
- [x] Create File Upload component with drag-and-drop
- [x] Add File Library page to view uploaded files
- [x] Implement file preview for images/PDFs
- [x] Add file download functionality
- [x] Add file deletion with confirmation

### Use Cases
- [ ] PMT Report Archive - Upload historical PMT reports (PDFs)
- [ ] Chart Screenshots - Upload trading chart images
- [ ] Trade Journal - Attach files to trade notes
- [ ] Historical Data Backups - Archive old JSON files

### Testing
- [x] Test file upload (images, PDFs, JSON)
- [x] Test file listing and filtering
- [x] Test file download
- [x] Test file deletion
- [x] Test error handling (file size limits, invalid types)

## Weekly Bias Update Fix (Current Task)

- [x] Rewrite weeklyBias.json with proper 2-3 sentence summaries (not bullet points)
- [x] Verify all 8 currencies have coherent paragraph-style rationales
- [x] Test dashboard display (Weekly View)
- [x] Save checkpoint with corrected data

## BiasCard Summary Display Fix (Current Task)

- [x] Check old weeklyBias.json structure for correct field name
- [x] Update BiasCard component to support both 'summary' and 'rationale' fields
- [x] Verify Weekly View displays summaries correctly
- [ ] Save checkpoint
