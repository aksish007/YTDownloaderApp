import React, { useState, useEffect } from 'react';
import { StyleSheet, View, TouchableOpacity, Platform } from 'react-native';
import { Text } from 'react-native-paper';
import { LinearGradient } from 'expo-linear-gradient';
import * as Animatable from 'react-native-animatable';
import { colors } from '../theme/colors';
import { spacing, borderRadius, shadows } from '../theme/spacing';
import { typography } from '../theme/typography';

// Platform check for web
const isWeb = Platform.OS === 'web';

const DownloadButton = ({
  onPress,
  disabled,
  loading,
  progress,
  progressText,
  downloadSpeed,
}) => {
  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    if (progress === 1 && !loading) {
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 2000);
    }
  }, [progress, loading]);

  const formatSpeed = (bytesPerSecond) => {
    if (!bytesPerSecond) return '';
    const mbps = bytesPerSecond / (1024 * 1024);
    if (mbps < 1) {
      const kbps = bytesPerSecond / 1024;
      return `${kbps.toFixed(1)} KB/s`;
    }
    return `${mbps.toFixed(2)} MB/s`;
  };

  return (
    <View style={styles.container}>
      {loading && progress !== null && (
        <Animatable.View
          animation="fadeInDown"
          duration={300}
          style={styles.progressContainer}
        >
          <View style={styles.progressHeader}>
            <Text style={styles.progressLabel}>Downloading...</Text>
            {progressText && (
              <Text style={styles.progressPercentage}>{progressText}</Text>
            )}
          </View>
          <View style={styles.progressBarContainer}>
            <View style={styles.progressBarBackground}>
              <Animatable.View
                animation={{
                  from: { width: `${(progress - 0.1) * 100}%` },
                  to: { width: `${progress * 100}%` },
                }}
                duration={200}
                style={[styles.progressBarFill, { width: `${progress * 100}%` }]}
              />
            </View>
          </View>
          {downloadSpeed && (
            <Text style={styles.speedText}>{formatSpeed(downloadSpeed)}</Text>
          )}
        </Animatable.View>
      )}

      <TouchableOpacity
        onPress={onPress}
        disabled={disabled || loading}
        activeOpacity={0.8}
        style={styles.buttonContainer}
      >
        {disabled || loading ? (
          <View style={[styles.button, styles.buttonDisabled]}>
            <Text style={styles.buttonTextDisabled}>
              {loading ? 'Downloading...' : 'Select Quality'}
            </Text>
          </View>
        ) : showSuccess ? (
          <Animatable.View
            animation="bounceIn"
            iterationCount={1}
            style={[styles.button, styles.buttonSuccess]}
          >
            <Text style={styles.successIcon}>✓</Text>
            <Text style={styles.buttonTextSuccess}>Downloaded!</Text>
          </Animatable.View>
        ) : isWeb ? (
          <View
            style={[
              styles.button,
              styles.buttonGradient,
              {
                backgroundColor: colors.primary.start,
                background: `linear-gradient(135deg, ${colors.primary.start} 0%, ${colors.primary.end} 100%)`,
              },
            ]}
          >
            <Text style={styles.downloadIcon}>⬇</Text>
            <Text style={styles.buttonText}>Download</Text>
          </View>
        ) : (
          <LinearGradient
            colors={[colors.primary.start, colors.primary.end]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={[styles.button, styles.buttonGradient]}
          >
            <Text style={styles.downloadIcon}>⬇</Text>
            <Text style={styles.buttonText}>Download</Text>
          </LinearGradient>
        )}
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: spacing.lg,
  },
  progressContainer: {
    marginBottom: spacing.md,
    padding: spacing.md,
    backgroundColor: colors.background.secondary,
    borderRadius: borderRadius.lg,
    ...shadows.sm,
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  progressLabel: {
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.medium,
    color: colors.text.secondary,
  },
  progressPercentage: {
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.bold,
    color: colors.primary.start,
  },
  progressBarContainer: {
    marginBottom: spacing.xs,
  },
  progressBarBackground: {
    height: 8,
    backgroundColor: colors.border.light,
    borderRadius: borderRadius.full,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: colors.primary.start,
    borderRadius: borderRadius.full,
  },
  speedText: {
    fontSize: typography.fontSize.xs,
    color: colors.text.tertiary,
    textAlign: 'right',
    marginTop: spacing.xs,
  },
  buttonContainer: {
    borderRadius: borderRadius.lg,
    overflow: 'hidden',
    ...shadows.md,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    borderRadius: borderRadius.lg,
    minHeight: 56,
  },
  buttonGradient: {
    ...shadows.md,
  },
  buttonDisabled: {
    backgroundColor: colors.button.disabled.background,
  },
  buttonSuccess: {
    backgroundColor: colors.success,
    ...shadows.md,
  },
  downloadIcon: {
    fontSize: 20,
    marginRight: spacing.sm,
    color: colors.text.inverse,
  },
  buttonText: {
    fontSize: typography.fontSize.lg,
    fontWeight: typography.fontWeight.bold,
    color: colors.text.inverse,
  },
  buttonTextDisabled: {
    fontSize: typography.fontSize.base,
    fontWeight: typography.fontWeight.medium,
    color: colors.button.disabled.text,
  },
  successIcon: {
    fontSize: 24,
    marginRight: spacing.sm,
    color: colors.text.inverse,
  },
  buttonTextSuccess: {
    fontSize: typography.fontSize.lg,
    fontWeight: typography.fontWeight.bold,
    color: colors.text.inverse,
  },
});

export default DownloadButton;
