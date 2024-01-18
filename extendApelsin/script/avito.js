console.log('- - - - - - - - -content2 - - - - - -')
let data = []
function getAvitoData() {
    console.log('s.e.n.d.R.e.s.p.o.n.s.e.')
    // со страниц https://www.avito.ru/kazan/avtomobili вытягивает заголовки, контент и id
    let fields = document.querySelectorAll('[data-marker="item"]')

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
            console.log('>>>> photo', photo)
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


    chrome.runtime.sendMessage({"action": "showData", data}); // передаю все данные


    // пока не заработало, не ловит фокус
    // console.log('пока не работает . фокусируюсь fields[0]', fields[0])
    // fields[0].focus()
    // fields[0].querySelectorAll('button')[1].click()
    // console.log('НАЖАЛ ОТКРЫТИЕ ТЕЛЕФОНА')

    findWithoutPhoto()
    setTimeout(()=>{
        getAvitoData()
    }, 15000) // овторяем

}


/**
 * Нахожу без фото -  прокручиваю к нему
 */
function findWithoutPhoto() {
    window.DDD =data
    console.log('data', data)
    let elementWitoutPhoto = data.find(el=>!el.photo)
    console.log('> > > elementWitoutPhoto', elementWitoutPhoto)
    toScrollIntoView(elementWitoutPhoto.id.toString())
}

function toScrollIntoView(id) {
    console.log('id', id, typeof id)
    const hiddenElement = document.getElementById(id);
    // console.log('hiddenElement', hiddenElement)
    hiddenElement.scrollIntoView({block: "center", behavior: "smooth"});
}


