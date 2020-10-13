import dataAPI from './data'

browser.omnibox.onInputStarted.addListener(() => {
  console.log('[' + new Date() + '] omnibox event: onInputStarted')
})

browser.omnibox.onInputChanged.addListener(async (inputText, suggest) => {
  const text = inputText.trim()
  console.log('[' + new Date() + '] omnibox event: onInputChanged, user input: ' + text)
  if (text.endsWith('.eth')) {
    const result = await dataAPI.query(text)
    suggest(result)
  }
})

browser.omnibox.onInputEntered.addListener(async (inputText, disposition) => {
  const text = inputText.trim()
  console.log('[' + new Date() + '] omnibox event: onInputEntered, user input: ' + text + ', disposition: ' + disposition)
  let url
  if (text.substr(0, 7) === 'mailto:' || text.substr(0, 7) === 'http://' || text.substr(0, 8) === 'https://') {
    url = text
  } else {
    if (text.endsWith('.eth')) {
      const data = await dataAPI.query(text)
      if (data && data.length > 0) {
        url = data[0].content
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
