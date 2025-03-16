import { Dimensions, Platform, StyleSheet, View } from "react-native";
import React from "react";
import Carousel from "react-native-snap-carousel";
import { useDispatch, useSelector } from "react-redux";
import CommonText from "@components/commons/CommonText";
import CommonImage from "@components/commons/CommonImage";
import CommonTouchableOpacity from "@components/commons/CommonTouchableOpacity";
import { useNavigation } from "@react-navigation/native";
import { WalletAction } from "@persistence/wallet/WalletAction";
import Price from "@components/Price";

const SLIDE_WIDTH = Dimensions.get("window").width;
const ITEM_WIDTH = SLIDE_WIDTH - 60;
export default function CarouselSlide() {
  const { activeWallet } = useSelector(state => state.WalletReducer);
  const { prices } = useSelector(state => state.PriceReducer);
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const renderItem = ({ item, index }, parallaxProps) => {
    let image = null;
    switch (index) {
      case 0:
        image = require("@assets/images/card/card2.png");
        break;
      case 1:
        image = require("@assets/images/card/card1.png");
        break;
      case 2:
        image = require("@assets/images/card/card3.png");
        break;
      case 3:
        image = require("@assets/images/card/card4.png");
        break;
      case 4:
        image = require("@assets/images/card/card5.png");
        break;
    }
    return (
      <CommonTouchableOpacity
        style={[styles.item]}
        onPress={() => {
          dispatch(WalletAction.setActiveAsset(item)).then(() => {
            navigation.navigate("WalletDetailScreen", {
              coin: { ...item, isNative: item.type !== "coin" },
            });
          });
        }}>
        <CommonImage
          source={image}
          containerStyle={styles.imageContainer}
          style={styles.itemImg}
        />
        <View style={styles.itemContainer}>
          <View style={styles.itemInfo}>
            <View>
              <CommonText>{item.name}</CommonText>
              <Price>{prices[item.id]?.usd}</Price>
            </View>

            <CommonImage
              source={{ uri: item.logoURI }}
              style={{ width: 48, height: 48 }}
            />
          </View>
          <View style={[styles.itemInfo, { marginTop: 50 }]}>
            <View>
              <CommonText>{item.symbol} Balance:</CommonText>
              <Price style={styles.itemValue}>
                {item.balance * prices[item.id]?.usd}
              </Price>
            </View>
          </View>
        </View>
      </CommonTouchableOpacity>
    );
  };
  return (
    <Carousel
      data={activeWallet.coins}
      renderItem={renderItem}
      sliderWidth={SLIDE_WIDTH}
      itemWidth={ITEM_WIDTH}
    />
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  item: {
    width: ITEM_WIDTH,
    height: 180,
  },
  itemImg: {
    ...StyleSheet.absoluteFillObject,
    resizeMode: "contain",
  },
  imageContainer: {
    height: "100%",
    width: ITEM_WIDTH,
    padding: 10,
    marginBottom: Platform.select({ ios: 0, android: 1 }),
    borderRadius: 10,
    position: "absolute",
  },
  itemContainer: {
    flex: 1,
    paddingVertical: 15,
    paddingHorizontal: 15,
  },
  itemInfo: {
    height: 50,
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 10,
  },
  itemValue: {
    fontSize: 30,
  },
});
