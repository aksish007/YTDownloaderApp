import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Animated } from 'react-native';
import { colors } from '../theme/colors';
import { spacing, borderRadius } from '../theme/spacing';

const SkeletonItem = ({ width, height, style }) => {
  const animatedValue = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(animatedValue, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(animatedValue, {
          toValue: 0,
          duration: 1000,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  const opacity = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [0.3, 0.7],
  });

  return (
    <Animated.View
      style={[
        {
          width,
          height,
          backgroundColor: colors.border.light,
          borderRadius: borderRadius.md,
          opacity,
        },
        style,
      ]}
    />
  );
};

const VideoInfoSkeleton = () => {
  return (
    <View style={styles.container}>
      <SkeletonItem width="100%" height={200} style={styles.thumbnail} />
      <View style={styles.details}>
        <SkeletonItem width="80%" height={20} style={styles.titleLine} />
        <SkeletonItem width="60%" height={16} style={styles.metaLine} />
        <View style={styles.badges}>
          <SkeletonItem width={80} height={24} style={styles.badge} />
          <SkeletonItem width={80} height={24} style={styles.badge} />
        </View>
      </View>
    </View>
  );
};

const QualitySelectorSkeleton = () => {
  return (
    <View style={styles.qualityContainer}>
      <SkeletonItem width={120} height={24} style={styles.sectionTitle} />
      {[1, 2, 3].map((i) => (
        <SkeletonItem
          key={i}
          width="100%"
          height={60}
          style={styles.qualityItem}
        />
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: spacing.lg,
  },
  thumbnail: {
    marginBottom: spacing.md,
  },
  details: {
    padding: spacing.md,
  },
  titleLine: {
    marginBottom: spacing.sm,
  },
  metaLine: {
    marginBottom: spacing.md,
  },
  badges: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  badge: {
    borderRadius: borderRadius.full,
    marginRight: spacing.sm,
  },
  qualityContainer: {
    marginBottom: spacing.lg,
  },
  sectionTitle: {
    marginBottom: spacing.md,
  },
  qualityItem: {
    marginBottom: spacing.sm,
  },
});

export { VideoInfoSkeleton, QualitySelectorSkeleton };
export default VideoInfoSkeleton;

