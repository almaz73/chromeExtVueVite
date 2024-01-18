console.log('Инициализирован SW (сервис воркер) ', self)
console.log('и внутри него chrome.runtime', chrome.runtime)

let nameAccont = ''
let data = []
chrome.runtime.onMessage.addListener(function (message) {
    console.log('message - - -', JSON.stringify(message))
    switch (message.action) {
        case "openOptionsPage":
            openOptionsPage();
            break;
        case "setOperator":
            if (message.nameAccount) nameAccont = message.nameAccount
            break;
        case "showData":
            if (message.data.length) data = message.data
            break;
        // case "ChaChaCha":
        //     console.log('IN ChaChaCha')
        //
        //     console.log('self.clients', self.clients)
        //     self.clients.matchAll().then(clients => {
        //         console.log('clients', clients)
        //         clients.forEach(client => {
        //             console.log('client', client)
        //             client.postMessage({msg: 'Hello from SW'})
        //         });
        //     })
        //     break
        default:
            break;
    }
    return true
});

function openOptionsPage() {
    chrome.runtime.openOptionsPage();
    setTimeout(() => {
        chrome.runtime.sendMessage({"action": "pass", data, nameAccont})
    }, 2000)
}