import * as React from "react";
import { useCallback, useEffect, useRef, useState } from "react";
import { RefreshControl, SafeAreaView, StyleSheet, View } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { WalletAction } from "@persistence/wallet/WalletAction";
import CommonTouchableOpacity from "@components/commons/CommonTouchableOpacity";
import Icon, { Icons } from "@components/icons/Icons";
import CommonText from "@components/commons/CommonText";
import CommonImage from "@components/commons/CommonImage";
import CommonLoading from "@components/commons/CommonLoading";
import { useTranslation } from "react-i18next";
import { useNavigation } from "@react-navigation/native";
import { formatCoins, formatPrice } from "@src/utils/CurrencyUtil";
import CommonBackButton from "@components/commons/CommonBackButton";
import { WalletFactory } from "@modules/core/factory/WalletFactory";
import CommonFlatList from "@components/commons/CommonFlatList";
import WebView from "react-native-webview";
import ActionSheet from "react-native-actions-sheet";
import LinearGradient from "react-native-linear-gradient";
import Price from "@components/Price";


function WalletDetailScreen({ route }) {
  const { t } = useTranslation();
  const actionSheetRef = useRef(null);
  const [url, setUrl] = useState("");
  const navigation = useNavigation();
  const { activeWallet } = useSelector(state => state.WalletReducer);
  const { theme } = useSelector(state => state.ThemeReducer);
  const { prices } = useSelector(state => state.PriceReducer);
  const dispatch = useDispatch();
  const [refreshing, setRefreshing] = useState(false);
  const [transactions, setTransactions] = useState([]);
  const onRefresh = useCallback(async () => {
    CommonLoading.show();
    dispatch(WalletAction.balance()).then(() => {
      setRefreshing(false);
      getTransactions(activeWallet.activeAsset);
      CommonLoading.hide();
    });
  }, []);
  useEffect(() => {
    (async () => {
      await getTransactions(activeWallet.activeAsset);
    })();
  }, []);
  const getTransactions = async (coin) => {
    const { success, data } = await WalletFactory.getTransactions({
      ...coin,
      walletAddress: activeWallet.activeAsset.walletAddress,
    });
    setTransactions(data);
  };
  const renderItem = ({ item }) => {
    return (
      <CommonTouchableOpacity
        onPress={async () => {
          actionSheetRef.current?.show();
          setUrl(item.explore);
        }}
        style={[styles.item, { borderBottomColor: theme.border }]}>
        <View style={styles.itemIcon}>
          <CommonImage
            source={
              item.isSender
                ? require("@assets/images/transaction/send.png")
                : require("@assets/images/transaction/receive.png")
            }
            style={{ width: 32, height: 32 }}
          />
        </View>
        <View style={styles.itemDetail}>
          <CommonText
            ellipsizeMode="middle"
            numberOfLines={1}
            style={styles.itemToAddressText}>
            {item.to}
          </CommonText>
          <CommonText style={[styles.itemAmountSub, { color: theme.subText }]}>
            {item.createdAt}
          </CommonText>
        </View>
        <View style={styles.itemAmount}>
          <CommonText
            style={[
              styles.itemAmountText,
              { color: item.isSender ? "#f33360" : "#24a86f" },
            ]}>
            {item.isSender ? "-" : "+"}
            {formatPrice(item.value, false, " ")}{" "}
            {activeWallet.activeAsset.symbol || activeWallet.activeAsset.tokenSymbol}
          </CommonText>
        </View>
      </CommonTouchableOpacity>
    );
  };
  return (
    <View style={{ flex: 1 }}>
      <LinearGradient
        colors={[theme.gradientPrimary, theme.gradientSecondary]}
        style={styles.gradient}>
        <SafeAreaView style={[styles.container]}>
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
              <CommonText style={styles.headerTitle}>{activeWallet.activeAsset.name}</CommonText>
            </View>
            <View style={[styles.rightHeader, { flex: 1 }]}>
              <Price>{prices[activeWallet.activeAsset.id]?.usd}</Price>
            </View>
          </View>
          <View style={[styles.balanceContainer]}>
            <CommonText
              style={[styles.balanceText, { color: theme.text }]}>{formatCoins(activeWallet.activeAsset.balance)}</CommonText>
            <CommonText
              style={[styles.walletNameText, { color: theme.text }]}>{activeWallet.activeAsset.symbol}</CommonText>
          </View>
          <View style={[styles.actionContainer, {
            paddingHorizontal: activeWallet.activeAsset.symbol === "BTC" ? 100 : 60,
          }]}>
            <CommonTouchableOpacity style={styles.actionItem} onPress={() => {
              let nextScreen = "WalletSendScreen";
              if (activeWallet.activeAsset.chain === "TRON") {
                nextScreen = "TronWalletSendScreen";
              } else if (activeWallet.activeAsset.chain === "BTC") {
                nextScreen = "BtcWalletSendScreen";
              }
              navigation.navigate(nextScreen, {
                coin: activeWallet.activeAsset,
              });
            }}>
              <View style={[styles.actionIcon, { backgroundColor: theme.button }]}>
                <Icon
                  type={Icons.Feather}
                  size={18}
                  name={"arrow-up"}
                  color={theme.text}
                />
              </View>
              <CommonText style={{ color: theme.text }}>{t("wallet.send")}</CommonText>
            </CommonTouchableOpacity>
            <CommonTouchableOpacity style={styles.actionItem} onPress={() => {
              navigation.navigate("WalletReceiveScreen", {
                coin: activeWallet.activeAsset,
              });
            }}>
              <View style={[styles.actionIcon, { backgroundColor: theme.button }]}>
                <Icon
                  type={Icons.Feather}
                  size={18}
                  name={"arrow-down"}
                  color={theme.text}
                />
              </View>
              <CommonText style={{ color: theme.text }}>{t("wallet.receive")}</CommonText>
            </CommonTouchableOpacity>
            <CommonTouchableOpacity style={styles.actionItem} onPress={() => {
              navigation.navigate("WalletBuyScreen", {
                coin: activeWallet.activeAsset,
              });
            }}>
              <View style={[styles.actionIcon, { backgroundColor: theme.button }]}>
                <Icon
                  type={Icons.Ionicons}
                  size={18}
                  name={"ios-cart-outline"}
                  color={theme.text}
                />
              </View>
              <CommonText style={{ color: theme.text }}>{t("wallet.buy")}</CommonText>
            </CommonTouchableOpacity>
          </View>
          <View style={[styles.tabViewContainer, { borderTopColor: theme.border }]}>
            <View style={styles.tabViewContent}>
              <CommonFlatList
                data={transactions}
                renderItem={renderItem}
                keyExtractor={item => item.hash}
                showsVerticalScrollIndicator={false}
                refreshControl={
                  <RefreshControl
                    refreshing={refreshing}
                    onRefresh={onRefresh}
                  />
                }
                ListEmptyComponent={() => {
                  return (
                    <View style={styles.emptyContainer}>
                      <CommonText
                        style={{ color: theme.subText }}>{t("wallet.your_transaction_will_appear_here")}</CommonText>
                    </View>
                  );
                }}
              />
            </View>
          </View>
          <ActionSheet
            ref={actionSheetRef}
            headerAlwaysVisible
            containerStyle={[styles.transactionDetailContainer, { backgroundColor: theme.background }]}>
            <WebView
              source={{
                uri: url,
              }}
              originWhitelist={["*"]}
              allowsInlineMediaPlayback={true}
              mediaPlaybackRequiresUserAction={true}
              showsVerticalScrollIndicator={false}
            />
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
  balanceContainer: {
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 20,
  },
  balanceText: {
    fontSize: 35,
    fontWeight: "bold",
  },
  walletNameText: {
    fontSize: 10,

  },
  actionContainer: {
    height: 100,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
  },
  actionItem: {
    width: 55,
    height: "100%",
    alignItems: "center",
    justifyContent: "center",
    marginHorizontal: 10,

  },
  actionIcon: {
    width: 50,
    height: 50,
    backgroundColor: "rgba(255,255,255,0.2)",
    borderRadius: 100,
    alignItems: "center",
    justifyContent: "center",
  },
  tabViewContainer: {
    flex: 1,
    borderTopWidth: 0.5,
  },
  tabViewHeader: {
    height: 50,
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
  },
  tabViewHeaderItem: {
    flex: 1,
    height: "100%",
    alignItems: "center",
    justifyContent: "center",
    borderBottomWidth: 2,
    borderBottomColor: "#fff",
  },
  tabViewContent: {
    flex: 1,
    paddingHorizontal: 10,
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
  addTokenButton: {
    width: "100%",
    height: 80,
    justifyContent: "center",
    alignItems: "center",
  },
  item: {
    height: 70,
    width: "100%",
    borderRadius: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderBottomWidth: 0.3,
  },
  itemImg: {
    width: 42,
    height: 42,
    borderRadius: 10000,
  },
  itemIcon: {
    width: 30,
    height: 50,
    justifyContent: "center",
    alignItems: "center",
  },
  itemAmount: {
    width: 120,
    height: "100%",
    alignItems: "flex-end",
    justifyContent: "center",
  },
  itemDetail: {
    flex: 1,
    paddingLeft: 10,
  },
  itemAmountText: {
    color: "#f33360",
    fontSize: 15,
    fontWeight: "bold",
  },
  itemAmountSub: {
    color: "#8c8c8c",
    fontSize: 13,
    fontWeight: "bold",
  },
  itemToAddressText: {
    color: "#343434",
    fontSize: 15,
    fontWeight: "bold",
  },
  emptyContainer: {
    width: "100%",
    height: 300,
    alignItems: "center",
    justifyContent: "center",
  },
  emptyImg: {
    width: 150,
    height: 150,
  },
  transactionDetailContainer: {
    height: "90%",
  },
  gradient: {
    width: "100%",
    height: "100%",
  },
});
export default WalletDetailScreen;
