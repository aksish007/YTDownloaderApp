import axios from 'axios';
import { Platform } from 'react-native';

// Backend API base URL
// For development, use localhost. For production, replace with your backend URL
// For Android emulator, use 10.0.2.2 instead of localhost
// For physical Android device, use your computer's local IP address
const getApiBaseUrl = () => {
  if (__DEV__) {
    if (Platform.OS === 'android') {
      // For Android emulator, use 10.0.2.2
      // For physical device, replace with your computer's IP (e.g., 'http://192.168.1.100:3001')
      return 'http://10.0.2.2:3001'; // Android emulator
    }
    return 'http://localhost:3001'; // Web
  }
  return 'https://your-backend-url.com'; // Production
};

const API_BASE_URL = getApiBaseUrl();

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
});

/**
 * Get video information and available formats
 * @param {string} url - YouTube video URL
 * @returns {Promise} Video info with formats
 */
export const getVideoInfo = async (url) => {
  try {
    const response = await api.get('/api/video-info', {
      params: { url },
    });
    return response.data;
  } catch (error) {
    if (error.response) {
      throw new Error(error.response.data.error || 'Failed to fetch video info');
    } else if (error.request) {
      throw new Error('Unable to connect to server. Please make sure the backend is running.');
    } else {
      throw new Error(error.message || 'An error occurred');
    }
  }
};

/**
 * Download video/audio
 * @param {string} url - YouTube video URL
 * @param {number} formatId - Format ITAG ID
 * @param {Function} onProgress - Progress callback (bytesDownloaded, totalBytes)
 * @returns {Promise} Response with download stream
 */
export const downloadVideo = async (url, formatId, onProgress) => {
  try {
    const response = await api.post(
      '/api/download',
      { url, formatId },
      {
        responseType: 'blob', // Important for file downloads
        onDownloadProgress: (progressEvent) => {
          if (onProgress && progressEvent.total) {
            onProgress(progressEvent.loaded, progressEvent.total);
          }
        },
      }
    );
    return response;
  } catch (error) {
    if (error.response) {
      throw new Error(error.response.data.error || 'Download failed');
    } else if (error.request) {
      throw new Error('Unable to connect to server. Please make sure the backend is running.');
    } else {
      throw new Error(error.message || 'Download failed');
    }
  }
};

export default api;

