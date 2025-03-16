import { configProperties } from "@modules/core/config/config.properties";
import axios from "axios";


export class TokenFactory {

  static async getTokenMetadata(chain, contractAddress) {
    try {
      const url =
        `${configProperties.moralis.api}/v2/erc20/metadata?chain=` +
        chain.toLowerCase() +
        "&addresses=" +
        contractAddress;
      const { data, error } = await axios.get(url, {
        headers: {
          accept: "application/json",
          "X-API-Key": configProperties.moralis.key,
        },
      });
      console.log(data);
      return data[0];
    } catch (e) {
      console.log(e);
    }
  };

}
