import cacheAPI from './cache.js'
import { getAllEnsTextKeys, getAllEnsCoinTypes, getCurrentEtherNetwork, getCurrentEtherProvider } from './../config.js'
import { toFullUrl } from './utils'

browser.omnibox.onInputStarted.addListener(() => {
  console.log('[' + new Date() + '] omnibox event: onInputStarted')
})

browser.omnibox.onInputChanged.addListener((inputText, suggest) => {
  const text = inputText.trim()
  console.log('[' + new Date() + '] omnibox event: onInputChanged, user input: ' + text)
  if (text.endsWith('.eth')) {
    const network = getCurrentEtherNetwork().shortName
    const suggestions = []
    const cache = cacheAPI.get(network, text)
    if (cache) {
      suggest(cache)
      // suggest(cache.slice(1))
      // if (cache && cache.length > 0) {
      //   browser.omnibox.setDefaultSuggestion({
      //     description: cache[0].description
      //   })
      // }
    }

    // suggest([])

    const resolver = getCurrentEtherProvider().name(text)
    if (resolver) {
      let fns = []
      // eslint-disable-next-line no-template-curly-in-string
      fns = fns.concat([resolver.getAddress().then((data) => { return { type: 'address', key: 'address', data: data, fullUrl: toFullUrl(data, 'address') } }).catch(() => {})])

      fns = fns.concat([resolver.getContent().then((data) => { return { type: 'contentHash', key: 'contentHash', data: data.value, fullUrl: toFullUrl(data.value, 'contentHash') } }).catch((e) => {
        console.log(e)
      })])

      fns = fns.concat(getAllEnsTextKeys().map((textKey) => {
        return resolver.getText(textKey).then((data) => { return { type: 'text', key: textKey, data: data, fullUrl: toFullUrl(data, 'text', textKey) } }).catch(() => {})
      }))
      fns = fns.concat(getAllEnsCoinTypes().map((coinType) => {
        return resolver.getAddress(coinType.shortName).then((data) => { return { type: 'coin', key: coinType.shortName, data: data, fullUrl: toFullUrl(data, 'coin', coinType.shortName) } }).catch((e) => {
          console.log(e)
        })
      }))

      Promise.all(fns).then(values => {
        values.forEach((value, i) => {
          if (value && value.data && value.data !== '0x0000000000000000000000000000000000000000') {
            if (value.type === 'address' || value.type === 'text' || value.type === 'coin' || value.type === 'contentHash') {
              const description = process.env.VENDOR === 'firefox'
                ? '' + text + ' [' + value.key + '] ' + ' -  ' + value.data + ''
                : '<match>' + text + '</match> <dim>[' + value.key + ']</dim> ' + ' -  <url>' + value.data + '</url>'
              const suggestion = {
                content: value.fullUrl || value.data,
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
          // suggest(suggestions.slice(1))

          // if (suggestions && suggestions.length > 0) {
          //   browser.omnibox.setDefaultSuggestion({
          //     description: suggestions[0].description
          //   })
          // }
          cacheAPI.set(network, text, suggestions)
        }
      }).catch((e) => {
        console.error(e)
      })
    }
  }
  return true
})

browser.omnibox.onInputEntered.addListener((text, disposition) => {
  console.log('[' + new Date() + '] omnibox event: onInputEntered, user input: ' + text + ', disposition: ' + disposition)
  let url
  if (text.substr(0, 7) === 'mailto:' || text.substr(0, 7) === 'http://' || text.substr(0, 8) === 'https://') {
    url = text
  } else {
    if (text.endsWith('.eth')) {
      const network = getCurrentEtherNetwork().shortName
      const cache = cacheAPI.get(network, text)
      if (cache && cache.length > 0) {
        url = cache[0].content
      } else {
        url = `https://app.ens.domains/name/${text}`
      }
    } else {
      url = `https://app.ens.domains/name/${text}`
    }
  }
  browser.tabs.create({
    url
  })
})
