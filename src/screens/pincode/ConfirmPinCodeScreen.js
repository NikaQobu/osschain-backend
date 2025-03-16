import React from "react";
import { PinCode } from "@components/PinCode";
import { SafeAreaView, StyleSheet, View } from "react-native";
import CommonBackButton from "@components/commons/CommonBackButton";
import LinearGradient from "react-native-linear-gradient";
import { useSelector } from "react-redux";

const ConfirmPinCodeScreen = ({ navigation }) => {
  const { theme } = useSelector(state => state.ThemeReducer);
  return (
    <View style={{ flex: 1 }}>
      <LinearGradient
        colors={[theme.gradientPrimary, theme.gradientSecondary]}
        style={styles.gradient}>
        <SafeAreaView style={{ flex: 1 }}>
          <View style={styles.header}>
            <CommonBackButton
              onPress={() => {
                navigation.goBack();
              }}
            />
          </View>
          <PinCode
            onSuccess={() => {
              navigation.navigate("ChangePinCodeScreen");
            }}
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
  gradient: {
    width: "100%",
    height: "110%",
  },
});
export default ConfirmPinCodeScreen;
