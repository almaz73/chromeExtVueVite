// пока не задействовано
function answerAccountName(val) {
    console.log(' пришел ответ answerAccountName> > > val', val)
    if (val && val !== 'null' && val !== true) operatorName.value = val
}

function answerAutoList(val) {
    // получает данные из сайта
    if (!chrome.runtime.lastError) {
        if (val) {
            avitoData.value = val
            avitoDataFiltered.value = [...avitoData.value]
        }
    }
}

function keep(item) {
    // нужно сохранить в локалстораж
    // перечесркнуть текст
    // и чтобы при повторном открытии эту обрабтку показать
    if (useIds.value.includes(item.id)) useIds.value = useIds.value.filter(el => el !== item.id)
    else useIds.value.push(item.id)

    localStorage.setItem('IDS', useIds.value.join(','))

    // Тут нужно отправить id, чтобы сообщить остальным что обьявление обработано
    keepInBD(item.id)
}

function keepInBD() {
    console.log('keepInBD')
}

function toActive(id) {
    if (activeItem.value !== id) activeItem.value = id
    else activeItem.value = null
}