import { Share, Platform } from 'react-native';
import i18n from '../translations/translations';

export const shareApp = async () => {
try {
    const appStoreLink = Platform.select({
        ios: i18n.t("share.urlios"),
        android: i18n.t("share.urlandroid")
    });

    await Share.share({
        message: `${i18n.t("share.message")}: ${appStoreLink}`,
    });
    } catch (error) {
    console.log('Error sharing:', error);
    }
};
