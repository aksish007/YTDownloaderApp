import React from 'react';
import { View, StyleSheet, Image, Platform } from 'react-native';
import { Text, Card } from 'react-native-paper';
import { LinearGradient } from 'expo-linear-gradient';
import * as Animatable from 'react-native-animatable';
import { colors } from '../theme/colors';
import { spacing, borderRadius, shadows } from '../theme/spacing';
import { typography } from '../theme/typography';

const VideoInfoCard = ({ videoInfo, loading }) => {
  if (loading || !videoInfo) {
    return null;
  }

  const formatDuration = (seconds) => {
    if (!seconds) return '';
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${String(secs).padStart(2, '0')}`;
  };

  return (
    <Animatable.View
      animation="fadeInUp"
      duration={500}
      style={styles.container}
    >
      <Card style={styles.card}>
        <Card.Content style={styles.content}>
          <View style={styles.thumbnailContainer}>
            {videoInfo.thumbnail && (
              <Image
                source={{ uri: videoInfo.thumbnail }}
                style={styles.thumbnail}
                resizeMode="cover"
              />
            )}
            <LinearGradient
              colors={['transparent', 'rgba(0,0,0,0.7)']}
              style={styles.thumbnailOverlay}
            >
              <View style={styles.playButton}>
                <Text style={styles.playIcon}>▶</Text>
              </View>
            </LinearGradient>
            {videoInfo.duration && (
              <View style={styles.durationBadge}>
                <Text style={styles.durationText}>{formatDuration(videoInfo.duration)}</Text>
              </View>
            )}
          </View>

          <View style={styles.detailsContainer}>
            <Text style={styles.title} numberOfLines={3}>
              {videoInfo.title}
            </Text>
            
            <View style={styles.metadataContainer}>
              <View style={styles.metadataBadge}>
                <Text style={styles.metadataIcon}>📹</Text>
                <Text style={styles.metadataText}>YouTube</Text>
              </View>
              {videoInfo.duration && (
                <View style={styles.metadataBadge}>
                  <Text style={styles.metadataIcon}>⏱</Text>
                  <Text style={styles.metadataText}>{formatDuration(videoInfo.duration)}</Text>
                </View>
              )}
            </View>
          </View>
        </Card.Content>
      </Card>
    </Animatable.View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: spacing.lg,
  },
  card: {
    borderRadius: borderRadius.xl,
    overflow: 'hidden',
    ...shadows.lg,
    backgroundColor: colors.card.background,
  },
  content: {
    padding: 0,
  },
  thumbnailContainer: {
    position: 'relative',
    width: '100%',
    aspectRatio: 16 / 9,
    backgroundColor: colors.background.tertiary,
  },
  thumbnail: {
    width: '100%',
    height: '100%',
  },
  thumbnailOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: '40%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  playButton: {
    width: 60,
    height: 60,
    borderRadius: borderRadius.full,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    justifyContent: 'center',
    alignItems: 'center',
    ...shadows.md,
  },
  playIcon: {
    fontSize: 24,
    color: colors.error,
    marginLeft: 4,
  },
  durationBadge: {
    position: 'absolute',
    bottom: spacing.sm,
    right: spacing.sm,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.md,
  },
  durationText: {
    color: colors.text.inverse,
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.medium,
  },
  detailsContainer: {
    padding: spacing.lg,
  },
  title: {
    fontSize: typography.fontSize.lg,
    fontWeight: typography.fontWeight.bold,
    color: colors.text.primary,
    marginBottom: spacing.md,
    lineHeight: typography.lineHeight.normal * typography.fontSize.lg,
  },
  metadataContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  metadataBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.background.secondary,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.full,
    marginRight: spacing.sm,
    marginBottom: spacing.xs,
  },
  metadataIcon: {
    fontSize: 14,
    marginRight: spacing.xs,
  },
  metadataText: {
    fontSize: typography.fontSize.sm,
    color: colors.text.secondary,
    fontWeight: typography.fontWeight.medium,
  },
});

export default VideoInfoCard;

