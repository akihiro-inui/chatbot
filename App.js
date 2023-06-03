import React, { useState } from 'react';
import { StyleSheet, View, Share, Platform } from 'react-native';
import "react-native-url-polyfill/auto";
import { NavigationContainer } from '@react-navigation/native';
import { createDrawerNavigator } from '@react-navigation/drawer';
import Icon from 'react-native-vector-icons/MaterialIcons';
import AsyncStorage from '@react-native-async-storage/async-storage';

import TermScreen from './components/term';
import ChatScreen from './components/chat';
import PrivacyPolicyScreen from './components/PrivacyPolicy';
import DeleteHistory from './components/deleteHistory';
import { ChatContext } from './components/chatContext';
import { shareApp } from './components/shareApp';
import i18n from './translations/translations';

const Drawer = createDrawerNavigator();

export default function App() {
  const [chatHistory, setChatHistory] = useState([]);

  const deleteChatHistory = async () => {
    try {
      await AsyncStorage.removeItem('chatHistory');
      setChatHistory([]);
    } catch (e) {
      console.log(e);
    }
  };

  const chatScreenOptions = {
    drawerLabel: i18n.t("drawer.chatbot"),
    drawerIcon: () => (
      <Icon name="chat" size={24} color="black" />
    ),
    headerRight: () => (
      <Icon
        name="share"
        size={24}
        color="black"
        onPress={() => shareApp()}
        style={{ marginRight: 16 }}
      />
    ),
  };

  return (
    <ChatContext.Provider value={{ chatHistory, setChatHistory, deleteChatHistory }}>
    <NavigationContainer>
      <View style={styles.container}>
        <Drawer.Navigator
        screenOptions={{ headerShown: true,
                     labelStyle: {
                      fontSize: 14,
                     },
                     itemStyle: {
                      marginVertical: 2}
                    }}>
          <Drawer.Screen name="ChatBot" component={ChatScreen} options={chatScreenOptions} />
          <Drawer.Screen name="Term of service" component={TermScreen} options={{ 
            drawerLabel: i18n.t("drawer.term"),
            drawerIcon: () => (
              <Icon name="info" size={24} color="black" />
            ),
          }} />
          <Drawer.Screen name="Privacy Policy" component={PrivacyPolicyScreen} options={{ 
            drawerLabel: i18n.t("drawer.privacypolicy"),
            drawerIcon: () => (
              <Icon name="privacy-tip" size={24} color="black" />
            ),
          }} />
          <Drawer.Screen name="Delete Chat History" component={DeleteHistory} options={{ 
            drawerLabel: i18n.t("drawer.deletehistory"),
            drawerIcon: () => (
              <Icon name="delete" size={24} color="black" />
            ),
          }} 
          >
          </Drawer.Screen>
        </Drawer.Navigator>
      </View>
    </NavigationContainer>
    </ChatContext.Provider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F7F7F7'
  },
});
