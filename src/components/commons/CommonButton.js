import React from "react";
import { StyleSheet, TouchableOpacity } from "react-native";
import CommonText from "@components/commons/CommonText";
import { useSelector } from "react-redux";

export default function CommonButton(props) {
  const { style, textStyle } = props;
  const { theme } = useSelector(state => state.ThemeReducer);
  return (
    <TouchableOpacity
      {...props}
      onPress={() => (props.onPress ? props.onPress() : null)}
      style={[styles.buttonContainer, { backgroundColor: theme.button }, style]}>
      <CommonText
        style={[
          styles.text,
          { color: props.disabled ? "gray" : theme.text },
          textStyle,
        ]}>
        {props.text}
      </CommonText>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  buttonContainer: {
    width: "100%",
    height: 64,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#701bc1",
    borderRadius: 10,
  },
  text: {
    fontSize: 18,
    fontWeight: "bold",
    color: "white",
  },
});
