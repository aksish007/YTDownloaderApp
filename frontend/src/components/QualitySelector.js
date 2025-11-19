import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, Platform } from 'react-native';
import { Text, Divider } from 'react-native-paper';
import * as Animatable from 'react-native-animatable';
import { colors } from '../theme/colors';
import { spacing, borderRadius, shadows } from '../theme/spacing';
import { typography } from '../theme/typography';

const QualitySelector = ({ formats, selectedFormat, onSelectFormat, loading }) => {
  const [audioExpanded, setAudioExpanded] = useState(false);
  const AUDIO_LIMIT = 3; // Show first 3 audio formats initially

  if (!formats || (!formats.video?.length && !formats.audio?.length)) {
    return null;
  }

  const getQualityBadge = (quality) => {
    const qualityNum = parseInt(quality);
    if (qualityNum >= 2160) return { label: '4K', color: colors.primary.start };
    if (qualityNum >= 1440) return { label: '2K', color: colors.primary.end };
    if (qualityNum >= 1080) return { label: 'HD', color: colors.info };
    if (qualityNum >= 720) return { label: 'HD', color: colors.success };
    if (qualityNum >= 480) return { label: 'SD', color: colors.warning };
    return { label: 'SD', color: colors.text.tertiary };
  };

  const formatFileSize = (bytes) => {
    if (!bytes) return '';
    const mb = bytes / (1024 * 1024);
    if (mb < 1) return `${(bytes / 1024).toFixed(0)} KB`;
    return `${mb.toFixed(1)} MB`;
  };

  const FormatItem = ({ format, isSelected, onPress, disabled }) => {
    const qualityBadge = format.quality ? getQualityBadge(format.quality) : null;
    const fileSize = format.contentLength ? formatFileSize(format.contentLength) : null;

    return (
      <Animatable.View
        animation={isSelected ? 'pulse' : undefined}
        iterationCount={1}
        duration={300}
      >
        <TouchableOpacity
          style={[
            styles.formatItem,
            isSelected && styles.formatItemSelected,
            disabled && styles.formatItemDisabled,
          ]}
          onPress={onPress}
          disabled={disabled}
          activeOpacity={0.7}
        >
          <View style={styles.formatItemContent}>
            <View style={styles.formatItemLeft}>
              <View style={styles.formatIconContainer}>
                <Text style={styles.formatIcon}>
                  {format.type === 'video' ? '🎬' : '🎵'}
                </Text>
              </View>
              <View style={styles.formatInfo}>
                <View style={styles.formatHeader}>
                  <Text
                    style={[
                      styles.formatLabel,
                      isSelected && styles.formatLabelSelected,
                    ]}
                  >
                    {format.label}
                  </Text>
                  {qualityBadge && (
                    <View
                      style={[
                        styles.qualityBadge,
                        { backgroundColor: qualityBadge.color + '20' },
                      ]}
                    >
                      <Text
                        style={[
                          styles.qualityBadgeText,
                          { color: qualityBadge.color },
                        ]}
                      >
                        {qualityBadge.label}
                      </Text>
                    </View>
                  )}
                </View>
                {fileSize && (
                  <Text style={styles.formatSize}>{fileSize}</Text>
                )}
              </View>
            </View>
            {isSelected && (
              <View style={styles.selectedIndicator}>
                <Text style={styles.selectedIcon}>✓</Text>
              </View>
            )}
          </View>
        </TouchableOpacity>
      </Animatable.View>
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Select Quality</Text>
      <ScrollView
        style={styles.scrollView}
        nestedScrollEnabled={true}
        showsVerticalScrollIndicator={false}
      >
        {formats.video && formats.video.length > 0 && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionIcon}>🎬</Text>
              <Text style={styles.sectionTitle}>Video Formats</Text>
            </View>
            {formats.video
              .filter((format, index, self) => 
                // Remove duplicates based on itag
                index === self.findIndex(f => f.itag === format.itag)
              )
              .map((format) => (
                <FormatItem
                  key={format.itag}
                  format={format}
                  isSelected={selectedFormat?.itag === format.itag}
                  onPress={() => !loading && onSelectFormat(format)}
                  disabled={loading}
                />
              ))}
          </View>
        )}

        {formats.video?.length > 0 && formats.audio?.length > 0 && (
          <Divider style={styles.divider} />
        )}

        {formats.audio && formats.audio.length > 0 && (() => {
          const uniqueAudioFormats = formats.audio.filter((format, index, self) => 
            // Remove duplicates based on itag
            index === self.findIndex(f => f.itag === format.itag)
          );
          
          const shouldShowExpand = uniqueAudioFormats.length > AUDIO_LIMIT;
          const displayedFormats = audioExpanded 
            ? uniqueAudioFormats 
            : uniqueAudioFormats.slice(0, AUDIO_LIMIT);
          const hiddenCount = uniqueAudioFormats.length - AUDIO_LIMIT;

          return (
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionIcon}>🎵</Text>
                <Text style={styles.sectionTitle}>Audio Formats</Text>
                {shouldShowExpand && !audioExpanded && (
                  <Text style={styles.formatCount}>({hiddenCount} more)</Text>
                )}
              </View>
              <Animatable.View
                animation={audioExpanded ? 'fadeInDown' : undefined}
                duration={300}
              >
                {displayedFormats.map((format) => (
                  <FormatItem
                    key={format.itag}
                    format={format}
                    isSelected={selectedFormat?.itag === format.itag}
                    onPress={() => !loading && onSelectFormat(format)}
                    disabled={loading}
                  />
                ))}
              </Animatable.View>
              {shouldShowExpand && (
                <TouchableOpacity
                  onPress={() => setAudioExpanded(!audioExpanded)}
                  style={styles.expandButton}
                  activeOpacity={0.7}
                >
                  <Text style={styles.expandButtonText}>
                    {audioExpanded ? 'Show Less' : `Show ${hiddenCount} More`}
                  </Text>
                  <Text style={styles.expandIcon}>
                    {audioExpanded ? '▲' : '▼'}
                  </Text>
                </TouchableOpacity>
              )}
            </View>
          );
        })()}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: spacing.lg,
  },
  title: {
    fontSize: typography.fontSize.xl,
    fontWeight: typography.fontWeight.bold,
    color: colors.text.primary,
    marginBottom: spacing.md,
  },
  scrollView: {
    maxHeight: 400,
  },
  section: {
    marginBottom: spacing.md,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.sm,
    marginTop: spacing.xs,
  },
  sectionIcon: {
    fontSize: 18,
    marginRight: spacing.xs,
  },
  sectionTitle: {
    fontSize: typography.fontSize.base,
    fontWeight: typography.fontWeight.semibold,
    color: colors.text.secondary,
  },
  formatItem: {
    marginBottom: spacing.sm,
    backgroundColor: colors.background.secondary,
    borderRadius: borderRadius.lg,
    borderWidth: 2,
    borderColor: colors.border.light,
    overflow: 'hidden',
  },
  formatItemSelected: {
    backgroundColor: colors.primary.start + '10',
    borderColor: colors.primary.start,
    ...shadows.md,
  },
  formatItemDisabled: {
    opacity: 0.5,
  },
  formatItemContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: spacing.md,
  },
  formatItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  formatIconContainer: {
    width: 40,
    height: 40,
    borderRadius: borderRadius.md,
    backgroundColor: colors.background.tertiary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.md,
  },
  formatIcon: {
    fontSize: 20,
  },
  formatInfo: {
    flex: 1,
  },
  formatHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    marginBottom: spacing.xs,
  },
  formatLabel: {
    fontSize: typography.fontSize.base,
    fontWeight: typography.fontWeight.medium,
    color: colors.text.primary,
    marginRight: spacing.sm,
  },
  formatLabelSelected: {
    fontWeight: typography.fontWeight.bold,
    color: colors.primary.start,
  },
  qualityBadge: {
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
    borderRadius: borderRadius.sm,
  },
  qualityBadgeText: {
    fontSize: typography.fontSize.xs,
    fontWeight: typography.fontWeight.bold,
  },
  formatSize: {
    fontSize: typography.fontSize.sm,
    color: colors.text.tertiary,
  },
  selectedIndicator: {
    width: 28,
    height: 28,
    borderRadius: borderRadius.full,
    backgroundColor: colors.primary.start,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: spacing.sm,
  },
  selectedIcon: {
    fontSize: 18,
    color: colors.text.inverse,
    fontWeight: typography.fontWeight.bold,
  },
  divider: {
    marginVertical: spacing.md,
    backgroundColor: colors.border.medium,
  },
  formatCount: {
    fontSize: typography.fontSize.sm,
    color: colors.text.tertiary,
    marginLeft: spacing.xs,
    fontStyle: 'italic',
  },
  expandButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.md,
    marginTop: spacing.sm,
    backgroundColor: colors.background.tertiary,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    borderColor: colors.border.light,
    borderStyle: 'dashed',
  },
  expandButtonText: {
    fontSize: typography.fontSize.base,
    fontWeight: typography.fontWeight.medium,
    color: colors.primary.start,
    marginRight: spacing.xs,
  },
  expandIcon: {
    fontSize: typography.fontSize.sm,
    color: colors.primary.start,
  },
});

export default QualitySelector;
