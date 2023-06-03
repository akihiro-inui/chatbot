import * as RNIap from 'react-native-iap';
import { APPLE_SHARED_SECRET, PURCHASE_TEST } from '@env';

let cachedAvailablePurchases = null;

async function getAvailablePurchases() {
  if (cachedAvailablePurchases === null) {
    cachedAvailablePurchases = await RNIap.getAvailablePurchases();
  }
  return cachedAvailablePurchases;
}

async function validateReceiptIos(latestAvailableReceipt) {
  const receiptBody = {
    'receipt-data': latestAvailableReceipt,
    'password': APPLE_SHARED_SECRET
  };

  return RNIap.validateReceiptIos({ receiptBody, isTest: PURCHASE_TEST });
}

async function validateReceiptAndroid() {
  let validatedPlan = 'trial';
    try {
      const purchases = await RNIap.getAvailablePurchases();
      if (purchases.length == 0 || !purchases) { return validatedPlan; }
      let receipt = JSON.parse(purchases[purchases.length - 1].transactionReceipt);
      if (receipt.productId == 'limited') {
        return 'limited';
      }
      else if (receipt.productId == 'unlimited') {
        return 'unlimited';
      }
    } catch (error) {
      console.log(error)
    }
  return validatedPlan;
}

export async function getCurrentSubscriptionFromServer() {
  let subscription = null;
  try {
    if (Platform.OS === 'ios') {
      const availablePurchases = await getAvailablePurchases();
      // If length of available purchases is 0, the user does not have a subscription
      if (availablePurchases.length === 0) {
        // console.log("No available purchases on server")
        return null;
      }
      const sortedAvailablePurchases = availablePurchases.sort(
        (a, b) => b.transactionDate - a.transactionDate
      );
      const latestAvailableReceipt = sortedAvailablePurchases[0].transactionReceipt;

      const [decodedReceipt] = await Promise.all([
        validateReceiptIos(latestAvailableReceipt)
      ]);

      const { latest_receipt_info: latestReceiptInfo } = decodedReceipt;

      const validReceipt = latestReceiptInfo.find(receipt => {
        const expirationInMilliseconds = Number(receipt.expires_date_ms);
        const nowInMilliseconds = Date.now();
        return expirationInMilliseconds > nowInMilliseconds;
      });

      if (validReceipt) {
        subscription = validReceipt.product_id;
      }
    } else if (Platform.OS === 'android') {
      const subscription = await validateReceiptAndroid();
      return subscription;
    }
  } catch (error) {
    // console.error('Error getting subscription from server:', error);
    return null;
  }

  return subscription;
}
