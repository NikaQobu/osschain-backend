import React, { useEffect, useState } from "react";
import { Dimensions, SafeAreaView, ScrollView, StyleSheet, View } from "react-native";
import { useSelector } from "react-redux";
import CommonText from "@components/commons/CommonText";
import FastImage from "react-native-fast-image";
import CommonImage from "@components/commons/CommonImage";
import { LineChart } from "react-native-chart-kit";
import { useTranslation } from "react-i18next";
import moment from "moment";
import CommonBackButton from "@components/commons/CommonBackButton";
import Price from "@components/Price";
import LinearGradient from "react-native-linear-gradient";
import CoinBalance from "@components/CoinBalance";

export default function MarketDetailScreen({ navigation, route }) {
  const { coin } = route.params;
  const { t } = useTranslation();
  const { theme } = useSelector(state => state.ThemeReducer);
  const { prices } = useSelector(state => state.PriceReducer);
  const [sparkline, setSparkline] = useState([1, 2, 3, 4, 5, 6, 7]);
  const [labels, setLabels] = useState([]);
  useEffect(() => {
    (async () => {
      const line = [
        coin?.sparkline_in_7d?.price[24],
        coin?.sparkline_in_7d?.price[48],
        coin?.sparkline_in_7d?.price[72],
        coin?.sparkline_in_7d?.price[96],
        coin?.sparkline_in_7d?.price[120],
        coin?.sparkline_in_7d?.price[144],
        coin?.sparkline_in_7d?.price[
        coin?.sparkline_in_7d?.price.length - 1
          ],
      ];
      setSparkline(line);
      let labels = [];
      for (let i = sparkline.length - 1; i >= 0; i--) {
        labels.push(moment().subtract(i, "days").format("Do"));
      }
      setLabels(labels);
    })();
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
              <CommonText style={styles.headerTitle}>{coin.name}</CommonText>
            </View>
          </View>
          <ScrollView showsVerticalScrollIndicator={false}>
            <View style={styles.content}>
              <View style={styles.coinInfo}>
                <View style={styles.coinInfoUpperArea}>
                  <CommonImage
                    style={styles.coinInfoImg}
                    source={{
                      uri: coin.image,
                      priority: FastImage.priority.normal,
                      cache: FastImage.cacheControl.immutable,
                    }}
                  />
                  <CommonText style={[styles.coinInfoSymbol]}>
                    {coin.symbol.toUpperCase()}
                  </CommonText>
                </View>
                <View style={styles.coinInfoLowerArea}>
                  <Price style={[styles.coinInfoPrice]}>
                    {prices[coin.id]?.usd}
                  </Price>
                  <View style={styles.coinInfoPercentage}>
                    <View style={[styles.coinInfoPercentageBg]}>
                      <CoinBalance
                        decimals={2}
                        symbol={"%"}
                        style={{
                          color:
                            coin.price_change_percentage_24h >=
                            0
                              ? "#00FF27FF"
                              : "red",
                        }}>
                        {coin.price_change_percentage_24h}
                      </CoinBalance>
                    </View>
                  </View>
                </View>
              </View>
              <View style={styles.coinChart}>
                <LineChart
                  data={{
                    labels: labels,
                    datasets: [
                      {
                        data: sparkline,
                      },
                    ],
                  }}
                  width={Dimensions.get("window").width - 25} // from react-native
                  height={220}
                  yAxisLabel="$"
                  yAxisInterval={1} // optional, defaults to 1
                  chartConfig={{
                    backgroundColor: theme.gradientPrimary,
                    backgroundGradientFrom: theme.gradientPrimary,
                    backgroundGradientTo: theme.gradientSecondary,
                    decimalPlaces:
                      coin.current_price >= 10000 ? 0 : 2, // optional, defaults to 2dp
                    color: (opacity = 1) =>
                      coin.price_change_percentage_24h >= 0
                        ? "#00FF27FF"
                        : "red",
                    labelColor: (opacity = 1) =>
                      `rgba(255, 255, 255, ${opacity})`,
                    style: {
                      borderRadius: 16,
                    },
                    propsForDots: {
                      r: "6",
                      strokeWidth: "2",
                      stroke: "#ffa726",
                    },
                  }}
                  bezier
                  style={{
                    marginVertical: 8,
                    borderRadius: 16,
                    paddingHorizontal: 10,
                  }}
                />
                <CommonText style={styles.last7DaysText}>
                  {t("coindetails.last_7_days")}
                </CommonText>
              </View>
              <View style={styles.coinStatistic}>
                <View style={styles.coinStatisticHeader}>
                  <CommonText style={styles.coinStatisticTitle}>
                    Statistic
                  </CommonText>
                  <View>
                    <CommonText
                      style={[
                        styles.coinStatisticSubtitle,
                        { color: theme.subText },
                      ]}>
                      Last updated:{" "}
                      {moment(coin.last_updated).fromNow()}
                    </CommonText>
                    <CommonText
                      style={[
                        styles.coinStatisticSubtitle,
                        {
                          color: theme.subText,
                          textAlign: "right",
                        },
                      ]}>
                      by CoinGecko
                    </CommonText>
                  </View>
                </View>

                <View style={[styles.coinStatisticItem, { borderBottomColor: theme.border }]}>
                  <CommonText>{t("coindetails.rank")}</CommonText>
                  <CommonText>
                    {coin?.market_cap_rank ?? "-"}
                  </CommonText>
                </View>
                <View style={[styles.coinStatisticItem, { borderBottomColor: theme.border }]}>
                  <CommonText>
                    {t("coindetails.marketcap")}
                  </CommonText>
                  <Price>{coin?.market_cap ?? "-"}</Price>
                </View>
                <View
                  style={[[styles.coinStatisticItem, { borderBottomColor: theme.border }], { borderBottomColor: theme.border }]}>
                  <CommonText>{t("coindetails.volume")}</CommonText>
                  <Price>
                    {coin?.total_volume ?? "-"}
                  </Price>
                </View>
                <View style={[styles.coinStatisticItem, { borderBottomColor: theme.border }]}>
                  <CommonText>
                    {t("coindetails.all_time_high")}
                  </CommonText>
                  <Price>{coin?.ath ?? "-"}</Price>
                </View>
                <View style={[styles.coinStatisticItem, { borderBottomColor: theme.border }]}>
                  <CommonText>{t("coindetails.high_24")}</CommonText>
                  <Price>{coin?.high_24h ?? "-"}</Price>
                </View>
                <View style={[styles.coinStatisticItem, { borderBottomColor: theme.border }]}>
                  <CommonText>{t("coindetails.low_24h")}</CommonText>
                  <Price>{coin?.low_24h ?? "-"}</Price>
                </View>
                <View style={[styles.coinStatisticItem, { borderBottomColor: theme.border }]}>
                  <CommonText>
                    {t("coindetails.circulating_supply")}
                  </CommonText>
                  <CoinBalance>
                    {coin?.circulating_supply ?? "-"}
                  </CoinBalance>
                </View>
                <View style={[styles.coinStatisticItem, { borderBottomColor: theme.border }]}>
                  <CommonText>
                    {t("coindetails.max_supply")}
                  </CommonText>
                  <CoinBalance>
                    {coin?.circulating_supply ?? "-"}
                  </CoinBalance>
                </View>
                <View style={[styles.coinStatisticItem, { borderBottomColor: theme.border }]}>
                  <CommonText>
                    {t("coindetails.total_supply")}
                  </CommonText>
                  <CoinBalance>
                    {coin?.total_supply ?? "-"}
                  </CoinBalance>
                </View>
              </View>
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
  content: {
    flex: 1,
  },
  coinInfo: {
    width: "100%",
    height: 70,
    paddingHorizontal: 10,
  },
  coinInfoUpperArea: {
    height: 42,
    width: "100%",
    alignItems: "center",
    flexDirection: "row",
  },
  coinInfoImg: {
    height: 32,
    width: 32,
  },
  gradient: {
    width: "100%",
    height: "100%",
  },
  coinInfoSymbol: {
    fontWeight: "bold",
    marginLeft: 5,
  },
  coinInfoLowerArea: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  coinInfoPrice: {
    fontSize: 24,
    fontWeight: "bold",
  },
  coinInfoPercentage: {
    width: 50,
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
  coinInfoPercentageBg: {
    borderRadius: 10,
    width: 60,
    justifyContent: "center",
    alignItems: "center",
  },
  coinChart: {
    height: 240,
    width: "100%",
    paddingTop: 10,
  },
  last7DaysText: {
    color: "gray",
    textAlign: "center",
    fontSize: 30,
    position: "absolute",
    fontWeight: "bold",
    opacity: 0.2,
    width: "100%",
    top: 80,
    left: 30,
  },
  coinStatistic: {
    width: "100%",
    flex: 1,
    padding: 10,
  },
  coinStatisticHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  coinStatisticTitle: {
    fontSize: 18,
    fontWeight: "bold",
  },
  coinStatisticItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    height: 55,
    borderBottomWidth: 0.5,
  },
  coinStatisticSubtitle: {
    fontSize: 10,
  },
  gapBackground: {
    height: 50,
    width: "100%",
    position: "absolute",
    top: 0,
  },

});
