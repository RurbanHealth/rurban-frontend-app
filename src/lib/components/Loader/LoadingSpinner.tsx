import ImageMedia from '@components/Media/ImageMedia';
import React, { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  Easing,
} from 'react-native-reanimated';

const CircularLoadingSpinner = () => {
  const rotation = useSharedValue(0); // Shared value for rotation

  useEffect(() => {
    // Start spinning
    rotation.value = withRepeat(
      withTiming(360, {
        duration: 1000, // Duration for one complete rotation
        easing: Easing.linear, // Continuous linear easing
      }),
      -1, // Repeat indefinitely
      false // Do not reset after each loop
    );
  }, []);

  // Animated style for the spinner
  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ rotate: `${rotation.value}deg` }], // Apply rotation
    };
  });

  return (
    <View style={styles.container}>
      {/* Background Circle */}
      <View style={[styles.backgroundCircle, {justifyContent:'center', alignItems:'center'}]} >
         <ImageMedia
                source={require("@assets/logo.png")}
                type='image'
            />
        </View>

      {/* Animated Spinner */}
      <Animated.View style={[styles.spinner, animatedStyle]} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    width: 80, // Size of the outer container
    height: 80,
  },
  backgroundCircle: {
    width: 90,
    height: 90,
    borderRadius: 100, // Half of the width and height for a perfect circle
    backgroundColor: '#f3f3f3', // Light grey for the background
    position: 'absolute', // Position it behind the spinner
  },
  spinner: {
    width: 90,
    height: 90,
    borderWidth: 5,
    // borderColor: 'transparent', // Make other borders transparent
    borderTopColor: '#3498db', // Color for the spinner effect
    borderBottomColor: '#3498db', // Color for the spinner effect
    borderRadius: 100, // Half of width/height for a circle
    position: 'absolute', // Position the spinner in the center
  },
});

export default CircularLoadingSpinner;
