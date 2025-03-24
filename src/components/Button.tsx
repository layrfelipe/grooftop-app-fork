import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ActivityIndicator, View } from 'react-native';
import { colors } from '../theme/colors';
import { spacing } from '../theme/spacing';

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'warn' | 'outline' | 'facebook' | 'google' | 'outlineColored' | 'cta';
  loading?: boolean;
  disabled?: boolean;
  size?: 'small' | 'medium' | 'large';
  icon?: React.ReactNode;
}

export const Button = ({ 
  title, 
  onPress, 
  variant = 'primary', 
  loading = false,
  disabled = false,
  size = 'medium',
  icon,
}: ButtonProps) => {
  return (
    <TouchableOpacity
      style={[
        styles.button,
        styles[variant],
        styles[size],
        disabled && styles.buttonDisabled,
      ]}
      onPress={onPress}
      disabled={loading || disabled}
    >
      {loading ? (
        <ActivityIndicator 
          color={variant === 'outline' ? colors.primary : colors.text.inverse} 
          size={size === 'small' ? 'small' : 'small'}
        />
      ) : (
        <View style={styles.content}>
          {icon && <View style={styles.iconContainer}>{icon}</View>}
          <Text style={[
            styles.text,
            styles[`${variant}Text`],
            styles[`${size}Text`],
            disabled && styles.textDisabled,
          ]}>
            {title}
          </Text>
        </View>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 12,
    flexDirection: 'row',
    borderWidth: 1,
    borderColor: 'transparent',
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconContainer: {
    marginRight: spacing.sm,
  },
  primary: {
    backgroundColor: colors.primary,
    shadowColor: colors.shadow.default,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  secondary: {
    backgroundColor: colors.secondary,
    shadowColor: colors.shadow.default,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  warn: {
    backgroundColor: colors.tertiary,
  },
  outline: {
    backgroundColor: 'transparent',
    borderColor: colors.text.primary,
  },
  facebook: {
    backgroundColor: colors.facebook.background,
  },
  google: {
    backgroundColor: colors.google.background,
  },
  outlineColored: {
    backgroundColor: 'transparent',
    borderColor: colors.primary,
  },
  cta: {
    backgroundColor: colors.text.primary,
  },
  buttonDisabled: {
    opacity: 0.5,
    shadowOpacity: 0,
    elevation: 0,
  },
  small: {
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.md,
    minHeight: 32,
  },
  medium: {
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.lg,
    minHeight: 44,
  },
  large: {
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.xl,
    minHeight: 54,
  },
  text: {
    fontWeight: '600',
    textAlign: 'center',
  },
  primaryText: {
    color: colors.text.secondary,
  },
  secondaryText: {
    color: colors.text.secondary,
  },
  outlineText: {
    color: colors.text.primary,
  },
  facebookText: {
    color: colors.text.primary,
  },
  googleText: {
    color: colors.text.primary,
  },
  outlineColoredText: {
    color: colors.primary,
  },
  ctaText: {
    color: colors.tertiary,
  },
  warnText: {
    color: colors.text.primary,
  },
  smallText: {
    fontSize: 14,
  },
  mediumText: {
    fontSize: 16,
  },
  largeText: {
    fontSize: 18,
  },
  textDisabled: {
    opacity: 0.7,
  },
}); 