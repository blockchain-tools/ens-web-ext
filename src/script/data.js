import cacheAPI from './cache'
import { getAllEnsTextKeys, getAllEnsCoinTypes, getCurrentEtherNetwork, getCurrentEtherProvider } from './config'
import { toFullUrl } from './utils'

const dataAPI = {
  _query: async (text) => {
    const suggestions = []
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

      return Promise.all(fns).then(async (values) => {
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
            }
          }
        })
        return suggestions
      }).catch((e) => {
        console.error(e)
        return []
      })
    }
    return suggestions
  },
  query: async (text) => {
    const network = getCurrentEtherNetwork().shortName
    const cache = cacheAPI.get(network, text)
    if (cache) {
      console.info('cache hit', cache)
      dataAPI._query(text).then((d) => {
        if (JSON.stringify(cache) !== JSON.stringify(d)) {
          console.info('cache update')
          cacheAPI.set(network, text, d)
        }
      })
      return cache
    } else {
      const suggestions = await dataAPI._query(text)
      console.info('cache did not hit')
      await cacheAPI.set(network, text, suggestions)
      return suggestions
    }
  }
}

export default dataAPI
