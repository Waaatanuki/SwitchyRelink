async function setIcon() {
  const { currentProfileId } = await browser.storage.local.get('currentProfileId')
  if (['direct', 'system'].includes(currentProfileId))
    browser.action.setIcon({ path: `/assets/logo_${currentProfileId}.png` })
  else
    browser.action.setIcon({ path: `/assets/logo_custom.png` })
}

browser.runtime.onStartup.addListener(() => {
  setIcon()
})

browser.runtime.onInstalled.addListener(() => {
  setIcon()
})
