console.log('- - - - - - - - -content2 - - - - - -')
let telefons=''
function getAvitoData() {
    console.log('s.e.n.d.R.e.s.p.o.n.s.e.')
    // со страниц https://www.avito.ru/kazan/avtomobili вытягивает заголовки, контент и id
    let data = []
    let fields = document.querySelectorAll('[data-marker="item"]')
    let count = 0
    fields && fields.forEach(el => {
        count++
        if (count > 15) return false

        let id, head, content, title, photo, price, link, time, text, diler, specific, corresponds, tel;
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
        try {
            tel = el.querySelector('[data-marker="item-contact"] img').src
        } catch (e) {
        }
        try {
            corresponds = el.querySelectorAll('span')[2].textContent
        } catch (e) {
        }
        document.querySelectorAll('[data-marker="item"]')[2].querySelectorAll('span')[2]

        data.push({id, title, content, head, photo, price, link, time, text, diler, specific, corresponds, tel})
    })


    console.log('ОТПРАВЛЯЮ ОТПРАВЛЯЮ ОТПРАВЛЯЮ , ', data)
    chrome.runtime && chrome.runtime.sendMessage({"action": "showData", data}); // передаю все данные


}


/**
 * Нахожу без фото -  прокручиваю к нему
 */
// function findWithoutPhoto() {
//     window.DDD =data
//     console.log('data', data)
//     let elementWitoutPhoto = data.find(el=>!el.photo)
//     console.log('> > > elementWitoutPhoto', elementWitoutPhoto)
//     toScrollIntoView(elementWitoutPhoto.id.toString())
// }
//
// function toScrollIntoView(id) {
//     console.log('id', id, typeof id)
//     const hiddenElement = document.getElementById(id);
//     // console.log('hiddenElement', hiddenElement)
//     hiddenElement.scrollIntoView({block: "center", behavior: "smooth"});
// }

let countTel = 0
let pereskok = 0

function getPhone() {
    console.log('telefons', telefons)


    countTel++
    console.log('countTel', countTel)
    // if (countTel == 3) getAvitoData();
    if (countTel > 4) {

        console.log(' ИДЕМ НА последнюю ОПРАВКУ С ТЕЛЕФОНАМИ')
        return getAvitoData();
    }
    let divs = document.querySelectorAll('[data-marker="item-phone-button/undefined"]')

    if (divs && divs[0]) {
        // тут если если телефон есть перескакиваем
        if (telefons && telefons.includes(divs[pereskok].closest('[data-marker="item"]').id)) {
            console.log('П Е Р Е С К А К И В А Е М')
            pereskok++
            getPhone();
            return false
        }
        else {
            // КЛИКАЕМ ВЫЩИПЫВАЕМ ТЕЛЕФОНЫ
            console.log('К Л И К  А  Е  М ВЫЩИПЫВАЕМ ТЕЛЕФОНЫ pereskok', pereskok)
             // getPhone(); // временоо чтобы быстро
           divs[pereskok].click()
        }
    }
    setTimeout(() => getPhone(), parseInt(Math.random() * 5) * 1000 + 3000)
}

