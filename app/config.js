import { EnsCoinTypes } from './config/EnsCoinTypes'
import { EnsTextKeys } from './config/EnsTextKeys'
import { EnsContentHashes } from './config/EnsContentHashes'
import { EtherNetworks } from './config/EtherNetworks'
import { ethers } from 'ethers'
let configuraion = {
  EnsCoinTypes,
  EnsTextKeys,
  EnsContentHashes,
  EtherNetworks,
  CurrentEtherNetwork: EtherNetworks.length > 0 ? EtherNetworks[0] : null
}

const extensionURL = browser.extension.getURL('')

browser.runtime.onInstalled && browser.runtime.onInstalled.addListener(() => {
  browser.storage.local.get('configuraion').then((data) => {
    if (!data || Object.keys(data).length === 0) {
      configuraion = {
        EnsCoinTypes,
        EnsTextKeys,
        EnsContentHashes,
        EtherNetworks,
        CurrentEtherNetwork: EtherNetworks.length > 0 ? EtherNetworks[1] : null
      }
    } else {
      configuraion = Object.assign(configuraion, data)
    }
  }, (e) => {
    console.error(e)
    configuraion = {
      EnsCoinTypes,
      EnsTextKeys,
      EnsContentHashes,
      EtherNetworks,
      CurrentEtherNetwork: EtherNetworks.length > 0 ? EtherNetworks[1] : null
    }
  })
})

browser.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (sender && sender.url.startsWith(extensionURL)) {
    if (request.command === 'SaveConfiguration') {
      configuraion[request.key] = request.value
      browser.storage.local.set({ configuraion }).then(
        () => {
          console.log(configuraion[request.key])
          sendResponse(request.value)
        },
        (e) => {
          console.error(e)
          sendResponse([])
        }
      )
    } else if (request.command === 'GetConfiguration') {
      sendResponse(configuraion[request.key])
    } else if (request.command === 'Notification') {
      const params = {
        ...request.value,
        iconUrl: './images/bridge.png'
      }
      browser.notifications.create('', params)
    }

    return true
  }
})

const getAllEnsCoinTypes = () => configuraion.EnsCoinTypes
const getAllEnsTextKeys = () => configuraion.EnsTextKeys
const getAllEnsContentHashes = () => configuraion.EnsContentHashes
const getAllEtherNetworks = () => configuraion.EtherNetworks
const getCurrentEtherNetwork = () => configuraion.CurrentEtherNetwork

const getCurrentEtherProvider = () => {
  // return new ethers.providers.InfuraProvider(getCurrentEtherNetwork().shortName, '4874216190994ef392d1ab05a980fd79')
  // const options = {
  //   infura: '4874216190994ef392d1ab05a980fd79'
  //   etherscan: 'BFREHUEBKMHVHFA1K8X34IRG8K4CWFFVW4',
  // }
  // return ethers.getDefaultProvider(getCurrentEtherNetwork().shortName, options)
  const infuraProvider = new ethers.providers.InfuraProvider(getCurrentEtherNetwork().shortName, '4874216190994ef392d1ab05a980fd79')
  const etherscanProvider = new ethers.providers.EtherscanProvider(getCurrentEtherNetwork().shortName, 'BFREHUEBKMHVHFA1K8X34IRG8K4CWFFVW4')
  return new ethers.providers.FallbackProvider([infuraProvider, etherscanProvider])
}
export {
  getAllEnsCoinTypes,
  getAllEnsTextKeys,
  getAllEnsContentHashes,
  getAllEtherNetworks,
  getCurrentEtherNetwork,
  getCurrentEtherProvider
}
