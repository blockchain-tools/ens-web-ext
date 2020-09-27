let ensMap = {}
const extensionURL = browser.extension.getURL('') + 'index.html'

browser.runtime.onStartup && browser.runtime.onStartup.addListener(function () {
  console.log('extension started: ' + Date.now())
  var getSuccess = function (items) {
    ensMap = (items && items.ensMap) || {}
  }
  if (process.env.VENDOR === 'edge') {
    browser.storage.sync.get('ensMap', getSuccess)
  } else {
    browser.storage.sync.get('ensMap').then(getSuccess, (e) => { console.log(e); ensMap = {} })
  }
})

browser.runtime.onInstalled.addListener(function () {
  console.log('extension onInstalled: ' + Date.now())

  const loadEnsMapSuccess = function (items) {
    ensMap = (items && items.ensMap) || {}
    console.info(ensMap)
  }
  if (process.env.VENDOR === 'edge') {
    browser.storage.sync.get('ensMap', loadEnsMapSuccess)
  } else {
    browser.storage.sync.get('ensMap').then(loadEnsMapSuccess, (e) => { console.log(e); ensMap = {} })
  }

  const queryTabSuccess = function (tabs) {
    if (tabs && tabs.length > 0) {
      browser.tabs.update(tabs[0].id, { active: true }).then(function (tab) {})
    } else {
      browser.tabs.create({
        url: extensionURL
      }).then(function (tab) {})
    }
  }
  if (process.env.VENDOR === 'edge') {
    browser.tabs.query({ url: extensionURL, currentWindow: true }, queryTabSuccess)
  } else {
    browser.tabs.query({ url: extensionURL, currentWindow: true }).then(queryTabSuccess, (error) => { console.log(`Error: ${error}`) })
  }
})
const cacheAPI = {
  set (network, ensName, object) {
    if (!ensMap[network]) {
      ensMap[network] = {}
    }
    ensMap[network][ensName] = JSON.stringify(object)
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
