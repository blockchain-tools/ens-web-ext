import ethers from 'ethers'
import contentHash from 'content-hash/dist/index'

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
