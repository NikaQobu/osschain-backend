import * as React from "react";
import { useEffect } from "react";
import { NavigationContainer } from "@react-navigation/native";
import AuthenticationStackNavigator from "@modules/navigation/AuthenticationStackNavigator";
import { withTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import MainStackNavigator from "@modules/navigation/MainStackNavigator";
import { StatusBar } from "react-native";
import { ThemeAction } from "@persistence/theme/ThemeAction";
import { FeeAction } from "@persistence/fee/FeeAction";
import { CurrencyAction } from "@persistence/currency/CurrencyAction";
import { AppLockAction } from "@persistence/applock/AppLockAction";
import { TokenAction } from "@persistence/token/TokenAction";
import { StorageUtil } from "@modules/core/util/StorageUtil";
import { WALLET_LIST, WALLET_LIST_KEY } from "@persistence/wallet/WalletConstant";
import ReduxStore from "@modules/redux/ReduxStore";
import { PriceAction } from "@persistence/price/PriceAction";
import { MarketAction } from "@persistence/market/MarketAction";

function ApplicationNavigator() {
  const { theme } = useSelector(state => state.ThemeReducer);
  const { loggedIn } = useSelector(state => state.UserReducer);
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(ThemeAction.getDefault());
    dispatch(FeeAction.getFee());
    dispatch(CurrencyAction.getCurrency());
    dispatch(AppLockAction.getAppLock());
    dispatch(TokenAction.getErc20Tokens());
    dispatch(TokenAction.getBep20Tokens());
    dispatch(TokenAction.getPolygonTokens());
    dispatch(TokenAction.getTrc20Tokens());
  }, []);
  return (
    <NavigationContainer
      theme={{
        colors: {
          background: "black",
        },
      }}>
      <StatusBar
        hidden={false}
        backgroundColor={theme.gradientPrimary}
        barStyle={"light-content"}
      />
      {loggedIn ? (
        <MainStackNavigator />
      ) : (
        <AuthenticationStackNavigator />
      )}
    </NavigationContainer>
  );
}

export default withTranslation()(ApplicationNavigator);
// Define your polling function
const startPolling = async () => {
  // Start polling every 60 seconds
  setInterval(async () => {
    console.log("update pricing...");
    const walletListData = await StorageUtil.getItem(WALLET_LIST_KEY);
    const walletList = walletListData ? walletListData.wallets : [WALLET_LIST[0]];
    const coins = walletList.map(item => [...item.coins, ...item.tokens]);
    const list = coins.flat();
    const ids = list.map(item => item.id);
    ReduxStore.dispatch(PriceAction.getPrices(ids));
    ReduxStore.dispatch(MarketAction.getMarkets(30, true));
    console.log("end update pricing...");
  }, 5000);
};

// Start the polling
startPolling();
