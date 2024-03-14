export async function setIcon() {
  const config = await browser.proxy.settings.get({})

  if (['direct', 'system'].includes(config.value.mode))
    browser.action.setIcon({ path: `/assets/logo_${config.value.mode}.png` })
  else
    browser.action.setIcon({ path: `/assets/logo_custom.png` })
}
