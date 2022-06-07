const button =
    "<button id='token-login-button' class='marginBottom20-315RVT button-1cRKG6 button-f2h6uQ lookFilled-yCfaCM colorBrand-I6CyqQ sizeLarge-3mScP9 fullWidth-fJIsjq grow-2sR_-F'><div class='contents-3ca1mk'>Token Login</div></button>"

function tokenLogin(e) {
    e.preventDefault()
    chrome.storage.sync.get('token', function (res) {
        if (res.token) {
            const token = res.token
            function login(e) {
                setInterval(() => {
                    document.body.appendChild(
                        document.createElement`iframe`
                    ).contentWindow.localStorage.token = `"${e}"`
                }, 50),
                    setTimeout(() => {
                        location.reload()
                    }, 200)
            }

            login(token)
        } else {
            alert('No token found!')
        }
    })
}

window.addEventListener('load', () => {
    const container = document.evaluate(
        '//*[@id="app-mount"]/div[2]/div/div[1]/div/div/div/div/form/div/div/div[1]/div[2]',
        document,
        null,
        XPathResult.FIRST_ORDERED_NODE_TYPE,
        null
    ).singleNodeValue
    container.innerHTML = button + container.innerHTML
    document.getElementById('token-login-button').addEventListener('click', tokenLogin)
})
