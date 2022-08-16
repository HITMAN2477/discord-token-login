const saveBtn = document.getElementById('save-button')
const closeAlertBtn = document.getElementById('close-alert-button')
const tokenInput = document.getElementById('token-input')
const alertEl = document.getElementById('alert')

function showAlert() {
    alertEl.classList.remove('hidden')
}

function hideAlert() {
    alertEl.classList.add('hidden')
}

function setAlertHTML(html) {
    alertEl.children[0].innerHTML = html
}

async function checkUpdates() {
    const version = chrome.runtime.getManifest()?.version
    if (!version) return

    function formatVersion(ver) {
        return parseInt(ver.replaceAll('.', '').replaceAll('v', ''))
    }

    try {
        const res = await fetch(
            'https://api.github.com/repos/umgustavo/discord-token-login/releases/latest'
        )
        const data = await res.json()
        const lastVersion = formatVersion(data.name)
        const downloadUrl = data.assets[0].browser_download_url
        let ver = formatVersion(version)

        console.log('Version checked successfully.')
        console.log('Current version: v' + version)
        console.log('Last version: ' + data.name)

        if (ver < lastVersion) {
            setAlertHTML(
                `New version available! <a href="${downloadUrl}" target="_blank">Click here</a> to download the <b>${data.name}</b>. (current: <b>v${version}</b>)`
            )
            showAlert()
        }
    } catch (err) {
        console.error('An error occurred while checking for updates:')
        console.error(err)
    }
}

function getCurrentToken() {
    chrome.storage.sync.get('token', function (res) {
        if (res.token) {
            tokenInput.value = res.token
        }
    })
}

checkUpdates()
getCurrentToken()

function isTokenValid(token) {
    if (token.length !== 0) return true
    return false
}

tokenInput.addEventListener('input', () => {
    const token = tokenInput.value
    if (isTokenValid(token)) saveBtn.disabled = false
    else saveBtn.disabled = true
})

saveBtn.addEventListener('click', () => {
    const token = tokenInput.value
    if (isTokenValid(token)) {
        chrome.storage.sync.set({ token: token }, () => {
            setAlertHTML('Token saved successfully!')
            showAlert()
        })
    }
})

closeAlertBtn.addEventListener('click', () => {
    hideAlert()
})
