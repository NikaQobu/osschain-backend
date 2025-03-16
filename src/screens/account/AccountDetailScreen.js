import React, { useRef, useState } from "react";
import { Keyboard, SafeAreaView, StyleSheet, TextInput, View } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import CommonText from "@components/commons/CommonText";
import CommonBackButton from "@components/commons/CommonBackButton";
import CommonButton from "@components/commons/CommonButton";
import Icon, { Icons } from "@components/icons/Icons";
import ActionSheet from "react-native-actions-sheet";
import Clipboard from "@react-native-clipboard/clipboard";
import { useTranslation } from "react-i18next";
import CommonTouchableOpacity from "@components/commons/CommonTouchableOpacity";
import { WalletAction } from "@persistence/wallet/WalletAction";
import CommonAlert from "@components/commons/CommonAlert";
import LinearGradient from "react-native-linear-gradient";

export default function AccountDetailScreen({ navigation, route }) {
  const { account } = route.params;
  const { theme } = useSelector(state => state.ThemeReducer);
  const { activeWallet } = useSelector(
    state => state.WalletReducer,
  );
  const [walletName, setWalletName] = useState(account.name);
  const actionSheetRef = useRef();
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const deleteWallet = async () => {
    if (activeWallet.id === account.id) {
      CommonAlert.show({
        title: t("alert.error"),
        message: t("settings.you_can_not_delete_active_wallet"),
        type: "error",
      });
      return;
    }
    CommonAlert.show({
      title: t("alert.warning"),
      message: t("alert.alert_delete_wallets"),
      type: "warning",
      confirm: true,
      onConfirm: () => {
        dispatch(WalletAction.remove(account)).then(({ success, data }) => {
          if (success === true) {
            actionSheetRef.current?.hide();
            navigation.pop(2);
          }
        });
      },
    });
  };
  const copyToClipboard = () => {
    Clipboard.setString(account.mnemonic);
    actionSheetRef.current?.hide();
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
              <CommonText style={styles.headerTitle}>{walletName}</CommonText>
            </View>
          </View>
          <View style={styles.section}>
            <View style={styles.inputTitle}>
              <CommonText style={{ color: theme.text }}>{t("setting.wallet_name")}</CommonText>
            </View>
            <View
              style={[
                styles.inputView,
                { backgroundColor: theme.inputBackground },
              ]}>
              <TextInput
                style={[styles.input, { color: theme.text }]}
                onChangeText={text => setWalletName(text)}
                value={walletName}
                placeholder={t("setting.enter_wallet_name")}
                numberOfLines={1}
                returnKeyType="done"
                placeholderTextColor="gray"
                autoCompleteType={"off"}
                autoCapitalize={"none"}
                autoCorrect={false}
              />
            </View>
          </View>
          <View style={[styles.section, { flex: 1 }]}>
            <View style={styles.inputTitle}>
              <CommonText style={{ color: theme.text }}>{t("setting.back_up_options")}</CommonText>
            </View>
            <CommonTouchableOpacity
              onPress={() => {
                navigation.navigate("ReEnterPinCodeScreen", {
                  onCallBack: () => {
                    actionSheetRef.current?.show();
                  },
                });
              }}
              style={[
                styles.row,
                { backgroundColor: theme.inputBackground },
              ]}>
              <View style={styles.leftItemContainer}>
                <View style={[styles.iconContainer]}>
                  <Icon
                    type={Icons.Foundation}
                    size={18}
                    name={"book"}
                  />
                </View>
                <CommonText style={{ color: theme.text }}>{t("setting.show_secret_phrase")}</CommonText>
              </View>
              <View style={styles.leftItemContainer}>
                <Icon
                  type={Icons.Feather}
                  size={18}
                  name={"chevron-right"}
                />
              </View>
            </CommonTouchableOpacity>
          </View>
          <View style={styles.buttonContainer}>
            <CommonButton
              text={"Save"}
              onPress={async () => {
                dispatch(WalletAction.update({ ...account, name: walletName }));
              }}
            />
            <CommonButton
              style={{
                marginTop: 20,
                backgroundColor: theme.gradientSecondary,
              }}
              text={"Delete this wallet"}
              textStyle={{ color: theme.text3 }}
              onPress={async () => {
                Keyboard.dismiss();
                await deleteWallet();
              }}
            />
          </View>
          <ActionSheet
            ref={actionSheetRef}
            gestureEnabled={true}
            containerStyle={{ backgroundColor: theme.gradientSecondary }}
            headerAlwaysVisible>
            <View style={[styles.confirmTx, { backgroundColor: theme.gradientSecondary }]}>
              <View style={[styles.confirmTxHeader]}>
                <View style={[styles.confirmTxItem, { justifyContent: "center", alignItems: "center" }]}>
                  <CommonText
                    style={{ fontWeight: "bold", fontSize: 18 }}>{t("setting.your_recovery_phrase")}</CommonText>
                </View>
              </View>
              <View style={styles.mnemonicsContainer}>
                <CommonText style={[styles.mnemonics, { color: theme.text }]}>
                  {account.mnemonic}
                </CommonText>
              </View>
              <CommonText style={[styles.paragraph, { color: theme.text }]}>
                {t("setting.copy_these_words")}
              </CommonText>
              <View style={styles.confirmTxButton}>
                <CommonButton
                  text={t("setting.copy")}
                  onPress={() => {
                    copyToClipboard();
                  }}
                />
              </View>
            </View>
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
  section: {
    width: "100%",
    borderRadius: 10,
    paddingHorizontal: 10,
  },
  row: {
    height: 60,
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 10,
    borderRadius: 5,
  },
  leftItemContainer: {
    height: "100%",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  iconContainer: {
    width: 30,
    height: 30,
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
  inputView: {
    height: 60,
    paddingHorizontal: 10,
    fontSize: 14,
    flexDirection: "row",
    justifyContent: "space-around",
  },
  input: { flex: 1 },
  inputTitle: {
    height: 30,
    width: "100%",
    justifyContent: "center",
    marginVertical: 10,
  },
  buttonContainer: {
    padding: 10,
  },
  recoveryText: {
    fontSize: 20,
    textAlign: "center",
    marginTop: 15,
  },
  mnemonicsContainer: {
    marginTop: 40,
    padding: 15,
    borderRadius: 10,
    borderWidth: 2,
    borderStyle: "dashed",
    borderColor: "red",
    minHeight: 130,
    marginHorizontal: 30,
    justifyContent: "center",
  },
  mnemonics: {
    textAlign: "center",
    lineHeight: 25,
    fontSize: 17,
    letterSpacing: 1,
  },
  paragraph: {
    textAlign: "center",
    marginVertical: 20,
    marginHorizontal: 40,
    fontSize: 14,
  },
  button: {
    paddingHorizontal: 10,
  },
  confirmTx: {
    width: "100%",
  },
  confirmTxItem: {
    height: 40,
    width: "100%",
    marginVertical: 5,
    paddingHorizontal: 10,
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  confirmTxHeader: {
    height: 50,
    width: "100%",
  },
  confirmTxButton: {
    marginVertical: 10,
    paddingHorizontal: 10,
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
