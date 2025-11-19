import { Animated } from 'react-native';

/**
 * Fade in animation
 */
export const fadeIn = (value, duration = 300) => {
  return Animated.timing(value, {
    toValue: 1,
    duration,
    useNativeDriver: true,
  });
};

/**
 * Fade out animation
 */
export const fadeOut = (value, duration = 300) => {
  return Animated.timing(value, {
    toValue: 0,
    duration,
    useNativeDriver: true,
  });
};

/**
 * Slide in from bottom
 */
export const slideInUp = (value, duration = 300) => {
  return Animated.timing(value, {
    toValue: 0,
    duration,
    useNativeDriver: true,
  });
};

/**
 * Slide out to bottom
 */
export const slideOutDown = (value, duration = 300) => {
  return Animated.timing(value, {
    toValue: 100,
    duration,
    useNativeDriver: true,
  });
};

/**
 * Scale animation
 */
export const scale = (value, toValue = 1.1, duration = 200) => {
  return Animated.timing(value, {
    toValue,
    duration,
    useNativeDriver: true,
  });
};

/**
 * Pulse animation
 */
export const pulse = (value) => {
  return Animated.loop(
    Animated.sequence([
      Animated.timing(value, {
        toValue: 1.1,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(value, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }),
    ])
  );
};

/**
 * Shake animation
 */
export const shake = (value) => {
  return Animated.sequence([
    Animated.timing(value, {
      toValue: -10,
      duration: 50,
      useNativeDriver: true,
    }),
    Animated.timing(value, {
      toValue: 10,
      duration: 50,
      useNativeDriver: true,
    }),
    Animated.timing(value, {
      toValue: -10,
      duration: 50,
      useNativeDriver: true,
    }),
    Animated.timing(value, {
      toValue: 0,
      duration: 50,
      useNativeDriver: true,
    }),
  ]);
};

/**
 * Spring animation
 */
export const spring = (value, toValue = 1, config = {}) => {
  return Animated.spring(value, {
    toValue,
    useNativeDriver: true,
    tension: 50,
    friction: 7,
    ...config,
  });
};

export default {
  fadeIn,
  fadeOut,
  slideInUp,
  slideOutDown,
  scale,
  pulse,
  shake,
  spring,
};

