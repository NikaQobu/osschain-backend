import React, { useEffect } from "react";
import { StyleSheet, View } from "react-native";
import _ from "lodash";
import CommonImage from "@components/commons/CommonImage";
import { CommonActions } from "@react-navigation/native";
import i18n from "i18next";
import { StorageUtil } from "@modules/core/util/StorageUtil";
import LinearGradient from "react-native-linear-gradient";
import { useSelector } from "react-redux";

export default function SplashScreen({ navigation }) {
  const { theme } = useSelector(state => state.ThemeReducer);
  useEffect(() => {
    (async () => {
      const lng = await StorageUtil.getItem("@lng");
      if (lng) {
        await i18n.changeLanguage(lng);
      }
      const isInitialized = await StorageUtil.getItem(
        "isInitialized",
      );
      if (!_.isNil(isInitialized)) {
        navigation.dispatch(
          CommonActions.reset({
            index: 1,
            routes: [{ name: "EnterPinCodeScreen" }],
          }),
        );
      } else {
        navigation.dispatch(
          CommonActions.reset({
            index: 1,
            routes: [{ name: "WalkThroughScreen" }],
          }),
        );
      }
    })();
  });

  return (
    <View style={{ flex: 1 }}>
      <LinearGradient
        colors={[theme.gradientPrimary, theme.gradientSecondary]}
        style={styles.gradient}>

        <CommonImage
          style={{ height: 164, width: 164, tintColor: "#353333" }}
          resizeMode="contain"
          source={require("@assets/images/logo2.png")}
        />
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
  logo: {
    fontSize: 40,
    letterSpacing: 1,
  },
  gradient: {
    width: "100%",
    height: "100%",
    alignItems: "center",
    justifyContent: "center",
  },
});
