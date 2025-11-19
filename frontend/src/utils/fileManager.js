import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import { Platform } from 'react-native';

/**
 * Save file to local storage
 * Platform-specific implementation:
 * - Web: Triggers browser download
 * - Android: Saves to device storage and opens share dialog
 */
export const saveFile = async (blob, filename, mimeType) => {
  if (Platform.OS === 'web') {
    // Web: Use browser download API
    return saveFileWeb(blob, filename, mimeType);
  } else {
    // Android/iOS: Use file system
    return saveFileNative(blob, filename, mimeType);
  }
};

/**
 * Save file on web platform
 */
const saveFileWeb = (blob, filename, mimeType) => {
  return new Promise((resolve, reject) => {
    try {
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = filename;
      link.style.display = 'none';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      resolve();
    } catch (error) {
      reject(new Error(`Failed to save file: ${error.message}`));
    }
  });
};

/**
 * Save file on native platform (Android/iOS)
 */
const saveFileNative = async (blob, filename, mimeType) => {
  try {
    // Convert blob to base64
    const base64 = await blobToBase64(blob);
    
    // Create file URI
    const fileUri = FileSystem.documentDirectory + filename;
    
    // Write file to device storage
    await FileSystem.writeAsStringAsync(fileUri, base64, {
      encoding: FileSystem.EncodingType.Base64,
    });

    // Check if sharing is available and share the file
    const isAvailable = await Sharing.isAvailableAsync();
    if (isAvailable) {
      await Sharing.shareAsync(fileUri, {
        mimeType: mimeType || 'video/mp4',
        dialogTitle: 'Save video',
      });
    }

    return fileUri;
  } catch (error) {
    throw new Error(`Failed to save file: ${error.message}`);
  }
};

/**
 * Convert blob to base64
 */
const blobToBase64 = (blob) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      // Remove data URL prefix (e.g., "data:video/mp4;base64,")
      const base64 = reader.result.split(',')[1];
      resolve(base64);
    };
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
};

/**
 * Get file extension from mime type
 */
export const getFileExtension = (mimeType) => {
  const mimeMap = {
    'video/mp4': 'mp4',
    'video/webm': 'webm',
    'audio/mp4': 'm4a',
    'audio/webm': 'webm',
    'audio/mpeg': 'mp3',
  };
  return mimeMap[mimeType] || 'mp4';
};

