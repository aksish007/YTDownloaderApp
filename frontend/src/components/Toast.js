import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Animated, TouchableOpacity, Platform } from 'react-native';
import { Text } from 'react-native-paper';
import * as Animatable from 'react-native-animatable';
import { colors } from '../theme/colors';
import { spacing, borderRadius, shadows } from '../theme/spacing';
import { typography } from '../theme/typography';

const Toast = ({ visible, message, type = 'success', onDismiss, duration = 3000 }) => {
  const slideAnim = useRef(new Animated.Value(-100)).current;

  useEffect(() => {
    if (visible) {
      Animated.spring(slideAnim, {
        toValue: 0,
        useNativeDriver: true,
        tension: 50,
        friction: 7,
      }).start();

      const timer = setTimeout(() => {
        if (onDismiss) {
          Animated.timing(slideAnim, {
            toValue: -100,
            duration: 300,
            useNativeDriver: true,
          }).start(() => {
            onDismiss();
          });
        }
      }, duration);

      return () => clearTimeout(timer);
    } else {
      Animated.timing(slideAnim, {
        toValue: -100,
        duration: 300,
        useNativeDriver: true,
      }).start();
    }
  }, [visible, duration, onDismiss]);

  if (!visible) return null;

  const getTypeStyles = () => {
    switch (type) {
      case 'success':
        return {
          backgroundColor: colors.success,
          icon: '✓',
        };
      case 'error':
        return {
          backgroundColor: colors.error,
          icon: '✕',
        };
      case 'info':
        return {
          backgroundColor: colors.info,
          icon: 'ℹ',
        };
      default:
        return {
          backgroundColor: colors.success,
          icon: '✓',
        };
    }
  };

  const typeStyles = getTypeStyles();

  return (
    <Animated.View
      style={[
        styles.container,
        {
          transform: [{ translateY: slideAnim }],
        },
      ]}
    >
      <Animatable.View
        animation="fadeInDown"
        duration={300}
        style={[styles.toast, { backgroundColor: typeStyles.backgroundColor }]}
      >
        <View style={styles.content}>
          <Text style={styles.icon}>{typeStyles.icon}</Text>
          <Text style={styles.message}>{message}</Text>
        </View>
        {onDismiss && (
          <TouchableOpacity onPress={onDismiss} style={styles.closeButton}>
            <Text style={styles.closeIcon}>×</Text>
          </TouchableOpacity>
        )}
      </Animatable.View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 60,
    left: spacing.md,
    right: spacing.md,
    zIndex: 1000,
    ...Platform.select({
      web: {
        position: 'fixed',
      },
    }),
  },
  toast: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: spacing.md,
    borderRadius: borderRadius.lg,
    ...shadows.lg,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  icon: {
    fontSize: 20,
    color: colors.text.inverse,
    marginRight: spacing.sm,
    fontWeight: typography.fontWeight.bold,
  },
  message: {
    fontSize: typography.fontSize.base,
    fontWeight: typography.fontWeight.medium,
    color: colors.text.inverse,
    flex: 1,
  },
  closeButton: {
    width: 24,
    height: 24,
    borderRadius: borderRadius.full,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: spacing.sm,
  },
  closeIcon: {
    fontSize: 18,
    color: colors.text.inverse,
    lineHeight: 18,
  },
});

export default Toast;

