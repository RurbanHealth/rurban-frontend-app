import React from 'react';
import { StyleProp } from 'react-native';
import { View, StyleSheet, ViewStyle, FlexAlignType } from 'react-native';

interface BoxProps {
  children: React.ReactNode;
  flex?: number; // Flex value to expand or shrink
  flexDirection?: 'row' | 'column' | 'row-reverse' | 'column-reverse'; // Flex direction
  justifyContent?: 'flex-start' | 'flex-end' | 'center' | 'space-between' | 'space-around' | 'space-evenly';
  alignItems?: FlexAlignType; // Flex alignment
  alignSelf?: FlexAlignType; // Align self
  flexWrap?: 'nowrap' | 'wrap' | 'wrap-reverse'; // Wrap children
  padding?: number; // Padding inside the box
  paddingHorizontal?: number;
  paddingVertical?: number;
  margin?: number; // Margin outside the box
  marginHorizontal?: number;
  marginVertical?: number;
  backgroundColor?: string; // Background color for the box
  style?: StyleProp<ViewStyle>; // Custom styles
}

const Box: React.FC<BoxProps> = ({
  children,
  flex,
  flexDirection = 'column',
  justifyContent = 'flex-start',
  alignItems = 'stretch',
  alignSelf,
  flexWrap = 'nowrap',
  padding,
  paddingHorizontal,
  paddingVertical,
  margin,
  marginHorizontal,
  marginVertical,
  backgroundColor = 'transparent',
  style,
}) => {
  return (
    <View
      style={[
        styles.box,
        {
          flex,
          flexDirection,
          justifyContent,
          alignItems,
          alignSelf,
          flexWrap,
          padding,
          paddingHorizontal,
          paddingVertical,
          margin,
          marginHorizontal,
          marginVertical,
          backgroundColor,
        },
        style,
      ]}
    >
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  box: {
    flexShrink: 0, // Default to not shrinking
  },
});

export default Box;
