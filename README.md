# YouTube Video Downloader App

A React Native application that allows users to download YouTube videos and Shorts on both Web and Android platforms. The app intelligently fetches video information and provides all available quality options for download.

## Features

- ✅ Works on both Web and Android platforms
- ✅ Supports YouTube videos and Shorts
- ✅ Automatic video information fetching
- ✅ All available quality options displayed
- ✅ Video and audio format selection
- ✅ Download progress tracking
- ✅ Minimal user steps - just paste link and select quality
- ✅ Beautiful, modern UI

## Architecture

- **Frontend**: React Native with Expo (supports Web and Android)
- **Backend**: Node.js/Express API server
- **YouTube Library**: `@distube/ytdl-core` for fetching video info and streams

## Project Structure

```
YTVidDownloaderApp/
├── frontend/                 # React Native Expo app
│   ├── App.js
│   ├── src/
│   │   ├── components/      # UI components
│   │   ├── screens/         # Screen components
│   │   ├── services/        # API client
│   │   └── utils/           # Utility functions
│   └── package.json
├── backend/                  # Node.js Express server
│   ├── server.js
│   ├── routes/              # API routes
│   ├── services/            # Business logic
│   └── package.json
└── README.md
```

## Setup Instructions

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- For Android: Android Studio and Android SDK
- For Web: Modern web browser

### Backend Setup

1. Navigate to the backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Start the server:
```bash
npm start
```

The backend server will run on `http://localhost:3001`

### Frontend Setup

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Configure API URL (if needed):
   - For Android emulator: The default configuration uses `10.0.2.2:3001`
   - For physical Android device: Update `API_BASE_URL` in `src/services/api.js` with your computer's local IP address
   - For Web: Uses `localhost:3001` by default

4. Run the app:

   **For Web:**
   ```bash
   npm run web
   ```

   **For Android:**
   ```bash
   npm run android
   ```

## Usage

1. Start the backend server (must be running before using the app)
2. Open the app (web or Android)
3. Paste a YouTube video or Shorts link in the input field
4. Wait for video information to load (thumbnail, title, duration)
5. Select your preferred quality from the available formats
6. Click "Download" button
7. The file will be saved to your device/downloads folder

## API Endpoints

### GET /api/video-info
Fetches video metadata and available formats.

**Query Parameters:**
- `url` (string, required): YouTube video URL

**Response:**
```json
{
  "id": "video_id",
  "title": "Video Title",
  "thumbnail": "thumbnail_url",
  "duration": "123",
  "formats": {
    "video": [...],
    "audio": [...]
  }
}
```

### POST /api/download
Downloads video/audio stream.

**Body:**
```json
{
  "url": "youtube_url",
  "formatId": 137
}
```

**Response:** Binary stream with appropriate headers

## Configuration

### Backend Port
Change the port in `backend/server.js`:
```javascript
const PORT = process.env.PORT || 3001;
```

### Frontend API URL
Update `frontend/src/services/api.js`:
```javascript
const API_BASE_URL = 'http://your-backend-url:port';
```

## Troubleshooting

### "Unable to connect to server"
- Make sure the backend server is running
- For Android emulator, ensure you're using `10.0.2.2:3001`
- For physical Android device, use your computer's local IP address instead of `localhost`
- Check firewall settings

### "Invalid YouTube URL"
- Ensure the URL is a valid YouTube link
- Supported formats:
  - `https://www.youtube.com/watch?v=VIDEO_ID`
  - `https://youtu.be/VIDEO_ID`
  - `https://www.youtube.com/shorts/VIDEO_ID`

### Download fails
- Check internet connection
- Ensure sufficient storage space
- Verify file permissions (Android)

## Legal Notice

This application is for educational purposes. Downloading YouTube videos may violate YouTube's Terms of Service. Users are responsible for ensuring they have the right to download content and comply with copyright laws.

## License

ISC

