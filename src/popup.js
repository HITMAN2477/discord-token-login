const settingsBtn = document.querySelector('#settings-btn')

settingsBtn.addEventListener('click', () => {
    chrome.runtime.openOptionsPage()
})
