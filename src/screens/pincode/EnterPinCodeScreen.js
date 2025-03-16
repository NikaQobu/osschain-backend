import React, { useEffect } from "react";
import { PinCode } from "@components/PinCode";
import { SafeAreaView, StyleSheet, View } from "react-native";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import CommonLoading from "@components/commons/CommonLoading";
import { WalletAction } from "@persistence/wallet/WalletAction";
import { UserAction } from "@persistence/user/UserAction";
import LinearGradient from "react-native-linear-gradient";

const EnterPinCodeScreen = ({ route }) => {
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const { theme } = useSelector(state => state.ThemeReducer);
  useEffect(() => {
  }, []);

  const success = async () => {
    CommonLoading.show();
    dispatch(WalletAction.findAll()).then(async () => {
      dispatch(WalletAction.balance()).then(() => {
      });
      dispatch(UserAction.signIn()).then(() => {
        CommonLoading.hide();
      });
    });
  };
  return (
    <View style={{ flex: 1 }}>
      <LinearGradient
        colors={[theme.gradientPrimary, theme.gradientSecondary]}
        style={styles.gradient}>
        <SafeAreaView style={{ flex: 1 }}>
          <PinCode
            onFail={() => {
              console.log("Fail to auth");
            }}
            onSuccess={() => success()}
            onClickButtonLockedPage={() => console.log("Quit")}
            status={"enter"}
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
  securityTextContainer: {
    width: "100%",
    paddingHorizontal: 10,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 10,
  },
  securityText: {
    fontSize: 13,
    textAlign: "center",
  },
  gradient: {
    width: "100%",
    height: "100%",
  },
});
export default EnterPinCodeScreen;
