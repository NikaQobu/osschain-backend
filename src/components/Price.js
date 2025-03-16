import * as React from "react";
import CommonText from "@components/commons/CommonText";
import { useSelector } from "react-redux";
import numeral from "numeral";

function Price({ style, children, decimals = 6, ...rest }) {
  const { currency } = useSelector(state => state.CurrencyReducer);
  const exchangeValue = children * currency.value;
  const format = `0,0.[${"0".repeat(decimals)}]`;
  return (
    <CommonText style={style} {...rest}>
      {numeral(exchangeValue).format(format)}{currency.symbol}
    </CommonText>
  );
}

export default Price;
