'use strict'
;(async () => {
    const randId = [...crypto.getRandomValues(new Uint8Array(8))]
        .map((m) => ('0' + m.toString(16)).slice(-2))
        .join('')

    let button = `<button id='${randId}' class='marginBottom20-315RVT button-1cRKG6 button-f2h6uQ lookFilled-yCfaCM colorBrand-I6CyqQ sizeLarge-3mScP9 fullWidth-fJIsjq grow-2sR_-F'><div class="contents-3ca1mk">Token Login</div></button>`

    async function getStoredToken() {
        const { token } = await chrome.storage.sync.get('token')
        return token
    }

    async function tokenInfo(token) {
        const headers = { Authorization: token, 'Content-Type': 'application/json' }
        return new Promise((resolve, reject) => {
            fetch('https://discord.com/api/v6/users/@me', {
                method: 'GET',
                headers,
            })
                .then(async (res) => {
                    const data = await res.json()
                    if (res.status === 200) {
                        const info = {
                            username: `${data.username}#${data.discriminator}`,
                            avatar: `https://cdn.discordapp.com/avatars/${data.id}/${data.avatar}.png?size=24`,
                        }
                        resolve(info)
                    } else {
                        resolve(null)
                    }
                })
                .catch(() => {
                    resolve(null)
                })
        })
    }

    const tokenToLogin = await getStoredToken()

    if (tokenToLogin) {
        const info = await tokenInfo(tokenToLogin)

        if (info !== null)
            button = `
                <button id='${randId}' class='marginBottom20-315RVT button-1cRKG6 button-f2h6uQ lookFilled-yCfaCM colorBrand-I6CyqQ sizeLarge-3mScP9 fullWidth-fJIsjq grow-2sR_-F'><div class="contents-3ca1mk" style="
                    display: flex;
                    align-items: center;
                    gap: 8px;
                ">
                    <div style="display:flex;align-items:center;gap:8px">
                        <img src="{avatar_url}" alt="avatar" width="24px" height="24px" style="border-radius:999px" draggable="false">
                        {username}
                    </div>
                </div></button>
            `
                .replaceAll('{avatar_url}', info.avatar)
                .replaceAll('{username}', info.username)
    }

    function loginButtonClick(e) {
        e.preventDefault()
        if (!tokenToLogin) alert('No token found!')

        function login(token) {
            setInterval(() => {
                document.body.appendChild(
                    document.createElement`iframe`
                ).contentWindow.localStorage.token = `"${token}"`
            }, 50)
            setTimeout(() => {
                location.reload()
            }, 200)
        }

        login(tokenToLogin)
    }

    window.addEventListener('load', () => {
        const container = document.evaluate(
            '//*[@id="app-mount"]/div[2]/div/div[1]/div/div/div/div/form/div/div/div[1]/div[2]',
            document,
            null,
            XPathResult.FIRST_ORDERED_NODE_TYPE,
            null
        ).singleNodeValue

        if (container) container.innerHTML = button + container.innerHTML

        const login_btn = document.getElementById(randId)
        if (login_btn) login_btn.addEventListener('click', loginButtonClick)
    })
})()
