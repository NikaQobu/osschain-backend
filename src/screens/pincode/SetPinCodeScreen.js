import React, { useEffect, useState } from "react";
import { useNavigation } from "@react-navigation/native";
import { PinCode } from "@components/PinCode";
import { SafeAreaView, StyleSheet, View } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import LinearGradient from "react-native-linear-gradient";
import CommonBackButton from "@components/commons/CommonBackButton";
import CommonLoading from "@components/commons/CommonLoading";
import { WalletAction } from "@persistence/wallet/WalletAction";
import { applicationProperties } from "@src/application.properties";
import { WALLET_LIST, WALLET_TYPE } from "@persistence/wallet/WalletConstant";
import { StorageUtil } from "@modules/core/util/StorageUtil";
import { UserAction } from "@persistence/user/UserAction";
import { WalletFactory } from "@modules/core/factory/WalletFactory";
import CommonAPI from "@modules/api/CommonAPI";

const SetPinCodeScreen = ({ route }) => {
  const { isNew } = route.params;
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const [mnemonics] = useState(WalletFactory.generateMnemonics());
  const { theme } = useSelector(state => state.ThemeReducer);
  useEffect(() => {
  }, []);
  const success = async () => {
    if (isNew === true) {
      CommonLoading.show();
      dispatch(WalletAction.insert(
        {
          name: applicationProperties.defaultWalletName,
          type: WALLET_TYPE.MANY,
          defaultChain: "ETH",
          mnemonic: mnemonics.join(" "),
          assets: [...WALLET_LIST[0].coins, ...WALLET_LIST[0].tokens],
          image: applicationProperties.logoURI.app,
          swappable: true,
          dapps: true,
          chain: "ALL",
        },
      )).then(async ({ data }) => {
        await StorageUtil.setItem(
          "isInitialized",
          true,
        );
        const activeWallet = data.activeWallet;
        const coins = activeWallet.coins;
        const params = {
          btcAddress: "",
          ethAddress: "",
          tronAddress: "",
          balance: 0,
          chain: "ALL",
        };
        for (let i = 0; i < coins.length; i++) {
          if (coins[i].chain === "BTC") {
            params.btcAddress = coins[i].walletAddress;
          } else if (coins[i].chain === "ETH" || coins[i].chain === "BSC" || coins[i].chain === "POLYGON") {
            params.ethAddress = coins[i].walletAddress;
          } else if (coins[i].chain === "TRON") {
            params.tronAddress = coins[i].walletAddress;
          }
        }
        CommonAPI.post(`private/wallet/save`, params);
        dispatch(UserAction.signIn()).then(() => {
          CommonLoading.hide();
        });
      });
    } else {
      navigation.navigate("ImportScreen");
    }

  };
  return (
    <View style={{ flex: 1 }}>
      <LinearGradient
        colors={[theme.gradientPrimary, theme.gradientSecondary]}
        style={styles.gradient}>
        <SafeAreaView style={{ flex: 1 }}>
          <View style={styles.header}>
            <CommonBackButton
              onPress={() => {
                navigation.goBack();
              }}>
            </CommonBackButton>
          </View>
          <PinCode
            onFail={() => {
              console.log("Fail to auth");
            }}
            onSuccess={() => success()}
            onClickButtonLockedPage={() => console.log("Quit")}
            status={"choose"}
          />
        </SafeAreaView>
      </LinearGradient>
    </View>
  );
};
const styles = StyleSheet.create({
  header: {
    height: 48,
    paddingHorizontal: 10,
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  gradient: {
    width: "100%",
    height: "100%",
  },
  securityTextContainer: {
    width: "100%",
    paddingHorizontal: 10,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 10,
  },
  securityText: {
    fontSize: 13,
    textAlign: "center",
  },
});
export default SetPinCodeScreen;
