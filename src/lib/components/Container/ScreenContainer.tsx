import React from 'react';
import { View, StyleSheet, StatusBar, ViewStyle, StatusBarStyle, Platform, useColorScheme } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors } from 'react-native/Libraries/NewAppScreen';

interface ScreenContainerProps {
    children: React.ReactNode;
    backgroundColor?: string; // Optional background color for the screen
    barStyle?: StatusBarStyle; // Light or dark content for the status bar
    safeAreaColor?: string; // Optional color for safe areas
    containerStyle?: ViewStyle; // Additional container styles
}

const ScreenContainer: React.FC<ScreenContainerProps> = ({
    children,
    backgroundColor = '#fff',
    barStyle = 'dark-content',
    safeAreaColor = '#fff',
    containerStyle,
}) => {
    const isDarkMode = useColorScheme() === 'dark';

    const backgroundStyle = {
        backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
        flex: 1
    };

    return (
        <View style={[styles.container, { backgroundColor }, containerStyle]}>
            {/* StatusBar configuration */}
            <StatusBar barStyle={isDarkMode ? 'light-content' : barStyle}
                backgroundColor={backgroundStyle.backgroundColor} />

            {/* SafeAreaView to prevent content overlapping with notches, status bar, and soft navigation */}
            <SafeAreaView
                style={[styles.safeArea, { backgroundColor: safeAreaColor }]}
                edges={['top', 'bottom']}
            >
                {/* Main content */}
                {children}
            </SafeAreaView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingHorizontal: 20,
    },
    safeArea: {
        flex: 1,
        paddingBottom: Platform.OS === 'android' ? 16 : 0, // Handles soft navigation on Android
    },
});

export default ScreenContainer;
