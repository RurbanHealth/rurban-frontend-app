import Box from '@components/Layout/Box';
import ImageMedia from '@components/Media/ImageMedia';
import React from 'react';
import { StyleSheet } from 'react-native';
import LoadingSpinner from './LoadingSpinner';

const LoadingScreen = () => {
    return (
        <Box style={styles.container}>
            <Box style={{ bottom: 30 }}>
                <LoadingSpinner /> 
            </Box>
        </Box>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        zIndex: 99,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.7)', // semi-transparent background
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
    },
});

export default LoadingScreen;
