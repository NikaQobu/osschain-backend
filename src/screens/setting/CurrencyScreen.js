import React, { useEffect } from "react";
import { SafeAreaView, StyleSheet, View } from "react-native";
import { useTranslation } from "react-i18next";
import CommonBackButton from "@components/commons/CommonBackButton";
import CommonText from "@components/commons/CommonText";
import { useDispatch, useSelector } from "react-redux";
import CommonFlatList from "@components/commons/CommonFlatList";
import { applicationProperties } from "@src/application.properties";
import CommonTouchableOpacity from "@components/commons/CommonTouchableOpacity";
import Icon, { Icons } from "@components/icons/Icons";
import { CurrencyAction } from "@persistence/currency/CurrencyAction";
import CommonLoading from "@components/commons/CommonLoading";
import LinearGradient from "react-native-linear-gradient";

export default function CurrencyScreen({ navigation, route }) {
  const { t } = useTranslation();
  const { theme } = useSelector(state => state.ThemeReducer);
  const { currency } = useSelector(state => state.CurrencyReducer);
  const dispatch = useDispatch();
  useEffect(() => {
    (async () => {
    })();
  }, []);
  const renderItem = ({ item }) => {
    return (
      <CommonTouchableOpacity
        onPress={async () => {
          CommonLoading.show();
          dispatch(CurrencyAction.getCurrency(item)).then(() => {
            CommonLoading.hide();
          });
        }}
        style={[
          styles.item,
          { borderBottomColor: theme.border, borderBottomWidth: 0.3 },
        ]}>
        <View style={styles.itemContent}>
          <CommonText style={[styles.itemName, { color: theme.text }]} numberOfLines={1}>
            {item.code} - {item.name}
          </CommonText>
        </View>
        {currency.code === item.code && (
          <Icon name="check" size={20} type={Icons.AntDesign} />
        )}
      </CommonTouchableOpacity>
    );
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
              <CommonText style={styles.headerTitle}>{t("settings.currency")}</CommonText>
            </View>
          </View>
          <View style={styles.content}>
            <CommonFlatList
              data={applicationProperties.currencies}
              renderItem={renderItem}
              keyExtractor={item => item.code}
              keyboardDismissMode="on-drag"
              showsVerticalScrollIndicator={false}
            />
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
  img: {
    width: 20,
    height: 20,
    marginRight: 0,
    justifyContent: "center",
    alignSelf: "center",
    marginVertical: 10,
  },
  itemContent: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
  },
  itemName: {
    marginLeft: 10,
    fontSize: 17,
  },
  itemSymbol: {
    marginLeft: 10,
    fontSize: 13,
  },
  content: {
    flex: 1,
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
