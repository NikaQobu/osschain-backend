import { Logs } from "@modules/core/log/logs";
import { MMKV } from "react-native-mmkv";

const storage = new MMKV({
  encryptionKey: "encryptionKey",
});

async function setItem(key, value) {
  try {
    await storage.set(key, JSON.stringify(value));
  } catch (error) {
    Logs.info("StorageUtil: setItem" + error);
  }
}

async function getItem(key) {
  try {
    const value = storage.getString(key);
    return JSON.parse(value);
  } catch (error) {
    Logs.info("StorageUtil: getItem" + error);
  }
}

async function deleteItem(key) {
  try {
    storage.delete(key);
  } catch (error) {
    Logs.info("StorageUtil: deleteItem" + error);
  }
}

async function clear() {
  try {
    storage.clearAll();
  } catch (error) {
    Logs.info("StorageUtil: clear" + error);
  }
}

export const StorageService = {
  setItem,
  getItem,
  deleteItem,
  clear,
};
