import React, { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
  withRepeat,
  withDelay,
  Easing,
} from 'react-native-reanimated';
import Svg, { Circle } from 'react-native-svg';

const DURATION = 2000;  // Duration of one ripple animation

const RippleAnimation = ({
  circleCount = 3, // Number of ripple circles
  maxRadius = 50, // Max ripple radius, customizable via props
  strokeColor = 'blue', // Color of ripple
  strokeWidth = 4, // Thickness of ripple circle stroke
  duration = DURATION, // Duration of one ripple animation cycle
  style,  // Allow custom styling via props
}:any) => {
  // Array to hold shared values for each circle (one per ripple)
  const rippleData = Array(circleCount).fill(null).map(() => ({
    radius: useSharedValue(0),
    opacity: useSharedValue(1),
  }));

  useEffect(() => {
    rippleData.forEach((data, index) => {
      const delay = (index * duration) / circleCount; // Stagger each ripple's start

      // Loop the radius animation for each ripple circle with a delay
      data.radius.value = withDelay(
        delay,
        withRepeat(
          withTiming(maxRadius, { duration, easing: Easing.linear }),
          -1,
          false
        )
      );

      // Loop the opacity fade-out for each ripple circle with the same delay
      data.opacity.value = withDelay(
        delay,
        withRepeat(
          withTiming(0, { duration, easing: Easing.linear }),
          -1,
          false
        )
      );
    });
  }, []);

  return (
    <View style={[styles.container, style]}>
      <Svg
        width={maxRadius * 2}  // The width should be twice the maxRadius for the circle
        height={maxRadius * 2} // The height should be twice the maxRadius for the circle
        style={styles.svg}
      >
        {rippleData.map((data, index) => {
          const animatedCircleStyle = useAnimatedStyle(() => ({
            r: data.radius.value,
            opacity: data.opacity.value,
          }));

          return (
            <AnimatedCircle
              key={index}
              cx={maxRadius} // Center X coordinate based on maxRadius
              cy={maxRadius} // Center Y coordinate based on maxRadius
              fill="none"
              stroke={strokeColor}
              strokeWidth={strokeWidth}
              animatedProps={animatedCircleStyle}
            />
          );
        })}
      </Svg>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  svg: {
    // Optional styling for the Svg component
  },
});

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

export default RippleAnimation;
