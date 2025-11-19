import React, { useState } from 'react';
import { TextInput, StyleSheet, View, TouchableOpacity, Platform } from 'react-native';
import { Text, IconButton } from 'react-native-paper';
import * as Clipboard from 'expo-clipboard';
import { colors } from '../theme/colors';
import { spacing, borderRadius, shadows } from '../theme/spacing';

const LinkInput = ({ value, onChangeText, error, placeholder, onFocus, onBlur }) => {
  const [isFocused, setIsFocused] = useState(false);
  const [hasPasted, setHasPasted] = useState(false);

  const handleFocus = () => {
    setIsFocused(true);
    if (onFocus) onFocus();
  };

  const handleBlur = () => {
    setIsFocused(false);
    if (onBlur) onBlur();
  };

  const handlePaste = async () => {
    try {
      const text = await Clipboard.getStringAsync();
      if (text) {
        onChangeText(text);
        setHasPasted(true);
        setTimeout(() => setHasPasted(false), 1000);
      }
    } catch (err) {
      console.error('Failed to paste:', err);
    }
  };

  const handleClear = () => {
    onChangeText('');
  };

  return (
    <View style={styles.container}>
      <View style={[styles.inputContainer, isFocused && styles.inputContainerFocused, error && styles.inputContainerError]}>
        {/* YouTube Icon */}
        <View style={styles.iconContainer}>
          <Text style={styles.youtubeIcon}>▶</Text>
        </View>

        {/* Input Field */}
        <TextInput
          style={styles.input}
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder || 'Paste YouTube link here...'}
          placeholderTextColor={colors.input.placeholder}
          autoCapitalize="none"
          autoCorrect={false}
          multiline={false}
          keyboardType="url"
          onFocus={handleFocus}
          onBlur={handleBlur}
        />

        {/* Action Buttons */}
        <View style={styles.actionsContainer}>
          {value.length > 0 && (
            <TouchableOpacity
              onPress={handleClear}
              style={styles.clearButton}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <Text style={styles.clearIcon}>×</Text>
            </TouchableOpacity>
          )}
          <TouchableOpacity
            onPress={handlePaste}
            style={[styles.pasteButton, hasPasted && styles.pasteButtonActive]}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Text style={styles.pasteIcon}>📋</Text>
          </TouchableOpacity>
        </View>
      </View>

      {error && (
        <View style={styles.errorContainer}>
          <Text style={styles.errorIcon}>⚠</Text>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: spacing.md,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.input.background,
    borderRadius: borderRadius.lg,
    borderWidth: 2,
    borderColor: colors.input.border,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    minHeight: 56,
    ...shadows.sm,
    transition: 'all 0.2s ease',
  },
  inputContainerFocused: {
    borderColor: colors.input.borderFocus,
    ...shadows.md,
  },
  inputContainerError: {
    borderColor: colors.error,
    borderWidth: 2,
  },
  iconContainer: {
    marginRight: spacing.sm,
    width: 32,
    height: 32,
    borderRadius: borderRadius.md,
    backgroundColor: colors.primary.start + '15',
    justifyContent: 'center',
    alignItems: 'center',
  },
  youtubeIcon: {
    fontSize: 16,
    color: colors.error,
    fontWeight: 'bold',
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: colors.text.primary,
    paddingVertical: spacing.sm,
    ...Platform.select({
      web: {
        outlineStyle: 'none',
      },
    }),
  },
  actionsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: spacing.sm,
  },
  clearButton: {
    width: 28,
    height: 28,
    borderRadius: borderRadius.full,
    backgroundColor: colors.border.medium,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.xs,
  },
  clearIcon: {
    fontSize: 20,
    color: colors.text.secondary,
    lineHeight: 20,
  },
  pasteButton: {
    width: 32,
    height: 32,
    borderRadius: borderRadius.md,
    backgroundColor: colors.background.tertiary,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.xs,
  },
  pasteButtonActive: {
    backgroundColor: colors.success + '20',
  },
  pasteIcon: {
    fontSize: 18,
  },
  errorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: spacing.xs,
    marginLeft: spacing.sm,
  },
  errorIcon: {
    fontSize: 14,
    marginRight: spacing.xs,
  },
  errorText: {
    color: colors.error,
    fontSize: 12,
    flex: 1,
  },
});

export default LinkInput;
