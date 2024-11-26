import Button from '@components/Button/Button';
import ScreenContainer from '@components/Container/ScreenContainer';
import PermissionDialog from '@components/Dialog/PermissionsDialog';
import Box from '@components/Layout/Box';
import ImageMedia from '@components/Media/ImageMedia';
import Typography from '@components/Typography/Typography';
import { getDistanceInKm, openRandomLocationInMaps } from '../../../utils/location';
import { handlePermissionRequest, openAppSettings } from '../../../utils/permission';
import React, { useCallback, useEffect, useState } from 'react';
import { Alert, Dimensions, Platform, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { PERMISSIONS } from 'react-native-permissions';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import usePatient from '@hooks/rest/patient/patient';
import { useAppSelector } from '@redux/store/store';
import { formattedDate, formattedTime } from '@utils/date';
import Dialog from '@components/Dialog/Dialog';
import { debounce, throttle } from 'lodash';
import Geolocation from '@react-native-community/geolocation';
import { io } from 'socket.io-client';




const PatientHome: React.FC = (props: any) => {
    const [cancelDialogVisible, setCancelDialogVisible] = useState(false);
    const [checkinSelected, setCheckinSelected] = useState<number | string | null>(null);
    const [dialogVisible, setDialogVisible] = useState(false);
    const [checkins, setCheckins] = useState<any>();
    const [hospitals, setHospitals] = useState<any>();
    const { loginInfo } = useAppSelector((state) => state.patient)
    const { getAllCheckins, getAllHospitals, createCheckin, updateCheckin } = usePatient();
    const [selectedTab, setSelectedTab] = useState('Checkins');
    const [searchQuery, setSearchQuery] = useState(''); // State to track search query
    const [patientLocation, setPatientLocation] = useState(''); // State to track search query
    const [filteredCheckinsOrHospitals, setFilteredCheckinsOrHospitals] = useState<any[]>([]); // State to store filtered appointments
    let socket: any;

    socket = io(process.env.SOCKET_BASE_URL);

    // Function to handle tab switch
    const handleTabSwitch = (tab: string) => {
        setSelectedTab(tab);
        setFilteredCheckinsOrHospitals([])
    };

    const CheckInItem = (item: any, index: number) => {
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
                            {formattedDate(item.bookingDate)}
                        </Typography>
                    </Box>
                    <Box flexDirection="row" alignItems="center">
                        <Icon name="clock-outline" size={24} color="#000" />
                        <Typography variant="body" style={styles.timeText}>
                            {formattedTime(item.bookingDate)}
                        </Typography>
                    </Box>
                </Box>

                {/* University Details */}
                <Typography variant="h3" style={styles.universityName}>
                    {item?.hospitalId.name}
                </Typography>
                <Typography variant="caption" style={styles.contactInfo}>
                    {item?.hospitalId.phone}
                </Typography>

                {/* Check-in and Booking Status */}
                <Box style={{ marginTop: 16 }}>
                    <Typography variant="body">Check In Status: <Typography style={item.checkInStatus === "CheckedIn" ? styles.booked : { color: 'red' }}>{item?.checkInStatus}</Typography></Typography>
                    <Typography variant="body" style={styles.bookingStatus}>
                        Booking Status: <Typography style={item.bookingStatus === "Booked" ? styles.booked : { color: 'red' }}>{item?.bookingStatus}</Typography>
                    </Typography>
                </Box>

                {/* Action Buttons */}
                <Box flexDirection="row" justifyContent="space-between" style={{ marginTop: 16 }}>
                    <Button title="Cancel" onPress={() => showCancelCheckinDialog(item.id)} style={{ backgroundColor: "transparent", borderColor: "#93a3c2", borderWidth: 0.5 }} textStyle={{ color: "#93a3c2" }} />
                    <Button title="Directions" onPress={openRandomLocationInMaps} style={{ backgroundColor: "#33528b" }} />
                </Box>
            </Box>
        );
    };

    const HospitalItem = (item: any, index: number, patientLocation: string) => {
        return (
            <Box
                key={index}
                style={[styles.container, { marginTop: 10 }]}
                padding={16}
                backgroundColor="#fff"
            >
                {/* Hospital Image and Name */}
                <Box flexDirection="row" justifyContent="space-between" alignItems="center">
                    <Box flexDirection="row" alignItems="center">
                        <ImageMedia
                            source={{ uri: 'data:image/png;base64,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' }} // Placeholder for hospital image
                            imageStyle={styles.hospitalImage}
                            type='image'
                        />
                        <Box style={{ marginLeft: 16 }}>
                            <Typography numberOfLines={1} variant="h3" style={styles.hospitalName}>
                                {item.name}
                            </Typography>
                            <Typography variant="caption" style={styles.contactInfo}>
                                {item.clinicContact}
                            </Typography>
                        </Box>
                    </Box>
                    {/* Distance */}
                    <Box flexDirection='row' alignItems='center' style={{ marginRight: 20 }}>
                        {patientLocation && item.location.includes(',') && <Typography numberOfLines={1} variant="body" style={styles.distanceText}>
                            {isNaN(parseInt(getDistanceInKm(item.location, patientLocation))) ? 0 : Math.round(parseFloat(getDistanceInKm(item.location, patientLocation)))} Kms
                        </Typography>}
                    </Box>
                </Box>

                {/* Address */}
                <Box flexDirection="row" alignItems="center" style={{ marginTop: 8 }}>
                    <Icon name="map-marker-outline" size={24} color="#6B7280" />
                    <Typography variant="caption" style={styles.address}>
                        City of Arabia, Dubai, United Arab Emirates
                    </Typography>
                </Box>

                {/* Action Buttons */}
                <Box flexDirection="row" justifyContent="space-between" style={{ marginTop: 16 }} >
                    <Button title="Check In" onPress={() => onCreateCheckin(item.id, item.location)} style={{ backgroundColor: "transparent", borderColor: "#93a3c2", borderWidth: 0.5 }} textStyle={{ color: "#93a3c2" }} />
                    <Button title="Directions" onPress={openRandomLocationInMaps} style={{ backgroundColor: "#33528b" }} />
                </Box>
            </Box>
        );
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
                Geolocation.getCurrentPosition(
                    (position) => {
                        const { latitude, longitude } = position.coords;
                        const coords = `${latitude},${longitude}`;
                        console.log('Current Location:', coords);
                        setPatientLocation(coords);
                    },
                    (error) => {
                        console.log('Error getting location:', error.message);
                        // Handle error
                    },
                    { timeout: 15000, maximumAge: 10000 }
                );
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
        (async () => {
            const allCheckins = await getAllCheckins();
            setCheckins(allCheckins);
            const allHospitals = await getAllHospitals();
            setHospitals(allHospitals);
        })()
    };

    // Function to show the cancel checkin dialog
    const showCancelCheckinDialog = (id?: number | string) => {
        if (id) setCheckinSelected(id)
        setCancelDialogVisible(true);
    };

    const onCancelCheckin = async () => {
        // call cancel checking API
        if (checkinSelected) {
            const cancelCheckinResult = await updateCheckin({ id: checkinSelected, bookingStatus: "Cancelled", });
            if (cancelCheckinResult?.bookingStatus === "Cancelled") {
                setCancelDialogVisible(false);
                const checkins = await getAllCheckins();
                setCheckins(checkins);
            }
        }
    }

    const onCreateCheckin = async (hospitalId: string | number, hospitalLocation: string) => {
        const createCheckinResult = await createCheckin({ hospitalId, patientId: loginInfo?.id, location: patientLocation, hospitalLocation, bookingStatus: "Booked", checkInStatus: "" });
        if (createCheckinResult?.bookingStatus === "Booked") {
            const checkins = await getAllCheckins();
            setCheckins(checkins);
        }
    }

    // Filter appointments based on search query
    const filterCheckinOrHospital = (records: any[], query: string) => {
        if (!query) return records;
        return records?.filter((item) => {
            return item?.hospitalId?.name.toLowerCase().includes(query.toLowerCase()) ||
                item?.name?.toLowerCase().includes(query.toLowerCase())
        }
        );
    };

    // Debounced search handler to update the search query
    const debouncedSearch = useCallback(
        debounce((query: string) => {
            const recordsToFilter = selectedTab === 'Checkins' ? checkins : hospitals;
            setFilteredCheckinsOrHospitals(filterCheckinOrHospital(recordsToFilter, query));
        }, 500), // Adjust the delay as needed (300ms in this case)
        [checkins, hospitals, selectedTab]
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
        setFilteredCheckinsOrHospitals([]); // Optionally clear filtered results or reset
    };


    useEffect(() => {
        showPermissionDialog();
        // Initialize the socket connection
        
        (async () => {
            const checkins = await getAllCheckins();
            setCheckins(checkins);
            const hospitals = await getAllHospitals();
            setHospitals(hospitals);
        })()
    }, [])

    useEffect(()=>{
        let intervalId = null;
        if (checkins?.length > 0) {
            // Function to be called at intervals
            intervalId = setInterval(async () => {
                // Handle incoming messages
                socket.emit('eta-beat', {
                    location: patientLocation,
                    appointmentId: checkins[0]?.id || "",
                    patientId: checkins[0]?.patientId || "",
                    hospitalId: checkins[0]?.hospitalId || "",
                    hospitalLocation: checkins[0]?.hospitalLocation || ""
                });
            }, 5000);
        }

        // Clean up the interval on component unmount
        return () => {
            intervalId && clearInterval(intervalId);
        };
    },[checkins?.length])


    return (
        <ScreenContainer>
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
                        placeholder="Search checkins/hospitals by name"
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
                            selectedTab === 'Checkins' ? styles.activeTab : {},
                        ]}
                        onPress={() => handleTabSwitch('Checkins')}
                    >
                        <Text style={selectedTab === 'Checkins' ? styles.activeTabText : styles.tabText}>Checkins</Text>
                        {/* <Text style={styles.tabText}>Appointments</Text> */}
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={[
                            styles.tabButton,
                            selectedTab === 'Hospitals' ? styles.activeTab : {},
                        ]}
                        onPress={() => handleTabSwitch('Hospitals')}
                    >
                        <Text style={selectedTab === 'Hospitals' ? styles.activeTabText : styles.tabText}>Hospitals</Text>
                        {/* <Text style={styles.tabText}>Appointments</Text> */}
                    </TouchableOpacity>
                </View>

                {/* Dynamic Content based on selectedTab */}
                {!searchQuery && selectedTab === 'Checkins' && (
                    <ScrollView style={styles.tabContent} contentContainerStyle={{ paddingBottom: 40 }} showsVerticalScrollIndicator={false}>
                        {Array.isArray(checkins) && checkins?.map(CheckInItem)}
                    </ScrollView>
                )}

                {!searchQuery && selectedTab === 'Hospitals' && (
                    <ScrollView style={styles.tabContent} contentContainerStyle={{ paddingBottom: 40 }} showsVerticalScrollIndicator={false}>
                        {Array.isArray(hospitals) && hospitals?.map((item, index) => HospitalItem(item, index, patientLocation))}
                    </ScrollView>
                )}

                {filteredCheckinsOrHospitals?.length > 0 &&
                    filteredCheckinsOrHospitals?.map((item) => {
                        if (selectedTab === 'Checkins') {
                            return (
                                <ScrollView style={styles.tabContent} contentContainerStyle={{ paddingBottom: 40 }} showsVerticalScrollIndicator={false}>
                                    {Array.isArray(filteredCheckinsOrHospitals) && filteredCheckinsOrHospitals?.map(CheckInItem)}
                                </ScrollView>
                            )

                        }
                        else if (selectedTab === 'Hospitals') {
                            return (
                                <ScrollView style={styles.tabContent} contentContainerStyle={{ paddingBottom: 40 }} showsVerticalScrollIndicator={false}>
                                    {Array.isArray(filteredCheckinsOrHospitals) && filteredCheckinsOrHospitals?.map((item, index) => HospitalItem(item, index, patientLocation))}
                                </ScrollView>
                            )
                        }
                        else {
                            <></>
                        }
                    })
                }
            </View>

            <Dialog
                visible={cancelDialogVisible}
                title="Cancel Checkin"
                message="Are you sure you want to cancel the check in?"
                onCancel={() => setCancelDialogVisible(false)}
                onConfirm={onCancelCheckin}
            />


            <PermissionDialog
                visible={dialogVisible}
                permissionTitle="Location Permission"
                permissionMessage="This app needs access to your location to provide features
        to calculate ETA to hospital"
                onCancel={() => setDialogVisible(false)}
                onConfirm={handleLocationPermission}
            />
        </ScreenContainer>
    );
};

export default PatientHome;

const styles = StyleSheet.create({
    container: {
        borderWidth: 1,
        borderColor: '#E5E7EB',
        borderRadius: 10,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 5
    },
    dateText: {
        marginLeft: 8,
        fontSize: 16,
    },
    timeText: {
        marginLeft: 8,
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
        width: '90%'
    },
    distanceText: {
        fontSize: 10,
        padding: 4,
        borderWidth: 0.5,
        borderColor: "#1E3A8A",
        borderRadius: 20,
        fontWeight: 'bold',
        color: '#1E3A8A',
        marginLeft: 10,
        // width:'30%'
    },
    address: {
        marginLeft: 8,
        color: '#6B7280',
    },
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
        // paddingHorizontal: 20,
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
});