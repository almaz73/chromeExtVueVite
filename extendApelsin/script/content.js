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
    // со страниц https://www.avito.ru/kazan/avtomobili вытягивает заголовки, контент и id
    let fields = document.querySelectorAll('[data-marker="item"]')

    let data = []
    fields.forEach(el => {
        let id = el.id
        let title = el.querySelector(".iva-item-titleStep-pdebR > div > a").title
        let content = el.querySelector('meta').content
        data.push({id, title, content})
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

// function setClosePosition(id) {
//     // сохраним в базе id обявления, чтобы отметить что обработано
//     let payload = {
//         "EntityId": 391867,
//         "entityType": 20,
//         "text": id
//     }
//     fetch("https://dev.autonet.pro/api/comment//", {
//         "headers": {
//             "accept": "application/json, text/plain, */*",
//             "content-type": "application/json;charset=UTF-8",
//             "sec-fetch-mode": "cors",
//             "sec-fetch-site": "same-origin",
//             "x-requested-with": "XMLHttpRequest"
//         },
//         "referrer": "https://dev.autonet.pro/",
//         "referrerPolicy": "strict-origin-when-cross-origin",
//         "body": payload,
//         "method": "POST",
//         "mode": "no-cors",
//         "credentials": "include"
//     });
//
// }


if ('serviceWorker' in navigator) console.log('serviceWorker заработал')



