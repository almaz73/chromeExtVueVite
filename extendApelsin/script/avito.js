console.log('- - - - - - - - -content2 - - - - - -')

function getAvitoData() {
    console.log('s.e.n.d.R.e.s.p.o.n.s.e.')
    // со страниц https://www.avito.ru/kazan/avtomobili вытягивает заголовки, контент и id
    let fields = document.querySelectorAll('[data-marker="item"]')

    let data = []
    fields.forEach(el => {
        let id, head, content, title, photo, price, link, time, text, diler, specific, corresponds;
        try {
            id = el.id
        } catch (e) {
        }
        try {
            head = el.querySelector(".iva-item-titleStep-pdebR > div > a").textContent
        } catch (e) {
        }
        try {
            content = el.querySelector('meta').content
        } catch (e) {
        }
        try {
            title = el.querySelector(".iva-item-titleStep-pdebR > div > a").title
        } catch (e) {
        }
        try {
            photo = el.querySelector('[data-marker="item-photo"] img').src
        } catch (e) {
        }
        try {
            text = el.querySelector('.iva-item-body-KLUuy').childNodes[5].textContent
        } catch (e) {
        }
        try {
            corresponds = el.querySelector('.iva-item-body-KLUu----------y').childNodes[3].textContent
        } catch (e) {
        }
        try {
            price = el.querySelector('[data-marker="item-price"]').querySelector('[itemprop="price"]').content
        } catch (e) {
        }
        try {
            link = el.querySelector('[itemprop="url"]').href
        } catch (e) {
        }
        try {
            time = el.querySelector('[data-marker="item-date/tooltip/reference"]').textContent
        } catch (e) {
        }
        try {
            diler = el.querySelector('[data-marker="item-line"]').textContent
        } catch (e) {
        }
        try {
            specific = el.querySelector('[data-marker="item-specific-params"]').textContent
        } catch (e) {
        }


        data.push({id, title, content, head, photo, price, link, time, text, diler, specific, corresponds})
    })


    chrome.runtime.sendMessage({"action": "openOptionsPage"}); // открываю вкладку опций
    chrome.runtime.sendMessage({"action": "showData", data}); // передаю все данные


    console.log('пока не работает . фокусируюсь fields[0]', fields[0])
    fields[0].focus()
    fields[0].querySelectorAll('button')[1].click()
    console.log('НАЖАЛ ОТКРЫТИЕ ТЕЛЕФОНА')
}