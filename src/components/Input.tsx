import React, { useState } from 'react';
import { TextInput, StyleSheet, View, Text, KeyboardTypeOptions, Pressable } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { colors } from '../theme/colors';
import { spacing } from '../theme/spacing';

interface InputProps {
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  secureTextEntry?: boolean;
  label?: string;
  error?: string;
  autoCapitalize?: 'none' | 'sentences' | 'words' | 'characters';
  keyboardType?: KeyboardTypeOptions;
  multiline?: boolean;
  numberOfLines?: number;
  helper?: string;
  leftIcon?: keyof typeof MaterialIcons.glyphMap;
  rightIcon?: keyof typeof MaterialIcons.glyphMap;
  onRightIconPress?: () => void;
}

export const Input = ({ 
  value,
  onChangeText,
  placeholder,
  secureTextEntry: isPasswordField,
  label,
  error,
  autoCapitalize = 'none',
  keyboardType = 'default',
  multiline = false,
  numberOfLines = 1,
  helper,
  leftIcon,
  rightIcon,
  onRightIconPress,
}: InputProps) => {
  const [isFocused, setIsFocused] = useState(false);
  const [secureTextEntry, setSecureTextEntry] = useState(isPasswordField);

  const toggleSecureEntry = () => {
    setSecureTextEntry(!secureTextEntry);
  };

  return (
    <View style={styles.container}>
      {label && <Text style={styles.label}>{label}</Text>}
      
      <View style={[
        styles.inputContainer,
        isFocused && styles.inputContainerFocused,
        error && styles.inputContainerError,
        multiline && styles.inputContainerMultiline,
      ]}>
        {leftIcon && (
          <MaterialIcons 
            name={leftIcon} 
            size={20} 
            color={colors.text.secondary}
            style={styles.leftIcon}
          />
        )}

        <TextInput
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor={colors.text.tertiary}
          secureTextEntry={secureTextEntry}
          style={[
            styles.input,
            leftIcon && styles.inputWithLeftIcon,
            (rightIcon || isPasswordField) && styles.inputWithRightIcon,
            multiline && styles.inputMultiline,
          ]}
          autoCapitalize={autoCapitalize}
          keyboardType={keyboardType}
          multiline={multiline}
          numberOfLines={numberOfLines}
          textAlignVertical={multiline ? 'top' : 'center'}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
        />

        {(rightIcon || isPasswordField) && (
          <Pressable 
            onPress={isPasswordField ? toggleSecureEntry : onRightIconPress}
            style={styles.rightIcon}
          >
            <MaterialIcons 
              name={isPasswordField ? (secureTextEntry ? 'visibility' : 'visibility-off') : rightIcon!} 
              size={20} 
              color={colors.text.secondary}
            />
          </Pressable>
        )}
      </View>

      {(error || helper) && (
        <Text style={[
          styles.helperText,
          error && styles.errorText,
        ]}>
          {error || helper}
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: spacing.sm,
  },
  label: {
    fontSize: 16,
    fontWeight: '500',
    color: colors.text.primary,
    marginBottom: spacing.xs,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 12,
    borderColor: '#cdcdcd',
    backgroundColor: '#222',
    minHeight: 48,
    shadowColor: colors.shadow.default,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1,
  },
  inputContainerFocused: {
    borderColor: colors.primary,
    borderWidth: 2,
    shadowColor: colors.primary,
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  inputContainerError: {
    borderColor: colors.error,
  },
  inputContainerMultiline: {
    minHeight: 100,
    alignItems: 'flex-start',
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: colors.text.primary,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.sm,
  },
  inputWithLeftIcon: {
    paddingLeft: 0,
  },
  inputWithRightIcon: {
    paddingRight: 0,
  },
  inputMultiline: {
    paddingTop: spacing.sm,
  },
  leftIcon: {
    paddingLeft: spacing.sm,
  },
  rightIcon: {
    padding: spacing.sm,
  },
  helperText: {
    fontSize: 14,
    color: colors.text.secondary,
    marginTop: spacing.xs,
    marginLeft: spacing.xs,
  },
  errorText: {
    color: colors.error,
  },
}); 