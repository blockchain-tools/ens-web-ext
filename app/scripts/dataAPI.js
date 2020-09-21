var ensMap = {}

browser.runtime.onStartup && browser.runtime.onStartup.addListener(function () {
  console.log('extension started: ' + Date.now())
  var getSuccess = function (items) {
    ensMap = (items && items.ensMap) || {}
  }
  if (process.env.VENDOR === 'edge') {
    browser.storage.sync.get('ensMap', getSuccess)
  } else {
    browser.storage.sync.get('ensMap').then(getSuccess, (e) => { console.log(e); ensMap = {} })
    // browser.storage.sync.get('installedTime',getInstalledTimeSuccess)
  }
})

browser.runtime.onInstalled.addListener(function () {
  console.log('extension onInstalled: ' + Date.now())

  var getSuccess = function (items) {
    ensMap = (items && items.ensMap) || {}
    console.info(ensMap)
  }
  if (process.env.VENDOR === 'edge') {
    browser.storage.sync.get('ensMap', getSuccess)
  } else {
    browser.storage.sync.get('ensMap').then(getSuccess, (e) => { console.log(e); ensMap = {} })
  }
})
var dataAPI = {
  saveMemoryData (cb) {
    if (process.env.VENDOR === 'edge') {
      browser.storage.local.set({ memory: ensMap }, () => { cb(null, true) })
    } else {
      browser.storage.local.set({ memory: ensMap }).then(() => { cb(null, true) }, (e) => { cb(e, false) })
    }
  },
  loadMemoryData (cb) {
    var getSuccess = function (data) {
      ensMap = {
        ...ensMap,
        ...data.memory
      }
      console.info(ensMap)
      cb(null, true)
    }
    if (process.env.VENDOR === 'edge') {
      browser.storage.local.get('memory', getSuccess)
    } else {
      browser.storage.local.get('memory').then(getSuccess, (e) => { cb(e, false) })
    }
  },

  set (ensName, object) {
    ensMap[ensName] = JSON.stringify(object)
  },
  get (ensName) {
    if (ensMap[ensName]) {
      return JSON.parse(ensMap[ensName])
    }
    return null
  }
}

module.exports = dataAPI
