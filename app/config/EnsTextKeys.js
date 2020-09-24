const EnsTextKeys = ['email', 'url', 'avatar', 'description', 'notice', 'keywords', 'vnd.twitter', 'vnd.github']

browser.runtime.onStartup && browser.runtime.onStartup.addListener(() => {
  console.log('extension started: ' + Date.now())
})

const extensionURL = browser.extension.getURL('') + 'index.html'

browser.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (sender && sender.url.startsWith(extensionURL)) {
    if (request.command === 'GetAllEnsTextKeys') {
      sendResponse(getAllEnsTextKeys())
    }
  }
})

function getAllEnsTextKeys () {
  return EnsTextKeys
}

export {
  getAllEnsTextKeys
}
