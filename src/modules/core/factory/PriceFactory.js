import { StorageUtil } from "@modules/core/util/StorageUtil";
import { WALLET_LIST, WALLET_LIST_KEY } from "@persistence/wallet/WalletConstant";
import _ from "lodash";
import { configProperties } from "@modules/core/config/config.properties";
import axios from "axios";
import { ASSET_TYPE_COIN } from "@modules/core/constant/constant";
import { Logs } from "@modules/log/logs";

export class PricesFactory {
  static prices: Object = {};

  static async init() {
    let coins = _.map(WALLET_LIST, "coins");
    let assets = [];
    _.forEach(coins, function(coin) {
      assets.push(...coin);
    });
    assets = _.uniqBy(assets, "symbol");
    const chunks = _.chunk(assets, 5);
    for (let i = 0; i < chunks.length; i++) {
      const chunk = chunks[i];
      let endpoints = _.map(chunk, function(item) {
        let config = {
          method: "get",
          timeout: 15000,
          headers: {
            "X-API-Key": configProperties.moralis.key,
          },
        };
        const symbol = item.symbol === "USDT" ? "USDC" : item.symbol;
        if (item.type === ASSET_TYPE_COIN) {
          config.url = `https://exzocoinnetwork.herokuapp.com/price/get?symbol=${symbol}`;
          return axios(config);
        } else {
          config.url = configProperties.moralis.api +
            "/v2/erc20/" +
            `${item.contract}` +
            "/price?chain=" +
            item.chain.toLowerCase();
          return axios(config);
        }
      });
      let results = await Promise.all(endpoints);
      for (let index = 0; index < results.length; index++) {
        const result = results[index];
        const key = !_.isNil(chunk[index].contract) ? chunk[index].contract : chunk[index].symbol;
        PricesFactory.prices[key] = !_.isNil(chunk[index].contract) ? result.data.usdPrice : parseFloat(result.data.price);
      }
    }
  }

  static async load() {
    try {
      const { wallets } = await StorageUtil.getItem(WALLET_LIST_KEY);
      let assets = [];
      _.forEach(wallets, wallet => {
        _.forEach([...wallet.coins, ...wallet.tokens], function(coin) {
          assets.push(coin);
        });
      });
      assets = _.uniqBy(assets, "symbol");
      const chunks = _.chunk(assets, 5);
      for (let i = 0; i < chunks.length; i++) {
        const chunk = chunks[i];
        let endpoints = _.map(chunk, function(item) {
          let config = {
            method: "get",
            timeout: 15000,
            headers: {
              "X-API-Key": configProperties.moralis.key,
            },
          };
          const symbol = item.symbol === "USDT" ? "USDC" : item.symbol;
          if (item.type === ASSET_TYPE_COIN || item.chain === "TRON") {
            config.url = `https://exzocoinnetwork.herokuapp.com/price/get?symbol=${symbol}`;
            return axios(config);
          } else {
            config.url = configProperties.moralis.api +
              "/v2/erc20/" +
              `${item.contract}` +
              "/price?chain=" +
              item.chain.toLowerCase();
            return axios(config);
          }
        });
        let results = await Promise.all(endpoints);
        for (let index = 0; index < results.length; index++) {
          const result = results[index];
          const key = !_.isNil(chunk[index].contract) ? chunk[index].contract : chunk[index].symbol;
          let price = 0;
          if (chunk[index].type === ASSET_TYPE_COIN || chunk[index].chain === "TRON") {
            price = parseFloat(result.data.price);
          } else {
            price = result.data.usdPrice;
          }
          PricesFactory.prices[key] = price;
        }
      }
    } catch (e) {
      Logs.info("PricesFactory: load", e);
    }
  }

  static async add(asset) {
    let url = configProperties.moralis.api +
      "/v2/erc20/" +
      `${asset.contract}` +
      "/price?chain=" +
      asset.chain.toLowerCase();
    let valueKey = "usdPrice";
    if (asset.chain === "TRON") {
      const symbol = asset.symbol === "USDT" ? "USDC" : asset.symbol;
      url = `https://exzocoinnetwork.herokuapp.com/price/get?symbol=${symbol}`;
      valueKey = "price";
    }
    let config = {
      method: "get",
      timeout: 15000,
      headers: {
        "X-API-Key": configProperties.moralis.key,
      },
    };
    console.log(url);
    const { data } = await axios.get(url, config);
    const price = parseFloat(data[valueKey]);
    PricesFactory.prices[asset.contract] = price;
    return price;
  }
}
