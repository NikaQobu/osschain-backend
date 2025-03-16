import React, { useEffect } from "react";
import TokenScreen from "@screens/token/TokenScreen";
import SelectWalletScreen from "@screens/wallet/SelectWalletScreen";
import WalletReceiveScreen from "@screens/wallet/WalletReceiveScreen";
import WalletSendScreen from "@screens/wallet/WalletSendScreen";
import BtcWalletSendScreen from "@screens/wallet/BtcWalletSendScreen";
import SwapScreen from "@screens/swap/SwapScreen";
import SelectTokenScreen from "@screens/swap/SelectTokenScreen";
import BottomTabBarNavigator from "@modules/navigation/BottomTabBarNavigator";
import AccountScreen from "@screens/account/AccountScreen";
import AddAccountStep1Screen from "@screens/account/AddAccountStep1Screen";
import AddAccountStep2Screen from "@screens/account/AddAccountStep2Screen";
import AddAccountStep4Screen from "@screens/account/AddAccountStep4Screen";
import AddAccountStep3Screen from "@screens/account/AddAccountStep3Screen";
import AddAccountStep5Screen from "@screens/account/AddAccountStep5Screen";
import AccountDetailScreen from "@screens/account/AccountDetailScreen";
import ReEnterPinCodeScreen from "@screens/pincode/ReEnterPinCodeScreen";
import WalletDetailScreen from "@screens/wallet/WalletDetailScreen";
import { CardStyleInterpolators, createStackNavigator } from "@react-navigation/stack";
import MarketDetailScreen from "@screens/market/MarketDetailScreen";
import SecurityScreen from "@screens/setting/SecurityScreen";
import PreferencesScreen from "@screens/setting/PreferencesScreen";
import LanguageScreen from "@screens/setting/LanguageScreen";
import CurrencyScreen from "@screens/setting/CurrencyScreen";
import WalletBuyScreen from "@screens/wallet/WalletBuyScreen";
import TronWalletSendScreen from "@screens/wallet/TronWalletSendScreen";
import NftDetailScreen from "@screens/nfts/NftDetailScreen";
import ConfirmPinCodeScreen from "@screens/pincode/ConfirmPinCodeScreen";
import ChangePinCodeScreen from "@screens/pincode/ChangePinCodeScreen";
import SelectNetworkScreen from "@screens/token/SelectNetworkScreen";
import AddTokenScreen from "@screens/token/AddTokenScreen";

const Stack = createStackNavigator();

function MainStackNavigator() {
  useEffect(() => {
  }, []);
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
      }}>
      <Stack.Screen name="BottomTabBarNavigator" component={BottomTabBarNavigator} />
      <Stack.Screen name="TokenScreen" component={TokenScreen} />
      <Stack.Screen name="SelectWalletScreen" component={SelectWalletScreen} />
      <Stack.Screen name="WalletReceiveScreen" component={WalletReceiveScreen} />
      <Stack.Screen name="WalletSendScreen" component={WalletSendScreen} />
      <Stack.Screen name="BtcWalletSendScreen" component={BtcWalletSendScreen} />
      <Stack.Screen name="SwapScreen" component={SwapScreen} />
      <Stack.Screen name="SelectTokenScreen" component={SelectTokenScreen} />
      <Stack.Screen name="AccountScreen" component={AccountScreen} />
      <Stack.Screen name="AccountDetailScreen" component={AccountDetailScreen} />
      <Stack.Screen name="AddAccountStep1Screen" component={AddAccountStep1Screen} />
      <Stack.Screen name="AddAccountStep2Screen" component={AddAccountStep2Screen} />
      <Stack.Screen name="AddAccountStep3Screen" component={AddAccountStep3Screen} />
      <Stack.Screen name="AddAccountStep4Screen" component={AddAccountStep4Screen} />
      <Stack.Screen name="AddAccountStep5Screen" component={AddAccountStep5Screen} />
      <Stack.Screen name="ReEnterPinCodeScreen" component={ReEnterPinCodeScreen} />
      <Stack.Screen name="WalletDetailScreen" component={WalletDetailScreen} />
      <Stack.Screen name="MarketDetailScreen" component={MarketDetailScreen} />
      <Stack.Screen name="SecurityScreen" component={SecurityScreen} />
      <Stack.Screen name="PreferencesScreen" component={PreferencesScreen} />
      <Stack.Screen name="LanguageScreen" component={LanguageScreen} />
      <Stack.Screen name="CurrencyScreen" component={CurrencyScreen} />
      <Stack.Screen name="WalletBuyScreen" component={WalletBuyScreen} />
      <Stack.Screen name="TronWalletSendScreen" component={TronWalletSendScreen} />
      <Stack.Screen name="NftDetailScreen" component={NftDetailScreen} />
      <Stack.Screen name="ConfirmPinCodeScreen" component={ConfirmPinCodeScreen} />
      <Stack.Screen name="ChangePinCodeScreen" component={ChangePinCodeScreen} />
      <Stack.Screen name="SelectNetworkScreen" component={SelectNetworkScreen} />
      <Stack.Screen name="AddTokenScreen" component={AddTokenScreen} />
    </Stack.Navigator>
  );
}

export default MainStackNavigator;
