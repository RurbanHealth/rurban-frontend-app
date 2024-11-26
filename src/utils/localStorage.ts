import AsyncStorage from '@react-native-async-storage/async-storage';

// Function to save data
export const storeData = async (key: string, value: string) => {
    try {
        await AsyncStorage.setItem(key, value);
        console.log('Data stored successfully!');
    } catch (error) {
        console.log('Failed to store data', error);
    }
};

// Function to retrieve data
export const getData = async (key: string) => {
    try {
        const value = await AsyncStorage.getItem(key);
        if (value !== null) {
            console.log('Data retrieved:', value);
            return value;
        }
    } catch (error) {
        console.log('Failed to retrieve data', error);
    }
};


// Function to remove data
export const removeData = async (key: string) => {
    try {
        await AsyncStorage.removeItem(key);
        console.log('Data removed successfully!');
    } catch (error) {
        console.log('Failed to remove data', error);
    }
};