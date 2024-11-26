import { Platform, Linking } from 'react-native';
import { check, request, RESULTS, Permission } from 'react-native-permissions';

export const handlePermissionRequest = async (
  permission: Permission,
  onGranted: () => void,
  onDenied: () => void,
  onBlocked: () => void
) => {
  try {
    const result = await check(permission);
    switch (result) {
      case RESULTS.UNAVAILABLE:
        console.log('This feature is not available on this device or in this context');
        break;
      case RESULTS.DENIED:
        const requestResult = await request(permission);
        if (requestResult === RESULTS.GRANTED) {
          onGranted();
        } else if (requestResult === RESULTS.DENIED) {
          onDenied();
        }
        break;
      case RESULTS.GRANTED:
        onGranted();
        break;
      case RESULTS.BLOCKED:
        onBlocked();
        break;
    }
  } catch (error) {
    console.log('Permission request error: ', error);
  }
};

export const openAppSettings = () => {
  if (Platform.OS === 'ios') {
    Linking.openURL('app-settings:');
  } else {
    Linking.openSettings();
  }
};
