import React, { useEffect, useRef, useState } from "react";
import { SafeAreaView, StyleSheet, View } from "react-native";
import { useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import { useBackHandler } from "@react-native-community/hooks";
import CommonLoading from "@components/commons/CommonLoading";
import WebView from "react-native-webview";
import { NftsFactory } from "@modules/core/factory/NftsFactory";
import CommonBackButton from "@components/commons/CommonBackButton";
import CommonText from "@components/commons/CommonText";
import _ from "lodash";

export default function NftDetailScreen({ navigation, route }) {
  const { t } = useTranslation();
  const { theme } = useSelector(state => state.ThemeReducer);
  const { nft, chain, nftUrl } = route.params;
  const webview = useRef();
  const [canGoBack, setCanGoBack] = useState(false);
  const [url, setUrl] = useState("");
  useBackHandler(() => {
    if (canGoBack) {
      webview.current.goBack();
    } else {
      navigation.goBack();
    }
    return true;
  });
  const onNavigationStateChange = webViewState => {
    setCanGoBack(webViewState.canGoBack);
  };
  useEffect(() => {
    CommonLoading.show();
    let url = nftUrl;
    if (_.isNil(url)) {
      url = NftsFactory.getNftUrl(chain, nft.token_id, nft.token_address);
    }
    setUrl(url);
  }, []);
  return (
    <SafeAreaView style={styles.container}>
      <View style={[styles.header]}>
        <View style={styles.leftHeader}>
          <CommonBackButton
            onPress={async () => {
              navigation.goBack();
            }}
          />
        </View>
        <View style={styles.contentHeader}>
          <CommonText style={styles.headerTitle}>{nft.name}</CommonText>
        </View>
      </View>
      <View style={styles.content}>
        <WebView
          ref={webview}
          source={{
            uri: url,
          }}
          originWhitelist={["*"]}
          allowsInlineMediaPlayback={true}
          mediaPlaybackRequiresUserAction={true}
          showsVerticalScrollIndicator={false}
          onLoad={syntheticEvent => {
            CommonLoading.hide();
          }}
          onNavigationStateChange={onNavigationStateChange}
        />
      </View>
    </SafeAreaView>
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

});
