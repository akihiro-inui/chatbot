import React from "react";
import i18n from '../translations/translations';
import { WebView } from 'react-native-webview';


export default function TermScreen() {
  return (
    <WebView source={{ uri: i18n.t("term.url") }}/>
  );
}
