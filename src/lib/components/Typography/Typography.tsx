import React from 'react';
import { Text, StyleSheet, TextStyle, StyleProp } from 'react-native';

type TypographyVariant = 'h1' | 'h2' | 'h3' | 'body' | 'caption' | 'label';

interface TypographyProps {
  variant?: TypographyVariant;
  color?: string;
  children: React.ReactNode;
  style?: StyleProp<TextStyle>;
  numberOfLines?: number;
}

const Typography: React.FC<TypographyProps> = ({
  variant = 'body',
  color = '#465670', // Default text color
  children,
  style,
  numberOfLines,
}) => {
  const getTextStyle = (): TextStyle => {
    switch (variant) {
      case 'h1':
        return { ...styles.h1, color };
      case 'h2':
        return { ...styles.h2, color };
      case 'h3':
        return { ...styles.h3, color };
      case 'caption':
        return { ...styles.caption, color };
      case 'label':
        return { ...styles.label, color };
      default:
        return { ...styles.body, color };
    }
  };

  return (
    <Text style={[getTextStyle(), style]} numberOfLines={numberOfLines}>
      {children}
    </Text>
  );
};

const styles = StyleSheet.create({
  h1: {
    fontSize: 32,
    // fontWeight: 'bold',
    fontFamily: 'OpenSans-Bold', // Bold weight for h1
  },
  h2: {
    fontSize: 28,
    // fontWeight: 'bold',
    fontFamily: 'OpenSans-Bold', // Bold weight for h2
  },
  h3: {
    fontSize: 24,
    // fontWeight: 'bold',
    fontFamily: 'OpenSans-Bold', // Bold weight for h3
  },
  body: {
    fontSize: 16,
    // fontWeight: 'normal',
    fontFamily: 'OpenSans-Regular', // Regular weight for body
  },
  caption: {
    fontSize: 12,
    // fontWeight: 'normal',
    fontFamily: 'OpenSans-Regular', // Regular weight for caption
  },
  label: {
    fontSize: 14,
    // fontWeight: '600',
    fontFamily: 'OpenSans-Medium', // Medium weight for label
  },
});

export default Typography;
