import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';

const DoctorAppointmentScreen = () => {
    // State to track which tab is selected (Overview or Reviews)
    const [selectedTab, setSelectedTab] = useState('Overview');

    // Function to handle tab switch
    const handleTabSwitch = (tab: string) => {
        setSelectedTab(tab);
    };

    return (
        <ScrollView style={styles.container}>
            {/* Top Section */}
            <View style={styles.topSection}>
                {/* Doctor's Info (Same as before) */}
            </View>

            {/* Bottom Section with Tabs */}
            <View style={styles.bottomSection}>
                {/* Tab Buttons */}
                <View style={styles.tabContainer}>
                    <TouchableOpacity
                        style={[
                            styles.tabButton,
                            selectedTab === 'Overview' ? styles.activeTab : {},
                        ]}
                        onPress={() => handleTabSwitch('Overview')}
                    >
                        <Text style={styles.tabText}>Overview</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={[
                            styles.tabButton,
                            selectedTab === 'Reviews' ? styles.activeTab : {},
                        ]}
                        onPress={() => handleTabSwitch('Reviews')}
                    >
                        <Text style={styles.tabText}>Reviews</Text>
                    </TouchableOpacity>
                </View>

                {/* Dynamic Content based on selectedTab */}
                {selectedTab === 'Overview' && (
                    <View style={styles.tabContent}>
                        <Text style={styles.tabContentText}>
                            Doctor's overview goes here. Information about specialization, qualifications, and experience.
                        </Text>
                    </View>
                )}

                {selectedTab === 'Reviews' && (
                    <View style={styles.tabContent}>
                        <Text style={styles.tabContentText}>
                            Patient reviews and ratings will be displayed here.
                        </Text>
                    </View>
                )}
            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f7f7f7',
    },
    topSection: {
        backgroundColor: '#4B6EA8',
        borderBottomLeftRadius: 30,
        borderBottomRightRadius: 30,
        padding: 20,
        height: 250, // Adjust this to your desired height
    },
    bottomSection: {
        backgroundColor: '#fff',
        borderTopLeftRadius: 30,
        borderTopRightRadius: 30,
        marginTop: -30, // Adjust this value based on overlap with the top section
        paddingHorizontal: 20,
        paddingTop: 20,
    },
    tabContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginBottom: 20,
    },
    tabButton: {
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderBottomWidth: 2,
        borderBottomColor: 'transparent',
    },
    activeTab: {
        borderBottomColor: '#4B6EA8',
    },
    tabText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#000',
    },
    tabContent: {
        padding: 20,
        backgroundColor: '#F7F7F7',
        borderRadius: 10,
    },
    tabContentText: {
        fontSize: 14,
        color: '#333',
    },
});

export default DoctorAppointmentScreen;
