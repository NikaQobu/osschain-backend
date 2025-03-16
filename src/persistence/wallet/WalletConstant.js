import {
  bsc,
  btc,
  dai_eth,
  eth,
  link_eth,
  mana_eth,
  oss_polygon,
  polygon,
  tron,
  uni_eth,
} from "@modules/core/constant/constant";
import { applicationProperties } from "@src/application.properties";

export const WALLET_TYPE = {
  MANY: 1,
  ONE: 2,
};
export const WALLET_LIST_KEY = "@WALLET_LIST_KEY";

export const WALLET_LIST = [
  {
    chain: "ALL",
    name: "Multi-Coin Wallet",
    type: WALLET_TYPE.MANY,
    image: applicationProperties.logoURI.app,
    swappable: true,
    dapps: true,
    coins: [
      btc,
      eth,
      bsc,
      polygon,
      tron,
    ],
    tokens: [
      oss_polygon,
      dai_eth,
      link_eth,
      mana_eth,
      uni_eth,
    ],
  },
];
