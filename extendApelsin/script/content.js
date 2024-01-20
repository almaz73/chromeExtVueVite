
chrome.runtime.onMessage.addListener( // this is the message listener
    function (request, sender, sendResponse) {
        console.log('>>получил>>>>>>>>>> запрос от расширения>' + request);
        telefons = request.split('|||')[1]

        switch (+request.split('.')[0]) {
            case 1:
                if (location.pathname.includes("/avtomobili")) {
                    getAvitoData()
                    getPhone()
                }
                chrome.runtime.sendMessage({"action": "openOptionsPage"}); // открываю вкладку опций
                break
            case 2:
                wichPageReady(sendResponse);
                break
            default:
        }

        return true
    }
);


// function toScrollIntoView(id) {
//     var hiddenElement = document.getElementById(id);
//     hiddenElement.scrollIntoView({block: "center", behavior: "smooth"});
// }


function wichPageReady(sendResponse) {
    console.log('===wichPageReady===')
    if (location.hostname.includes("autonet.pro")) {
        // Если зарегистрировались на сайте автосеть
        let nameAccount = localStorage.getItem('name');
        if (nameAccount) {
            chrome.runtime && chrome.runtime.sendMessage({"action": "setOperator", nameAccount}); // сообщаем расширению о готовности
            sendResponse('autoNetProReady');
            return false
        }
    }
    if (location.pathname.includes("/avtomobili")) {
        // chrome.runtime.sendMessage({"action": "readyAvito", "state": "ready"});
        // сообщаем расширению о готовности, наверно могли бы сразу с разных страниц начинать отправлять данные сразу
        sendResponse('avitoReady');
    }
}


if ('serviceWorker' in navigator) console.log('serviceWorker заработал')

// Для периодического обновления кнопка
// document.querySelector('[data-marker="search-filters/submit-button"]')



