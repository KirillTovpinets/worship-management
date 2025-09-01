# PDF Upload Functionality

This document describes the PDF upload functionality for songs in the worship management application.

## Overview

The PDF upload feature allows administrators to upload PDF files containing song lyrics with chords for each song. These PDFs are stored in Firebase Storage and can be viewed directly in the application.

## Features

- **PDF Upload**: Drag and drop or file picker for PDF uploads
- **File Validation**: Only PDF files up to 10MB are accepted
- **Firebase Storage**: Secure cloud storage for PDF files
- **PDF Viewer**: Built-in PDF viewer with download functionality
- **Toast Notifications**: User feedback for upload success/failure
- **File Management**: Upload, view, and delete PDF files

## Components

### 1. `useFirebase` Hook (`src/hooks/useFirebase.ts`)

Provides Firebase Storage functionality:

- `uploadPDF(file, songId)`: Uploads a PDF file to Firebase Storage
- `getPDFUrl(songId)`: Retrieves the download URL for a song's PDF
- `deletePDF(songId)`: Deletes a PDF file from Firebase Storage

### 2. `usePDFUpload` Hook (`src/app/admin/songs/hooks/usePDFUpload.ts`)

Manages PDF upload state and operations:

- File validation (type and size)
- Upload progress tracking
- Error handling with toast notifications
- PDF URL management

### 3. `PDFUpload` Component (`src/app/admin/songs/components/PDFUpload.tsx`)

UI component for PDF upload:

- Drag and drop interface
- File picker button
- Upload progress indicator
- PDF status display (uploaded/not uploaded)
- View and delete buttons for uploaded PDFs

### 4. `PDFModal` Component (`src/app/admin/songs/components/PDFModal.tsx`)

Modal for viewing PDF content:

- Embedded PDF viewer using iframe
- Download functionality
- Loading and error states
- Responsive design

## File Structure

```
songs/
├── [id]/
│   ├── lyrics.pdf  # PDF file for each song
```

## Usage

### Basic Upload

1. Navigate to a song's detail page
2. Scroll to the "PDF с текстом и аккордами" section
3. Click "Выбрать PDF файл" or drag and drop a PDF file
4. Wait for upload completion
5. Click "Просмотреть" to view the PDF

### Viewing PDFs

1. Click the "Просмотреть" button on an uploaded PDF
2. The PDF opens in a modal dialog
3. Use the embedded viewer to scroll through the PDF
4. Click "Скачать" to download the PDF file

### Deleting PDFs

1. Click the "Удалить" button on an uploaded PDF
2. Confirm the deletion
3. The PDF is removed from Firebase Storage

## File Requirements

- **Format**: PDF only (`application/pdf`)
- **Size**: Maximum 10MB
- **Content**: Should contain song lyrics with chords

## Security

- Only administrators can upload PDFs
- Files are stored in Firebase Storage with proper access controls
- File validation prevents malicious uploads
- Download URLs are temporary and secure

## Error Handling

The system handles various error scenarios:

- Invalid file type (non-PDF)
- File too large (>10MB)
- Upload failures
- Network errors
- Firebase Storage errors

All errors are displayed to the user via toast notifications.

## Future Enhancements

Potential improvements for the PDF upload feature:

- PDF metadata storage in database
- PDF preview thumbnails
- Multiple PDF support per song
- PDF versioning
- Bulk PDF upload
- PDF search functionality
- PDF annotation support

## Technical Implementation

### Firebase Storage Rules

Ensure your Firebase Storage rules allow PDF uploads:

```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /songs/{songId}/lyrics.pdf {
      allow read, write: if request.auth != null &&
        request.auth.token.role == 'ADMIN';
    }
  }
}
```

### Environment Variables

Make sure your Firebase configuration is properly set up in your environment variables or configuration files.

## Troubleshooting

### Common Issues

1. **Upload fails**: Check Firebase Storage rules and network connection
2. **PDF doesn't load**: Verify the PDF URL is accessible
3. **File too large**: Ensure PDF is under 10MB
4. **Permission denied**: Verify user has admin role

### Debug Steps

1. Check browser console for errors
2. Verify Firebase configuration
3. Test Firebase Storage access
4. Check network connectivity
5. Validate PDF file format
