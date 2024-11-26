import * as Localization from 'react-native-localize';
import i18n from '../config/i18n';

export const handleLocalizationChange = () => {
    const { languageTag } = Localization.getLocales()[0]; // Get the first locale
    i18n.changeLanguage(languageTag); // Change the i18n language
};



