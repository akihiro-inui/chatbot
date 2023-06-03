import React, {useContext, useState} from 'react';
import {View, Text, TouchableOpacity, Alert, StyleSheet} from 'react-native';
import {DrawerContentScrollView } from '@react-navigation/drawer';
import { ChatContext } from './chatContext';
import i18n from '../translations/translations';


export default function DeleteHistory(props) {
  const [showConfirmation, setShowConfirmation] = useState(true);
  const { deleteChatHistory } = useContext(ChatContext);

  const cancelDeletion = () => {
    props.navigation.navigate('ChatBot');
  };

  const handleDeleteChatHistory = async () => {
    await deleteChatHistory();

    Alert.alert(
      i18n.t("delete.title"),
      i18n.t("delete.message"),
      [
        {
          text: 'OK',
          onPress: () => props.navigation.navigate('ChatBot'),
        },
      ],
      { cancelable: false }
    );
  };

  return (
    <DrawerContentScrollView {...props}>
      <View style={styles.drawerContent}>
        {showConfirmation && (
          <View style={styles.confirmationContainer}>
            <Text style={styles.confirmationText}>
              {i18n.t('delete.confirmation')}
            </Text>
            <View style={styles.confirmationButtonContainer}>
              <TouchableOpacity
                style={styles.confirmationButton}
                onPress={handleDeleteChatHistory}
              >
                <Text style={styles.confirmationButtonText}>{i18n.t('delete.yes')}</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.confirmationButton, styles.cancelButton]}
                onPress={() => cancelDeletion()}
              >
                <Text style={styles.confirmationButtonText}>{i18n.t('delete.no')}</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      </View>
    </DrawerContentScrollView>
  );
};


const styles = StyleSheet.create({
    drawerContent: {
      flex: 1,
      padding: 20,
    },
    confirmationContainer: {
      backgroundColor: '#FFFFFF',
      padding: 20,
      borderRadius: 5,
      alignItems: 'center',
    },
    confirmationText: {
      fontSize: 16,
      marginBottom: 10,
    },
    confirmationButtonContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginTop: 10,
    },
    confirmationButton: {
      backgroundColor: '#2196F3',
      paddingVertical: 10,
      paddingHorizontal: 15,
      marginHorizontal: 15,
      borderRadius: 5,
      width: '35%',
    },
    cancelButton: {
      backgroundColor: '#FF5252',
      paddingVertical: 10,
      paddingHorizontal: 15,
      borderRadius: 5,
      width: '35%',
    },
    confirmationButtonText: {
      color: '#FFFFFF',
      fontSize: 16,
      textAlign: 'center',
    },
});
