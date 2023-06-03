import React, { useState, useEffect, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Image,
  ScrollView,
  Keyboard,
  ActivityIndicator
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import * as RNIap from 'react-native-iap';
import * as StoreReview from 'expo-store-review';

import i18n from '../translations/translations';
import { getCurrentSubscriptionFromServer } from "./getRemoteSubscription";
import { 
  LIMITED_SUBSCRIPTION_SKU_APPLE,
  UNLIMITED_SUBSCRIPTION_SKU_APPLE,
  LIMITED_SUBSCRIPTION_SKU_GOOGLE,
  UNLIMITED_SUBSCRIPTION_SKU_GOOGLE,
  LIMITED_SUBSCRIPTION_OFFER_TOKEN_GOOGLE,
  UNLIMITED_SUBSCRIPTION_OFFER_TOKEN_GOOGLE
} from '@env';

const subscriptionSKUs = Platform.select({
  // Name of SKU must match the one from Google Play console and App Store Connect
  ios: [LIMITED_SUBSCRIPTION_SKU_APPLE, UNLIMITED_SUBSCRIPTION_SKU_APPLE],
  android: [LIMITED_SUBSCRIPTION_SKU_GOOGLE, UNLIMITED_SUBSCRIPTION_SKU_GOOGLE],
});

const SubscriptionModal = ({ visible, onRequestClose, onSubscriptionChange, onSubscriptionSuccess }) => {
  const [selectedPlan, setSelectedPlan] = useState('limited');
  const [availableProducts, setAvailableProducts] = useState([]);
  const [tosVisible, setTosVisible] = useState(false);
  const [prvVisible, setPrvVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [reviewProvided, setReviewProvided] = useState(false); // Track if the user has provided a review


  useEffect(() => {
    // Get available subscriptions and set them in state
    async function fetchSubscriptions() {
      try {
        await RNIap.initConnection();
        const availableProducts = await RNIap.getSubscriptions({skus:subscriptionSKUs});
        setAvailableProducts(availableProducts);
      } catch (err) {
        console.log(err);
      }
    }
    fetchSubscriptions();
  }, []);

  const handleTosModal = useCallback(() => {
    setTosVisible(!tosVisible);
  }, [tosVisible]);

  const handlePrvModal = useCallback(() => {
    setPrvVisible(!prvVisible);
  }, [prvVisible]);

  const selectPlan = useCallback((plan) => {
    setSelectedPlan(plan);
  }, []);

  const restorePurchase = useCallback(async () => {
    try {
      // console.log('Trying to restore the subscription')
      const subscription = await getCurrentSubscriptionFromServer();
      if (!subscription) {
        await AsyncStorage.setItem('currentSubscription', 'trial');
      }
      // console.log(`User has ${subscription} subscription`)
      if (subscription == 'limited' || subscription == 'unlimited') {
        // Set active plan in AsyncStorage
        await AsyncStorage.setItem('currentSubscription', subscription);
        Alert.alert(i18n.t("subscription.restoredTitle"), i18n.t("subscription.restoredText"));
        onRequestClose();
      }
      else {
        Alert.alert(i18n.t("subscription.restoredFailedTitle"), i18n.t("subscription.restoredFailedText"));
      }
    } catch (err) {
      // console.log(err);
      Alert.alert(i18n.t("subscription.restoredFailedTitle"), i18n.t("subscription.restoreFailedError"));
    }
  }, []);

  const handleFailedPurchase = useCallback(() => {
    Keyboard.dismiss();
    Alert.alert(i18n.t("subscription.subscribeFailedTitle"), i18n.t("subscription.subscribeFailedText"));
  }, []);

  const handlePurchase = useCallback(async (productId) => {
    setLoading(true);
    try {
      // console.log(`User wants to purchase ${productId}`);
      let currentSubscription = await getCurrentSubscriptionFromServer();
      if (productId === currentSubscription) {
        Keyboard.dismiss();
        Alert.alert(i18n.t("subscription.alreadySubscribedTitle"));
        return;
      }
      if (Platform.OS === 'ios') {
        const purchase = await RNIap.requestSubscription({ sku: productId });
        if (purchase) {
          {
            Alert.alert(i18n.t("subscription.subscribedTitle"), i18n.t("subscription.subscribedText"));
            onRequestClose();
            setSelectedPlan(productId);
            onSubscriptionSuccess(productId);
          }
          if (!reviewProvided) { // Check if the user has already provided a review
            setTimeout(() => {
              StoreReview.requestReview();
              // Update the review status in AsyncStorage
              AsyncStorage.setItem('reviewStatus', 'provided');
              setReviewProvided(true);
            }, 10000); // Pause for 10 seconds before requesting a review
          }
        } else {
          handleFailedPurchase();
        }
      }
      else if (Platform.OS === 'android') {
        const subscriptions = await RNIap.getSubscriptions({skus:subscriptionSKUs});
        let offerToken;
        if (productId == 'limited') {
          offerToken = LIMITED_SUBSCRIPTION_OFFER_TOKEN_GOOGLE;
        } else if (productId == 'unlimited') {
          offerToken = UNLIMITED_SUBSCRIPTION_OFFER_TOKEN_GOOGLE;
        }
        
        purchase = await RNIap.requestSubscription({
          sku: productId,
          subscriptionOffers: [{sku: productId, offerToken}],
        });

        if (purchase) {
          {
            Alert.alert(i18n.t("subscription.subscribedTitle"), i18n.t("subscription.subscribedText"));
            onRequestClose();
            setSelectedPlan(productId);
            onSubscriptionSuccess(productId);
            if (!reviewProvided) { // Check if the user has already provided a review
              setTimeout(() => {
                StoreReview.requestReview();
                // Update the review status in AsyncStorage
                AsyncStorage.setItem('reviewStatus', 'provided');
                setReviewProvided(true);
              }, 10000); // Pause for 10 seconds before requesting a review
            }
          }
        } else {
          handleFailedPurchase();
        }
      }
    } catch (err) {
      handleFailedPurchase();
    } finally {
      setLoading(false);
    }
  }, [onRequestClose, onSubscriptionSuccess]);  
  
  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClo
      se={onRequestClose}
    >
      <View style={styles.centeredView}>
        <View style={styles.modalView}>
          <TouchableOpacity
            style={styles.closeButton}
            onPress={onRequestClose}
          >
            <Icon name="close" size={24} color="#000" />
          </TouchableOpacity>
          <ScrollView contentContainerStyle={styles.scrollViewContainer}>
            <Image
              source={require('../assets/icon.png')}
              style={styles.icon}
              resizeMode="contain"
            />
            <Text style={styles.modalText}>
              {i18n.t('subscription.description')}
            </Text>
            <View style={styles.subscriptionContainer}>
              <TouchableOpacity onPress={() => selectPlan('limited')}>
                <View
                  style={[
                    styles.limitedContainer,
                    selectedPlan === 'limited'
                      ? styles.selectedPlanBorder
                      : null,
                  ]}
                >
                  <View style={styles.limitedWrapper}>
                    <Text style={styles.popularLabel}>{i18n.t('subscription.popular')}</Text>
                    <Text style={styles.limitedTitle}>{i18n.t('subscription.limitedTitle')}</Text>
                    <Text style={styles.limitedPrice}>
                      {i18n.t('subscription.limitedPrice')}
                    </Text>
                    <Text style={styles.limitedDescription}>
                      {i18n.t('subscription.limitedDescription')}
                    </Text>
                  </View>
                </View>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => selectPlan('unlimited')}>
                <View
                  style={[
                    styles.unlimitedContainer,
                    selectedPlan === 'unlimited'
                      ? styles.selectedPlanBorder
                      : null,
                  ]}
                >
                  <Text style={styles.unlimitedTitle}>{i18n.t('subscription.unlimitedTitle')}</Text>
                  <Text style={styles.unlimitedPrice}>
                    {i18n.t('subscription.unlimitedPrice')}
                    </Text>
                  <Text style={styles.unlimitedDescription}>
                  {i18n.t('subscription.unlimitedDescription')}
                  </Text>
                </View>
              </TouchableOpacity>
            </View>
            <TouchableOpacity
              style={styles.subscribeButton}
              onPress={() => handlePurchase(selectedPlan)}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator size="small" color="#fff" />
              ) : (
                <Text style={styles.subscribeButtonText}>{i18n.t("subscription.subscribe")}</Text>
              )}
            </TouchableOpacity>
              <View style={styles.linksContainer}>
              <TouchableOpacity onPress={handleTosModal}>
                <Text style={styles.linkText}>{i18n.t("term.title")}</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={handlePrvModal}>
                <Text style={styles.linkText}>{i18n.t("privacy_policy.title")}</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={restorePurchase}>
                <Text style={styles.linkText}>{i18n.t("subscription.restorePurchase")}</Text>
              </TouchableOpacity>
          </View>
          </ScrollView>
        </View>
        <Modal
          animationType="slide"
          transparent={true}
          visible={tosVisible}
          onRequestClose={handleTosModal}
        >
          <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={handleTosModal}
            >
              <Icon name="close" size={24} color="#000" />
            </TouchableOpacity>
            <ScrollView contentContainerStyle={styles.scrollViewContainer}>
              <View style={{ padding: 20 }}>
                <Text style={{ fontWeight: "bold", fontSize: 20, marginBottom: 20}}>{i18n.t("term.title")}</Text>
                <Text>{"\n"}{i18n.t("term.lastedit")}{"\n"}</Text>
                <Text>
                  {i18n.t("term.intro")}{"\n"}
                </Text>
                <Text style={{ fontWeight: "bold" }}>{i18n.t("term.term1_title")}</Text>
                <Text>
                  {i18n.t("term.term1_text")}{"\n"}
                </Text>
                <Text style={{ fontWeight: "bold" }}>{i18n.t("term.term2_title")}</Text>
                <Text>
                  {i18n.t("term.term2_text")}{"\n"}
                </Text>
                <Text style={{ fontWeight: "bold" }}>{i18n.t("term.term3_title")}</Text>
                <Text>
                  {i18n.t("term.term3_text")}{"\n"}
                </Text>
                <Text style={{ fontWeight: "bold" }}>{i18n.t("term.term4_title")}</Text>
                <Text>
                  {i18n.t("term.term4_text")}{"\n"}
                </Text>
                <Text style={{ fontWeight: "bold" }}>{i18n.t("term.term5_title")}</Text>
                <Text>
                  {i18n.t("term.term5_text")}{"\n"}
                </Text>
                <Text>
                  {i18n.t("term.closure")}{"\n"}
                </Text>
              </View>
            </ScrollView>
          </View>
        </View>
      </Modal>
      <Modal
        animationType="slide"
        transparent={true}
        visible={prvVisible}
        onRequestClose={handlePrvModal}
      >
          <View style={styles.centeredView}>
            <View style={styles.modalView}>
              <TouchableOpacity
                style={styles.closeButton}
                onPress={handlePrvModal}
              >
                <Icon name="close" size={24} color="#000" />
              </TouchableOpacity>
              <ScrollView contentContainerStyle={styles.scrollViewContainer}>
                <View style={{ padding: 20 }}>
                  <Text style={{ fontWeight: "bold", fontSize: 20, marginBottom: 20 }}>{i18n.t("privacy_policy.title")}</Text>
                  <Text>{i18n.t("privacy_policy.lastedit")}</Text>
                  <Text>
                    {i18n.t("privacy_policy.intro")}{"\n"}
                  </Text>
                  <Text style={{ fontWeight: "bold" }}>{i18n.t("privacy_policy.privacy1_title")}</Text>
                  <Text>
                    {i18n.t("privacy_policy.privacy1_text")}{"\n"}
                  </Text>
                  <Text style={{ fontWeight: "bold" }}>{i18n.t("privacy_policy.privacy2_title")}</Text>
                  <Text>
                    {i18n.t("privacy_policy.privacy2_text")}{"\n"}
                  </Text>
                  <Text style={{ fontWeight: "bold" }}>{i18n.t("privacy_policy.privacy3_title")}</Text>
                  <Text>
                    {i18n.t("privacy_policy.privacy3_text")}{"\n"}
                  </Text>
                  <Text style={{ fontWeight: "bold" }}>{i18n.t("privacy_policy.privacy4_title")}</Text>
                  <Text>
                    {i18n.t("privacy_policy.privacy4_text")}{"\n"}
                  </Text>
                  <Text style={{ fontWeight: "bold" }}>{i18n.t("privacy_policy.privacy5_title")}</Text>
                  <Text>
                    {i18n.t("privacy_policy.privacy5_text")}{"\n"}
                  </Text>
                  <Text style={{ fontWeight: "bold" }}>{i18n.t("privacy_policy.privacy6_title")}</Text>
                  <Text>
                    {i18n.t("privacy_policy.privacy6_text")}{"\n"}
                  </Text>
                  <Text style={{ fontWeight: "bold" }}>{i18n.t("privacy_policy.privacy7_title")}</Text>
                  <Text>
                    {i18n.t("privacy_policy.privacy7_text")}{"\n"}
                  </Text>
                  <Text>
                    {i18n.t("privacy_policy.closure")}
                  </Text>
                </View>
              </ScrollView>
            </View>
          </View>
        </Modal>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  centeredView: {
    flex:1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  icon: {
    alignSelf: "center",
    width: 100,
    height: 100,
    marginBottom: 10,
  },
  modalView: {
    flex: 1,
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 35,
    alignItems: 'center',
    maxHeight: '90%',
    maxWidth: '90%',
  },
  scrollViewContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    maxWidth: "85%"
  },
  modalText: {
    marginTop: 15,
    marginBottom: 15,
    textAlign: 'center',
    fontSize: 22,
    fontWeight: 'bold',
  },
  selectedPlanBorder: {
    borderWidth: 2,
    borderColor: '#0069FE',
  },
  subscriptionContainer: {
    marginBottom: 20,
    marginTop: 20,
    flexDirection: 'column',
    alignItems: 'center',
  },
  limitedContainer: {
    alignSelf: "center",
    minWidth: "100%",
    // backgroundColor: "#D3D3D3",
    borderRadius: 10,
    padding: 10,
    marginTop: 8,
    marginBottom: 5,
    borderColor: "#8F8F8F",
    borderWidth: 1,
  },
  limitedTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 1,
  },
  limitedPrice: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  limitedDescription: {
    fontSize: 14,
    marginBottom: 2,
    color: "#8F8F8F",
  },
  unlimitedContainer: {
    alignSelf: "center",
    minWidth: "100%",
    // backgroundColor: "#D3D3D3",
    borderRadius: 10,
    padding: 10,
    marginTop: 3,
    borderColor: "#8F8F8F",
    borderWidth: 1,
  },
  unlimitedTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  unlimitedPrice: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  unlimitedDescription: {
    fontSize: 14,
    marginBottom: 2,
    color: "#8F8F8F",
  },
  subscribeButton: {
    marginTop: 10,
    marginBottom: 20,
    backgroundColor: '#0084FF',
    borderRadius: 5,
    padding: 10,
    minWeight: '50%',
    maxWeight: '50%',
  },
  subscribeButtonText: {
    color: '#fff',
    fontSize: 16,
    textAlign: 'center',
  },
  closeButton: {
    position: 'absolute',
    right: 10,
    top: 10,
  },
  closeButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  popularLabel: {
    fontSize: 14,
    color: '#3CAE76',
    fontWeight: 'bold',
    marginBottom: 4,
    textShadowColor:'#31BB75',
    textShadowOffset:{width: 2, height: 2},
    textShadowRadius:10,
  },
  linksContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 20,
  },
  linkText: {
  color: '#585858',
  fontSize: 10,
  textAlign: 'center',
  marginBottom: 5,
  marginHorizontal: 4,
},
loaderContainer: {
  position: 'absolute',
  justifyContent: 'center',
  alignItems: 'center',
  width: '100%',
  height: '100%',
  backgroundColor: 'rgba(255, 255, 255, 0.8)',
},
});

export default SubscriptionModal;
