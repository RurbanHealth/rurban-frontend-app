import { Linking, Alert } from 'react-native';
import Geolocation from '@react-native-community/geolocation';

export const openRandomLocationInMaps = () => {
    // Generate random latitude and longitude values
    const randomLatitude = (Math.random() * 180 - 90).toFixed(6); // Latitude between -90 and 90
    const randomLongitude = (Math.random() * 360 - 180).toFixed(6); // Longitude between -180 and 180
  
    // Create the Google Maps link with the random coordinates
    const url = `https://www.google.com/maps/search/?api=1&query=${randomLatitude},${randomLongitude}`;
  
    // Open the link in the Google Maps app or browser
    Linking.openURL(url).catch((err) => Alert.alert('Error', 'Failed to open Google Maps'));
  };

  // Function to get the current location coordinates
  export const getCurrentLocation = (setLocation: any) => {
    Geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        const coords = `${latitude},${longitude}`;
        console.log('Current Location:', coords);
        setLocation('location',coords);
        // Do something with the coordinates, like saving or using in the app
      },
      (error) => {
        console.log('Error getting location:', error.message);
        // Handle error
      },
      { timeout: 15000, maximumAge: 10000 }
    );
  };


  export const getDistanceInKm = (coords1: string, coords2: string) => {
    const toRadians = (degrees: any) => (degrees * Math.PI) / 180;
  
    const [lat1, lon1] = coords1.split(',').map(Number);
    const [lat2, lon2] = coords2.split(',').map(Number);
  
    const R = 6371; // Radius of the Earth in kilometers
    const dLat = toRadians(lat2 - lat1);
    const dLon = toRadians(lon2 - lon1);
  
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(toRadians(lat1)) * Math.cos(toRadians(lat2)) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
  
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  
    const distance = R * c; // Distance in kilometers
    return distance.toFixed(2); // Return distance rounded to 2 decimal places
  };