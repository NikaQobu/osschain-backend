import React, { useEffect, useState } from "react";
import { SafeAreaView, StyleSheet, View } from "react-native";
import CommonBackButton from "@components/commons/CommonBackButton";
import CommonText from "@components/commons/CommonText";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { WalletFactory } from "@modules/core/factory/WalletFactory";
import CommonButton from "@components/commons/CommonButton";
import { deleteUserPinCode } from "@haskkor/react-native-pincode";
import { StackActions } from "@react-navigation/native";
import LinearGradient from "react-native-linear-gradient";

export default function MnemonicScreen({ navigation }) {
  const { t } = useTranslation();
  const { theme } = useSelector(state => state.ThemeReducer);
  const [mnemonics] = useState(WalletFactory.generateMnemonics());
  useEffect(() => {
  }, []);
  const renderMnemonic = (mnemonic, index) => (
    <View style={[styles.mnemonic, { borderColor: theme.border }]} key={index.toString()}>
      <CommonText
        style={{ textAlign: "left", fontWeight: "bold", color: theme.subText }}>{index + 1}. {mnemonic}</CommonText>
    </View>
  );
  return (
    <View style={{ flex: 1 }}>
      <LinearGradient
        colors={[theme.gradientPrimary, theme.gradientSecondary]}
        style={styles.gradient}>
        <SafeAreaView style={styles.container}>
          <View style={styles.header}>
            <CommonBackButton
              onPress={async () => {
                await deleteUserPinCode();
                navigation.dispatch(StackActions.pop(3));
              }}
            />
          </View>
          <View
            style={[
              styles.content,
            ]}>
            <View style={styles.titleContainer}>
              <CommonText style={[styles.titleText]}>
                {t("backup.yourRecoveryPhrase")}
              </CommonText>
              <CommonText style={[styles.descText, { color: theme.subText }]}>
                {t("backup.writeDown")}
              </CommonText>
            </View>
            <View style={styles.mnemonicContainer}>
              {mnemonics && mnemonics.map(renderMnemonic)}
            </View>
            <View style={styles.bottomContainer}>
              <View style={styles.warningContainer}>
                <CommonText style={[styles.warningText, { color: theme.text3 }]}>{t("mnemonic.do_not")}</CommonText>
                <CommonText style={[styles.warningText, {
                  color: theme.text3,
                  fontWeight: "normal",
                  marginTop: 10,
                }]}>{t("backup.never_ask")}</CommonText>
              </View>
              <CommonButton
                text={t("continue")}
                style={{
                  marginVertical: 10,
                }}
                textStyle={{ color: theme.text }}
                onPress={() => {
                  const data = mnemonics.map((item, index) => {
                    return {
                      id: index + 1,
                      word: item,
                    };
                  });
                  navigation.navigate("ConfirmMnemonicScreen", { mnemonics: data });
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
  agreementContainer: {
    width: "100%",
    paddingHorizontal: 10,
  },
  agreementItem: {
    width: "100%",
    height: 70,
    marginBottom: 10,
    borderWidth: 1,
    borderRadius: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 10,
  },
  agreementText: {
    fontSize: 15,
  },
  check: {
    width: 32,
    height: 32,
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
  copy: {
    fontSize: 15,
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
  warningContainer: {
    width: "100%",
    height: 120,
    backgroundColor: "#e7d5d6",
    padding: 10,
    justifyContent: "center",
    marginVertical: 10,
  },
  warningText: {
    fontWeight: "bold",
    textAlign: "center",
    fontSize: 15,
  },
  gradient: {
    width: "100%",
    height: "100%",
  },
});
