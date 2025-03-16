import React, { useEffect, useRef, useState } from "react";
import { Platform, SafeAreaView, StyleSheet, Switch, View } from "react-native";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import CommonBackButton from "@components/commons/CommonBackButton";
import CommonText from "@components/commons/CommonText";
import CommonTouchableOpacity from "@components/commons/CommonTouchableOpacity";
import Icon, { Icons } from "@components/icons/Icons";
import ActionSheet from "react-native-actions-sheet";
import { AppLockAction } from "@persistence/applock/AppLockAction";
import LinearGradient from "react-native-linear-gradient";

export default function SecurityScreen({ navigation, route }) {
  const { t } = useTranslation();
  const { theme } = useSelector(state => state.ThemeReducer);
  const dispatch = useDispatch();
  const actionSheetRef = useRef();
  const actionSheetLockMethodRef = useRef();
  const { appLock } = useSelector(state => state.AppLockReducer);
  const [isEnabled, setIsEnabled] = useState(appLock.appLock);
  const toggleSwitch = async () => {
    setIsEnabled(previousState => !previousState);
    const lock = !appLock.appLock;

    const newLock = {
      appLock: lock,
      autoLock: appLock.autoLock,
      biometryLock: appLock.biometryLock,
      appLockText: appLock.appLockText,
    };
    if (!lock) {
      newLock.autoLock = 0;
      newLock.biometryLock = false;
      newLock.appLockText = "app_lock.immediate";
    }
    dispatch(AppLockAction.setAppLock(newLock));
  };
  const appLockText = {
    "app_lock.immediate": t("app_lock.immediate"),
    "app_lock.away1minute": t("app_lock.away1minute"),
    "app_lock.away5minutes": t("app_lock.away5minutes"),
    "app_lock.away1Hour": t("app_lock.away1Hour"),
    "app_lock.away5Hours": t("app_lock.away5Hours"),
  };
  useEffect(() => {
  }, []);

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
              <CommonText style={styles.headerTitle}>{t("settings.security")}</CommonText>
            </View>
          </View>
          <View style={styles.content}>
            <CommonTouchableOpacity
              style={[
                styles.item,
                { borderBottomColor: theme.border, borderBottomWidth: 0.3 },
              ]}
              onPress={() => {
              }}>
              <CommonText style={[styles.textItem, { color: theme.text }]}>
                {t("settings.app_lock")}
              </CommonText>
              <Switch
                trackColor={{ false: "#767577", true: theme.button }}
                thumbColor={isEnabled ? "#f5dd4b" : "#f4f3f4"}
                ios_backgroundColor="#3e3e3e"
                value={isEnabled}
                onValueChange={toggleSwitch}
              />
            </CommonTouchableOpacity>
            {appLock.appLock && (
              <>
                <CommonTouchableOpacity
                  style={[
                    styles.item,
                    { borderBottomColor: theme.border, borderBottomWidth: 0.3 },
                  ]}
                  onPress={() => {
                    actionSheetRef.current?.show();
                  }}>
                  <CommonText style={[styles.textItem, { color: theme.text }]}>
                    {t("app_lock.autolock")}
                  </CommonText>
                  <View style={styles.rightSubItem}>
                    <CommonText style={{ color: theme.text }}>
                      {appLockText[appLock.appLockText]}
                    </CommonText>
                  </View>
                </CommonTouchableOpacity>
                <CommonTouchableOpacity
                  style={[
                    styles.item,
                    { borderBottomColor: theme.border, borderBottomWidth: 0.3 },
                  ]}
                  onPress={() => {
                    actionSheetLockMethodRef.current?.show();
                  }}>
                  <CommonText style={[styles.textItem, { color: theme.text }]}>
                    {t("app_lock.lockmethod")}
                  </CommonText>
                  <View style={styles.rightSubItem}>
                    <CommonText style={{ color: theme.text }}>
                      {appLock.biometryLock
                        ? Platform.OS === "ios"
                          ? t("app_lock.faceid")
                          : t("app_lock.touchid")
                        : t("app_lock.passcode")}
                    </CommonText>
                  </View>
                </CommonTouchableOpacity>
                <CommonTouchableOpacity
                  style={[
                    styles.item,
                    { borderBottomColor: theme.border, borderBottomWidth: 0.3 },
                  ]}
                  onPress={() => {
                    navigation.navigate("ConfirmPinCodeScreen");
                  }}>
                  <CommonText style={[styles.textItem, { color: theme.text }]}>
                    Change Pin-code
                  </CommonText>
                  <View style={styles.rightSubItem}>

                  </View>
                </CommonTouchableOpacity>
              </>
            )}
          </View>
          <ActionSheet
            ref={actionSheetRef}
            containerStyle={{
              backgroundColor: theme.gradientSecondary,
            }}
            gestureEnabled={true}
            headerAlwaysVisible>
            <CommonTouchableOpacity
              style={[
                styles.item,
                { backgroundColor: theme.gradientSecondary, borderBottomColor: theme.border, borderBottomWidth: 0.3 },
              ]}
              onPress={() => {
                const newLock = {
                  appLock: appLock.appLock,
                  autoLock: 0,
                  biometryLock: appLock.biometryLock,
                  appLockText: "app_lock.immediate",
                };
                dispatch(AppLockAction.setAppLock(newLock));
              }}>
              <CommonText style={[styles.textItem, { color: theme.text }]}>
                {t("app_lock.immediate")}
              </CommonText>
              <View style={styles.rightSubItem}>
                {appLock.autoLock === 0 && (
                  <Icon name="check" size={20} type={Icons.Entypo} />
                )}
              </View>
            </CommonTouchableOpacity>
            <CommonTouchableOpacity
              style={[
                styles.item,
                { backgroundColor: theme.gradientSecondary, borderBottomColor: theme.border, borderBottomWidth: 0.3 },
              ]}
              onPress={() => {
                const newLock = {
                  appLock: appLock.appLock,
                  autoLock: 60,
                  biometryLock: appLock.biometryLock,
                  appLockText: "app_lock.away1minute",
                };
                dispatch(AppLockAction.setAppLock(newLock));
              }}>
              <CommonText style={[styles.textItem, { color: theme.text }]}>
                {t("app_lock.away1minute")}
              </CommonText>
              <View style={styles.rightSubItem}>
                {appLock.autoLock === 60 && (
                  <Icon name="check" size={20} type={Icons.Entypo} />
                )}
              </View>
            </CommonTouchableOpacity>
            <CommonTouchableOpacity
              style={[
                styles.item,
                { backgroundColor: theme.gradientSecondary, borderBottomColor: theme.border, borderBottomWidth: 0.3 },
              ]}
              onPress={() => {
                const newLock = {
                  appLock: appLock.appLock,
                  autoLock: 300,
                  biometryLock: appLock.biometryLock,
                  appLockText: "app_lock.away5minutes",
                };
                dispatch(AppLockAction.setAppLock(newLock));
              }}>
              <CommonText style={[styles.textItem, { color: theme.text }]}>
                {t("app_lock.away5minutes")}
              </CommonText>
              <View style={styles.rightSubItem}>
                {appLock.autoLock === 300 && (
                  <Icon name="check" size={20} type={Icons.Entypo} />
                )}
              </View>
            </CommonTouchableOpacity>
            <CommonTouchableOpacity
              style={[
                styles.item,
                { backgroundColor: theme.gradientSecondary, borderBottomColor: theme.border, borderBottomWidth: 0.3 },
              ]}
              onPress={() => {
                const newLock = {
                  appLock: appLock.appLock,
                  autoLock: 3600,
                  biometryLock: appLock.biometryLock,
                  appLockText: "app_lock.away1Hour",
                };
                dispatch(AppLockAction.setAppLock(newLock));
              }}>
              <CommonText style={[styles.textItem, { color: theme.text }]}>
                {t("app_lock.away1Hour")}
              </CommonText>
              <View style={styles.rightSubItem}>
                {appLock.autoLock === 3600 && (
                  <Icon name="check" size={20} type={Icons.Entypo} />
                )}
              </View>
            </CommonTouchableOpacity>
            <CommonTouchableOpacity
              style={[
                styles.item,
                { backgroundColor: theme.gradientSecondary, borderBottomColor: theme.border, borderBottomWidth: 0.3 },
              ]}
              onPress={() => {
                const newLock = {
                  appLock: appLock.appLock,
                  autoLock: 18000,
                  biometryLock: appLock.biometryLock,
                  appLockText: "app_lock.away5Hours",
                };
                dispatch(AppLockAction.setAppLock(newLock));
              }}>
              <CommonText style={[styles.textItem, { color: theme.text }]}>
                {t("app_lock.away5Hours")}
              </CommonText>
              <View style={styles.rightSubItem}>
                {appLock.autoLock === 18000 && (
                  <Icon name="check" size={20} type={Icons.Entypo} />
                )}
              </View>
            </CommonTouchableOpacity>
          </ActionSheet>
          <ActionSheet
            ref={actionSheetLockMethodRef}
            gestureEnabled={true}
            containerStyle={{
              backgroundColor: theme.gradientSecondary,
            }}
            headerAlwaysVisible>
            <CommonTouchableOpacity
              style={[
                styles.item,
                { backgroundColor: theme.gradientSecondary, borderBottomColor: theme.border, borderBottomWidth: 0.3 },
              ]}
              onPress={() => {
                const newLock = {
                  appLock: appLock.appLock,
                  autoLock: appLock.autoLock,
                  biometryLock: false,
                  appLockText: appLock.appLockText,
                };
                dispatch(AppLockAction.setAppLock(newLock));
              }}>
              <CommonText style={[styles.textItem, { color: theme.text }]}>
                {t("app_lock.passcode")}
              </CommonText>
              <View style={styles.rightSubItem}>
                {appLock.biometryLock === false && (
                  <Icon name="check" size={20} type={Icons.Entypo} />
                )}
              </View>
            </CommonTouchableOpacity>
            <CommonTouchableOpacity
              style={[
                styles.item,
                { backgroundColor: theme.gradientSecondary, borderBottomColor: theme.border, borderBottomWidth: 0.3 },
              ]}
              onPress={() => {
                const newLock = {
                  appLock: appLock.appLock,
                  autoLock: appLock.autoLock,
                  biometryLock: true,
                  appLockText: appLock.appLockText,
                };
                dispatch(AppLockAction.setAppLock(newLock));
              }}>
              <CommonText style={[styles.textItem, { color: theme.text }]}>
                {Platform.OS === "android"
                  ? t("app_lock.touchid")
                  : t("app_lock.faceid")}
              </CommonText>
              <View style={styles.rightSubItem}>
                {appLock.biometryLock === true && (
                  <Icon name="check" size={20} type={Icons.Entypo} />
                )}
              </View>
            </CommonTouchableOpacity>
          </ActionSheet>
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
  textItem: { flex: 3 },
  rightSubItem: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  content: {},
  gapBackground: {
    height: 50,
    width: "100%",
    position: "absolute",
    top: 0,
  },
  gradient: {
    height: "100%",
    width: "100%",
  },
});
