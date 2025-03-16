import React, { useEffect, useState } from "react";
import { SafeAreaView, StyleSheet, View } from "react-native";
import CommonBackButton from "@components/commons/CommonBackButton";
import CommonText from "@components/commons/CommonText";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import CommonButton from "@components/commons/CommonButton";
import _ from "lodash";
import CommonTouchableOpacity from "@components/commons/CommonTouchableOpacity";
import CommonLoading from "@components/commons/CommonLoading";
import { WalletAction } from "@persistence/wallet/WalletAction";
import { applicationProperties } from "@src/application.properties";
import { WALLET_LIST, WALLET_TYPE } from "@persistence/wallet/WalletConstant";
import { UserAction } from "@persistence/user/UserAction";
import { StorageUtil } from "@modules/core/util/StorageUtil";
import CommonAPI from "@modules/api/CommonAPI";
import LinearGradient from "react-native-linear-gradient";

export default function ConfirmMnemonicScreen({ navigation, route }) {
  const { t } = useTranslation();
  const { theme } = useSelector(state => state.ThemeReducer);
  const { mnemonics } = route.params;
  const [selectable, setSelectable] = useState(_.shuffle([...mnemonics]));
  const [selected, setSelected] = useState([]);
  const [invalidWord, setInvalidWord] = useState(undefined);
  const [valid, setValid] = useState(undefined);
  const dispatch = useDispatch();
  useEffect(() => {

  }, []);
  const onPressMnemonic = (mnemonic, isSelected) => {
    if (!isSelected) {
      const list1 = selectable.filter((m) => m.id !== mnemonic.id);
      const list2 = selected.concat([mnemonic]);
      setSelectable(list1);
      setSelected(list2);
      isValidSequence(list2);
    } else {
      const list1 = selectable.concat([mnemonic]);
      const list2 = selected.filter((m) => m.id !== mnemonic.id);
      setSelectable(list1);
      setSelected(list2);
      isValidSequence(list2);
    }
  };
  const isValidSequence = (list) => {
    const string1 = list.map(item => item.word).join("");
    const string2 = mnemonics.map(item => item.word).join("");
    setInvalidWord(_.startsWith(string2, string1));
    const isValid = _.isEqual(list, mnemonics);
    setValid(isValid);
    return isValid;
  };
  const renderMnemonic = (mnemonic, index) => (
    <CommonTouchableOpacity style={[styles.mnemonic, { borderColor: theme.border, backgroundColor: "white" }]}
                            key={index.toString()}
                            onPress={() => {
                              onPressMnemonic(mnemonic, true);
                            }}>
      <CommonText
        style={{
          textAlign: "left",
          fontWeight: "bold",
          color: theme.subText,
        }}>{index + 1}. {mnemonic.word}</CommonText>
    </CommonTouchableOpacity>
  );
  const renderSelectable = (mnemonic, index) => (
    <CommonTouchableOpacity style={[styles.mnemonic, { borderColor: theme.border }]}
                            key={index.toString()}
                            onPress={() => {
                              onPressMnemonic(mnemonic, false);
                            }}>
      <CommonText
        style={{
          textAlign: "left",
          fontWeight: "bold",
          color: theme.subText,
        }}>{mnemonic.word}</CommonText>
    </CommonTouchableOpacity>
  );
  return (
    <View style={{ flex: 1 }}>
      <LinearGradient
        colors={[theme.gradientPrimary, theme.gradientSecondary]}
        style={styles.gradient}>
        <SafeAreaView style={styles.container}>
          <View style={styles.header}>
            <CommonBackButton
              onPress={() => {
                navigation.goBack();
              }}
            />
          </View>
          <View
            style={[
              styles.content,
            ]}>
            <View style={styles.titleContainer}>
              <CommonText style={[styles.titleText]}>
                {t("backup.verifyRecoveryPhrase")}
              </CommonText>
              <CommonText style={[styles.descText, { color: theme.subText }]}>
                {t("backup.tapTheWord")}
              </CommonText>
            </View>
            <View style={styles.selectableMnemonicContainer}>
              <View style={{ flexWrap: "wrap", flexDirection: "row", justifyContent: "center" }}>
                {selected.map(renderMnemonic)}

              </View>
              {invalidWord === false &&
                <CommonText style={{ color: theme.text3 }}>{t("mnemonic.invalid_order")}</CommonText>}
            </View>
            <View style={styles.mnemonicContainer}>
              {selectable.map(renderSelectable)}
            </View>
            <View style={styles.bottomContainer}>
              <CommonButton
                text={t("continue")}
                style={{
                  marginVertical: 10,
                  backgroundColor: valid ? theme.button : theme.subButton,
                }}
                textStyle={{ color: theme.text }}
                onPress={async () => {
                  if (valid) {
                    const seedPhrase = mnemonics.map(item => item.word).join(" ");
                    CommonLoading.show();
                    dispatch(WalletAction.insert(
                      {
                        name: applicationProperties.defaultWalletName,
                        type: WALLET_TYPE.MANY,
                        defaultChain: "ETH",
                        mnemonic: seedPhrase,
                        assets: WALLET_LIST[0].coins,
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
                  }
                }}
              />
            </View>
          </View>
        </SafeAreaView>
      </LinearGradient>
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  header: {
    height: 48,
    paddingHorizontal: 10,
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  content: {
    flex: 1,
    width: "100%",
  },
  titleContainer: {
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
  },
  titleText: {
    fontSize: 20,
    fontWeight: "bold",
  },
  descText: {
    marginVertical: 10,
    textAlign: "center",
  },
  mnemonicContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    alignItems: "center",
  },
  mnemonic: {
    borderRadius: 10,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 10,
    marginVertical: 5,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  copyContainer: {
    alignItems: "center",
    justifyContent: "center",
    marginVertical: 10,
  },
  bottomContainer: {
    flex: 1,
    padding: 10,
    justifyContent: "flex-end",
  },
  selectableMnemonicContainer: {
    width: "100%",
    paddingHorizontal: 10,
    minHeight: 125,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#151414",
    marginBottom: 10,
  },
  gradient: {
    width: "100%",
    height: "100%",
  },
});

