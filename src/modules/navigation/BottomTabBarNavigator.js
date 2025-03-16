import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import HomeScreen from "@screens/HomeScreen";
import Icon, { Icons } from "@components/icons/Icons";
import { AppState, Platform } from "react-native";
import { useSelector } from "react-redux";
import SettingScreen from "@screens/setting/SettingScreen";
import MarketScreen from "@screens/market/MarketScreen";
import { useNavigation } from "@react-navigation/native";
import * as React from "react";
import { useEffect } from "react";
import SwapScreen from "@screens/swap/SwapScreen";

const Tab = createBottomTabNavigator();

function BottomTabBarNavigator() {
  const { theme } = useSelector(state => state.ThemeReducer);
  const { activeWallet } = useSelector(state => state.WalletReducer);
  const { appLock } = useSelector(state => state.AppLockReducer);
  let timeOut = appLock.autoLock;
  let lock = appLock.appLock;
  let inBackground = false;
  let lastDate = Date.now();
  const navigation = useNavigation();
  const lockState = nextAppState => {
    console.log(
      "Next AppState is: ",
      nextAppState + " inBackground " + inBackground,
    );

    if (nextAppState === "active" && inBackground) {
      const timeDiff = Date.now() - lastDate;
      if (timeDiff > timeOut * 1000) {
        if (lock === true) {
          navigation.navigate("ReEnterPinCodeScreen");
        }
      }
      inBackground = false;
      lastDate = Date.now();
    } else if (nextAppState === "background") {
      inBackground = true;
      lastDate = Date.now();
    }
  };

  const handleAppStateChange = nextAppState => {
    lockState(nextAppState);
  };
  useEffect(() => {
    const appStateListener = AppState.addEventListener(
      "change",
      handleAppStateChange,
    );
    return () => {
      appStateListener.remove();
    };
  }, [timeOut, lock]);
  return (
    <Tab.Navigator screenOptions={{
      headerShown: false,
      tabBarStyle: {
        borderTopWidth: 0,
        paddingVertical: 0,
        height: Platform.OS === "android" ? 55 : 90,
        backgroundColor: theme.tabBarBackground,

      },
    }}>
      <Tab.Screen name="Home" component={HomeScreen} options={{
        tabBarInactiveTintColor: theme.tabBarInactiveTintColor,
        tabBarActiveTintColor: theme.tabBarActiveTintColor,
        tabBarLabel: "Wallet",
        tabBarIcon: ({ color, size }) => (
          <Icon
            name="wallet-outline"
            size={size}
            type={Icons.Ionicons}
            color={color}
          />
        ),
      }} />
      <Tab.Screen name="MarketScreen" component={MarketScreen} options={{
        tabBarLabel: "Market",
        tabBarInactiveTintColor: theme.tabBarInactiveTintColor,
        tabBarActiveTintColor: theme.tabBarActiveTintColor,
        tabBarIcon: ({ color, size }) => (
          <Icon
            name="bar-chart"
            size={size}
            type={Icons.Feather}
            color={color}
          />
        ),
      }} />
      <Tab.Screen name="SwapScreen" component={SwapScreen} options={{
        tabBarLabel: "Swap",
        tabBarInactiveTintColor: theme.tabBarInactiveTintColor,
        tabBarActiveTintColor: theme.tabBarActiveTintColor,
        tabBarIcon: ({ color, size }) => (
          <Icon
            name={"swap-horizontal"}
            size={size}
            type={Icons.Ionicons}
            color={color}
          />
        ),
      }} />
      <Tab.Screen name="SettingScreen" component={SettingScreen} options={{
        tabBarLabel: "Settings",
        tabBarInactiveTintColor: theme.tabBarInactiveTintColor,
        tabBarActiveTintColor: theme.tabBarActiveTintColor,
        tabBarIcon: ({ color, size }) => (
          <Icon
            name="setting"
            size={size}
            type={Icons.AntDesign}
            color={color}
          />
        ),
      }} />
    </Tab.Navigator>
  );
}

export default BottomTabBarNavigator;
