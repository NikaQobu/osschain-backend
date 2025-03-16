import { configProperties } from "@modules/core/config/config.properties";
import axios from "axios";


export class NftsFactory {

  static async getNfts(chain, walletAddress) {
    try {
      const url =
        configProperties.moralis.api +
        "/v2/" +
        walletAddress +
        "/nft?chain=" +
        chain.toLowerCase() +
        "&format=decimal";
      const { data } = await axios.get(url, {
        headers: {
          "X-API-Key": configProperties.moralis.key,
        },
      });
      const result = [];
      for (let i = 0; i < data.result.length; i++) {
        const nft = data.result[i];
        if (nft.metadata !== null) {
          nft.metadata = JSON.parse(nft.metadata);
          result.push(data.result[i]);
        }
      }
      return result;
    } catch (e) {
      console.log(e);
      return [];
    }
  };

  static getNftUrl(chain, tokenId, tokenAddress) {
    let url = `${configProperties.bsc.explore}/nft/${tokenAddress}/${tokenId}`;
    switch (chain) {
      case "ETH":
        url = `${configProperties.eth.explore}/nft/${tokenAddress}/${tokenId}`;
        break;
      case "POLYGON":
        url = `${configProperties.polygon.explore}/nft/${tokenAddress}/${tokenId}`;
        break;
      default:
        break;
    }
    return url;
  };

  static getOpenSeaCollectionLink(id) {
    const openseaId = id.replaceAll("-", "");
    console.log(openseaId);
    return `${configProperties.opensea.url}/collection/${openseaId}`;
  };
}
