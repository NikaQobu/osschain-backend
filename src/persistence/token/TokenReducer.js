import { createSlice } from "@reduxjs/toolkit";

const TokenReducer = createSlice({
  name: "token",
  initialState: {
    bep20Tokens: [],
    erc20Tokens: [],
    polygonTokens: [],
    trc20Tokens: [],
    allTokens: [],
  },
  reducers: {
    getBep20TokensSuccess(state, { payload }) {
      state.bep20Tokens = payload;
    },
    getErc20TokensSuccess(state, { payload }) {
      state.erc20Tokens = payload;
    },
    getPolygonTokensSuccess(state, { payload }) {
      state.polygonTokens = payload;
    },
    getTrc20TokensSuccess(state, { payload }) {
      state.trc20Tokens = payload;
    },
    getAllTokensSuccess(state, { payload }) {
      state.allTokens = payload;
    },
  },
});
// Extract the action creators object and the reducer
const { actions, reducer } = TokenReducer;
// Extract and export each action creator by name
export const {
  getBep20TokensSuccess,
  getErc20TokensSuccess,
  getPolygonTokensSuccess,
  getTrc20TokensSuccess,
  getAllTokensSuccess,
} = actions;
// Export the reducer, either as a default or named export
export default reducer;
