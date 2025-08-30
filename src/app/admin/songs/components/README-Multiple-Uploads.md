# Multiple File Uploads for Songs

This document describes the new multiple file upload functionality for songs in the worship management system.

## Overview

The system now supports uploading multiple PDF and MP3 files for each song, allowing for:

- Multiple chord sheets and lyrics in PDF format
- Multiple audio recordings in MP3 format
- Individual file management (view, download, delete)
- Organized file storage with unique identifiers

## Components

### MultiplePDFUpload

- **Location**: `src/app/admin/songs/components/MultiplePDFUpload.tsx`
- **Hook**: `src/app/admin/songs/hooks/useMultiplePDFUpload.ts`
- **Features**:
  - Upload multiple PDF files simultaneously
  - View PDF files in modal
  - Download individual files
  - Delete individual files
  - File size validation (max 10MB per file)
  - File type validation (PDF only)

### MultipleMP3Upload

- **Location**: `src/app/admin/songs/components/MultipleMP3Upload.tsx`
- **Hook**: `src/app/admin/songs/hooks/useMultipleMP3Upload.ts`
- **Features**:
  - Upload multiple MP3 files simultaneously
  - Built-in audio player for each file
  - Download individual files
  - Delete individual files
  - File size validation (max 50MB per file)
  - File type validation (MP3 only)
  - Play/pause controls with automatic pause of other tracks

## Firebase Storage Structure

Files are stored in Firebase Storage with the following structure:

```
songs/
├── {songId}/
│   ├── pdfs/
│   │   ├── {fileId}-{filename}.pdf
│   │   └── ...
│   └── mp3s/
│       ├── {fileId}-{filename}.mp3
│       └── ...
```

Each file gets a unique ID prefix to avoid naming conflicts.

## Usage

### In Song Detail Page

The multiple upload components are automatically included in the song detail page:

```tsx
// PDF Section
<MultiplePDFUpload songId={song.id} songTitle={song.title} />

// MP3 Section
<MultipleMP3Upload songId={song.id} songTitle={song.title} />
```

### File Management

Users can:

1. **Upload**: Select multiple files using the file picker
2. **View**: Click "Просмотр" to view PDF files in a modal
3. **Play**: Use the built-in audio player for MP3 files
4. **Download**: Click the download icon to save files locally
5. **Delete**: Click "Удалить" to remove individual files

## Backward Compatibility

The system maintains backward compatibility with the existing single file upload functionality:

- Old single PDF files are still accessible via `getPDFUrl()`
- Old single MP3 files are still accessible via `getMP3Url()`
- The original `MP3Upload` component is still available

## Error Handling

The system includes comprehensive error handling:

- File type validation
- File size validation
- Upload progress indicators
- Error messages for failed operations
- Toast notifications for user feedback

## File Information

Each uploaded file includes:

- Unique ID
- Original filename
- File size
- Upload timestamp
- Download URL

## Security

- Files are stored in Firebase Storage with proper access controls
- File types are validated on both client and server side
- File sizes are limited to prevent abuse
- Unique file IDs prevent naming conflicts
