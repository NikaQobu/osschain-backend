import { Linking } from "react-native";
import InAppBrowser from "react-native-inappbrowser-reborn";

const openLink = async url => {
  try {
    if (await InAppBrowser.isAvailable()) {
      await InAppBrowser.open(url, {
        // iOS Properties
        dismissButtonStyle: "cancel",
        readerMode: true,
        animated: true,
        modalPresentationStyle: "automatic",
        modalTransitionStyle: "coverVertical",
        modalEnabled: true,
        enableBarCollapsing: false,
        // Android Properties
        showTitle: true,
        enableUrlBarHiding: true,
        enableDefaultShare: true,
        forceCloseOnRedirection: false,
      });
    } else {
      await Linking.openURL(url);
    }
  } catch (error) {
    console.log(error);
  }
};
const CommonBrowser = {
  openLink,
};
export default CommonBrowser;
