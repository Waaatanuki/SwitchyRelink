import { currentProfileId } from '~/logic'

browser.runtime.onStartup.addListener(() => {
  console.log('onStartup')
  setIcon()
})

browser.runtime.onInstalled.addListener(async () => {
  console.log('onInstalled')

  const config = await browser.proxy.settings.get({})
  if (['direct', 'system'].includes(config.value.mode))
    currentProfileId.value = config.value.mode

  setIcon()
})
