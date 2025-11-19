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
 * Get video information and available formats using yt-dlp
 * yt-dlp handles YouTube's anti-bot measures better than ytdl-core
 */
async function getVideoInfo(url) {
  try {
    const videoId = extractVideoId(url);
    if (!videoId) {
      throw new Error('Invalid YouTube URL');
    }

    const ytdlp = new YtDlp();
    
    // Use yt-dlp to get video info with anti-bot bypass options
    // yt-dlp handles bot detection automatically, but we can add extra options
    const info = await ytdlp.getInfoAsync(url, {
      // yt-dlp options (passed as object keys, not --flags)
      userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      referer: 'https://www.youtube.com/',
      // Use Android client to bypass bot detection (more reliable)
      // extractorArgs expects arrays of strings
      extractorArgs: {
        youtube: ['player_client=android']
      },
    });
    
    // Extract video details from yt-dlp format
    const videoDetails = {
      id: info.id || videoId,
      title: info.title || 'Unknown Title',
      thumbnail: info.thumbnail || (info.thumbnails && info.thumbnails[info.thumbnails.length - 1]?.url) || '',
      duration: info.duration || 0,
      formats: []
    };

    // Process available formats from yt-dlp
    const formats = info.formats || [];
    
    // Filter and process formats
    const videoFormats = [];
    const audioFormats = [];
    const qualityMap = new Map();
    const seenFormatIds = new Set();

    formats.forEach((format) => {
      // Skip if we've already seen this format_id
      const formatId = format.format_id || format.formatId;
      if (seenFormatIds.has(formatId)) {
        return;
      }
      seenFormatIds.add(formatId);

      // Determine if it's video, audio, or both
      const hasVideo = format.vcodec && format.vcodec !== 'none';
      const hasAudio = format.acodec && format.acodec !== 'none';
      
      if (!hasVideo && !hasAudio) {
        return; // Skip formats with neither
      }

      // Extract quality information
      const quality = format.height || format.resolution || format.quality || 'Unknown';
      const container = format.ext || format.container || 'mp4';
      const bitrate = format.tbr || format.abr || format.vbr || 0;
      const filesize = format.filesize || format.filesize_approx || 0;
      
      // Map format_id to itag for compatibility
      const itag = parseInt(formatId) || format.itag || formatId;

      const formatInfo = {
        itag: itag,
        formatId: formatId,
        quality: quality.toString(),
        container: container,
        hasVideo: hasVideo,
        hasAudio: hasAudio,
        videoCodec: format.vcodec,
        audioCodec: format.acodec,
        bitrate: bitrate,
        contentLength: filesize,
        url: format.url,
        mimeType: format.mimeType || `${hasVideo ? 'video' : 'audio'}/${container}`
      };

      if (hasVideo && hasAudio) {
        // Video with audio
        const qualityLabel = quality.toString();
        const qualityKey = `${qualityLabel}-${container}`;
        const label = `${qualityLabel}p (${container})`;
        
        if (!qualityMap.has(qualityKey) || (bitrate && bitrate > (qualityMap.get(qualityKey)?.bitrate || 0))) {
          if (qualityMap.has(qualityKey)) {
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
      } else if (hasAudio && !hasVideo) {
        // Audio only
        const audioQuality = format.abr ? `${format.abr}kbps` : (format.quality || 'Audio');
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
    
    // Get the download URL using yt-dlp with anti-bot bypass options
    const formatSelector = formatId.toString();
    
    const info = await ytdlp.getInfoAsync(url, {
      format: formatSelector,
      // Anti-bot bypass options
      userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      referer: 'https://www.youtube.com/',
      // Use Android client to bypass bot detection (more reliable)
      extractorArgs: {
        youtube: ['player_client=android']
      },
    });

    // Extract the download URL from the info
    let downloadUrl = info.url;
    
    // If url is not directly available, try to get it from formats
    if (!downloadUrl && info.formats) {
      const format = info.formats.find(f => 
        f.format_id === formatSelector || 
        f.formatId === formatSelector ||
        f.itag === formatId ||
        parseInt(f.format_id) === parseInt(formatId)
      );
      if (format) {
        downloadUrl = format.url;
      }
    }

    if (!downloadUrl) {
      throw new Error('No download URL available for the selected format');
    }

    // Create a stream from the download URL with realistic browser headers
    const urlObj = new URL(downloadUrl);
    const client = urlObj.protocol === 'https:' ? https : http;

    return new Promise((resolve, reject) => {
      const request = client.get(downloadUrl, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
          'Accept': '*/*',
          'Accept-Language': 'en-US,en;q=0.9',
          'Accept-Encoding': 'gzip, deflate, br',
          'Referer': 'https://www.youtube.com/',
          'Origin': 'https://www.youtube.com',
          'Sec-Fetch-Dest': 'empty',
          'Sec-Fetch-Mode': 'cors',
          'Sec-Fetch-Site': 'cross-site',
          'Connection': 'keep-alive',
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

