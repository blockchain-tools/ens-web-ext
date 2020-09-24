const EnsCoinTypes = [
  {
    name: 'Bitcoin',
    value: 0,
    shortName: 'BTC',
    explorer: 'https://www.blockchain.com/btc/address/'
  },
  {
    name: 'Litecoin',
    value: 2,
    shortName: 'LTC'
  },
  {
    name: 'Dogecoin',
    value: 3,
    shortName: 'DOGE'
  },
  {
    name: 'DASH',
    value: 5,
    shortName: 'DASH'
  },

  {
    name: 'Monacoin',
    value: 22,
    shortName: 'MONA'
  },
  {
    name: 'XEM',
    value: 43,
    shortName: 'XEM'
  },
  {
    name: 'Ethereum',
    value: 60,
    shortName: 'ETH'
  },
  {
    name: 'Ethereum Classic',
    value: 61,
    shortName: 'ETC'
  },
  {
    name: 'cosmos',
    value: 118,
    shortName: 'ATOM'
  },
  {
    name: 'Rootstock',
    value: 137,
    shortName: 'RSK'
  },
  {
    name: 'Ripple',
    value: 144,
    shortName: 'XRP'
  },
  {
    name: 'Bitcoin Cash',
    value: 145,
    shortName: 'BCH',
    explorer: 'https://www.blockchain.com/bch/address/'
  },
  {
    name: 'XLM',
    value: 148,
    shortName: 'XLM'
  },
  {
    name: 'EOS',
    value: 194,
    shortName: 'EOS'
  },
  {
    name: 'TRX',
    value: 195,
    shortName: 'TRX'
  },
  {
    name: 'KSM',
    value: 434,
    shortName: 'KSM'
  },
  {
    name: 'XDAI',
    value: 700,
    shortName: 'XDAI'
  },
  {
    name: 'Binance',
    value: 714,
    shortName: 'BNB'
  }

]

browser.runtime.onStartup && browser.runtime.onStartup.addListener(() => {
  console.log('extension started: ' + Date.now())
})

const extensionURL = browser.extension.getURL('') + 'index.html'

browser.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (sender && sender.url.startsWith(extensionURL)) {
    if (request.command === 'GetAllEnsCoinTypes') {
      sendResponse(getAllEnsCoinTypes())
    }
  }
})

function getAllEnsCoinTypes () {
  return EnsCoinTypes
}

export {
  getAllEnsCoinTypes
}
