export function weblink(link) {
    if (!link) return {}

    const car = link.split('/').pop().split('_');
    let line = ''
    let capacity = ''
    let brand = '';
    let model = '';
    let year = '';

    car.pop();

    ['amt', 'at', 'mt', 'cvt'].forEach((type) => {
        if (car.includes(type)) {
            let place = car.indexOf(type)
            if (type === 'at' && !Number.isFinite(+car[place - 1])) return capacity = car.splice(+place, 1)
            capacity = car.splice(place - 1, 2)
        }
    })

    if (car.includes('km')) {
        let placeYear = car.findLastIndex((el) => el.match(/\b\d{4}\b/g))
        let placeKM = car.indexOf('km')
        let count = 0
        for (let i = placeYear + 1; i < placeKM; i++) {
            count++
            line = line + car[i]
        }
        for (let i = 0; i < count + 1; i++) {
            car.pop()
        }
    }

    year = car.pop();

    if ((car[0] === 'tesla' && car[1] === 'model') ||
        (car[0] === 'gaz' && car[1] === 'gazel')) {
        car[1] = car[1] + car[2]
        car.pop()
    }


    if (car.length > 2) brand = car.splice(0, 2);
    else brand = car.splice(0, 1);
    model = car;
    console.log('::: brand', brand)
    console.log('::: model', model)
    console.log('::: year', year)
    console.log('::: capacity', capacity)
    console.log('::: line', line)


    return {brand, model, year, capacity, line}

}



export async function attempt1() {
    const response = await fetch('https://dev.autonet.pro/api/comment//', {
        headers: {'content-type': 'application/json;charset=UTF-8'},
        method: 'POST',
        body: '{"text":' + Date.now() + ',"EntityId":391850,"entityType":20}',
    })
    if (response.ok) {
        console.log('ОК', response)
    } else {
        alert(`Ошибка HTTP: ${response.status}`)
    }
}



export async function attempt2() {
    const response = await fetch('https://dev.autonet.pro/api/communication/callCenterCommunication?id=', {
        headers: {'content-type': 'application/json;charset=UTF-8'},
        method: 'POST',
        "body": "{\"workflow\":{\"source\":10,\"auto\":{},\"workflowLeadType\":2,\"BuyCategory\":10,\"carBrand\":\"ВАЗ (LADA)\",\"brandId\":255,\"carModelId\":2685,\"locationId\":0},\"lead\":{\"source\":10,\"person\":{\"phone\":\"23232323\",\"firstName\":\"Алмаз\",\"email\":\"almaz73@gmail.com\",\"lastName\":\"Файзрахманов\"},\"leadId\":0,\"leadType\":10},\"communication\":{\"callType\":10,\"type\":10,\"sourceId\":15,\"city\":\"Казань\"}}",
    })

    if (response.ok) {
        console.log('ОК', response)
    } else {
        alert(`Ошибка HTTP: ${response.status}`)
    }

}


/**
 * Буду добавлять новые порции, нужно удалить устаревшие
 */
export function updateData(data, avitoData, avitoDataFiltered) {
    Object.assign(avitoData.value, data)
    console.log('LENGTH = ', avitoData.value.length)
    avitoDataFiltered.value = [...avitoData.value]
}