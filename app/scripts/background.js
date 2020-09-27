import cacheAPI from './cache.js'
import { getAllEnsContentHashes, getAllEnsTextKeys, getAllEnsCoinTypes, getCurrentEtherNetwork, getCurrentEtherProvider } from './../config.js'
import { contentHash2Url, isEthAddress } from './utils'

browser.omnibox.onInputStarted.addListener(() => {
  console.log('[' + new Date() + '] omnibox event: onInputStarted')
})

browser.omnibox.onInputChanged.addListener((text, suggest) => {
  console.log('[' + new Date() + '] omnibox event: onInputChanged, user input: ' + text)
  if (text.endsWith('.eth')) {
    const network = getCurrentEtherNetwork().shortName
    const suggestions = []
    const cache = cacheAPI.get(network, text)
    if (cache) {
      suggest(cache.slice(1))
      // if (cache && cache.length > 0) {
      //   browser.omnibox.setDefaultSuggestion({
      //     description: cache[0].description
      //   })
      // }
    }
    getCurrentEtherProvider().getResolver(text).then((resolver) => {
      console.info(resolver)
      if (resolver) {
        let fns = []

        fns = fns.concat([resolver.getAddress().then((data) => { return { type: 'address', key: 'address', data: data, fullUrl: `${getCurrentEtherNetwork().explorerUrl}/address/${data}` } }).catch(() => {})])

        fns = fns.concat([resolver.getContentHash().then((data) => { return { type: 'contentHash', key: 'contentHash', data: data } }).catch((e) => {
          if (e.code && e.code === 'UNSUPPORTED_OPERATION') {
            if (e.data) {
              return { type: 'contentHash', key: 'contentHash', data: contentHash2Url(e.data) }
            }
          }
          // console.info(e.message)
        })])

        fns = fns.concat(getAllEnsTextKeys().map((textKey) => {
          return resolver.getText(textKey).then((data) => { return { type: 'text', key: textKey, data: data } }).catch(() => {})
        }))
        fns = fns.concat(getAllEnsCoinTypes().map((coinType) => {
          return resolver.getAddress(coinType.value).then((data) => { return { type: 'coin', key: coinType.shortName, data: data } }).catch(() => {})
        }))

        Promise.all(fns).then(values => {
          console.info(values)
          values.forEach((value, i) => {
            if (value && value.data) {
              if (value.type === 'address' || value.type === 'text' || value.type === 'coin' || value.type === 'contentHash') {
                console.error(process.env.VENDOR)
                const description = process.env.VENDOR === 'firefox'
                  ? '' + text + ' [' + value.key + '] ' + ' -  ' + value.data + ''
                  : '<match>' + text + '</match> <dim>[' + value.key + ']</dim> ' + ' -  <url>' + value.data + '</url>'
                const suggestion = {
                  content: value.data,
                  description: description
                }
                suggestions.push(suggestion)

                // if(value.type=="address") {
                //   browser.omnibox.setDefaultSuggestion({
                //     "description": suggestion.description
                //   })
                // }
              }
            }
          })
          if (!cache || JSON.stringify(cache) !== JSON.stringify(suggestions)) {
            console.info('cache did not hit')
            suggest(suggestions.slice(1))
            // if (suggestions && suggestions.length > 0) {
            //   browser.omnibox.setDefaultSuggestion({
            //     description: suggestions[0].description
            //   })
            // }
            cacheAPI.set(network, text, suggestions)
          }
        })
      }
    })
  }
})

browser.omnibox.onInputEntered.addListener((text, disposition) => {
  console.log('[' + new Date() + '] omnibox event: onInputEntered, user input: ' + text + ', disposition: ' + disposition)
  let url
  if (text.substr(0, 7) === 'http://' || text.substr(0, 8) === 'https://') {
    url = text
  } else if (text.substr(0, 7) === 'ipfs://' || text.substr(0, 6) === '/ipfs/') {
    const config = getAllEnsContentHashes().find(d => d.name === 'ipfs/ipns')
    url = `${config.gateway}/${text.replace('ipfs://', 'ipfs/')}`
  } else if (text.substr(0, 7) === 'ipns://' || text.substr(0, 6) === '/ipns/') {
    const config = getAllEnsContentHashes().find(d => d.name === 'ipfs/ipns')
    url = `${config.gateway}/${text.replace('ipns://', 'ipns/')}`
  } else if (text.substr(0, 6) === 'bzz://') {
    const config = getAllEnsContentHashes().find(d => d.name === 'swarm')
    url = `${config.gateway}/${text.replace('bzz://', 'bzz:/')}`
  } else {
    if (text.endsWith('.eth')) {
      const network = getCurrentEtherNetwork().shortName
      const cache = cacheAPI.get(network, text)
      if (cache && cache.length > 0) {
        url = cache[0].content
        if (isEthAddress(url)) {
          url = `${getCurrentEtherNetwork().explorerUrl}/address/` + url
        }
      } else {
        url = `https://app.ens.domains/name/${text}`
      }
    } else {
      url = `${getCurrentEtherNetwork().explorerUrl}/address/` + text
    }
  }
  browser.tabs.update({
    url
  })
  // switch (disposition) {
  //   case 'currentTab':
  //     browser.tabs.update({ url })
  //     break
  //   case 'newForegroundTab':
  //     browser.tabs.create({ url })
  //     break
  //   case 'newBackgroundTab':
  //     browser.tabs.create({ url, active: false })
  //     break
  // }
})
