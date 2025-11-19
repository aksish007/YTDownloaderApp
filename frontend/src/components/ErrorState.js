import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { Text, Button } from 'react-native-paper';
import { colors } from '../theme/colors';
import { spacing, borderRadius } from '../theme/spacing';
import { typography } from '../theme/typography';

const ErrorState = ({ error, onRetry, onDismiss }) => {
  const getErrorIcon = () => {
    if (error?.includes('connect') || error?.includes('server')) {
      return '🔌';
    }
    if (error?.includes('Invalid') || error?.includes('URL')) {
      return '🔗';
    }
    if (error?.includes('permission') || error?.includes('storage')) {
      return '📁';
    }
    return '⚠️';
  };

  const getErrorTitle = () => {
    if (error?.includes('connect') || error?.includes('server')) {
      return 'Connection Error';
    }
    if (error?.includes('Invalid') || error?.includes('URL')) {
      return 'Invalid URL';
    }
    if (error?.includes('permission') || error?.includes('storage')) {
      return 'Storage Permission';
    }
    return 'Error';
  };

  const getErrorSuggestion = () => {
    if (error?.includes('connect') || error?.includes('server')) {
      return 'Make sure the backend server is running on port 3001';
    }
    if (error?.includes('Invalid') || error?.includes('URL')) {
      return 'Please check that the URL is a valid YouTube link';
    }
    if (error?.includes('permission') || error?.includes('storage')) {
      return 'Please grant storage permissions in your device settings';
    }
    return 'Please try again or check your connection';
  };

  return (
    <View style={styles.container}>
      <View style={styles.iconContainer}>
        <Text style={styles.icon}>{getErrorIcon()}</Text>
      </View>
      <Text style={styles.title}>{getErrorTitle()}</Text>
      <Text style={styles.message}>{error}</Text>
      <Text style={styles.suggestion}>{getErrorSuggestion()}</Text>
      
      {onRetry && (
        <Button
          mode="contained"
          onPress={onRetry}
          style={styles.retryButton}
          contentStyle={styles.buttonContent}
          labelStyle={styles.buttonLabel}
        >
          Try Again
        </Button>
      )}
      
      {onDismiss && (
        <TouchableOpacity onPress={onDismiss} style={styles.dismissButton}>
          <Text style={styles.dismissText}>Dismiss</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    padding: spacing.lg,
    backgroundColor: colors.error + '10',
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    borderColor: colors.error + '30',
    marginVertical: spacing.md,
  },
  iconContainer: {
    width: 60,
    height: 60,
    borderRadius: borderRadius.full,
    backgroundColor: colors.error + '20',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  icon: {
    fontSize: 32,
  },
  title: {
    fontSize: typography.fontSize.xl,
    fontWeight: typography.fontWeight.bold,
    color: colors.error,
    marginBottom: spacing.sm,
    textAlign: 'center',
  },
  message: {
    fontSize: typography.fontSize.base,
    color: colors.text.primary,
    textAlign: 'center',
    marginBottom: spacing.xs,
    lineHeight: typography.lineHeight.relaxed * typography.fontSize.base,
  },
  suggestion: {
    fontSize: typography.fontSize.sm,
    color: colors.text.secondary,
    textAlign: 'center',
    marginBottom: spacing.lg,
    lineHeight: typography.lineHeight.relaxed * typography.fontSize.sm,
  },
  retryButton: {
    marginBottom: spacing.sm,
    borderRadius: borderRadius.md,
    backgroundColor: colors.error,
  },
  buttonContent: {
    paddingVertical: spacing.xs,
  },
  buttonLabel: {
    fontSize: typography.fontSize.base,
    fontWeight: typography.fontWeight.semibold,
  },
  dismissButton: {
    padding: spacing.sm,
  },
  dismissText: {
    fontSize: typography.fontSize.sm,
    color: colors.text.secondary,
    textDecorationLine: 'underline',
  },
});

export default ErrorState;

