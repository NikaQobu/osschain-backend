import { Wallet } from "@modules/core/provider/base/Wallet";
import * as bip39 from "bip39";
import * as bitcoin from "bitcoinjs-lib";
import { bip32 } from "bitcoinjs-lib";
import { BitcoinProvider } from "@modules/core/provider/bitcoin/BitcoinProvider";
import { Logs } from "@modules/log/logs";
import { ProviderFactory } from "@modules/core/factory/ProviderFactory";

export class BitcoinWallet implements Wallet {
  provider: BitcoinProvider;

  constructor(provider: BitcoinProvider) {
    this.provider = provider;
  }

  async fromMnemonic(data, mnemonic): Promise<Object> {
    try {
      const network = await this.provider.getNetwork();
      const seed = bip39.mnemonicToSeedSync(mnemonic);
      const root = bip32.fromSeed(seed, network);
      const keyPair = root.derivePath("m/0'/0/0");
      const { address } = bitcoin.payments.p2wpkh({
        pubkey: keyPair.publicKey,
        network: network,
      });
      return {
        success: true,
        data: {
          ...data,
          walletAddress: address,
          privateKey: keyPair.toWIF(),
        },
      };
    } catch (e) {
      Logs.info("BitcoinWallet: fromMnemonic", e);
      return {
        success: false,
        data: {
          ...data,
        },
      };
    }
  }

  async fromPrivateKey(data, privateKey): Promise<Object> {
    try {
      const network = await this.provider.getNetwork();
      const keyPair = bitcoin.ECPair.fromWIF(privateKey, network);
      const { address } = bitcoin.payments.p2wpkh({
        pubkey: keyPair.publicKey,
        network: network,
      });
      return {
        success: true,
        data: {
          ...data,
          walletAddress: address,
          privateKey: privateKey,
        },
      };
    } catch (e) {
      Logs.info("BitcoinWallet: fromMnemonic", e);
      return {
        success: false,
        data: {
          ...data,
        },
      };
    }
  }

  async getTransactions(wallet): Promise<Object> {
    try {
      const provider = await ProviderFactory.getProvider(wallet.chain);
      return {
        success: true,
        data: await provider.getTransactions(wallet),
      };
    } catch (e) {
      Logs.info("BtcWallet: getTransactions", e);
      return {
        success: false,
        data: [],
      };
    }
  }

  async sendTransaction(transaction): Promise<Object> {
    try {
      const provider = await ProviderFactory.getProvider("BTC");
      return provider.sendTransaction(transaction);
    } catch (e) {
      Logs.info("BtcWallet: sendTransaction", e);
      return {
        success: false,
        data: e.reason,
      };
    }
  }
}
