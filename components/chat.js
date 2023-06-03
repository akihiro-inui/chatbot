import React, { useState, useEffect, useRef, useContext, useCallback } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, StyleSheet, KeyboardAvoidingView, Animated, Easing, ActivityIndicator } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import 'react-native-url-polyfill/auto';
import DeviceInfo from 'react-native-device-info';

import { ChatContext } from './chatContext';
import { saveConversationToDB } from './mongo';
import { initializeOpenAI } from './openai';
import i18n from '../translations/translations';
import SubscriptionModal from './subscriptionModal';
import { getCurrentSubscriptionFromServer } from './getRemoteSubscription';
import { LIMITED_SUBSCRIPTION_COUNT, TRIAL_COUNT, MAX_HISTORY_SIZE } from '@env';


const ChatScreen = ({ navigation }) => {
  const [inputValue, setInputValue] = useState('');
  const [openai, setOpenai] = useState(null);
  const scrollViewRef = useRef();
  const { chatHistory, setChatHistory } = useContext(ChatContext);
  const [interactionCount, setInteractionCount] = useState(0);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [currentSubscription, setSubscriptionStatus] = useState(null);
  const [chatbotTyping, setChatbotTyping] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    const initialize = async () => {

    // TODO: This is for test, remove it later
    // await AsyncStorage.removeItem('chatHistory');
    // await AsyncStorage.removeItem('interactionCount');
    // await AsyncStorage.removeItem('userId');
    // await AsyncStorage.removeItem('lastResetDate');
    // await AsyncStorage.removeItem('currentSubscription');
    // await AsyncStorage.removeItem('subscription');
    // await AsyncStorage.removeItem('subscriptionStatus');

      try {
        // console.log('Initializing app...')
        subscriptionCheck();
        const client = await initializeOpenAI();
        setOpenai(client);
        await loadChatHistoryAndUserId();
      } catch (error) {
        console.error('Error initializing OpenAI:', error);
      }
      finally {
        // console.log('App initialized')
        setIsLoading(false);
        setIsInitialized(true);
      }
    };
    initialize();
  }, []);

  const subscriptionCheck = async () => {
    // Check current subscription at startup
    let subscription = await getCurrentSubscriptionFromServer();
    if (subscription) {
      setSubscriptionStatus(subscription);
      await AsyncStorage.setItem('currentSubscription', subscription);
    } 
    else {
      subscription = await AsyncStorage.getItem('currentSubscription');
      if (subscription) {
        setSubscriptionStatus(subscription);
      } else {
        subscription = 'trial';
        setSubscriptionStatus('trial');
        await AsyncStorage.setItem('currentSubscription', 'trial');
        await AsyncStorage.setItem('interactionCount', '0');
      }
    }
    // console.log(`Current subscription at launch: ${subscription}`);
  };

  const loadChatHistoryAndUserId = async() => {
      try {
        
        // Get data from cache
        storedHistory = await AsyncStorage.getItem('chatHistory');
        storedUserId = await AsyncStorage.getItem('userId');
        storedInteractionCount = await AsyncStorage.getItem('interactionCount');
        subscription = await AsyncStorage.getItem('currentSubscription');

        // Show introduction from chatbot if no subscription and no interactions
        // console.log("Show initial chatbot message?")
        // console.log(`Subscription: ${subscription}`)
        // console.log(`storedInteractionCount: ${storedInteractionCount}`)
        if ((subscription == null || subscription == 'trial') && (storedInteractionCount == 0 || storedInteractionCount == null)) {
          await setChatHistory([
            { role: 'assistant', content: i18n.t("chat.greeting") },
            { role: 'assistant', content: i18n.t("chat.example") },
            { role: 'assistant', content: i18n.t("chat.warning") },
          ]);
        }
    
        if (!storedUserId) {
          DeviceInfo.getUniqueId().then((uniqueId) => {
            AsyncStorage.setItem('userId', uniqueId);
            });
        }
    
        if (storedInteractionCount === null || storedInteractionCount.length === 0) {
          await AsyncStorage.setItem('interactionCount', '0');
          setInteractionCount(0);
        } else {
          setInteractionCount(parseInt(storedInteractionCount, 10));
          // console.log("Loading chat history from cache")
        }

        if (storedHistory) {
          // console.log("Loading chat history from cache")
          setChatHistory(JSON.parse(storedHistory));
        }
        // console.log(`User ID: ${userId}`);
        // console.log(`User has ${storedInteractionCount} interactions`);
      } catch (error) {
        console.error(error);
      }
  }

  
  useEffect(() => {
    const checkDateAndResetCounter = async () => {
      const today = new Date();
      const lastResetDateStr = await AsyncStorage.getItem('lastResetDate');
      const lastResetDate = lastResetDateStr ? new Date(lastResetDateStr) : null;
      
      if (!lastResetDate || (today.getMonth() !== lastResetDate.getMonth() || today.getFullYear() !== lastResetDate.getFullYear())) {
        await resetInteractionCounter();
        await AsyncStorage.setItem('lastResetDate', today.toISOString());
      }
    };

    checkDateAndResetCounter();
  }, []);

  useEffect(() => {
    if (scrollViewRef.current) {
        scrollViewRef.current.scrollToEnd({ animated: true })
    }
}, [chatHistory]);


  const handleSubscriptionSuccess = async (subscription) => {
    resetInteractionCounter();
    await AsyncStorage.setItem('currentSubscription', subscription);
    // console.log(`Successfully subscribed to ${subscription} plan`)
    setSubscriptionStatus(subscription);
    setIsModalVisible(false);
  };

  const resetInteractionCounter = async () => {
    setInteractionCount(0);
    await AsyncStorage.setItem('interactionCount', '0');
  };

  const sendMessage = async (message) => {
    try {
      // Send message to ChatBot. TODO: Remove
      // const request = "This is test"
      previousHistory = await AsyncStorage.getItem('chatHistory');
      userId = await AsyncStorage.getItem('userId');
      // console.log(previousHistory)

      const parsedHistory = JSON.parse(previousHistory) || [];
      const formattedHistory = parsedHistory.map((message) => ({
        role: message.role,
        content: message.content,
      }));

      const response = await openai.createChatCompletion({
        model: "gpt-3.5-turbo",
        messages: formattedHistory,
        temperature: 0.3,
        max_tokens: 300,
        top_p: 0.95,
        frequency_penalty: 0,
        presence_penalty: 0,
        user: userId
      });
      
      // Clean up ChatGPT Response
      const text = response.data.choices[0].message.content.trim();
      //const text = response.data.choices[0].text.trim();
      
      // console.log(text)
      return text;
    } catch (error) {
      console.error(error);
      return i18n.t("chat.error");
    }
  };

  // Update cache conversation history
  const updateChatHistory = (newMessage) => {
    setChatHistory((prevHistory) => {
      // Remove the oldest message if history size reaches the limit
      if (prevHistory.length >= MAX_HISTORY_SIZE) {
        console.log("Removing oldest message")
        prevHistory.shift();
      }
      // Save new history to async storage and return
      const newHistory = [...prevHistory, newMessage];
      AsyncStorage.setItem('chatHistory', JSON.stringify(newHistory)).catch((error) => console.error(error));
      return newHistory;
    });
  };

  // Execute when user presses send button
  const handleSubmit = useCallback(async () => {
    let message = inputValue.trim();
    updateChatHistory({ role: 'user', content: message });

    // Clean up the message
    message = message.replace(/\n/g, ' '); // replace new lines with space
    message = message.replace(/  +/g, ' '); // replace multiple spaces with a single space
    
    setInputValue('');
  
    if (!message) {
      return;
    }
    
    const userId = await AsyncStorage.getItem('userId');
    const subscription = await AsyncStorage.getItem('currentSubscription');

    // console.log('Sending message')
    // console.log(`Trial limit is ${TRIAL_COUNT}`)
    // console.log(`Limited subscription limit is ${LIMITED_SUBSCRIPTION_COUNT}`)
    // console.log(`User interaction count is ${interactionCount}`)
    // console.log(`User subscription is ${subscription}`)

    if (interactionCount >= TRIAL_COUNT && (subscription != 'limited' && currentSubscription != 'unlimited')) {
      setIsModalVisible(true);
      return;
    }
    
    if (interactionCount >= LIMITED_SUBSCRIPTION_COUNT && subscription == 'limited') {
      setIsModalVisible(true);
      return;
    }
  
    setChatbotTyping(true);

    try {
      const response = await sendMessage(message);

      // Set chatbotTyping to false after receiving the response
      setChatbotTyping(false);

      // Update cache conversation history
      updateChatHistory({ role: 'assistant', content: response });

      // Save conversation to DB
      await saveConversationToDB(userId, message, 'user');
      await saveConversationToDB(userId, response, 'assistant');

      // Only update interaction count if the response is not an error
      if (response !== i18n.t("chat.error")) { 
        setInteractionCount((prevCount) => {
          const newCount = prevCount + 1;
          AsyncStorage.setItem('interactionCount', newCount.toString());
          return newCount;
        }); 
      }
    }
    catch (error) {
      console.error(error);
      updateChatHistory({ role: 'assistant', content: i18n.t('chat.error')});

      // Set chatbotTyping to false if there's an error
      setChatbotTyping(false);
    }
  }, [inputValue, interactionCount]);
  

  const typingOpacity = useRef(new Animated.Value(0)).current;

  // Start the typing animation
  const startTypingAnimation = () => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(typingOpacity, {
          toValue: 1,
          duration: 400,
          easing: Easing.linear,
          useNativeDriver: true,
        }),
        Animated.timing(typingOpacity, {
          toValue: 0,
          duration: 400,
          easing: Easing.linear,
          useNativeDriver: true,
        }),
      ]),
      {
        iterations: -1,
      }
    ).start();
  };

    // Stop the typing animation
  const stopTypingAnimation = () => {
    typingOpacity.stopAnimation();
    typingOpacity.setValue(0);
  };

  useEffect(() => {
    if (chatbotTyping) {
      startTypingAnimation();
    } else {
      stopTypingAnimation();
    }
  }, [chatbotTyping]);

  
  const renderTypingIndicator = () => {
    if (chatbotTyping) {
      return (
        <View style={styles.chatbotTyping}>
          <Animated.View
            style={[
              styles.typingDot,
              { opacity: typingOpacity, marginLeft: 4 },
            ]}
          />
          <Animated.View
            style={[
              styles.typingDot,
              { opacity: typingOpacity, marginLeft: 4 },
            ]}
          />
          <Animated.View
            style={[
              styles.typingDot,
              { opacity: typingOpacity, marginLeft: 4 },
            ]}
          />
        </View>
      );
    }
    return null;
  };
    
  return (
    isLoading ? (
      <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
        <ActivityIndicator size="large" color="#0084FF" />
      </View>
    ) : (
      <View style={styles.content}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.container}
          keyboardVerticalOffset={Platform.OS === 'ios' ? 100 : 120}
        >
        <ScrollView
          style={styles.chatContainer}
          ref={scrollViewRef}
          onContentSizeChange={() =>
            scrollViewRef.current.scrollToEnd({ animated: true })
          }
        >
          {chatHistory && chatHistory.map((message, index) => (
            <View
              key={index}
              style={message.role === 'user' ? styles.userMessage : styles.chatbotMessage}
            >
              <Text style={styles.messageText} selectable={true}>{message.content}</Text>
            </View>
          ))}
          {renderTypingIndicator()}
        </ScrollView>
          <View style={styles.inputContainer}>
          <TextInput
            style={styles.textInput}
            value={inputValue}
            onChangeText={setInputValue}
            placeholder={i18n.t('chat.placeholder')}
            placeholderTextColor="#888"
            multiline={true}
            returnKeyType="default"
          />
          <TouchableOpacity style={styles.sendButton} onPress={handleSubmit}>
            <Text style={styles.sendButtonText}>{i18n.t('chat.send')}</Text>
          </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
        <SubscriptionModal
          visible={isModalVisible}
          onRequestClose={() => setIsModalVisible(false)}
          navigation={navigation}
          onSubscriptionSuccess={handleSubscriptionSuccess}
        />
      </View>
    )
  )
}

