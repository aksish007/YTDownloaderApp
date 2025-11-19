const express = require('express');
const router = express.Router();
const youtubeService = require('../services/youtubeService');

/**
 * GET /api/video-info
 * Get video information and available formats
 */
router.get('/video-info', async (req, res) => {
  try {
    const { url } = req.query;

    if (!url) {
      return res.status(400).json({ error: 'URL parameter is required' });
    }

    if (!youtubeService.isValidYouTubeUrl(url)) {
      return res.status(400).json({ error: 'Invalid YouTube URL' });
    }

    const videoInfo = await youtubeService.getVideoInfo(url);
    res.json(videoInfo);
  } catch (error) {
    console.error('Error fetching video info:', error);
    res.status(500).json({ error: error.message || 'Failed to fetch video information' });
  }
});

/**
 * POST /api/download
 * Download video/audio stream
 */
router.post('/download', async (req, res) => {
  try {
    const { url, formatId } = req.body;

    if (!url || !formatId) {
      return res.status(400).json({ error: 'URL and formatId are required' });
    }

    if (!youtubeService.isValidYouTubeUrl(url)) {
      return res.status(400).json({ error: 'Invalid YouTube URL' });
    }

    // Get video info to determine file extension
    const videoInfo = await youtubeService.getVideoInfo(url);
    const allFormats = [...videoInfo.formats.video, ...videoInfo.formats.audio];
    const selectedFormat = allFormats.find(f => f.itag === parseInt(formatId));

    if (!selectedFormat) {
      return res.status(400).json({ error: 'Invalid format ID' });
    }

    // Set appropriate headers
    const extension = selectedFormat.container || 'mp4';
    const filename = `${videoInfo.title.replace(/[^a-z0-9]/gi, '_').substring(0, 50)}.${extension}`;
    
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    res.setHeader('Content-Type', selectedFormat.mimeType || 'application/octet-stream');

    // Use yt-dlp to get download stream
    try {
      const streamResponse = await youtubeService.getDownloadStream(url, parseInt(formatId));
      
      // Handle response errors
      streamResponse.on('error', (error) => {
        console.error('Stream error:', error);
        if (!res.headersSent) {
          res.status(500).json({ error: `Download failed: ${error.message}` });
        } else {
          res.end();
        }
      });

      // Forward status code
      if (streamResponse.statusCode !== 200) {
        console.error('Download error:', streamResponse.statusCode);
        if (!res.headersSent) {
          return res.status(streamResponse.statusCode).json({ error: 'Download failed' });
        }
        return;
      }

      // Forward content length if available
      if (streamResponse.headers['content-length']) {
        res.setHeader('Content-Length', streamResponse.headers['content-length']);
      }

      // Handle client disconnect
      req.on('close', () => {
        streamResponse.destroy();
      });

      // Pipe stream to response
      streamResponse.pipe(res);

    } catch (streamError) {
      console.error('Error creating stream:', streamError);
      if (!res.headersSent) {
        res.status(500).json({ error: `Failed to create download stream: ${streamError.message}` });
      }
    }

  } catch (error) {
    console.error('Error downloading video:', error);
    if (!res.headersSent) {
      res.status(500).json({ error: error.message || 'Download failed' });
    }
  }
});

module.exports = router;

