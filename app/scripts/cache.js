let ensMap = {}
const extensionURL = browser.extension.getURL('')

const recoverCache = () => {
  var getSuccess = function (items) {
    ensMap = (items && items.ensMap) || {}
  }
  if (process.env.VENDOR === 'edge') {
    browser.storage.local.get('ensMap', getSuccess)
  } else {
    browser.storage.local.get('ensMap').then(getSuccess, (e) => { console.log(e); ensMap = {} })
  }
}
browser.runtime.onStartup && browser.runtime.onStartup.addListener(function () {
  console.log('extension started: ' + Date.now())
  recoverCache()
})

browser.runtime.onInstalled.addListener(function () {
  console.log('extension onInstalled: ' + Date.now())
  recoverCache()
  const defaultUrl = extensionURL + 'index.html'
  const queryTabSuccess = function (tabs) {
    if (tabs && tabs.length > 0) {
      browser.tabs.update(tabs[0].id, { active: true }).then(function (tab) {})
    } else {
      browser.tabs.create({
        url: defaultUrl
      }).then(function (tab) {})
    }
  }
  if (process.env.VENDOR === 'edge') {
    browser.tabs.query({ url: defaultUrl, currentWindow: true }, queryTabSuccess)
  } else {
    browser.tabs.query({ url: defaultUrl, currentWindow: true }).then(queryTabSuccess, (error) => { console.log(`Error: ${error}`) })
  }
})
const cacheAPI = {
  set (network, ensName, object) {
    if (!ensMap[network]) {
      ensMap[network] = {}
    }
    ensMap[network][ensName] = JSON.stringify(object)
    // console.info('set', ensMap)
    browser.storage.local.set({ ensMap: ensMap })
  },
  get (network, ensName) {
    if (ensMap[network] && ensMap[network][ensName]) {
      return JSON.parse(ensMap[network][ensName])
    }
    return null
  }
}

export default cacheAPI
