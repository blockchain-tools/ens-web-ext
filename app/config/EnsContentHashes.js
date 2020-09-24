const EnsContentHashes = ['ipfs/ipns', 'swarm']

browser.runtime.onStartup && browser.runtime.onStartup.addListener(() => {
  console.log('extension started: ' + Date.now())
})

const extensionURL = browser.extension.getURL('') + 'index.html'

browser.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (sender && sender.url.startsWith(extensionURL)) {
    if (request.command === 'GetAllEnsContentHashes') {
      sendResponse(getAllEnsContentHashes())
    }
  }
})

function getAllEnsContentHashes () {
  return EnsContentHashes
}

export {
  getAllEnsContentHashes
}
