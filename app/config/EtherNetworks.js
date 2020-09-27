// import { ethers } from 'ethers'

export const EtherNetworks = [
  {
    shortName: 'homestead',
    name: 'Main Ethereum Network',
    provider: 'https://mainnet.infura.io/v3/4874216190994ef392d1ab05a980fd79',
    explorerUrl: 'https://etherscan.io'
  },
  {
    shortName: 'ropsten',
    name: 'Ropsten Test Network',
    provider: 'https://ropsten.infura.io/v3/4874216190994ef392d1ab05a980fd79',
    explorerUrl: 'https://ropsten.etherscan.io'
  }, {
    shortName: 'kovan',
    name: 'Kovan Test Network',
    provider: 'https://kovan.infura.io/v3/4874216190994ef392d1ab05a980fd79',
    explorerUrl: 'https://kovan.etherscan.io'
  }, {
    shortName: 'rinkeby',
    name: 'Rinkeby Test Network',
    provider: 'https://rinkeby.infura.io/v3/4874216190994ef392d1ab05a980fd79',
    explorerUrl: 'https://rinkeby.etherscan.io'
  }
]

// let CurrentEtherNetwork = EtherNetworks.length > 0 ? EtherNetworks[1] : null

// // let CurrentEtherProvider = CurrentEtherNetwork ? ethers.getDefaultProvider(CurrentEtherNetwork.shortName, options) : null

// browser.runtime.onStartup && browser.runtime.onStartup.addListener(() => {
//   console.log('extension started: ' + Date.now())
// })

// const extensionURL = browser.extension.getURL('') + 'index.html'

// browser.runtime.onMessage.addListener((request, sender, sendResponse) => {
//   if (sender && sender.url.startsWith(extensionURL)) {
//     if (request.command === 'SwitchNetwork') {
//       for (var d of EtherNetworks) {
//         if (d.shortName === request.network) {
//           CurrentEtherNetwork = d
//           sendResponse(CurrentEtherNetwork)
//           break
//         }
//       }
//     } else if (request.command === 'GetAllEtherNetworks') {
//       sendResponse(getAllEtherNetworks())
//     } else if (request.command === 'GetCurrentEtherNetwork') {
//       sendResponse(getCurrentEtherNetwork())
//     }
//   }
// })

// function getAllEtherNetworks () {
//   return EtherNetworks
// }

// function getCurrentEtherNetwork () {
//   return CurrentEtherNetwork
// }

// function getCurrentEtherProvider () {
//   const options = {
//     infura: '4874216190994ef392d1ab05a980fd79'
//   }
//   return ethers.getDefaultProvider(getCurrentEtherNetwork().shortName, options)
// }

// export {
//   getAllEtherNetworks,
//   getCurrentEtherNetwork,
//   getCurrentEtherProvider
// }
