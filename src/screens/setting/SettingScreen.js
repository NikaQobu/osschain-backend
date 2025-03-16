import React, { useEffect } from "react";
import { Linking, SafeAreaView, ScrollView, StyleSheet, View } from "react-native";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import CommonText from "@components/commons/CommonText";
import Icon, { Icons } from "@components/icons/Icons";
import CommonTouchableOpacity from "@components/commons/CommonTouchableOpacity";
import { applicationProperties } from "@src/application.properties";
import LinearGradient from "react-native-linear-gradient";

export default function SettingScreen({ navigation, route }) {
  const { t } = useTranslation();
  const { theme } = useSelector(state => state.ThemeReducer);
  const { activeWallet } = useSelector(state => state.WalletReducer);

  useEffect(() => {
    (async () => {
    })();
  }, []);

  return (
    <View style={{ flex: 1 }}>
      <LinearGradient
        colors={[theme.gradientPrimary, theme.gradientSecondary]}
        style={styles.gradient}>
        <SafeAreaView style={[styles.container]}>
          <View style={[styles.header]}>
            <View style={styles.contentHeader}>
              <CommonText style={styles.headerTitle}>{t("setting.setting")}</CommonText>
            </View>
          </View>
          <ScrollView style={[styles.content]}
                      showsVerticalScrollIndicator={false}>
            <View style={styles.item}>
              <CommonTouchableOpacity
                onPress={() => {
                  navigation.navigate("AccountScreen");
                }}
                style={[
                  styles.row,
                  { borderBottomColor: theme.border, borderBottomWidth: 0.5 },
                ]}>
                <View style={styles.leftItemContainer}>
                  <View style={styles.iconContainer}>
                    <Icon
                      type={Icons.Ionicons}
                      size={18}
                      name={"md-wallet-outline"}
                      color={"white"}
                    />
                  </View>
                  <CommonText style={{ color: theme.text }}>{t("settings.wallets")}</CommonText>
                </View>
                <View style={styles.leftItemContainer}>
                  <CommonText style={{ color: theme.subText }}>{activeWallet.name}</CommonText>
                </View>
              </CommonTouchableOpacity>
              <CommonTouchableOpacity
                onPress={() => {
                  navigation.navigate("SecurityScreen");
                }}
                style={[
                  styles.row,
                  { borderBottomColor: theme.border, borderBottomWidth: 0.3 },
                ]}>
                <View style={styles.leftItemContainer}>
                  <View
                    style={[
                      styles.iconContainer,
                      { backgroundColor: "#565656" },
                    ]}>
                    <Icon
                      type={Icons.MaterialCommunityIcons}
                      size={18}
                      name={"security"}
                      color={"white"}
                    />
                  </View>
                  <CommonText style={{ color: theme.text }}>{t("settings.security")}</CommonText>
                </View>
              </CommonTouchableOpacity>
              <CommonTouchableOpacity
                onPress={() => {
                  navigation.navigate("PreferencesScreen");
                }}
                style={[
                  styles.row,
                  { borderBottomColor: theme.border, borderBottomWidth: 0.5 },
                ]}>
                <View style={styles.leftItemContainer}>
                  <View
                    style={[
                      styles.iconContainer,
                      { backgroundColor: "#33b9a2" },
                    ]}>
                    <Icon
                      type={Icons.Ionicons}
                      size={18}
                      name={"settings-outline"}
                      color={"white"}
                    />
                  </View>
                  <CommonText style={{ color: theme.text }}>{t("settings.preferences")}</CommonText>
                </View>
              </CommonTouchableOpacity>
              <CommonTouchableOpacity
                onPress={async () => {
                  await Linking.openURL(applicationProperties.endpoints.helpCenter);
                }}
                style={[
                  styles.row,
                  { borderBottomColor: theme.border, borderBottomWidth: 0.3 },
                ]}>
                <View style={styles.leftItemContainer}>
                  <View
                    style={[
                      styles.iconContainer,
                      { backgroundColor: "#f48e0f" },
                    ]}>
                    <Icon
                      type={Icons.MaterialCommunityIcons}
                      size={18}
                      name={"account-question-outline"}
                      color={"white"}
                    />
                  </View>
                  <CommonText style={{ color: theme.text }}>{t("settings.help_center")}</CommonText>
                </View>

              </CommonTouchableOpacity>
              <CommonTouchableOpacity
                onPress={async () => {
                  await Linking.openURL(applicationProperties.endpoints.twitter);
                }}
                style={[
                  styles.row,
                  { borderBottomColor: theme.border, borderBottomWidth: 0.7 },
                ]}>
                <View style={styles.leftItemContainer}>
                  <View
                    style={[
                      styles.iconContainer,
                      { backgroundColor: "#5ca3d3" },
                    ]}>
                    <Icon
                      type={Icons.Feather}
                      size={18}
                      name={"twitter"}
                      color={"white"}
                    />
                  </View>
                  <CommonText style={{ color: theme.text }}>{t("settings.twitter")}</CommonText>
                </View>

              </CommonTouchableOpacity>
              <CommonTouchableOpacity
                onPress={async () => {
                  await Linking.openURL(applicationProperties.endpoints.telegram);
                }}
                style={[
                  styles.row,
                  { borderBottomColor: theme.border, borderBottomWidth: 0.3 },
                ]}>
                <View style={styles.leftItemContainer}>
                  <View
                    style={[
                      styles.iconContainer,
                      { backgroundColor: "#2ca2d6" },
                    ]}>
                    <Icon
                      type={Icons.EvilIcons}
                      size={18}
                      name={"sc-telegram"}
                      color={"white"}
                    />
                  </View>
                  <CommonText style={{ color: theme.text }}>{t("settings.telegram")}</CommonText>
                </View>

              </CommonTouchableOpacity>
              <CommonTouchableOpacity
                onPress={async () => {
                  await Linking.openURL(applicationProperties.endpoints.facebook);
                }}
                style={[
                  styles.row,
                  { borderBottomColor: theme.border, borderBottomWidth: 0.7 },
                ]}>
                <View style={styles.leftItemContainer}>
                  <View
                    style={[
                      styles.iconContainer,
                      { backgroundColor: "#3b5696" },
                    ]}>
                    <Icon
                      type={Icons.Feather}
                      size={18}
                      name={"facebook"}
                      color={"white"}
                    />
                  </View>
                  <CommonText style={{ color: theme.text }}>{t("settings.facebook")}</CommonText>
                </View>

              </CommonTouchableOpacity>
              <CommonTouchableOpacity
                onPress={async () => {
                  await Linking.openURL(applicationProperties.endpoints.reddit);
                }}
                style={[
                  styles.row,
                  { borderBottomColor: theme.border, borderBottomWidth: 0.5 },
                ]}>
                <View style={styles.leftItemContainer}>
                  <View
                    style={[
                      styles.iconContainer,
                      { backgroundColor: "#f6550a" },
                    ]}>
                    <Icon
                      type={Icons.Ionicons}
                      size={18}
                      name={"logo-reddit"}
                      color={"white"}
                    />
                  </View>
                  <CommonText style={{ color: theme.text }}>{t("settings.reddit")}</CommonText>
                </View>

              </CommonTouchableOpacity>
              <CommonTouchableOpacity
                onPress={async () => {
                  await Linking.openURL(applicationProperties.endpoints.discord);
                }}
                style={[
                  styles.row,
                  { borderBottomColor: theme.border, borderBottomWidth: 0.3 },
                ]}>
                <View style={styles.leftItemContainer}>
                  <View
                    style={[
                      styles.iconContainer,
                      { backgroundColor: "#535edd" },
                    ]}>
                    <Icon
                      type={Icons.MaterialCommunityIcons}
                      size={18}
                      name={"discord"}
                      color={"white"}
                    />
                  </View>
                  <CommonText style={{ color: theme.text }}>{t("setting.discord")}</CommonText>
                </View>
              </CommonTouchableOpacity>
              <CommonTouchableOpacity
                onPress={async () => {
                  await Linking.openURL(applicationProperties.endpoints.about);
                }}
                style={[
                  styles.row,
                  { borderBottomColor: theme.border, borderBottomWidth: 0.5 },
                ]}>
                <View style={styles.leftItemContainer}>
                  <View
                    style={[
                      styles.iconContainer,
                      { backgroundColor: "#e04479" },
                    ]}>
                    <Icon
                      type={Icons.AntDesign}
                      size={18}
                      name={"hearto"}
                      color={"white"}
                    />
                  </View>
                  <CommonText style={{ color: theme.text }}>{t("settings.about")}</CommonText>
                </View>
              </CommonTouchableOpacity>
            </View>

          </ScrollView>
        </SafeAreaView>
      </LinearGradient>
    </View>

  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {},
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
    width: "100%",
    marginBottom: 10,
  },
  row: {
    height: 70,
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 10,
  },
  leftItemContainer: {
    height: "100%",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  iconContainer: {
    width: 42,
    height: 42,
    backgroundColor: "#27aa7b",
    borderRadius: 10,
    marginRight: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  rightItemContainer: {
    height: "100%",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
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
