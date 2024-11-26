import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ActivityIndicator, ViewStyle, TextStyle, StyleProp, View } from 'react-native';

type ButtonVariant = 'primary' | 'secondary' | 'link';

interface ButtonProps {
  title: string;
  onPress: () => void;
  disabled?: boolean;
  loading?: boolean;
  variant?: ButtonVariant;
  style?: StyleProp<ViewStyle>;
  textStyle?: TextStyle;
  icon?: React.ReactNode; // New prop for icon
}

const Button: React.FC<ButtonProps> = ({
  title,
  onPress,
  disabled = false,
  loading = false,
  variant = 'primary',
  style,
  textStyle,
  icon, // Add icon prop
}) => {
  const getButtonStyle = (): StyleProp<ViewStyle> => {
    switch (variant) {
      case 'primary':
        return [styles.buttonPrimary, style];
      case 'secondary':
        return [styles.buttonSecondary, style];
      case 'link':
        return [styles.buttonLink, style];
      default:
        return [styles.buttonPrimary, style];
    }
  };

  const getTextStyle = (): StyleProp<TextStyle> => {
    switch (variant) {
      case 'primary':
        return [styles.textPrimary, textStyle];
      case 'secondary':
        return [styles.textSecondary, textStyle];
      case 'link':
        return [styles.textLink, textStyle];
      default:
        return [styles.textPrimary, textStyle];
    }
  };

  return (
    <TouchableOpacity
      style={[getButtonStyle(), disabled && styles.buttonDisabled]}
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.7}
    >
      <View style={styles.buttonContent}>
        {loading ? (
          <ActivityIndicator color={variant === 'primary' ? '#FFF' : '#000'} />
        ) : (
          <>
            {icon && <View style={styles.iconContainer}>{icon}</View>}
            <Text style={getTextStyle()}>{title}</Text>
          </>
        )}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  buttonPrimary: {
    backgroundColor: '#11a0da',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonSecondary: {
    backgroundColor: '#11a0da',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonLink: {
    backgroundColor: 'transparent',
    paddingVertical: 10,
    paddingHorizontal: 12,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  textPrimary: {
    color: '#fff',
    fontSize: 16,
    // fontWeight: 'bold',
    fontFamily: 'OpenSans-Bold', // Use OpenSans-Bold for primary buttons
  },
  textSecondary: {
    color: '#2c3e50',
    fontSize: 16,
    // fontWeight: 'bold',
    fontFamily: 'OpenSans-Bold', // Use OpenSans-Bold for secondary buttons
  },
  textLink: { 
    color: '#33528b',
    fontSize: 16,
    textDecorationLine: 'underline',
    fontFamily: 'OpenSans-Regular', // Use OpenSans-Regular for link buttons
  },
  buttonContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconContainer: {
    marginRight: 8, // Space between icon and text
  },
});

export default Button;
