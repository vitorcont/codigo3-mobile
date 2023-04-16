import * as Linking from 'expo-linking';
import * as WebBrowser from 'expo-web-browser';

export const openCall = (phoneNumberProp: string) => {
  Linking.openURL(`tel:${phoneNumberProp}`);
};

export const openWhatsApp = (whatsappProp: string) => {
  const url = `whatsapp://send?phone=${whatsappProp}`;
  Linking.openURL(url);
};

export const openEmail = (emailProp: string) => {
  const url = `mailto:${emailProp}`;
  Linking.openURL(url);
};

export const openWebSite = async (siteProp: string) => {
  await WebBrowser.openBrowserAsync(siteProp);
};
