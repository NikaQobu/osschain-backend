import { getPricesSuccess } from "@persistence/price/PriceReducer";
import { PriceService } from "@persistence/price/PriceService";

export const PriceAction = {
  getPrices,
};

function getPrices(ids) {
  return async dispatch => {
    const { success, data } = await PriceService.getPrices(ids);
    if (success) {
      dispatch(getPricesSuccess(data));
    }
    return { success, data };
  };
}

