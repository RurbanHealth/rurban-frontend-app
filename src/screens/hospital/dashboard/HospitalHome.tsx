import Button from '@components/Button/Button';
import ScreenContainer from '@components/Container/ScreenContainer';
import PermissionDialog from '@components/Dialog/PermissionsDialog';
import Box from '@components/Layout/Box';
import ImageMedia from '@components/Media/ImageMedia';
import Typography from '@components/Typography/Typography';
import { openRandomLocationInMaps } from '../../../utils/location';
import { handlePermissionRequest, openAppSettings } from '../../../utils/permission';
import React, { useCallback, useEffect, useState } from 'react';
import { Alert, Dimensions, Platform, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { PERMISSIONS } from 'react-native-permissions';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import useHospital from '@hooks/rest/hospital/hospital';
import { formattedDate, formattedTime } from '@utils/date';
import { useAppSelector } from '@redux/store/store';
import Login from '@screens/common/Login';
import AnalogClock from '@components/Clock/ClockAnalog';
import Clock from '@components/Clock/Clock';
import { debounce, throttle } from 'lodash';
import ChatWidget from '@components/ChatWidget/ChatWidget';
import { io } from 'socket.io-client';
import RippleAnimation from '@components/Animated/Ripple/Ripple';


let socket: any;



const HospitalHome: React.FC = (props: any) => {
    const [dialogVisible, setDialogVisible] = useState(false);
    const [upcomingAppointments, setUpcomingAppointments] = useState<any>();
    const [previousAppointments, setPreviousAppointments] = useState<any>();
    const { loginInfo } = useAppSelector((state) => state.hospital)
    const { getUpcomingAppointments, getPreviousAppointments, updateCheckin } = useHospital();
    const [selectedTab, setSelectedTab] = useState('UpcomingAppointments');
    const [searchQuery, setSearchQuery] = useState(''); // State to track search query
    const [filteredAppointments, setFilteredAppointments] = useState<any[]>([]); // State to store filtered appointments

    // Function to handle tab switch
    const handleTabSwitch = (tab: string) => {
        setSelectedTab(tab);
        setFilteredAppointments([])
    };

    const onUpdateCheckin = async (item: any, action: string) => {
        await updateCheckin({ id: item.id, checkInStatus: action });
        const upcomingAppointments = await getUpcomingAppointments();
        setUpcomingAppointments(upcomingAppointments);
        const previousAppointments = await getPreviousAppointments();
        setPreviousAppointments(previousAppointments);
    }

    const UpcomingAppointmentItem = (item: any, index: number) => {
        return (
            <Box
                key={index}
                style={[styles.container, { marginTop: 10 }]}
                padding={10}
                backgroundColor="#fff"
            >
                {/* Header with Date and Time */}
                <Box flexDirection="row" justifyContent="space-between" alignItems="center" style={{ marginBottom: 16 }}>
                    <Box flexDirection="row" alignItems="center">
                        <Icon name="clock-outline" size={24} color="#000" />
                        <Typography variant="body" style={styles.timeText}>
                            ETA:
                        </Typography>
                        <Typography variant="body" style={styles.timeText}>
                            {item.eta}
                        </Typography>
                        <RippleAnimation
                                circleCount={5}
                                maxRadius={20}  // Set the ripple size
                                strokeColor="#6B7280"  // Customize the ripple color
                                strokeWidth={1}    // Set the stroke thickness
                                duration={2000}    // Animation duration
                            />
                    </Box>
                    <Box flexDirection="row" alignItems="center">
                        <Icon name="clock-outline" size={24} color="#000" />
                        <Typography variant="body" style={styles.timeText}>
                            {formattedTime(item.createdAt)}
                        </Typography>
                    </Box>
                </Box>

                <Box flexDirection="row" alignItems="center">
                    <Icon name="calendar" size={24} color="#000" />
                    <Typography variant="body" style={styles.dateText}>
                        {formattedDate(item.createdAt)}
                    </Typography>
                </Box>

                {/* University Details */}
                <Typography variant="h3" style={styles.universityName}>
                    {item.patientId.name}
                </Typography>
                <Typography variant="caption" style={styles.contactInfo}>
                    {item.patientId.phone}
                </Typography>

                {/* Check-in and Booking Status */}
                <Box style={{ marginTop: 16 }}>
                    <Typography variant="body">Check In Status: <Typography style={item.checkInStatus === "CheckedIn" ? styles.booked : { color: 'red' }}>{item.checkInStatus}</Typography></Typography>
                    <Typography variant="body" style={styles.bookingStatus}>
                        Booking Status: <Typography style={item.bookingStatus === "Booked" ? styles.booked : { color: 'red' }}>{item.bookingStatus}</Typography>
                    </Typography>
                </Box>

                {/* Action Buttons */}
                <Box flexDirection="row" justifyContent="space-between" style={{ marginTop: 16 }}>
                    <Button title="Check In" onPress={() => onUpdateCheckin(item, "CheckedIn")} style={{ backgroundColor: "transparent", borderColor: "#93a3c2", borderWidth: 0.5 }} textStyle={{ color: "#93a3c2" }} />
                    <Button title="No Show" onPress={() => onUpdateCheckin(item, "NoShow")} style={{ backgroundColor: "#33528b" }} />
                </Box>
            </Box>
        );
    };

    const PreviousAppointmentItem = (item: any, index: number) => {
        return (
            <Box
                key={index}
                style={[styles.container, { marginTop: 10 }]}
                padding={10}
                backgroundColor="#fff"
            >
                {/* Header with Date and Time */}
                <Box flexDirection="row" justifyContent="space-between" alignItems="center" style={{ marginBottom: 16 }}>
                    <Box flexDirection="row" alignItems="center">
                        <Icon name="calendar" size={24} color="#000" />
                        <Typography variant="body" style={styles.dateText}>
                            {formattedDate(item.createdAt)}
                        </Typography>
                    </Box>
                    <Box flexDirection="row" alignItems="center">
                        <Icon name="clock-outline" size={24} color="#000" />
                        <Typography variant="body" style={styles.timeText}>
                            {formattedTime(item.createdAt)}
                        </Typography>
                    </Box>
                </Box>

                {/* University Details */}
                <Typography variant="h3" style={styles.universityName}>
                    {item.patientId.name}
                </Typography>
                <Typography variant="caption" style={styles.contactInfo}>
                    {item.patientId.phone}
                </Typography>

                {/* Check-in and Booking Status */}
                <Box style={{ marginTop: 16 }}>
                    <Typography variant="body">Check In Status: <Typography style={item.checkInStatus === "CheckedIn" ? styles.booked : { color: 'red' }}>{item.checkInStatus}</Typography></Typography>
                    <Typography variant="body" style={styles.bookingStatus}>
                        Booking Status: <Typography style={item.bookingStatus === "Booked" ? styles.booked : { color: 'red' }}>{item.bookingStatus}</Typography>
                    </Typography>
                </Box>

                {/* Action Buttons */}
                {/* <Box flexDirection="row" justifyContent="space-between" style={{ marginTop: 16 }}>
                    <Button title="Check In" onPress={() => { }} style={{ backgroundColor: "transparent", borderColor: "#93a3c2", borderWidth: 0.5 }} textStyle={{ color: "#93a3c2" }} />
                    <Button title="Directions" onPress={openRandomLocationInMaps} style={{ backgroundColor: "#33528b" }} />
                </Box> */}
            </Box>
        );
    };

    // Filter appointments based on search query
    const filterAppointments = (appointments: any[], query: string) => {
        if (!query) return appointments;
        return appointments?.filter((item) =>
            item.patientId.patientName.toLowerCase().includes(query.toLowerCase()) ||
            item.patientId.patientContact?.toString().includes(query)
        );
    };

    // Debounced search handler to update the search query
    const debouncedSearch = useCallback(
        debounce((query: string) => {
            const appointmentsToFilter = selectedTab === 'UpcomingAppointments' ? upcomingAppointments : previousAppointments;
            setFilteredAppointments(filterAppointments(appointmentsToFilter, query));
        }, 400), // Adjust the delay as needed (300ms in this case)
        [upcomingAppointments, previousAppointments, selectedTab]
    );

    // Throttled handler for onChangeText, to reduce how often setSearchQuery is called
    const handleSearchChange = useCallback(
        throttle((text: string) => {
            setSearchQuery(text);
            debouncedSearch(text); // Call the debounced search
        }, 500), // Throttle to limit calls every 500ms
        [debouncedSearch]
    );

    // Function to handle clearing search input
    const clearSearch = () => {
        setSearchQuery('');
        setFilteredAppointments([]); // Optionally clear filtered results or reset
    };

    // Function to handle location permission request
    const handleLocationPermission = () => {
        return handlePermissionRequest(
            Platform.OS === 'android'
                ? PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION
                : PERMISSIONS.IOS.LOCATION_WHEN_IN_USE, // iOS permission

            () => {
                console.log('Location permission granted');
                // Handle granted permission (e.g., start fetching location)
                setDialogVisible(false);
            },
            () => {
                console.log('Location permission denied');
                // Handle denied permission
                setDialogVisible(false);
            },
            () => {
                console.log('Location permission blocked');
                // Open app settings if blocked
                openAppSettings();
                setDialogVisible(false);
            }
        );
    };

    // Function to show the permission dialog
    const showPermissionDialog = () => {
        setDialogVisible(true);
    };

    useEffect(() => {
        // showPermissionDialog();
        if (!socket) {
            socket = io(process.env.SOCKET_BASE_URL);
        }
        if (upcomingAppointments?.length > 0) {
            socket.on("eta-beat-broadcast", ({
                location,
                appointmentId,
                patientId,
                hospitalId,
                eta
            }: any) => {
                console.log(eta, "WE RECEIVED AN ETA FROM A PATIENT")
                Alert.alert("WE RECEIVED AN ETA FROM A PATIENT")
                setUpcomingAppointments((prevAppointments: any) =>
                    prevAppointments.map((appointment: any) =>
                        appointment.id === appointmentId
                            ? { ...appointment, eta }
                            : appointment
                    )
                );
            })
        }
    }, [])

    useEffect(() => {
        (async () => {
            if (selectedTab === "UpcomingAppointments") {
                const upcomingAppointments = await getUpcomingAppointments();
                setUpcomingAppointments(upcomingAppointments);
            }
        })()
    }, [selectedTab])

    useEffect(() => {
        (async () => {
            if (selectedTab === "PreviousAppointments") {
                const previousAppointments = await getPreviousAppointments();
                setPreviousAppointments(previousAppointments);
            }
        })()
    }, [selectedTab])

    return (
        <ScreenContainer containerStyle={{ paddingHorizontal: 10, }}>

            {/* Top Section */}
            <View style={styles.topSection}>
                <Box flexDirection='row' justifyContent='space-between' style={{ marginTop: 10 }}>
                    <Box flexDirection='row'>
                        <Box>
                            <ImageMedia source={require("@assets/logo.png")} type='image' />
                        </Box>
                        <Box style={{ marginLeft: 10 }}>
                            <Typography style={{ color: 'white' }}>Welcome,</Typography>
                            <Typography style={{ color: 'white', fontSize: 12 }}>{loginInfo?.name}</Typography>
                        </Box>
                    </Box>
                    <Icon onPress={props.navigation.openDrawer} name='menu' color="#FFF" size={30} />
                </Box>

                {/* <Box style={{ marginLeft: 10, justifyContent:'center', alignItems:'center', flexDirection:'row' }}> */}
                {/* <Box style={{ marginLeft: 10, justifyContent:'center', alignItems:'center', marginRight:20 }}>
                    <Typography variant='h1' color='#FFFFFF' style={{fontFamily:'OpenSans-Regular'}}>Welcome,</Typography>
                    <Typography variant='h3' style={{fontWeight:'normal'}} color='#FFFFFF'>{loginInfo?.details.name}</Typography>
                    </Box> */}
                {/* <AnalogClock clockSize={100} hourHandLength={25} hourHandWidth={2.5} minuteHandLength={35} minuteHandWidth={2.5} secondHandLength={40} secondHandWidth={2} hourHandColor='#FFFFFF' minuteHandColor='#FFFFFF' secondHandColor='white' clockCentreColor='#FFFFFF' clockBorderWidth={2.5} /> */}
                {/* <Clock format='12'/> */}
                {/* </Box> */}

                {/* Search Input */}
                <View style={styles.searchContainer}>
                    <Icon
                        name={searchQuery ? 'close' : 'magnify'}
                        size={20}
                        color="#000"
                        onPress={searchQuery ? clearSearch : undefined} // Clear if cross icon, otherwise do nothing
                        style={styles.icon}
                    />
                    <TextInput
                        style={styles.searchInput}
                        placeholder="Search appointments by name or contact..."
                        value={searchQuery}
                        onChangeText={handleSearchChange} // Call throttled handler on input change
                    />
                </View>
            </View>

            {/* Bottom Section with Tabs */}
            <View style={styles.bottomSection}>
                {/* Tab Buttons */}
                <View style={styles.tabContainer}>
                    <TouchableOpacity
                        style={[
                            styles.tabButton,
                            { justifyContent: 'center' },
                            selectedTab === 'UpcomingAppointments' ? styles.activeTab : {},
                        ]}
                        onPress={() => handleTabSwitch('UpcomingAppointments')}
                    >
                        <Text style={selectedTab === 'UpcomingAppointments' ? styles.activeTabText : styles.tabText}>Upcoming</Text>
                        {/* <Text style={styles.tabText}>Appointments</Text> */}
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={[
                            styles.tabButton,
                            selectedTab === 'PreviousAppointments' ? styles.activeTab : {},
                        ]}
                        onPress={() => handleTabSwitch('PreviousAppointments')}
                    >
                        <Text style={selectedTab === 'PreviousAppointments' ? styles.activeTabText : styles.tabText}>Previous</Text>
                        {/* <Text style={styles.tabText}>Appointments</Text> */}
                    </TouchableOpacity>
                </View>

                {/* Dynamic Content based on selectedTab */}
                {!searchQuery && selectedTab === 'UpcomingAppointments' && (
                    <ScrollView style={styles.tabContent} contentContainerStyle={{ paddingBottom: 40 }} showsVerticalScrollIndicator={false}>
                        {Array.isArray(upcomingAppointments) && upcomingAppointments?.map(UpcomingAppointmentItem)}
                    </ScrollView>
                )}

                {!searchQuery && selectedTab === 'PreviousAppointments' && (
                    <ScrollView style={styles.tabContent} contentContainerStyle={{ paddingBottom: 40 }} showsVerticalScrollIndicator={false}>
                        {Array.isArray(previousAppointments) && previousAppointments?.map(PreviousAppointmentItem)}
                    </ScrollView>
                )}

                {filteredAppointments?.length > 0 &&
                    filteredAppointments?.map((item) => {
                        if (selectedTab === 'UpcomingAppointments') {
                            return (
                                <ScrollView style={styles.tabContent} contentContainerStyle={{ paddingBottom: 40 }} showsVerticalScrollIndicator={false}>
                                    {Array.isArray(filteredAppointments) && filteredAppointments?.map(UpcomingAppointmentItem)}
                                </ScrollView>
                            )

                        }
                        else if (selectedTab === 'PreviousAppointments') {
                            return (
                                <ScrollView style={styles.tabContent} contentContainerStyle={{ paddingBottom: 40 }} showsVerticalScrollIndicator={false}>
                                    {Array.isArray(filteredAppointments) && filteredAppointments?.map(PreviousAppointmentItem)}
                                </ScrollView>
                            )
                        }
                        else {
                            <></>
                        }
                    })
                }
            </View>

            <PermissionDialog
                visible={dialogVisible}
                permissionTitle="Location Permission"
                permissionMessage="This app needs access to your location to provide features
        to calculate ETA to hospital"
                onCancel={() => setDialogVisible(false)}
                onConfirm={handleLocationPermission}
            />

            <ChatWidget />
        </ScreenContainer>
    );
};

export default HospitalHome;

const styles = StyleSheet.create({
    container: {
        borderColor: '#E5E7EB',
        borderRadius: 10,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 5,
        backgroundColor: '#fff', // Ensure you set a background color
        elevation: 2,
    },
    dateText: {
        marginLeft: 8,
        fontSize: 16,
    },
    timeText: {
        // marginLeft: 8,
        fontSize: 16,
    },
    universityName: {
        fontWeight: 'bold',
        fontSize: 18,
        marginBottom: 8,
    },
    contactInfo: {
        color: '#6B7280',
        marginBottom: 8,
    },
    bookingStatus: {
        color: '#6B7280',
    },
    booked: {
        color: 'green',
        fontWeight: 'bold',
    },
    hospitalImage: {
        width: 50,
        height: 50,
        borderRadius: 25,
    },
    hospitalName: {
        fontWeight: 'bold',
        fontSize: 18,
    },
    distanceText: {
        fontWeight: 'bold',
        color: '#1E3A8A',
    },
    address: {
        marginLeft: 8,
        color: '#6B7280',
    },

    // container: {
    //     flex: 1,
    //     backgroundColor: '#f7f7f7',
    // },
    topSection: {
        backgroundColor: '#4B6EA8',
        borderBottomLeftRadius: 30,
        borderBottomRightRadius: 30,
        padding: 20,
        height: 180, // Adjust this to your desired height
    },
    bottomSection: {
        backgroundColor: '#fff',
        borderTopLeftRadius: 30,
        borderTopRightRadius: 30,
        marginTop: -20, // Adjust this value based on overlap with the top section
        paddingHorizontal: 20,
        paddingTop: 20,
    },
    tabContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        backgroundColor: '#F7F7F7',
        marginBottom: 20,
    },
    tabButton: {
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderBottomWidth: 2,
        width: '50%',
        borderBottomColor: 'transparent',
    },
    activeTab: {
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderBottomWidth: 2,
        // borderBottomColor: '#33528b',
        shadowColor: "#000", // Color of the shadow
        shadowOffset: {
            width: 0, // Horizontal shadow offset
            height: 2, // Vertical shadow offset
        },
        shadowOpacity: 0.25, // Opacity of the shadow
        shadowRadius: 3.84, // Blur radius of the shadow
        backgroundColor: '#fff', // Ensure you set a background color
        borderRadius: 8,
        elevation: 2,
    },
    activeTabText: {
        fontSize: 16,
        // fontWeight: 'bold',
        color: '#33528b',
        textAlign: 'center'
    },
    tabText: {
        fontSize: 16,
        // fontWeight: 'bold',
        color: '#000',
        textAlign: 'center'
    },
    tabContent: {
        padding: 20,
        backgroundColor: '#F7F7F7',
        borderRadius: 10,
        height: Dimensions.get("window").height - 280,
    },
    tabContentText: {
        fontSize: 14,
        color: '#333',
    },
    searchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#f0f0f0',
        paddingHorizontal: 15,
        borderRadius: 10,
        marginVertical: 20,
    },
    icon: {
        marginRight: 10,
    },
    // searchInput: {
    //     flex: 1, // Allows input to take up the rest of the row
    // },
    searchInput: {
        backgroundColor: '#f0f0f0',
        // paddingHorizontal: 15,
        // paddingVertical: 10,
        borderRadius: 10,
        // marginVertical: 20,
    },
    appointmentContainer: {
        padding: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#ddd',
    },
    appointmentText: {
        fontSize: 16,
    },
});


