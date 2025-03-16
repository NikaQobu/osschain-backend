import _ from "lodash";
import cryptocompare from "cryptocompare";
import { applicationProperties } from "@src/application.properties";
import { StorageUtil } from "@modules/core/util/StorageUtil";

async function getCurrency(to) {
  let defaultCurrency = await StorageUtil.getItem("defaultCurrency");
  if (_.isNil(defaultCurrency)) {
    defaultCurrency = applicationProperties.defaultCurrency;
  }
  await StorageUtil.setItem("defaultCurrency", to || defaultCurrency);
  const currency = to ? to : defaultCurrency;
  const rate = await cryptocompare.price("USD", currency.code);
  for (const [key, value] of Object.entries(rate)) {
    currency.value = value;
  }
  return currency;
}

export const CurrencyService = {
  getCurrency,
};
