const saveBtn = document.getElementById('save-button')
const tokenInput = document.getElementById('token-input')

function getCurrentToken() {
    chrome.storage.sync.get('token', function (res) {
        if (res.token) {
            tokenInput.value = res.token
        }
    })
}

getCurrentToken()

function isTokenValid(token) {
    const regex = /[MN][A-Za-z\d]{23}\.[\w-]{6}\.[\w-]{27}/g
    if (token.match(regex)) {
        saveBtn.disabled = false
        return true
    }
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
            alert('Token saved!')
        })
    }
})
