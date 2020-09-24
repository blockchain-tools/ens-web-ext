// var contentHash = require('content-hash/dist/index')
import dataAPI from './dataAPI.js'
import { getAllEnsContentHashes, getAllEnsTextKeys, getAllEnsCoinTypes, getCurrentEtherNetwork, getCurrentEtherProvider } from './../config.js'
import { contentHash2Url, isEthAddress } from './utils'

const extensionURL = browser.extension.getURL('') + 'index.html'

browser.runtime.onStartup && browser.runtime.onStartup.addListener(() => {
  console.log('extension started: ' + Date.now())
})

browser.runtime.onInstalled && browser.runtime.onInstalled.addListener(() => {
  console.log('extension installed: ' + Date.now())

  dataAPI.loadMemoryData(() => {
    var querySuccess = function (tabs) {
      console.log(tabs)
      if (tabs && tabs.length > 0) {
        browser.tabs.update(tabs[0].id, { active: true }).then(function (tab) {
          // browser.tabs.sendMessage(tab.id,{'command':'FETCH_DATA_FROM_INDEXDB'}).then(()=>{},()=>{});
        })
      } else {
        browser.tabs.create({
          url: extensionURL
        }).then(function (tab) {
          // browser.tabs.sendMessage(tab.id,{'command':'FETCH_DATA_FROM_INDEXDB'}).then(()=>{},()=>{});
        })
      }
    }
    if (process.env.VENDOR === 'edge') {
      browser.tabs.query({ url: extensionURL, currentWindow: true }, querySuccess)
    } else {
      browser.tabs.query({ url: extensionURL, currentWindow: true }).then(querySuccess, (error) => { console.log(`Error: ${error}`) })
    }
  })
})

browser.runtime.onInstalled.addListener((details) => {
  console.log('previousVersion', details.previousVersion)
  getAllEnsContentHashes()
})

browser.omnibox.onInputStarted.addListener(() => {
  console.log('[' + new Date() + '] omnibox event: onInputStarted')
})

browser.omnibox.onInputChanged.addListener((text, suggest) => {
  console.log('[' + new Date() + '] omnibox event: onInputChanged, user input: ' + text)
  if (text.endsWith('.eth')) {
    const network = getCurrentEtherNetwork().shortName
    const suggestions = []
    const cache = dataAPI.get(network, text)
    if (cache) {
      suggest(cache)
      if (cache && cache.length > 0) {
        browser.omnibox.setDefaultSuggestion({
          description: cache[0].description
        })
      }
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
            suggest(suggestions)
            if (suggestions && suggestions.length > 0) {
              browser.omnibox.setDefaultSuggestion({
                description: suggestions[0].description
              })
            }
            dataAPI.set(network, text, suggestions)
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
    url = `https://ipfs.io/${text.replace('ipfs://', 'ipfs/')}`
  } else if (text.substr(0, 7) === 'ipns://' || text.substr(0, 6) === '/ipns/') {
    url = `https://ipfs.io/${text.replace('ipns://', 'ipns/')}`
  } else if (text.substr(0, 6) === 'bzz://') {
    url = `https://swarm-gateways.net/${text.replace('bzz://', 'bzz:/')}`
  } else {
    if (text.endsWith('.eth')) {
      const network = getCurrentEtherNetwork().shortName
      const cache = dataAPI.get(network, text)
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
  browser.tabs.create({
    url
  })
})
