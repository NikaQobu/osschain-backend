import React, { useCallback, useEffect, useState } from "react";
import { RefreshControl, SafeAreaView, StyleSheet, View } from "react-native";
import CommonTouchableOpacity from "@components/commons/CommonTouchableOpacity";
import FastImage from "react-native-fast-image";
import CommonImage from "@components/commons/CommonImage";
import { useDispatch, useSelector } from "react-redux";
import { MarketAction } from "@persistence/market/MarketAction";
import CommonText from "@components/commons/CommonText";
import { formatPercentage } from "@src/utils/CurrencyUtil";
import { LineChart } from "react-native-chart-kit";
import Price from "@components/Price";
import { useTranslation } from "react-i18next";
import CommonFlatList from "@components/commons/CommonFlatList";
import LinearGradient from "react-native-linear-gradient";

export default function MarketScreen({ navigation, route }) {
  const { t } = useTranslation();
  const { theme } = useSelector(state => state.ThemeReducer);
  const { markets } = useSelector(state => state.MarketReducer);
  const dispatch = useDispatch();
  const [refreshing, setRefreshing] = useState(false);
  useEffect(() => {
  }, []);
  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    dispatch(MarketAction.getMarkets(30, true)).then(() => {
      setRefreshing(false);
    });
  }, []);
  const renderItem = ({ item }) => {
    const up = item.price_change_percentage_24h >= 0;
    return (
      <CommonTouchableOpacity
        onPress={async () => {
          navigation.navigate("MarketDetailScreen", { coin: item });
        }}
        style={[styles.item, { borderBottomColor: theme.border }]}>
        <CommonImage
          style={styles.img}
          source={{
            uri: item.image,
            priority: FastImage.priority.normal,
            cache: FastImage.cacheControl.immutable,
          }}
        />
        <View style={styles.itemContent}>
          <View style={{ width: 100 }}>
            <CommonText style={[styles.itemName, { color: theme.text }]} numberOfLines={1}>
              {item.name}
            </CommonText>
            <CommonText
              style={[
                styles.itemName,
                { color: theme.subText, fontSize: 12 },
              ]}
              numberOfLines={1}>
              {item.symbol.toUpperCase()}
            </CommonText>
          </View>
          <View
            style={{
              flex: 1,
              justifyContent: "center",
              alignItems: "center",
            }}>
            <LineChart
              withVerticalLabels={false}
              withHorizontalLabels={false}
              withHorizontalLines={false}
              width={120}
              height={30}
              bezier
              withDots={false}
              withVerticalLines={false}
              withOuterLines={false}
              chartConfig={{
                color: () => (up ? "#00ff0a" : "red"),
                backgroundGradientFromOpacity: 0,
                backgroundGradientToOpacity: 0,
              }}
              style={styles.chart}
              data={{
                datasets: [
                  {
                    data: item.sparkline_in_7d.price.slice(
                      item.sparkline_in_7d.length -
                      Math.round(
                        item.sparkline_in_7d
                          .length / 7,
                      ),
                      item.sparkline_in_7d.length,
                    ),
                  },
                ],
              }}
            />
          </View>
          <View style={{ width: 100, alignItems: "flex-end" }}>
            <Price numberOfLines={1}>{item.current_price}</Price>
            <CommonText
              numberOfLines={1}
              style={{ color: up ? "#00ff0a" : "red" }}>
              {formatPercentage(item.price_change_percentage_24h)}
            </CommonText>
          </View>
        </View>
      </CommonTouchableOpacity>
    );
  };
  return (
    <View style={{ flex: 1 }}>
      <LinearGradient
        colors={[theme.gradientPrimary, theme.gradientSecondary]}
        style={styles.gradient}>
        <SafeAreaView style={styles.container}>
          <View style={{ flex: 1, paddingHorizontal: 10 }}>
            <CommonFlatList
              refreshControl={
                <RefreshControl
                  refreshing={refreshing}
                  onRefresh={onRefresh}
                />
              }
              data={markets}
              renderItem={renderItem}
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
  customBtn: {
    borderWidth: 0,
  },
  item: {
    flexDirection: "row",
    borderBottomWidth: 0.5,
    alignItems: "center",
    height: 75,
  },
  img: {
    width: 42,
    height: 42,
  },
  itemContent: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  itemName: {
    marginLeft: 10,
    fontSize: 15,
  },
  itemSymbol: {
    fontSize: 13,
    textAlign: "left",
  },
  searchContainer: {
    flexDirection: "row",
    paddingTop: 10,
    paddingBottom: 20,
    paddingHorizontal: 15,
  },
  search: {
    flex: 4,
    fontSize: 16,
    borderWidth: 1,
    backgroundColor: "red",
    paddingHorizontal: 10,
    height: 45,
    borderTopLeftRadius: 5,
    borderBottomLeftRadius: 5,
  },
  close: {
    flex: 1.2,
    height: 43,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 1,
    borderTopEndRadius: 5,
    borderBottomEndRadius: 5,
  },
  choose_network: {
    fontSize: 20,
    textAlign: "center",
    marginTop: 15,
    marginBottom: 25,
  },
  chart: {
    paddingRight: 0,
    paddingBottom: 10,
    paddingTop: 10,
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
