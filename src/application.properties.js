export const applicationProperties = {
  defaultTheme: {
    code: "light",
    icon: "Light",
    name: "Light",
  },
  themes: [
    {
      code: "dark",
      icon: "Dark",
      name: "Dark",
    },
    {
      code: "light",
      icon: "Light",
      name: "Light",
    },
  ],
  defaultCurrency: { code: "USD", value: 1, name: "US Dollar", symbol: "$" },
  currencies: [
    {
      code: "AUD",
      name: "Australian Dollar",
      symbol: "$",
    },
    {
      code: "EUR",
      name: "Euro",
      symbol: "€",
    },
    {
      code: "GBP",
      name: "British Pound",
      symbol: "£",
    },
    {
      code: "RUB",
      name: "Russian Ruble",
      symbol: "₽",
    },
    {
      code: "USD",
      name: "US Dollar",
      symbol: "$",
    },
  ],
  defaultWalletName: "OSSChain wallet",
  logoURI: {
    app: "https://osschain.com/favicon.png",
    eth: "https://assets.coingecko.com/coins/images/279/large/ethereum.png",
    bsc: "https://assets.coingecko.com/coins/images/825/large/binance-coin-logo.png",
    polygon: "https://assets.coingecko.com/coins/images/4713/large/matic-token-icon.png",
    tron: "https://s2.coinmarketcap.com/static/img/coins/64x64/1958.png",
  },
  endpoints: {
    app: {
      url: "http://161.97.137.183:8080/",
      token: "eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJhZG1pbiIsImV4cCI6MzE3MDYyOTc5ODcwLCJpYXQiOjE3MDI5Nzk4NzB9.lvP4QdArmtPwndyIfptg6fuOavMFI_tLa4ijGS7d9ABPbTMM5_VY2dLSxRYRGm4_NOrwFx5RM-waLvAIoTmpCw",
    },
    apiBtc: "https://blockstream.info/api/",
    apiBsc: "https://api.bscscan.com/api?apiKey=DI5F6DDAVHJHHNE3HH8SF7UTP2R4D7PTBU",
    apiEth: "https://api.etherscan.com/api?apiKey=JW4VI7MBC4BFBYI29FGN17IYQCSNBCJSMQ",
    apiPolygon:
      "https://api.polygonscan.com/api?apiKey=Z2BKEA7HR8YYQNAWT6AI1BFVWFNA6X2YSN",
    privacyPolicy: "https://google.com",
    termsOfService: "https://google.com",
    ramp: "https://buy.ramp.network/?hostAppName=VCoin&variant=mobile&hostApiKey=",
    helpCenter: "https://vcoinlab.com",
    twitter: "",
    telegram: "https://t.me/CryptoLorde",
    facebook: "",
    reddit: "",
    youtube: "",
    about: "https://vcoinlab.com",
    discord: "",
  },
  networks: [
    {
      id: "ethereum",
      name: "Ethereum",
      symbol: "ETH",
      chain: "ETH",
      logoURI: "https://assets.coingecko.com/coins/images/279/large/ethereum.png",
    },
    {
      id: "binance-chain",
      name: "Binance Smart Chain",
      chain: "BSC",
      symbol: "BNB",
      logoURI: "https://assets.coingecko.com/coins/images/825/large/binance-coin-logo.png",
    },
    {
      id: "polygon",
      name: "Polygon",
      chain: "POLYGON",
      symbol: "MATIC",
      logoURI: "https://assets.coingecko.com/coins/images/4713/large/matic-token-icon.png",
    },
  ],
};
