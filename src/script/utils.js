import ethers from 'ethers'
import contentHash from 'content-hash/dist/index'
import { getAllEnsContentHashes, getAllEnsCoinTypes, getCurrentEtherNetwork } from './config'

function uInt8ArrayToString (array) {
  var dataString = ''
  for (var i = 0; i < array.length; i++) {
    dataString += String.fromCharCode(array[i])
  }

  return dataString
}

export function contentHash2Url (data) {
  console.info(data.substr(), contentHash.getCodec(data.substr()))
  const coder = contentHash.getCodec(data)
  const hash = contentHash.decode(data)
  if (coder === 'ipns-ns') {
    const str = uInt8ArrayToString(ethers.utils.base58.decode(hash))
    return `ipns://${str.substr(2)}`
  } else if (coder === 'swarm-ns') {
    return `bzz://${hash}`
  } else if (coder === 'sha3-256') {
    return `sha3-256://${data}`
  }
  return `${coder}://${hash}`
}

export function isEthAddress (data) {
  return ethers.utils.isAddress(data)
}

export function toFullUrl (data, type, key) {
  if (!data) return null
  if (type === 'address') {
    const config = getCurrentEtherNetwork()
    // eslint-disable-next-line no-template-curly-in-string
    return `${config.explorerUrl}/address/${data}`
  } else if (type === 'coin') {
    const config = getAllEnsCoinTypes().find(d => d.shortName === key)
    // eslint-disable-next-line no-template-curly-in-string
    return `${config.explorer.replace('${account}', data)}`
  } else if (type === 'contentHash') {
    if (data.substr(0, 7) === 'ipfs://' || data.substr(0, 6) === '/ipfs/' || data.substr(0, 7) === 'ipns://' || data.substr(0, 6) === '/ipns/') {
      const config = getAllEnsContentHashes().find(d => d.name === 'ipfs/ipns')
      return `${config.gateway}/${data.replace('ipfs://', 'ipfs/').replace('ipns://', 'ipns/')}`
    } else if (data.substr(0, 6) === 'bzz://') {
      const config = getAllEnsContentHashes().find(d => d.name === 'swarm')
      return `${config.gateway}/${data.replace('bzz://', 'bzz:/')}`
    }
    return `${data}`
  } else if (type === 'text') {
    if (key === 'email') {
      return `mailto:${data}`
    }
    return `${data}`
  }
}
