import dataAPI from './dataAPI.js'
import { ethers } from 'ethers'
import { textKeys, coinTypes } from './../config.js'

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

// const network = "homestead";
const network = 'ropsten'

const provider = ethers.getDefaultProvider(network, {
  infura: '4874216190994ef392d1ab05a980fd79'
})

browser.runtime.onInstalled.addListener((details) => {
  console.log('previousVersion', details.previousVersion)
})

browser.omnibox.onInputStarted.addListener(() => {
  console.log('[' + new Date() + '] omnibox event: onInputStarted')
})

browser.omnibox.onInputChanged.addListener((text, suggest) => {
  console.log('[' + new Date() + '] omnibox event: onInputChanged, user input: ' + text)
  if (text.endsWith('.eth')) {
    var suggestions = []
    var cache = dataAPI.get(text)
    if (cache) {
      suggest(cache)
    }
    provider.getResolver(text).then((resolver) => {
      console.info(resolver)
      if (resolver) {
        let fns = []

        fns = fns.concat([resolver.getAddress().then((data) => { return { type: 'address', key: 'address', data: data } }).catch(() => {})])

        fns = fns.concat([resolver.getContentHash().then((data) => { return { type: 'contentHash', key: 'contentHash', data: data } }).catch(() => {})])

        fns = fns.concat(textKeys.map((textKey) => {
          return resolver.getText(textKey).then((data) => { return { type: 'text', key: textKey, data: data } }).catch(() => {})
        }))
        fns = fns.concat(coinTypes.map((coinType) => {
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
            dataAPI.set(text, suggestions)
            suggest(suggestions)
          }
        })
      }
    })
  }
})

browser.omnibox.onInputEntered.addListener((text, disposition) => {
  console.log('[' + new Date() + '] omnibox event: onInputEntered, user input: ' + text + ', disposition: ' + disposition)
  var url
  if (text.substr(0, 7) === 'http://' || text.substr(0, 8) === 'https://') {
    url = text
  } else {
    url = 'https://etherscan.io/address/' + text
  }
  browser.tabs.create({
    url
  })
})
