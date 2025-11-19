const ytdl = require('@distube/ytdl-core');
const { YtDlp } = require('ytdlp-nodejs');

/**
 * Extract YouTube video ID from various URL formats
 * Supports: youtube.com/watch?v=, youtu.be/, youtube.com/shorts/
 */
function extractVideoId(url) {
  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/shorts\/)([^&\n?#]+)/,
    /^([a-zA-Z0-9_-]{11})$/ // Direct video ID
  ];

  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match) {
      return match[1];
    }
  }
  return null;
}

/**
 * Validate if URL is a valid YouTube URL
 */
function isValidYouTubeUrl(url) {
  return extractVideoId(url) !== null;
}

/**
 * Get video information and available formats
 */
async function getVideoInfo(url) {
  try {
    const videoId = extractVideoId(url);
    if (!videoId) {
      throw new Error('Invalid YouTube URL');
    }

    // Configure ytdl with options to avoid 403 errors
    const info = await ytdl.getInfo(url, {
      requestOptions: {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
        }
      }
    });
    
    // Extract video details
    const videoDetails = {
      id: info.videoDetails.videoId,
      title: info.videoDetails.title,
      thumbnail: info.videoDetails.thumbnails[info.videoDetails.thumbnails.length - 1]?.url,
      duration: info.videoDetails.lengthSeconds,
      formats: []
    };

    // Process available formats
    const formats = info.formats.filter(format => 
      format.hasVideo || format.hasAudio
    );

    // Deduplicate by itag first
    const seenItags = new Set();
    const uniqueFormats = formats.filter(format => {
      if (seenItags.has(format.itag)) {
        return false;
      }
      seenItags.add(format.itag);
      return true;
    });

    // Group and categorize formats
    const videoFormats = [];
    const audioFormats = [];
    const qualityMap = new Map(); // Track quality labels to avoid exact duplicates

    uniqueFormats.forEach((format) => {
      const formatInfo = {
        itag: format.itag,
        quality: format.qualityLabel || format.audioQuality || 'Unknown',
        container: format.container,
        hasVideo: format.hasVideo,
        hasAudio: format.hasAudio,
        videoCodec: format.videoCodec,
        audioCodec: format.audioCodec,
        bitrate: format.bitrate,
        contentLength: format.contentLength,
        url: format.url,
        mimeType: format.mimeType
      };

      if (format.hasVideo && format.hasAudio) {
        // Video with audio
        const qualityLabel = format.qualityLabel || 'Unknown';
        const container = format.container || 'mp4';
        const label = `${qualityLabel} (${container})`;
        
        // Create a unique key for this quality+container combination
        const qualityKey = `${qualityLabel}-${container}`;
        
        // Only add if we haven't seen this exact quality+container combo, or if this one has better bitrate
        if (!qualityMap.has(qualityKey) || (format.bitrate && format.bitrate > (qualityMap.get(qualityKey)?.bitrate || 0))) {
          if (qualityMap.has(qualityKey)) {
            // Replace with better quality version
            const existingIndex = videoFormats.findIndex(f => `${f.quality}-${f.container}` === qualityKey);
            if (existingIndex !== -1) {
              videoFormats[existingIndex] = {
                ...formatInfo,
                type: 'video',
                label: label
              };
              qualityMap.set(qualityKey, formatInfo);
            }
          } else {
            videoFormats.push({
              ...formatInfo,
              type: 'video',
              label: label
            });
            qualityMap.set(qualityKey, formatInfo);
          }
        }
      } else if (format.hasAudio && !format.hasVideo) {
        // Audio only - show all unique audio formats
        const audioQuality = format.audioQuality || 'Audio';
        const container = format.container || 'm4a';
        const label = `${audioQuality} (${container})`;
        
        audioFormats.push({
          ...formatInfo,
          type: 'audio',
          label: label
        });
      }
    });

    // Sort video formats by quality (descending)
    videoFormats.sort((a, b) => {
      const qualityA = parseInt(a.quality) || 0;
      const qualityB = parseInt(b.quality) || 0;
      return qualityB - qualityA;
    });

    // Sort audio formats by bitrate (descending)
    audioFormats.sort((a, b) => {
      return (b.bitrate || 0) - (a.bitrate || 0);
    });

    videoDetails.formats = {
      video: videoFormats,
      audio: audioFormats
    };

    return videoDetails;
  } catch (error) {
    throw new Error(`Failed to get video info: ${error.message}`);
  }
}

/**
 * Get download stream for a specific format using yt-dlp
 */
async function getDownloadStream(url, formatId) {
  try {
    const ytdlp = new YtDlp();
    const https = require('https');
    const http = require('http');
    
    // Get the download URL using yt-dlp
    // Format selector: use itag directly or format code
    const formatSelector = formatId.toString();
    
    const info = await ytdlp.getInfoAsync(url, {
      format: formatSelector,
    });

    // Extract the download URL from the info
    let downloadUrl = info.url;
    
    // If url is not directly available, try to get it from formats
    if (!downloadUrl && info.formats) {
      const format = info.formats.find(f => f.format_id === formatSelector || f.itag === formatId);
      if (format) {
        downloadUrl = format.url;
      }
    }

    if (!downloadUrl) {
      throw new Error('No download URL available for the selected format');
    }

    // Create a stream from the download URL
    const urlObj = new URL(downloadUrl);
    const client = urlObj.protocol === 'https:' ? https : http;

    return new Promise((resolve, reject) => {
      const request = client.get(downloadUrl, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
          'Accept': '*/*',
          'Accept-Language': 'en-US,en;q=0.9',
          'Referer': 'https://www.youtube.com/',
          'Origin': 'https://www.youtube.com',
        }
      }, (response) => {
        if (response.statusCode !== 200) {
          reject(new Error(`HTTP ${response.statusCode}: ${response.statusMessage}`));
          return;
        }
        resolve(response);
      });

      request.on('error', reject);
    });
  } catch (error) {
    throw new Error(`Failed to create download stream: ${error.message}`);
  }
}

module.exports = {
  extractVideoId,
  isValidYouTubeUrl,
  getVideoInfo,
  getDownloadStream
};