const styles = StyleSheet.create(
  {
    container: {
      flex: 1,
      paddingTop: 20
    },
    content: {
      flex: 0.9,
    },
    chatContainer: {
      flex: 0.9,
      paddingBottom: 100,
      height: '100%'
    },
    userMessage: {
      alignSelf: 'flex-end',
      backgroundColor: '#7BE57A',
      borderRadius: 10,
      marginTop: 5,
      marginBottom: 5,
      marginRight: 5,
      padding: 10,
      maxWidth: '70%',
    },
    chatbotMessage: {
      alignSelf: 'flex-start',
      backgroundColor: '#FFFFFF',
      borderRadius: 10,
      marginTop: 5,
      marginBottom: 5,
      marginLeft: 5,
      padding: 10,
      maxWidth: '70%',
    },
    messageText: {
      fontSize: 16,
      color: '#333',
    },
    inputContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: '#FFFFFF',
      borderRadius: 10,
      padding: 10,
      marginTop: 10,
      marginLeft: 10,
      marginRight: 10
    },
    textInput: {
      flex: 1,
      fontSize: 16,
      color: '#333',
      marginRight: 10,
    },
    sendButton: {
      backgroundColor: '#0084FF',
      borderRadius: 5,
      padding: 10,
    },
    sendButtonText: {
      color: '#fff',
      fontSize: 16,
    },
    // ... other styles
    chatbotTyping: {
      alignSelf: 'flex-start',
      backgroundColor: '#FFFFFF',
      borderRadius: 10,
      marginTop: 5,
      marginBottom: 5,
      marginLeft: 5,
      padding: 10,
      maxWidth: '70%',
      flexDirection: 'row',
      alignItems: 'center',
    },
    typingDot: {
      backgroundColor: '#333',
      borderRadius: 50,
      width: 6,
      height: 6,
    },
  }
  );

export default ChatScreen;