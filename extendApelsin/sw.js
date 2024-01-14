console.log('Инициализирован SW (сервис воркер) ', self)
console.log('и внутри него chrome.runtime', chrome.runtime)
chrome.runtime.onMessage.addListener(function(message) {
    console.log('message - - -', JSON.stringify(message))
    switch (message.action) {
        case "openOptionsPage":
            openOptionsPage();
            break;
        default:
            break;
    }
});

function openOptionsPage(){
    chrome.runtime.openOptionsPage();
    setTimeout(()=>{
        chrome.runtime.sendMessage({site:'От БАКЕНДА',time:'222222'})
    }, 2000)
}