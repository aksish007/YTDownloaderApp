import React from 'react';
import { View, StyleSheet, Platform } from 'react-native';
import { Text, Button } from 'react-native-paper';
import { colors } from '../theme/colors';
import { spacing, borderRadius } from '../theme/spacing';
import { typography } from '../theme/typography';

const EmptyState = ({ onPasteExample }) => {
  const exampleUrls = [
    'https://www.youtube.com/watch?v=...',
    'https://youtu.be/...',
    'https://www.youtube.com/shorts/...',
  ];

  return (
    <View style={styles.container}>
      <View style={styles.iconContainer}>
        <Text style={styles.icon}>📺</Text>
      </View>
      <Text style={styles.title}>Ready to Download</Text>
      <Text style={styles.subtitle}>
        Paste a YouTube video or Shorts link above to get started
      </Text>
      
      <View style={styles.examplesContainer}>
        <Text style={styles.examplesTitle}>Supported formats:</Text>
        {exampleUrls.map((url, index) => (
          <View key={index} style={styles.exampleItem}>
            <Text style={styles.exampleBullet}>•</Text>
            <Text style={styles.exampleText}>{url}</Text>
          </View>
        ))}
      </View>

      <View style={styles.tipsContainer}>
        <Text style={styles.tipsTitle}>💡 Tips:</Text>
        <Text style={styles.tipText}>
          • Copy the link from YouTube app or browser
        </Text>
        <Text style={styles.tipText}>
          • Select your preferred quality before downloading
        </Text>
        <Text style={styles.tipText}>
          • Downloads are saved to your device
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    padding: spacing.xl,
    paddingTop: spacing['2xl'],
  },
  iconContainer: {
    width: 80,
    height: 80,
    borderRadius: borderRadius.full,
    backgroundColor: colors.primary.start + '15',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  icon: {
    fontSize: 40,
  },
  title: {
    fontSize: typography.fontSize['2xl'],
    fontWeight: typography.fontWeight.bold,
    color: colors.text.primary,
    marginBottom: spacing.sm,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: typography.fontSize.base,
    color: colors.text.secondary,
    textAlign: 'center',
    marginBottom: spacing.xl,
    lineHeight: typography.lineHeight.relaxed * typography.fontSize.base,
  },
  examplesContainer: {
    width: '100%',
    backgroundColor: colors.background.secondary,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    marginBottom: spacing.lg,
  },
  examplesTitle: {
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.semibold,
    color: colors.text.secondary,
    marginBottom: spacing.sm,
  },
  exampleItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.xs,
  },
  exampleBullet: {
    fontSize: typography.fontSize.base,
    color: colors.primary.start,
    marginRight: spacing.sm,
    fontWeight: typography.fontWeight.bold,
  },
  exampleText: {
    fontSize: typography.fontSize.sm,
    color: colors.text.tertiary,
    fontFamily: Platform.select({
      web: 'monospace',
      default: 'monospace',
    }),
  },
  tipsContainer: {
    width: '100%',
    backgroundColor: colors.info + '10',
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    borderLeftWidth: 4,
    borderLeftColor: colors.info,
  },
  tipsTitle: {
    fontSize: typography.fontSize.base,
    fontWeight: typography.fontWeight.semibold,
    color: colors.text.primary,
    marginBottom: spacing.sm,
  },
  tipText: {
    fontSize: typography.fontSize.sm,
    color: colors.text.secondary,
    marginBottom: spacing.xs,
    lineHeight: typography.lineHeight.relaxed * typography.fontSize.sm,
  },
});

export default EmptyState;

