import React from 'react';
import { Image, ImageStyle, StyleSheet, View, ViewStyle, ImageSourcePropType } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

type ImageMediaType = 'image' | 'avatar' | 'icon';

interface ImageMediaProps {
  type: ImageMediaType;
  source?: ImageSourcePropType | string; // URL or local image using require
  iconName?: string; // Only for type 'icon'
  iconSize?: number; // Only for type 'icon'
  iconColor?: string; // Only for type 'icon'
  size?: number; // Size for avatar and icons (width/height will be equal)
  imageStyle?: ImageStyle; // Style for images and avatars
  containerStyle?: ViewStyle; // Style for the container (View) wrapping the image media element
  placeholder?: ImageSourcePropType | string; // Placeholder image for avatars and images
  borderRadius?: number; // For rounded corners or circular avatars
}

const ImageMedia: React.FC<ImageMediaProps> = ({
  type,
  source,
  iconName,
  iconSize = 24,
  iconColor = '#000',
  size = 50,
  imageStyle,
  containerStyle,
  placeholder,
  borderRadius = 0,
}) => {
  // Function to determine if the image source is a URL or local file
  const getImageSource = (imgSource: ImageSourcePropType | string | undefined) => {
    if (typeof imgSource === 'string') {
      // Check if it's a URL
      return { uri: imgSource };
    }
    // Otherwise, it's a local image using require
    return imgSource;
  };

  const defaultPlaceholder: ImageSourcePropType = placeholder
    ? getImageSource(placeholder)
    : require('@assets/ImagePlaceholder.jpg'); // Local default placeholder image (change this path as needed)

  // Function to render different image media types
  const renderImageMedia = () => {
    switch (type) {
      case 'image':
        return (
          <Image
            source={getImageSource(source) || defaultPlaceholder}
            style={[{ width: size, height: size, borderRadius }, imageStyle]}
            resizeMode="cover"
          />
        );
      case 'avatar':
        return (
          <Image
            source={getImageSource(source) || defaultPlaceholder}
            style={[
              { width: size, height: size, borderRadius: size / 2 },
              imageStyle,
            ]}
            resizeMode="cover"
          />
        );
      case 'icon':
        return <Icon name={iconName || 'image'} size={iconSize} color={iconColor} />;
      default:
        return null;
    }
  };

  return <View style={[styles.container, containerStyle]}>{renderImageMedia()}</View>;
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default ImageMedia;
