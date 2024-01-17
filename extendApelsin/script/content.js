chrome.runtime.onMessage.addListener( // this is the message listener
    function (request, sender, sendResponse) {
        console.log('>>получил запрос от расширения>' + request);

        switch (+request.split('.')[0]) {
            case 1:
                if (location.pathname.includes("/avtomobili")) getAvitoData()
                break
            case 2:
                wichPageReady(sendResponse);
                break
            case 3:
                setClosePosition(request.split('.')[1]);
                break
            default:
                toScrollIntoView(request);
        }

        return true
    }
);


function toScrollIntoView(id) {
    var hiddenElement = document.getElementById(id);
    hiddenElement.scrollIntoView({block: "center", behavior: "smooth"});
}


function wichPageReady(sendResponse) {
    console.log('===wichPageReady===')
    if (location.hostname.includes("autonet.pro")) {
        // Если зарегистрировались на сайте автосеть
        let nameAccount = localStorage.getItem('name');
        if (nameAccount) {
            chrome.runtime.sendMessage({"action": "setOperator", nameAccount}); // сообщаем расширению о готовности
            sendResponse('autoNetProReady');
            console.log('===wichPageReady===')
        } else {

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



