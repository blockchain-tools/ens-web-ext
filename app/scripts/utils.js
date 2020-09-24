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
  // console.info(data)
  const coder = contentHash.getCodec(data)
  const hash = contentHash.decode(data)
  if (coder === 'ipns-ns') {
    const str = uInt8ArrayToString(ethers.utils.base58.decode(hash))
    // console.info(coder, hash, ethers.utils.base58.decode(hash), str)
    return `ipns://${str.substr(2)}`
  } else if (coder === 'swarm-ns') {
  // console.info(coder, hash, ethers.utils.base58.decode(hash), str)
    return `bzz://${hash}`
  }
  return `${coder}://${hash}`
}

export function isEthAddress (data) {
  return ethers.utils.isAddress(data)
}
