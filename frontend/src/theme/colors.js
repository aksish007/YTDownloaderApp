export const colors = {
  // Primary gradient colors
  primary: {
    start: '#6366f1', // Indigo
    end: '#8b5cf6', // Purple
    light: '#a78bfa',
    dark: '#4f46e5',
  },
  
  // Status colors
  success: '#10b981',
  successLight: '#34d399',
  error: '#ef4444',
  errorLight: '#f87171',
  warning: '#f59e0b',
  info: '#3b82f6',
  
  // Neutral colors
  background: {
    primary: '#ffffff',
    secondary: '#f9fafb',
    tertiary: '#f3f4f6',
  },
  
  text: {
    primary: '#111827',
    secondary: '#6b7280',
    tertiary: '#9ca3af',
    inverse: '#ffffff',
  },
  
  border: {
    light: '#e5e7eb',
    medium: '#d1d5db',
    dark: '#9ca3af',
  },
  
  // Card colors
  card: {
    background: '#ffffff',
    shadow: 'rgba(0, 0, 0, 0.1)',
    shadowHover: 'rgba(0, 0, 0, 0.15)',
  },
  
  // Input colors
  input: {
    background: '#ffffff',
    border: '#e5e7eb',
    borderFocus: '#6366f1',
    placeholder: '#9ca3af',
  },
  
  // Button colors
  button: {
    primary: {
      background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
      text: '#ffffff',
      hover: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)',
    },
    secondary: {
      background: '#f3f4f6',
      text: '#111827',
      hover: '#e5e7eb',
    },
    disabled: {
      background: '#e5e7eb',
      text: '#9ca3af',
    },
  },
};

// Gradient helper
export const gradients = {
  primary: ['#6366f1', '#8b5cf6'],
  success: ['#10b981', '#34d399'],
  error: ['#ef4444', '#f87171'],
};

export default colors;

