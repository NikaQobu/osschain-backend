import { Logs } from "@modules/log/logs";
import { configProperties } from "@modules/core/config/config.properties";
import axios from "axios";


export class MarketFactory {

  static async getMarkets(
    limit: number = 10,
    sparkline: boolean = false,
  ) {
    const url =
      configProperties.coinGecko.api +
      "coins/markets?vs_currency=usd&order=market_cap_desc&per_page=" +
      limit +
      "&page=1&sparkline=" +
      sparkline + "&x_cg_pro_api_key=" + configProperties.coinGecko.key;
    const params = {
      method: "get",
      url: url,
    };
    try {
      const response = await axios(params);
      return response.data;
    } catch (error) {
      Logs.info("MarketFactory: getMarkets" + error);
      return [];
    }
  };

  static async getMarketDetail(id) {
    const url =
      configProperties.coinGecko.api +
      "coins/markets?vs_currency=usd&order=market_cap_desc&page=1&sparkline=true&price_change_percentage=1h,24h,7d,30d,1y&ids=" +
      id;
    const params = {
      method: "get",
      url: url,
    };
    try {
      const response = await axios(params);
      return response.data;
    } catch (error) {
      return false;
    }
  }
}
