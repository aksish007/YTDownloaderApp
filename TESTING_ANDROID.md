# Testing on Android Phone - Step by Step Guide

## ✅ Using Expo Go (Recommended - Works!)

**Good News**: `react-native-ytdl` is pure JavaScript (no native code), so it works with Expo Go! Android uses native library (no backend needed), Web uses backend API.

### Steps:

1. **Install Expo Go on your Android phone**
   - Download from Google Play Store: [Expo Go](https://play.google.com/store/apps/details?id=host.exp.exponent)

2. **Connect your phone and computer to the same Wi-Fi network**

3. **Start the Expo development server**
   ```bash
   cd frontend
   npm start
   ```

4. **Scan QR code**
   - Open Expo Go app on your phone
   - Tap "Scan QR code"
   - Scan the QR code shown in the terminal/browser
   - The app will load on your phone

5. **Test the app** (No backend needed for Android!)
   - Paste a YouTube URL (e.g., `https://youtu.be/BZP1rYjoBgI`)
   - Wait for video info to load (uses native library)
   - Select quality
   - Download directly to your phone (no backend required!)

**Note**: For Web testing, you'll need the backend running on port 3001, but Android works independently!

---

## Option 2: Development Build (Optional - If you want a standalone app)

You can also create a development build if you prefer not to use Expo Go.

### Prerequisites:
- Android Studio installed
- Android SDK configured
- USB debugging enabled on your phone

### Steps:

1. **Enable USB Debugging on your phone**
   - Go to Settings → About Phone
   - Tap "Build Number" 7 times to enable Developer Options
   - Go to Settings → Developer Options
   - Enable "USB Debugging"

2. **Connect your phone via USB**
   ```bash
   # Verify connection
   adb devices
   # Should show your device
   ```

3. **Install EAS CLI (if not already installed)**
   ```bash
   npm install -g eas-cli
   ```

4. **Create a development build**
   ```bash
   cd frontend
   eas build --profile development --platform android
   ```
   
   **OR** use local build (faster):
   ```bash
   cd frontend
   npx expo run:android
   ```
   This will:
   - Build the app locally
   - Install it on your connected phone
   - Start the development server

5. **Test the app**
   - The app should open automatically on your phone
   - Paste a YouTube URL
   - Test download (no backend needed!)

---

## Option 3: Build APK and Install Manually

### Steps:

1. **Build the APK**
   ```bash
   cd frontend
   npx expo build:android
   ```
   
   OR using EAS:
   ```bash
   eas build --platform android --profile preview
   ```

2. **Download and install APK**
   - Download the APK from the build output
   - Transfer to your phone
   - Enable "Install from Unknown Sources" in Android settings
   - Install the APK

---

## Quick Test Commands

### Start development server:
```bash
cd frontend
npm start
```

### Run on connected Android device:
```bash
cd frontend
npx expo run:android
```

### Check if device is connected:
```bash
adb devices
```

### View logs from device:
```bash
npx expo start --android
# Then press 'a' to open on Android
# Press 'shift+m' to view logs
```

---

## Troubleshooting

### "Unable to connect to server" error on Android
- ✅ **This should NOT happen on Android!** Android uses native library, no backend needed
- If you see this error, the platform detection might not be working
- Check that `Platform.OS === 'android'` is correctly detecting Android
- Make sure `react-native-ytdl` is installed: `cd frontend && npm install react-native-ytdl`

### App crashes on Android
- Check device logs: `adb logcat | grep -i error`
- Make sure all dependencies are installed: `cd frontend && npm install`
- Try clearing cache: `npx expo start -c`

### API connection issues
- Make sure backend is running on port 3001
- Check firewall settings - port 3001 should be accessible
- Verify Wi-Fi connection on both devices

### USB connection issues
- Make sure USB debugging is enabled
- Try different USB cable/port
- Run `adb kill-server && adb start-server`

---

## Testing Checklist

- [ ] App opens on Android device
- [ ] Can paste YouTube URL
- [ ] Video info loads (thumbnail, title, formats)
- [ ] Can select quality
- [ ] Download starts without backend server
- [ ] Progress bar shows during download
- [ ] File saves to device
- [ ] Share dialog appears after download

---

## Important Notes

1. **No Backend Required for Android**: 
   - Android uses `react-native-ytdl` natively (pure JavaScript library)
   - Works completely offline - no backend server needed!
   - Downloads go directly to your phone

2. **Backend Only for Web**: 
   - Web platform requires backend API (CORS restrictions)
   - To test Web: `cd backend && npm start`

3. **Storage Permissions**: 
   - The app will request storage permissions on first download (Android)
   - Grant permissions when prompted

4. **Expo Go Works**: 
   - `react-native-ytdl` is pure JavaScript, so Expo Go works perfectly!
   - No native build needed - just scan QR code and test

5. **Network**: 
   - Your phone needs internet to download YouTube videos
   - No need for phone and computer to be on same network (for Android)

