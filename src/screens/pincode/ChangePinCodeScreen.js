import React from "react";
import { PinCode } from "@components/PinCode";
import { SafeAreaView, StyleSheet, View } from "react-native";
import CommonTouchableOpacity from "@components/commons/CommonTouchableOpacity";
import Icon, { Icons } from "@components/icons/Icons";
import { useTranslation } from "react-i18next";
import CommonText from "@components/commons/CommonText";
import CommonAlert from "@components/commons/CommonAlert";
import { useSelector } from "react-redux";
import LinearGradient from "react-native-linear-gradient";

const ChangePinCodeScreen = ({ navigation }) => {
  const { t } = useTranslation();
  const { theme } = useSelector(state => state.ThemeReducer);
  return (
    <View style={{ flex: 1 }}>
      <LinearGradient
        colors={[theme.gradientPrimary, theme.gradientSecondary]}
        style={styles.gradient}>
        <SafeAreaView style={{ flex: 1 }}>
          <View style={styles.header}>
            <CommonTouchableOpacity
              onPress={() => {
                navigation.goBack();
              }}>
              <Icon type={Icons.Feather} name={"arrow-left"} />
            </CommonTouchableOpacity>
            <CommonText>{t("settings.new_pincode")}</CommonText>
            <View style={{ width: 30 }}></View>
          </View>
          <PinCode
            onSuccess={() => {
              CommonAlert.show({
                title: t("alert.info"),
                message: t("settings.change_pincode_success"),
              });
              navigation.pop(2);
            }}
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
});
export default ChangePinCodeScreen;
