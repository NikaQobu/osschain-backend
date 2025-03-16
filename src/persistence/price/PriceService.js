import React from "react";
import CommonAPI from "@modules/api/CommonAPI";
import axios from "axios";

export const PriceService = {
  getPrices,
};

async function getPrices(ids) {
  const { data } = await CommonAPI.get("coingecko/price?ids=" + ids, {});
  const { data: geckoData } = await axios.get("https://api.geckoterminal.com/api/v2/networks/polygon_pos/pools/0x1ec9458bd254beee729fab330976e28ae1eb4815", {});
  const { data: priceData } = geckoData;
  const { attributes } = priceData;
  const price = attributes.base_token_price_usd;
  const { success, data: coinGeckoData } = data;
  return {
    success,
    data: { ...coinGeckoData, "oss": { usd: price } },
  };
}
