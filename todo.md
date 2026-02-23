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

## Weekly Bias Update (Current Task)

- [x] Access PMT Analyst Reports (Weekly Outlook)
- [x] Access Forex Factory Calendar (current week)
- [x] Analyze market overview and key themes
- [x] Update all 8 currency biases with strength qualifiers
- [x] Write trader-focused rationales (2-4 sentences per currency)
- [x] List key drivers and events for each currency
- [x] Update weeklyBias.json file
- [x] Verify Weekly View displays correctly
- [ ] Commit changes to Git
- [ ] Push to GitHub repository
