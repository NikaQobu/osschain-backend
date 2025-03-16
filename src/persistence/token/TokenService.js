import _ from "lodash";
import { StorageUtil } from "@modules/core/util/StorageUtil";
import all from "@data/tokens/all.json";
import erc20 from "@data/tokens/erc20.json";
import bep20 from "@data/tokens/bep20.json";
import polygon from "@data/tokens/polygon.json";
import trc20 from "@data/tokens/trc20.json";

export const TokenService = {
  getTokensByChain,
  addTokenByChain,
  removeTokenByChain,
};

async function getTokensByChain(chain) {
  let tokens = [];
  switch (chain) {
    case "ALL":
      tokens = all;
      break;
    case "BSC":
      tokens = bep20;
      break;
    case "ETH":
      tokens = erc20;
      break;
    case "POLYGON":
      tokens = polygon;
      break;
    case "TRON":
      tokens = trc20;
      break;
  }
  const final = (await StorageUtil.getItem(chain)) || tokens;
  await StorageUtil.setItem(chain, final);
  return final;
}

async function addTokenByChain(chain, token) {
  let tokens = [];
  switch (chain) {
    case "ALL":
      tokens = all;
      break;
    case "BSC":
      tokens = bep20;
      break;
    case "ETH":
      tokens = erc20;
      break;
    case "POLYGON":
      tokens = polygon;
      break;
    case "TRON":
      tokens = trc20;
      break;
  }
  let currentData = (await StorageUtil.getItem(chain)) || tokens;
  let customTokens = [...currentData];
  const index = _.findIndex(customTokens, function(item) {
    return item.address.toLowerCase() === token.address.toLowerCase();
  });
  let isExists = false;
  if (index !== -1) {
    const newToken = { ...customTokens[index] };
    customTokens.splice(index, 1, newToken);
    isExists = true;
  } else {
    const newToken = {
      id: token.id,
      symbol: token.symbol,
      name: token.name,
      address: token.address,
      decimals: token.decimals,
      chainId: token.chainId,
      logoURI: token.logoURI,
    };
    customTokens = [newToken, ...customTokens];
  }
  await StorageUtil.setItem(chain, customTokens);
  return {
    isExists: isExists,
    tokens: customTokens,
  };
}

async function removeTokenByChain(chain, token) {
  let tokens = (await StorageUtil.getItem(chain)) || [];
  const newTokens = _.filter(tokens, function(item) {
    return item.address.toLowerCase() !== token.address.toLowerCase();
  });
  await StorageUtil.setItem(chain, newTokens);
  return {
    success: true,
    data: newTokens,
  };
}
