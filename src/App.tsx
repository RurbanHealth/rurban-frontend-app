import React, { useEffect } from 'react';
import { I18nextProvider } from 'react-i18next';
import i18n from './config/i18n';
import { NavigationContainer } from '@react-navigation/native';
import RootNavigator from '@navigation/root';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { Provider } from 'react-redux';
import store, { useAppSelector } from '@redux/store/store';
import LoadingScreen from '@components/Loader/Loading';
import Toast from 'react-native-toast-message';
import toastConfig from '@components/Toast/Toast';
import { handleLocalizationChange } from '@utils/languageListener';

function AppContainer() {
  const { loading } = useAppSelector(state => state.appConfig);
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <NavigationContainer theme={{
        colors: {
          background: 'transparent',
          primary: '',
          card: '',
          text: '',
          border: '',
          notification: ''
        }
      } as any}>
        <RootNavigator />
        {loading && <LoadingScreen />}
        <Toast config={toastConfig} />
      </NavigationContainer>

    </GestureHandlerRootView>

  )
}

function App(): React.JSX.Element {

  useEffect(() => {
    // Initial language setup based on the device's locale
    handleLocalizationChange();
  }, [])

  return (
    <Provider store={store}>
      <I18nextProvider i18n={i18n}>
        <AppContainer />
      </I18nextProvider>
    </Provider>
  );
}

export default App;
