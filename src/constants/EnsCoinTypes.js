/* eslint-disable no-template-curly-in-string */
export const EnsCoinTypes = [
  {
    name: 'Bitcoin',
    value: 0,
    shortName: 'BTC',
    explorer: 'https://www.blockchain.com/btc/address/${account}'
  },
  {
    name: 'Litecoin',
    value: 2,
    shortName: 'LTC',
    explorer: 'https://ltc.btc.com/${account}'
  },
  {
    name: 'Dogecoin',
    value: 3,
    shortName: 'DOGE',
    explorer: 'https://dogechain.info/address/${account}'
  },
  {
    name: 'DASH',
    value: 5,
    shortName: 'DASH',
    explorer: 'https://insight.dash.org/insight/address/${account}'
  },

  {
    name: 'Monacoin',
    value: 22,
    shortName: 'MONA',
    explorer: 'https://mona.chainsight.info/address/${account}'
  },
  {
    name: 'XEM',
    value: 43,
    shortName: 'XEM',
    explorer: 'https://explorer.nemtool.com/#/s_account?account=${account}'
  },
  {
    name: 'Ethereum',
    value: 60,
    shortName: 'ETH',
    explorer: 'https://etherscan.io/address/${account}'
  },
  {
    name: 'Ethereum Classic',
    value: 61,
    shortName: 'ETC',
    explorer: 'https://blockscout.com/etc/mainnet/address/${account}'
  },
  {
    name: 'cosmos',
    value: 118,
    shortName: 'ATOM',
    explorer: 'https://www.mintscan.io/cosmos/account/${account}'
  },
  {
    name: 'Rootstock',
    value: 137,
    shortName: 'RSK',
    explorer: 'https://explorer.rsk.co/address/${account}'
  },
  {
    name: 'Ripple',
    value: 144,
    shortName: 'XRP',
    explorer: 'https://xrpscan.com/account/${account}'
  },
  {
    name: 'Bitcoin Cash',
    value: 145,
    shortName: 'BCH',
    explorer: 'https://blockchair.com/bitcoin-cash/address/${account}'
  },
  {
    name: 'XLM',
    value: 148,
    shortName: 'XLM',
    explorer: 'https://blockchair.com/stellar/account/${account}'
  },
  {
    name: 'EOS',
    value: 194,
    shortName: 'EOS',
    explorer: 'https://bloks.io/account/${account}'
  },
  {
    name: 'TRX',
    value: 195,
    shortName: 'TRX',
    explorer: 'https://trx.tokenview.com/en/address/${account}'
  },
  {
    name: 'KSM',
    value: 434,
    shortName: 'KSM',
    explorer: 'https://kusama.polkastats.io/account/${account}'
  },
  {
    name: 'XDAI',
    value: 700,
    shortName: 'XDAI',
    explorer: 'https://blockscout.com/poa/xdai/address/${account}'
  },
  {
    name: 'Binance',
    value: 714,
    shortName: 'BNB',
    explorer: 'https://explorer.binance.org/address/${account}'
  }

]
