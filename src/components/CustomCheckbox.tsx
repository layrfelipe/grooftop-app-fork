import React from 'react';
import { TouchableOpacity, View, Text, StyleSheet } from 'react-native';
import { colors } from '../theme/colors';
import { spacing } from '../theme/spacing';

interface CustomCheckboxProps {
  title: string;
  checked: boolean;
  onPress: () => void;
  containerStyle?: any;
  textStyle?: any;
  isRadio?: boolean;
}

export const CustomCheckbox: React.FC<CustomCheckboxProps> = ({
  title,
  checked,
  onPress,
  containerStyle,
  textStyle,
  isRadio = false,
}) => {
  return (
    <TouchableOpacity
      style={[styles.container, containerStyle]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={[styles.checkbox, checked && styles.checked, isRadio && styles.radio]}>
        {checked && !isRadio && <View style={styles.checkmark} />}
        {checked && isRadio && <View style={styles.radioDot} />}
      </View>
      <Text style={[styles.label, textStyle]}>{title}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: spacing.xs,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: colors.primary,
    marginRight: spacing.sm,
    justifyContent: 'center',
    alignItems: 'center',
  },
  radio: {
    borderRadius: 10,
  },
  checked: {
    backgroundColor: colors.primary,
  },
  checkmark: {
    width: 10,
    height: 10,
    backgroundColor: colors.background.primary,
    borderRadius: 2,
  },
  radioDot: {
    width: 8,
    height: 8,
    backgroundColor: colors.background.primary,
    borderRadius: 4,
  },
  label: {
    fontSize: 16,
  },
}); 