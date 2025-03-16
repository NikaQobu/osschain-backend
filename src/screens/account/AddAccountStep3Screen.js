import React, { useEffect, useState } from "react";
import { SafeAreaView, StyleSheet, View } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import CommonText from "@components/commons/CommonText";
import CommonBackButton from "@components/commons/CommonBackButton";
import CommonButton from "@components/commons/CommonButton";
import { WalletFactory } from "@modules/core/factory/WalletFactory";
import { useTranslation } from "react-i18next";
import LinearGradient from "react-native-linear-gradient";

export default function AddAccountStep3Screen({ navigation, route }) {
  const { t } = useTranslation();
  const { account } = route.params;
  const [mnemonics] = useState(WalletFactory.generateMnemonics());
  const { theme } = useSelector(state => state.ThemeReducer);
  const dispatch = useDispatch();
  useEffect(() => {

  }, []);
  const renderMnemonic = (mnemonic, index) => (
    <View
      style={[styles.mnemonic, { backgroundColor: theme.gradientSecondary }]}
      key={index}>
      <CommonText style={{ textAlign: "left", fontWeight: "bold", color: theme.text }}>
        {index + 1}. {mnemonic}
      </CommonText>
    </View>
  );
  return (
    <View style={{ flex: 1 }}>
      <LinearGradient
        colors={[theme.gradientPrimary, theme.gradientSecondary]}
        style={styles.gradient}>
        <SafeAreaView style={styles.container}>
          <View style={[styles.header]}>
            <CommonBackButton
              color={theme.text}
              onPress={async () => {
                navigation.goBack();
              }}
            />
          </View>
          <View
            style={[
              styles.content,
            ]}>
            <View style={styles.titleContainer}>
              <CommonText style={[styles.titleText, { color: theme.text }]}>
                {t("backup.yourRecoveryPhrase")}
              </CommonText>
              <CommonText style={[styles.descText, { color: theme.subText }]}>
                {t("backup.writeDown")}
              </CommonText>
            </View>
            <View style={[styles.mnemonicContainer]}>
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
                  navigation.navigate("AddAccountStep4Screen", { mnemonics: data, account });
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
    marginTop: 10,
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
  },
  warningText: {
    fontWeight: "bold",
    textAlign: "center",
    fontSize: 15,
  },
  gapBackground: {
    height: 50,
    width: "100%",
    position: "absolute",
    top: 0,
  },
  gradient: {
    width: "100%",
    height: "100%",
  },
});
