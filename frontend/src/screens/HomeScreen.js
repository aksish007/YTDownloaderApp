import React, { useState, useEffect, useRef } from 'react';
import { View, StyleSheet, ScrollView, Platform, Alert } from 'react-native';
import { Text, Card, ActivityIndicator } from 'react-native-paper';
import { LinearGradient } from 'expo-linear-gradient';
import * as Animatable from 'react-native-animatable';
import LinkInput from '../components/LinkInput';
import VideoInfoCard from '../components/VideoInfoCard';
import QualitySelector from '../components/QualitySelector';
import DownloadButton from '../components/DownloadButton';
import EmptyState from '../components/EmptyState';
import ErrorState from '../components/ErrorState';
import Toast from '../components/Toast';
import { VideoInfoSkeleton } from '../components/LoadingSkeleton';
import { getVideoInfo, downloadVideo } from '../services/api';
import { saveFile, getFileExtension } from '../utils/fileManager';
import { colors } from '../theme/colors';
import { spacing, borderRadius, shadows } from '../theme/spacing';
import { typography } from '../theme/typography';

const HomeScreen = () => {
  const [url, setUrl] = useState('');
  const [videoInfo, setVideoInfo] = useState(null);
  const [selectedFormat, setSelectedFormat] = useState(null);
  const [fetchingInfo, setFetchingInfo] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const [downloadProgress, setDownloadProgress] = useState(null);
  const [downloadSpeed, setDownloadSpeed] = useState(null);
  const [error, setError] = useState(null);
  const [toastVisible, setToastVisible] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState('success');
  const lastProgressTime = useRef(Date.now());
  const lastProgressBytes = useRef(0);

  // Validate YouTube URL
  const isValidYouTubeUrl = (url) => {
    if (!url || !url.trim()) {
      return false;
    }
    const patterns = [
      /^https?:\/\/(www\.)?(youtube\.com|youtu\.be)\/.+/,
      /^https?:\/\/youtube\.com\/shorts\/.+/,
      /^https?:\/\/(m\.)?youtube\.com\/.+/,
    ];
    return patterns.some(pattern => pattern.test(url.trim()));
  };

  // Show toast notification
  const showToast = (message, type = 'success') => {
    setToastMessage(message);
    setToastType(type);
    setToastVisible(true);
  };

  // Fetch video info when URL changes
  useEffect(() => {
    const fetchInfo = async () => {
      if (!url.trim()) {
        setVideoInfo(null);
        setSelectedFormat(null);
        setError(null);
        return;
      }

      if (!isValidYouTubeUrl(url)) {
        setError('Please enter a valid YouTube URL');
        setVideoInfo(null);
        setSelectedFormat(null);
        return;
      }

      setError(null);
      setFetchingInfo(true);
      setVideoInfo(null);
      setSelectedFormat(null);

      try {
        const info = await getVideoInfo(url);
        setVideoInfo(info);
        // Auto-select first format (best quality)
        if (info.formats.video?.length > 0) {
          setSelectedFormat(info.formats.video[0]);
        } else if (info.formats.audio?.length > 0) {
          setSelectedFormat(info.formats.audio[0]);
        } else {
          setError('No downloadable formats available for this video');
          setVideoInfo(null);
          setSelectedFormat(null);
        }
      } catch (err) {
        let errorMessage = 'Failed to fetch video information';
        if (err.message.includes('connect')) {
          errorMessage = 'Unable to connect to server. Please make sure the backend is running on port 3001.';
        } else if (err.message.includes('Invalid')) {
          errorMessage = 'Invalid YouTube URL or video not available';
        } else {
          errorMessage = err.message || errorMessage;
        }
        setError(errorMessage);
        setVideoInfo(null);
        setSelectedFormat(null);
      } finally {
        setFetchingInfo(false);
      }
    };

    // Debounce API call
    const timeoutId = setTimeout(fetchInfo, 1000);
    return () => clearTimeout(timeoutId);
  }, [url]);

  // Handle download
  const handleDownload = async () => {
    if (!selectedFormat || !videoInfo) {
      showToast('Please select a quality option', 'error');
      return;
    }

    setDownloading(true);
    setDownloadProgress(0);
    setDownloadSpeed(null);
    setError(null);
    lastProgressTime.current = Date.now();
    lastProgressBytes.current = 0;

    try {
      const response = await downloadVideo(
        url,
        selectedFormat.itag,
        (loaded, total) => {
          if (total) {
            const progress = loaded / total;
            setDownloadProgress(progress);

            // Calculate download speed
            const now = Date.now();
            const timeDiff = (now - lastProgressTime.current) / 1000; // seconds
            if (timeDiff >= 0.5) { // Update speed every 0.5 seconds
              const bytesDiff = loaded - lastProgressBytes.current;
              const speed = bytesDiff / timeDiff;
              setDownloadSpeed(speed);
              lastProgressTime.current = now;
              lastProgressBytes.current = loaded;
            }
          }
        }
      );

      // Get filename from response headers or generate one
      const contentDisposition = response.headers['content-disposition'];
      let filename = `video.${getFileExtension(selectedFormat.mimeType)}`;
      
      if (contentDisposition) {
        const filenameMatch = contentDisposition.match(/filename="?([^"]+)"?/);
        if (filenameMatch) {
          filename = filenameMatch[1];
        }
      } else {
        // Generate filename from video title
        const safeTitle = videoInfo.title.replace(/[^a-z0-9]/gi, '_').substring(0, 50);
        filename = `${safeTitle}.${getFileExtension(selectedFormat.mimeType)}`;
      }

      // Save file
      await saveFile(response.data, filename, selectedFormat.mimeType);

      showToast('Download completed successfully!', 'success');
      setDownloadProgress(null);
      setDownloadSpeed(null);
    } catch (err) {
      let errorMessage = 'Download failed';
      if (err.message.includes('connect')) {
        errorMessage = 'Unable to connect to server. Please check your connection.';
      } else if (err.message.includes('Failed to save')) {
        errorMessage = 'Failed to save file. Please check storage permissions.';
      } else {
        errorMessage = err.message || errorMessage;
      }
      setError(errorMessage);
      showToast(errorMessage, 'error');
    } finally {
      setDownloading(false);
      setDownloadProgress(null);
      setDownloadSpeed(null);
    }
  };

  const handleRetry = () => {
    setError(null);
    if (url.trim() && isValidYouTubeUrl(url)) {
      // Trigger refetch by updating URL state
      const currentUrl = url;
      setUrl('');
      setTimeout(() => setUrl(currentUrl), 100);
    }
  };

  return (
    <View style={styles.container}>
      {/* Background Gradient */}
      {Platform.OS === 'web' ? (
        <View
          style={[
            styles.backgroundGradient,
            {
              background: `linear-gradient(135deg, ${colors.background.secondary} 0%, ${colors.background.primary} 100%)`,
            },
          ]}
        />
      ) : (
        <LinearGradient
          colors={[colors.background.secondary, colors.background.primary]}
          style={styles.backgroundGradient}
        />
      )}

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <Animatable.View animation="fadeInDown" duration={500} style={styles.header}>
          <View style={styles.headerIconContainer}>
            <Text style={styles.headerIcon}>📺</Text>
          </View>
          <Text style={styles.title}>YouTube Downloader</Text>
          <Text style={styles.subtitle}>
            Download videos and audio from YouTube
          </Text>
        </Animatable.View>

        {/* Main Card */}
        <Animatable.View animation="fadeInUp" duration={500} delay={100}>
          <Card style={styles.card}>
            <Card.Content style={styles.cardContent}>
              <LinkInput
                value={url}
                onChangeText={setUrl}
                error={error && !fetchingInfo && !videoInfo ? error : null}
                placeholder="Paste YouTube link here..."
              />

              {/* Loading State */}
              {fetchingInfo && (
                <View style={styles.loadingContainer}>
                  <ActivityIndicator
                    size="large"
                    color={colors.primary.start}
                  />
                  <Text style={styles.loadingText}>
                    Fetching video information...
                  </Text>
                  <VideoInfoSkeleton />
                </View>
              )}

              {/* Error State */}
              {error && !fetchingInfo && !videoInfo && url.trim() && (
                <ErrorState
                  error={error}
                  onRetry={handleRetry}
                  onDismiss={() => setError(null)}
                />
              )}

              {/* Empty State */}
              {!fetchingInfo && !videoInfo && !error && !url.trim() && (
                <EmptyState />
              )}

              {/* Video Info */}
              {videoInfo && !fetchingInfo && (
                <>
                  <VideoInfoCard videoInfo={videoInfo} loading={fetchingInfo} />

                  <QualitySelector
                    formats={videoInfo.formats}
                    selectedFormat={selectedFormat}
                    onSelectFormat={setSelectedFormat}
                    loading={downloading}
                  />

                  <DownloadButton
                    onPress={handleDownload}
                    disabled={!selectedFormat}
                    loading={downloading}
                    progress={downloadProgress}
                    progressText={
                      downloadProgress !== null
                        ? `${Math.round(downloadProgress * 100)}%`
                        : null
                    }
                    downloadSpeed={downloadSpeed}
                  />
                </>
              )}
            </Card.Content>
          </Card>
        </Animatable.View>
      </ScrollView>

      {/* Toast Notification */}
      <Toast
        visible={toastVisible}
        message={toastMessage}
        type={toastType}
        onDismiss={() => setToastVisible(false)}
        duration={3000}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.primary,
  },
  backgroundGradient: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: '40%',
    zIndex: 0,
  },
  scrollView: {
    flex: 1,
    zIndex: 1,
  },
  content: {
    padding: spacing.lg,
    paddingTop: Platform.OS === 'web' ? spacing['2xl'] : spacing.xl,
    paddingBottom: spacing['2xl'],
    ...Platform.select({
      web: {
        maxWidth: 800,
        alignSelf: 'center',
        width: '100%',
      },
    }),
  },
  header: {
    marginBottom: spacing.xl,
    alignItems: 'center',
  },
  headerIconContainer: {
    width: 80,
    height: 80,
    borderRadius: borderRadius.full,
    backgroundColor: colors.primary.start + '15',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.md,
    ...shadows.md,
  },
  headerIcon: {
    fontSize: 40,
  },
  title: {
    fontSize: typography.fontSize['4xl'],
    fontWeight: typography.fontWeight.bold,
    color: colors.text.primary,
    marginBottom: spacing.sm,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: typography.fontSize.base,
    color: colors.text.secondary,
    textAlign: 'center',
  },
  card: {
    borderRadius: borderRadius.xl,
    overflow: 'hidden',
    ...shadows.lg,
    backgroundColor: colors.card.background,
  },
  cardContent: {
    padding: spacing.lg,
  },
  loadingContainer: {
    alignItems: 'center',
    padding: spacing.xl,
  },
  loadingText: {
    marginTop: spacing.md,
    fontSize: typography.fontSize.base,
    color: colors.text.secondary,
    fontWeight: typography.fontWeight.medium,
  },
});

export default HomeScreen;
