import React, { useEffect, useState } from "react";
import { SafeAreaView, StyleSheet, View } from "react-native";
import CommonBackButton from "@components/commons/CommonBackButton";
import CommonText from "@components/commons/CommonText";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import CommonImage from "@components/commons/CommonImage";
import CommonTouchableOpacity from "@components/commons/CommonTouchableOpacity";
import CommonButton from "@components/commons/CommonButton";
import LinearGradient from "react-native-linear-gradient";

export default function AgreementScreen({ navigation }) {
  const { t } = useTranslation();
  const { theme } = useSelector(state => state.ThemeReducer);
  const [agreement1, setAgreement1] = useState(false);
  const [agreement2, setAgreement2] = useState(false);
  const [agreement3, setAgreement3] = useState(false);
  useEffect(() => {
    (async () => {

    })();
  });

  return (
    <View style={{ flex: 1 }}>
      <LinearGradient
        colors={[theme.gradientPrimary, theme.gradientSecondary]}
        style={styles.gradient}>
        <SafeAreaView style={styles.container}>
          <View style={styles.header}>
            <CommonBackButton
              onPress={() => {
                navigation.pop(2);
              }}
            />
          </View>
          <View
            style={[
              styles.content,
            ]}>
            <View style={styles.titleContainer}>
              <CommonText style={[styles.titleText]}>
                {t("backup.back_up_your_wallet_now")}
              </CommonText>
              <CommonText style={[styles.descText]}>
                {t("backup.in_the_next_step")}
              </CommonText>
            </View>
            <View style={styles.imageContainer}>
              <CommonImage
                source={require("@assets/images/logo2.png")}
                style={{ width: 200, height: 200 }}
              />
            </View>
            <View style={styles.agreementContainer}>
              <View style={[styles.agreementItem, { borderColor: theme.border }]}>
                <View style={{ flex: 1 }}>
                  <CommonText
                    style={[styles.agreementText]}>{t("backup.if_i_lose")}</CommonText>
                </View>
                <CommonTouchableOpacity
                  onPress={() => {
                    setAgreement1(!agreement1);
                  }}>
                  <CommonImage
                    style={styles.check}
                    source={
                      agreement1
                        ? require("@assets/images/checkbox/checked.png")
                        : require("@assets/images/checkbox/unchecked.png")
                    }
                  />
                </CommonTouchableOpacity>
              </View>
              <View style={[styles.agreementItem, { borderColor: theme.border }]}>
                <View style={{ flex: 1 }}>
                  <CommonText
                    style={[styles.agreementText]}>{t("backup.if_i_expose")}</CommonText>
                </View>
                <CommonTouchableOpacity
                  onPress={() => {
                    setAgreement2(!agreement2);
                  }}>
                  <CommonImage
                    style={styles.check}
                    source={
                      agreement2
                        ? require("@assets/images/checkbox/checked.png")
                        : require("@assets/images/checkbox/unchecked.png")
                    }
                  />
                </CommonTouchableOpacity>
              </View>
              <View style={[styles.agreementItem, { borderColor: theme.border }]}>
                <View style={{ flex: 1 }}>
                  <CommonText
                    style={[styles.agreementText]}>{t("backup.never_ask")}</CommonText>
                </View>
                <CommonTouchableOpacity
                  onPress={() => {
                    setAgreement3(!agreement3);
                  }}>
                  <CommonImage
                    style={styles.check}
                    source={
                      agreement3
                        ? require("@assets/images/checkbox/checked.png")
                        : require("@assets/images/checkbox/unchecked.png")
                    }
                  />
                </CommonTouchableOpacity>
              </View>
              <CommonButton
                text={t("continue")}
                style={{
                  marginVertical: 10,
                  backgroundColor: agreement1 && agreement2 && agreement3 ? theme.button : theme.subButton,
                }}
                textStyle={{ color: theme.text }}
                onPress={() => {
                  if (agreement1 && agreement2 && agreement3) {
                    navigation.navigate("MnemonicScreen");
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
  imageContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
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
  gradient: {
    width: "100%",
    height: "100%",
  },
});
