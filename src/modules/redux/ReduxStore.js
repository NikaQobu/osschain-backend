import { configureStore, getDefaultMiddleware } from "@reduxjs/toolkit";
import ThemeReducer from "@persistence/theme/ThemeReducer";
import UserReducer from "@persistence/user/UserReducer";
import CurrencyReducer from "@persistence/currency/CurrencyReducer";
import TokenReducer from "@persistence/token/TokenReducer";
import AppLockReducer from "@persistence/applock/AppLockReducer";
import WalletReducer from "@persistence/wallet/WalletReducer";
import MarketReducer from "@persistence/market/MarketReducer";
import FeeReducer from "@persistence/fee/FeeReducer";
import PriceReducer from "@persistence/price/PriceReducer";

const ReduxStore = configureStore({
  reducer: {
    ThemeReducer,
    UserReducer,
    CurrencyReducer,
    TokenReducer,
    AppLockReducer,
    WalletReducer,
    MarketReducer,
    FeeReducer,
    PriceReducer,
  },
  middleware: getDefaultMiddleware({
    serializableCheck: false,
  }),
});
export default ReduxStore;
