import React, { useCallback, useState } from "react";
import { RefreshControl, SafeAreaView, StyleSheet, View } from "react-native";
import CommonImage from "@components/commons/CommonImage";
import LinearGradient from "react-native-linear-gradient";
import { useDispatch, useSelector } from "react-redux";
import CarouselSlide from "@components/CarouselSlide";
import Icon, { Icons } from "@components/icons/Icons";
import CommonFlatList from "@components/commons/CommonFlatList";
import CommonText from "@components/commons/CommonText";
import CommonTouchableOpacity from "@components/commons/CommonTouchableOpacity";
import { useNavigation } from "@react-navigation/native";
import Balance from "@components/Balance";
import { useTranslation } from "react-i18next";
import { WalletAction } from "@persistence/wallet/WalletAction";
import CommonLoading from "@components/commons/CommonLoading";
import CoinBalance from "@components/CoinBalance";
import Price from "@components/Price";

export default function HomeScreen() {
  const { theme } = useSelector(state => state.ThemeReducer);
  const { activeWallet } = useSelector(state => state.WalletReducer);
  const { prices } = useSelector(state => state.PriceReducer);
  const { t } = useTranslation();
  const navigation = useNavigation();
  const [refreshing, setRefreshing] = useState(false);
  const dispatch = useDispatch();
  const onRefresh = useCallback(async () => {
    CommonLoading.show();
    dispatch(WalletAction.balance()).then(() => {
      setRefreshing(false);
      CommonLoading.hide();
    });
  }, []);
  return (
    <View style={{ flex: 1 }}>
      <LinearGradient
        colors={[theme.gradientPrimary, theme.gradientSecondary]}
        style={styles.gradient}>
        <SafeAreaView style={styles.container}>
          <View style={styles.header}>
            <View>
              <CommonImage
                source={require("@assets/images/logo2.png")}
                style={styles.logo}
              />
            </View>
            <Balance />
          </View>
          <View style={styles.carousel}>
            <CarouselSlide />
          </View>
          <View style={styles.portfolioContainer}>
            <View style={styles.portfolioHeader}>
              <CommonText style={styles.portfolioTitle}>
                {t("home.portfolios")}
              </CommonText>
              <CommonTouchableOpacity
                onPress={() => {
                  navigation.navigate("TokenScreen");
                }}>
                <Icon
                  type={Icons.Feather}
                  name={"plus"}
                  style={{ marginBottom: 10 }}
                />
              </CommonTouchableOpacity>
            </View>

            <CommonFlatList
              data={activeWallet.tokens}
              keyExtractor={item => `${item.chain}${item.symbol}`}
              refreshControl={
                <RefreshControl
                  refreshing={refreshing}
                  onRefresh={onRefresh}
                />
              }
              renderItem={({ item, index }) => {
                let chainImg = require("@assets/images/chain/ethereum.webp");
                switch (item.chain) {
                  case "POLYGON":
                    chainImg = require("@assets/images/chain/matic-token-icon.webp");
                    break;
                  case "BSC":
                    chainImg = require("@assets/images/chain/binance-coin-logo.webp");
                    break;
                  case "TRON":
                    chainImg = require("@assets/images/chain/tron.png");
                    break;
                  default:
                    break;
                }
                return (
                  <CommonTouchableOpacity
                    onPress={() => {
                      dispatch(
                        WalletAction.setActiveAsset(
                          item,
                        ),
                      ).then(() => {
                        navigation.navigate(
                          "WalletDetailScreen",
                        );
                      });
                    }}>
                    <View
                      style={[
                        styles.item,
                        {
                          borderBottomColor:
                          theme.border,
                        },
                      ]}>
                      <View style={styles.itemInfo}>
                        <View>
                          <CommonImage
                            source={{
                              uri: item.logoURI,
                            }}
                            style={styles.itemImg}
                          />
                          <CommonImage
                            source={chainImg}
                            style={styles.chainImg}
                          />
                        </View>

                        <View style={styles.itemDesc}>
                          <CommonText
                            style={styles.itemName}>
                            {item.name}
                          </CommonText>
                          <Price
                            style={[
                              styles.itemSymbol,
                              { color: theme.text },
                            ]}>
                            {prices[item.id]?.usd}
                          </Price>
                        </View>
                      </View>
                      <View style={styles.itemPrice}>
                        <View
                          style={[
                            styles.itemDesc,
                            {
                              alignItems:
                                "flex-end",
                            },
                          ]}>
                          <CoinBalance
                            symbol={item.symbol}
                            style={styles.itemName}>
                            {item.balance}
                          </CoinBalance>
                          <Price
                            style={[
                              styles.itemSymbol,
                              { color: theme.text },
                            ]}>
                            {item.balance * prices[item.id]?.usd}
                          </Price>
                        </View>
                      </View>
                    </View>
                  </CommonTouchableOpacity>
                );
              }}
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
  gradient: {
    width: "100%",
    height: "100%",
  },
  header: {
    height: 52,
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 10,
  },
  carousel: {
    marginVertical: 20,
  },
  logo: {
    width: 32,
    height: 32,
  },
  portfolioContainer: {
    paddingHorizontal: 20,
    flex: 1,
  },
  portfolioTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 10,
  },
  item: {
    height: 80,
    width: "100%",
    marginBottom: 10,
    borderRadius: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderBottomWidth: 0.5,
  },
  itemImg: {
    width: 42,
    height: 42,
    borderRadius: 10000,
    backgroundColor: "black",
  },
  chainImg: {
    width: 15,
    height: 15,
    borderRadius: 10000,
    backgroundColor: "black",
    position: "absolute",
    borderWidth: 1,
    borderColor: "#ce8621",
  },
  itemInfo: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  itemDesc: {
    marginLeft: 10,
  },
  itemName: {
    fontWeight: "bold",
  },
  itemSymbol: {
    fontSize: 12,
  },
  itemPrice: {
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "center",
  },
  portfolioHeader: {
    height: 38,
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
});
