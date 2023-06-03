import { getCurrentSubscriptionFromServer } from "./getRemoteSubscription";
import AsyncStorage from '@react-native-async-storage/async-storage';


export async function getCurrentSubscription () {
    // Try to get subscription status from cache
    console.log('Getting subscription from cache')
    const cachedSubscription = await AsyncStorage.getItem('currentSubscription');
    if (cachedSubscription) {
        return cachedSubscription
    }

    // If the cached subscription does not exist, try to fetch it from the server
    try {
        const subscription = await getCurrentSubscriptionFromServer();
        if (!subscription) {
            return 'trial';
        }
    }
    catch (error) {
        console.error('Error getting subscription from server:', error);
    }
    return subscription;
};
