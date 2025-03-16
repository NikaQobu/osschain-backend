import * as React from "react";
import { useState } from "react";
import { StyleSheet } from "react-native";
import CommonTouchableOpacity from "@components/commons/CommonTouchableOpacity";
import { useSelector } from "react-redux";
import Icon, { Icons } from "@components/icons/Icons";
import CommonText from "@components/commons/CommonText";
import Price from "@components/Price";

function Balance() {
  const { theme } = useSelector(state => state.ThemeReducer);
  const [active, setActive] = useState(false);
  const { activeWallet } = useSelector(state => state.WalletReducer);
  return (
    <CommonTouchableOpacity
      style={styles.balanceContainer}
      onPress={() => {
        setActive(!active);
        setTimeout(() => {
          if (active === true) {
            setActive(!active);
          }

        }, 5000);

      }}>
      {active === false && <Icon
        type={Icons.FontAwesome5}
        name={active ? "eye" : "eye-slash"}
        size={15}
        color={"white"}
      />}
      {
        active && <Price style={styles.balanceText}>
          {activeWallet.totalBalance}
        </Price>
      }
      {
        !active && <CommonText style={styles.balanceText}>
          *******
        </CommonText>
      }
    </CommonTouchableOpacity>
  );
}

const styles = StyleSheet.create({
  balanceContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  balanceText: {
    fontSize: 18,
    fontWeight: "bold",
  },
});

export default Balance;
