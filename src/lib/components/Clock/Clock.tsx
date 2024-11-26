import React, { useState, useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import Typography from '@components/Typography/Typography';
import Box from '@components/Layout/Box';

interface ClockProps {
    format?: '12' | '24'; // Add format prop
}

const Clock: React.FC<ClockProps> = ({ format = '24' }) => {
    const [time, setTime] = useState(new Date());

    // Update the time every second
    useEffect(() => {
        const interval = setInterval(() => {
            setTime(new Date());
        }, 1000);

        return () => clearInterval(interval); // Cleanup on unmount
    }, []);

    const formatTime = (num: number) => (num < 10 ? `0${num}` : num); // Add leading zero for single digits

    // Get hours based on the format (12-hour or 24-hour)
    const getHours = () => {
        let hours = time.getHours();
        if (format === '12') {
            hours = hours % 12 || 12; // Convert 24-hour format to 12-hour format
        }
        return formatTime(hours);
    };

    // Get AM or PM for 12-hour format
    const getAmPm = () => {
        if (format === '12') {
            return time.getHours() >= 12 ? 'PM' : 'AM';
        }
        return ''; // No AM/PM for 24-hour format
    };

    return (
        <View style={styles.clockContainer}>
            <Box style={styles.timeBox}>
                <Typography style={styles.hours}>{getHours()}</Typography>
            </Box>
            <Typography style={styles.separator}>:</Typography>
            <Box style={styles.timeBox}>
                <Typography style={styles.minutes}>{formatTime(time.getMinutes())}</Typography>
            </Box>
            <Typography style={styles.separator}>:</Typography>
            <Box style={styles.timeBox}>
                <Typography style={styles.seconds}>{formatTime(time.getSeconds())}</Typography>
            </Box>
            <Typography style={styles.separator}>:</Typography>
            {format === '12' && (
                <Box style={styles.timeBox}>
                    <Typography style={styles.amPm}>{getAmPm()}</Typography>
                </Box>
            )}
        </View>
    );
};

export default Clock;

const styles = StyleSheet.create({
    clockContainer: {
        marginTop: 10,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
    timeBox: {
        backgroundColor: 'white',
        borderRadius: 5,
        padding: 5,
    },
    hours: {
        fontSize: 30,
    },
    minutes: {
        fontSize: 30,
    },
    seconds: {
        fontSize: 30,
    },
    separator: {
        fontSize: 30,
        color: '#FFFFFF',
        paddingHorizontal: 5,
    },
    amPmBox: {
        marginLeft: 10,
        justifyContent: 'center',
    },
    amPm: {
        fontSize: 30,
        // color: '#FFFFFF',
    },
});
