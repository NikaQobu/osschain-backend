import React, { useEffect } from "react";
import { PinCode } from "@components/PinCode";
import { BackHandler, SafeAreaView, StyleSheet, View } from "react-native";
import { useNavigation } from "@react-navigation/native";
import CommonBackButton from "@components/commons/CommonBackButton";
import LinearGradient from "react-native-linear-gradient";
import { useSelector } from "react-redux";

const ReEnterPinCodeScreen = ({ route }) => {
  const params = route.params;
  const navigation = useNavigation();
  const { theme } = useSelector(state => state.ThemeReducer);
  useEffect(() => {
    const backHandler = BackHandler.addEventListener("hardwareBackPress", () => true);
    return () => backHandler.remove();
  }, []);

  const success = async () => {
    navigation.goBack();
    if (params) {
      params.onCallBack();
    }
  };

  return (
    <View style={{ flex: 1 }}>
      <LinearGradient
        colors={[theme.gradientPrimary, theme.gradientSecondary]}
        style={styles.gradient}>
        <SafeAreaView style={{ flex: 1 }}>
          <View style={styles.header}>
            {params && (
              <CommonBackButton
                onPress={async () => {
                  navigation.goBack();
                }}
              />
            )}
          </View>
          <PinCode onSuccess={() => success()} status={"enter"} />
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
export default ReEnterPinCodeScreen;
