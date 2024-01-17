chrome.runtime.onMessage.addListener( // this is the message listener
    function (request, sender, sendResponse) {
        console.log('>>получил запрос от расширения>' + request);

        switch (+request.split('.')[0]) {
            case 1:
                getAvitoData(sendResponse) // с текущей страницы отдаются найденные данные
                break
            case 2:
                getAccount(sendResponse);
                break
            case 3:
                setClosePosition(request.split('.')[1]);
                break
            default:
                toScrollIntoView(request);
        }
    }
);


function toScrollIntoView(id) {
    var hiddenElement = document.getElementById(id);
    hiddenElement.scrollIntoView({block: "center", behavior: "smooth"});
}


function getAvitoData(sendResponse) {
    console.log('s.e.n.d.R.e.s.p.o.n.s.e.')
    // со страниц https://www.avito.ru/kazan/avtomobili вытягивает заголовки, контент и id
    let fields = document.querySelectorAll('[data-marker="item"]')

    let data = []
    fields.forEach(el => {
        let id, head, content, title, photo, price, link, time, text, diler, specific, corresponds;
        id = el.id
        head = el.querySelector(".iva-item-titleStep-pdebR > div > a").textContent
        content = el.querySelector('meta').content
        title = el.querySelector(".iva-item-titleStep-pdebR > div > a").title
        photo = el.querySelector('[data-marker="item-photo"] img').src
        price = el.querySelector('[data-marker="item-price"]').querySelector('[itemprop="price"]').content
        link = el.querySelector('[itemprop="url"]').href
        time = el.querySelector('[data-marker="item-date/tooltip/reference"]').textContent
        diler = el.querySelector('[data-marker="item-line"]').textContent
        specific = el.querySelector('[data-marker="item-specific-params"]').textContent
        try {
            text = el.querySelector('.iva-item-body-KLUuy').childNodes[5].textContent
            corresponds = el.querySelector('.iva-item-body-KLUu----------y').childNodes[3].textContent
        } catch (e) {
        }


        data.push({id, title, content, head, photo, price, link, time, text, diler, specific, corresponds})
    })


    sendResponse(data);

    chrome.runtime.sendMessage({"action": "openOptionsPage"}); // открываю вкладку опций
    chrome.runtime.sendMessage({"action": "showData", data}); // передаю все данные

    fields[0].focus()
    fields[0].querySelectorAll('button')[1].click()
    console.log('НАЖАЛ ОТКРЫТИЕ ТЕЛЕФОНА')
}

function getAccount(sendResponse) {
    // с сайта https://dev.autonet.pro/ вытягивает имя зарегистрированного аккунта
    let nameAccount = localStorage.getItem('name')
    console.log('= = =с сайта dev.autonet.pro 3333333333333333 = nameAccount', nameAccount)
    if (!nameAccount) {
        nameAccount = location.pathname.includes("/avtomobili")
        console.log(' ? ? ? nameAccount', nameAccount)
    }
    sendResponse(nameAccount);

    chrome.runtime.sendMessage({"action": "setOperator", nameAccount}); // сообщаем расширению о готовности

}


if ('serviceWorker' in navigator) console.log('serviceWorker заработал')

// Для периодического обновления кнопка
// document.querySelector('[data-marker="search-filters/submit-button"]')



