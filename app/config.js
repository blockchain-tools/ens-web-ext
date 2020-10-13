import { EnsCoinTypes } from './config/EnsCoinTypes'
import { EnsTextKeys } from './config/EnsTextKeys'
import { EnsContentHashes } from './config/EnsContentHashes'
import { EtherNetworks } from './config/EtherNetworks'
import ENS, { getEnsAddress } from '@ensdomains/ensjs'
import Web3 from 'web3'

let configuraion = {
  EnsCoinTypes,
  EnsTextKeys,
  EnsContentHashes,
  EtherNetworks,
  CurrentEtherNetwork: EtherNetworks.length > 0 ? EtherNetworks[0] : null
}

const extensionURL = browser.extension.getURL('')

const recoverConfiguration = () => {
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
      configuraion = Object.assign(configuraion, data.configuraion)
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
}
browser.runtime.onStartup && browser.runtime.onStartup.addListener(() => {
  recoverConfiguration()
})
browser.runtime.onInstalled && browser.runtime.onInstalled.addListener(function () {
  recoverConfiguration()
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
  const provider = new Web3.providers.HttpProvider(getCurrentEtherNetwork().provider)
  const ens = new ENS({ provider, ensAddress: getEnsAddress(`${getCurrentEtherNetwork().networkId}`) })
  return ens
}
export {
  getAllEnsCoinTypes,
  getAllEnsTextKeys,
  getAllEnsContentHashes,
  getAllEtherNetworks,
  getCurrentEtherNetwork,
  getCurrentEtherProvider
}
