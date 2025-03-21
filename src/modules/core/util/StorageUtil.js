import EncryptedStorage from "react-native-encrypted-storage";
import { Logs } from "@modules/log/logs";

async function setItem(key, value) {
  try {
    await EncryptedStorage.setItem(
      key,
      JSON.stringify(value),
    );
  } catch (error) {
    Logs.info(value);
    Logs.info("StorageUtil: setItem" + error);
  }
}

async function getItem(key) {
  try {
    return JSON.parse(await EncryptedStorage.getItem(key));
  } catch (error) {
    Logs.info("StorageUtil: getItem" + error);
  }
}

async function deleteItem(key) {
  try {
    await EncryptedStorage.removeItem(key);
  } catch (error) {
    Logs.info("StorageUtil: deleteItem" + error);
  }
}

async function clear() {
  try {
    await EncryptedStorage.clear();
  } catch (error) {
    Logs.info("StorageUtil: deleteItem" + error);
  }
}

export const StorageUtil = {
  setItem,
  getItem,
  deleteItem,
  clear,
};
