chrome.runtime.onMessage.addListener( // this is the message listener
    function (request, sender, sendResponse) {
        console.log('>>получил запрос request>' + request);
        console.log('>>фнукция колбек sendResponse>' + sendResponse);


        // if (request.length > 12) getData(sendResponse)
        // else toScrollIntoView(request)

        switch (+request.split('.')[0]) {
            case 1:
                console.log(' - - - - - - --')
                getData(sendResponse)

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


function getData(sendResponse) {
    console.log('sendResponse')
    // со страниц https://www.avito.ru/kazan/avtomobili вытягивает заголовки, контент и id
    let fields = document.querySelectorAll('[data-marker="item"]')

    let data = []
    fields.forEach(el => {
        let id, head, content, title, photo, price, link;
        id = el.id
        head = el.querySelector(".iva-item-titleStep-pdebR > div > a").textContent
        content = el.querySelector('meta').content
        try {
            title = el.querySelector(".iva-item-titleStep-pdebR > div > a").title
            photo = el.querySelector('[data-marker="item-photo"] img').src
            price = el.querySelector('[data-marker="item-price"]').querySelector('[itemprop="price"]').content
            link = el.querySelector('[itemprop="url"]').href
        } catch (e) {
        }



        data.push({id, title, content, head, photo, price, link})
    })

    sendResponse(data);

    chrome.runtime.sendMessage({"action": "openOptionsPage"}); // открываю вкладку опций
    chrome.runtime.sendMessage({"action": "showData", data}); // передаю все данные
}

function getAccount(sendResponse) {
    // с сайта https://dev.autonet.pro/ вытягивает имя зарегистрированного аккунта
    let nameAccount = localStorage.getItem('name')
    console.log('= = =с сайта dev.autonet.pro 3333333333333333 = nameAccount', nameAccount)
    if (!nameAccount) {
        nameAccount = location.pathname === "/kazan/avtomobili"
        console.log(' ? ? ? nameAccount', nameAccount)
    }
    sendResponse(nameAccount);

    chrome.runtime.sendMessage({"action": "setOperator", nameAccount}); // открываю вкладку опций

}


if ('serviceWorker' in navigator) console.log('serviceWorker заработал')



