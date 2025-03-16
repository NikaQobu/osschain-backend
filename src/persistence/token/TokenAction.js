import {
  getAllTokensSuccess,
  getBep20TokensSuccess,
  getErc20TokensSuccess,
  getPolygonTokensSuccess,
  getTrc20TokensSuccess,
} from "@persistence/token/TokenReducer";
import { TokenService } from "@persistence/token/TokenService";
import { WALLET_TYPE } from "@persistence/wallet/WalletConstant";

export const TokenAction = {
  getBep20Tokens,
  getErc20Tokens,
  getPolygonTokens,
  getTrc20Tokens,
  getAllTokens,
  addTokenByChain,
  removeTokenByChain,
};

function getBep20Tokens() {
  return async dispatch => {
    const customTokens = await TokenService.getTokensByChain("BSC");
    dispatch(getBep20TokensSuccess(customTokens));
  };
}

function getErc20Tokens() {
  return async dispatch => {
    const customTokens = await TokenService.getTokensByChain("ETH");
    dispatch(getErc20TokensSuccess(customTokens));
  };
}

function getPolygonTokens() {
  return async dispatch => {
    const customTokens = await TokenService.getTokensByChain("POLYGON");
    dispatch(getPolygonTokensSuccess(customTokens));
  };
}

function getTrc20Tokens() {
  return async dispatch => {
    const customTokens = await TokenService.getTokensByChain("TRON");
    dispatch(getTrc20TokensSuccess(customTokens));
  };
}

function getAllTokens(chain, type) {
  return async dispatch => {
    const customTokens = await TokenService.getTokensByChain(type === WALLET_TYPE.MANY ? "ALL" : chain);
    dispatch(getAllTokensSuccess(customTokens));
  };
}

function addTokenByChain(chain, data) {
  return async dispatch => {
    const { isExists, tokens } = await TokenService.addTokenByChain(
      chain,
      data,
    );
    if (chain === "ALL") {
      dispatch(getAllTokensSuccess(tokens));
    } else if (chain === "ETH") {
      dispatch(getErc20TokensSuccess(tokens));
    } else if (chain === "BSC") {
      dispatch(getBep20TokensSuccess(tokens));
    } else if (chain === "POLYGON") {
      dispatch(getPolygonTokensSuccess(tokens));
    } else if (chain === "TRON") {
      dispatch(getPolygonTokensSuccess(tokens));
    }
    return { isExists, tokens };
  };
}

function removeTokenByChain(chain, token) {
  return async dispatch => {
    const { success, data } = await TokenService.removeTokenByChain(
      chain,
      token,
    );
    if (chain === "ALL") {
      dispatch(getAllTokensSuccess(data));
    } else if (chain === "ETH") {
      dispatch(getErc20TokensSuccess(data));
    } else if (chain === "BSC") {
      dispatch(getBep20TokensSuccess(data));
    } else if (chain === "POLYGON") {
      dispatch(getPolygonTokensSuccess(data));
    } else if (chain === "TRON") {
      dispatch(getPolygonTokensSuccess(data));
    }
    return { success, data };
  };
}
