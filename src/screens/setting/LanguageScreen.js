import React, { useEffect, useState } from "react";
import { SafeAreaView, StyleSheet, View } from "react-native";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import CommonBackButton from "@components/commons/CommonBackButton";
import CommonText from "@components/commons/CommonText";
import CommonTouchableOpacity from "@components/commons/CommonTouchableOpacity";
import CommonImage from "@components/commons/CommonImage";
import i18n from "i18next";
import Icon, { Icons } from "@components/icons/Icons";
import { StorageUtil } from "@modules/core/util/StorageUtil";
import LinearGradient from "react-native-linear-gradient";

export default function LanguageScreen({ navigation, route }) {
  const { onCallBack } = route.params;
  const { t } = useTranslation();
  const { theme } = useSelector(state => state.ThemeReducer);
  const dispatch = useDispatch();
  const [currentLang, setCurrentLang] = useState("");
  useEffect(() => {
    (async () => {
      const lang =
        (await StorageUtil.getItem("@lng")) || "en";
      setCurrentLang(lang);
    })();
  }, []);
  const setLanguage = async lng => {
    await i18n.changeLanguage(lng);
    await StorageUtil.setItem("@lng", lng);
    await onCallBack();
    navigation.goBack();
  };
  return (
    <View style={{ flex: 1 }}>
      <LinearGradient
        colors={[theme.gradientPrimary, theme.gradientSecondary]}
        style={styles.gradient}>
        <SafeAreaView style={styles.container}>
          <View style={[styles.header]}>
            <View style={styles.leftHeader}>
              <CommonBackButton
                color={theme.text}
                onPress={async () => {
                  navigation.goBack();
                }}
              />
            </View>
            <View style={styles.contentHeader}>
              <CommonText style={styles.headerTitle}>{t("settings.language")}</CommonText>
            </View>
          </View>
          <View style={styles.content}>
            <CommonTouchableOpacity
              style={[
                styles.item,
                { borderBottomColor: theme.border, borderBottomWidth: 0.3 },
              ]}
              onPress={() => setLanguage("en")}>
              <CommonImage
                style={{ height: 42, width: 42 }}
                resizeMode="contain"
                source={require("@assets/images/countries/usa.png")}
              />
              <CommonText style={[styles.textItem, { color: theme.text }]}>
                {t("language.english")}
              </CommonText>
              {currentLang === "en" && (
                <Icon name="check" size={20} type={Icons.AntDesign} />
              )}
            </CommonTouchableOpacity>
            <CommonTouchableOpacity
              style={[
                styles.item,
                { borderBottomColor: theme.border, borderBottomWidth: 0.3 },
              ]}
              onPress={() => setLanguage("fr")}>
              <CommonImage
                style={{ height: 42, width: 42 }}
                resizeMode="contain"
                source={require("@assets/images/countries/france.png")}
              />
              <CommonText style={[styles.textItem, { color: theme.text }]}>
                {t("language.french")}
              </CommonText>
              {currentLang === "fr" && (
                <Icon name="check" size={20} type={Icons.AntDesign} />
              )}
            </CommonTouchableOpacity>
          </View>
        </SafeAreaView>
      </LinearGradient>
    </View>

  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    height: 48,
    paddingHorizontal: 10,
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  leftHeader: {
    width: 30,
    height: "100%",
    justifyContent: "center",
    alignItems: "flex-start",
  },
  contentHeader: {
    flex: 1,
    justifyContent: "center",
    height: "100%",
  },
  rightHeader: {
    width: 30,
    height: "100%",
    alignItems: "flex-end",
    justifyContent: "center",
  },
  headerTitle: {
    fontSize: 15,
    fontWeight: "bold",
  },
  item: {
    height: 70,
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 10,
  },
  textItem: { marginLeft: 10, flex: 3 },
  content: {
    marginTop: 20,
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
