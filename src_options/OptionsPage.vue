<template>
  <main>
    <div style="text-align: center; ">
      <div style="position: absolute; right: 40px;text-align: right; display: flex; align-items: center">

        <el-radio-group @click="toggleDark()">
          <el-radio-button label="Темная тема"/>
          <el-radio-button label="Светлая тема"/>
        </el-radio-group>
        &nbsp; &nbsp; &nbsp;

        Оператор: {{ operatorName }}<br>

      </div>

      <div>

        <h1>Операторская</h1>
        <p>Обработка обьявлений.
          <a href="#" @click="isDescription=!isDescription" style="font-size: smaller">Подробнее..</a>
        </p>

        <div>
          <a href="#" style="font-size: small" @click="isDev=!isDev">Что нужно сделать</a>
          <div style="text-align: left" v-if="isDev">
            <ul>
              <li>Отображение отклонения цены от рынка (На больших данных среднюю цену рассчитать)</li>
              <li>Онлайн обновление</li>
              <li>Без дублей, если открывает DROM AVTO AVITO</li>
              <li>Сообщение, если уже снято с продажи</li>
              <li>Хранить ссылку, для открывания на сайте</li>
              <li>Показ частник/дилер</li>
              <li>Показать сколько обьявлений у продовца (дилер не дилер)</li>
            </ul>
            <button @click="attempt1()">Попытка сохранить комментарий</button>
            <button @click="attempt2()">Попытка создатьт обращение</button>
          </div>


        </div>


        <div v-if="isDescription" style="text-align: left">
          <p>https://dev.autonet.pro/#/appeal/391850</p>
          <h3 @click="isReady=!isReady" style="cursor: pointer">Что уже умеет</h3>
          <ul v-if="isReady">
            <li>Работает с сайтом Авито (<a href="avito.ru/kazan/avtomobili?radius=100">
              avito.ru/kazan/avtomobili?radius=100)</a></li>
            <li>Может получить данные с сайта и построить краткий список</li>
            <li>При нажатии текста списка, отображает доп.данные</li>
            <li>При нажатие на иконку автомобиля, прокручивает сайт до данного обьявления</li>
            <li>Имеет поле фильтрации, которая работает по вхождению слов, чисел</li>
          </ul>
          <h3 @click="isFuture=!isFuture" style="cursor: pointer">Что еще можно сделать</h3>
          <ul v-if="isFuture">
            <li> При нажатии галочки "Взять на обработку" в нужно сохранить в базу кто и что и когда взял на обработку,
              который будет
              потом отображена у всех опереторов, предотвращая двойную обработку.
            </li>
            <li>При обработке, оператор может писать комментарии типа: автовладелец готов приехать на осмотр/ попросил
              перезводинть позже/не подходит для нас, закредитован.
            </li>
            <li>Список обработанных данных можно сразу включить в состав программы, для анализа и повторного
              использования
            </li>
            <li>Через плагин можно настроить управление фильтрами авито</li>
            <li>Плагин можно привязать к аккаунту оператора, и ставить задания удаленно прямо в плагин</li>
          </ul>
        </div>
      </div>
    </div>


    <br><br>
    <div v-if="avitoData.length" style="max-width: 1200px; margin: auto;">
      <div v-if="avitoData.length" style="text-align: right; margin: 4px 0; opacity: .5">
        <small>Фильтрация по слову:
          <input v-model="filtertext" @input="search()">
        </small>
      </div>
      <el-table
          ref="tableRef"
          row-key="date"
          border
          height="650"
          highlight-current-row
          :row-class-name="tableRowClassName"
          :data="avitoDataFiltered"
          style="width: 100%">


        <el-table-column prop="time" label="time" width="80"/>
        <el-table-column prop="diler" label="diler" width="140">
          <template #default="scope">
            <div> {{ scope.row.diler }}</div>
            <div style="color: green">
              {{scope.row.text && scope.row.text.includes('Соответствует оценке')?'Соответствует оценке':''}}
            </div>
          </template>
        </el-table-column>


        <el-table-column label="Обьявления">
          <template #default="scope">
            <a :href="scope.row.title.lonk">{{ scope.row.title }}</a>
          </template>
        </el-table-column>
        <el-table-column label="Цена, руб" width="90">
          <template #default="scope">
            <div style="float: right">
              {{ scope.row.price && (+scope.row.price).toLocaleString('ru-RU') }}
            </div>
          </template>
        </el-table-column>

        <el-table-column label="Тел.">
          <template #default="scope">
            <img v-if="scope.row.tel" :src="scope.row.tel" style="width: 200px; height: 30px"/>
          </template>
        </el-table-column>

        <el-table-column label="Обработка" width="170">
          <template #default="scope">
            <label><input type="checkbox"> Обработан</label> &nbsp;&nbsp;

            <span style="cursor: pointer" @click="openModal(scope.row)">&nbsp;&nbsp;✏️</span>
          </template>
        </el-table-column>
      </el-table>

    </div>

    <ModalParams :currentRow="currentRow" :isOpen="isOpen" :currentParams="currentParams" @closeModal="closeModal"/>

  </main>
</template>
<style>
.el-table .warning-row {
  --el-table-tr-bg-color: var(--el-color-warning-light-9);
}

.el-table .success-row {
  --el-table-tr-bg-color: var(--el-color-success-light-9);
}

a {
  text-decoration: none;
  color: black;
}


.dark a {
  color: white;
}

a:hover, .dark a:hover {
  text-decoration: underline;
  color: blue;
}

.dark a:hover {
  color: #9999ff;
}

</style>

<script setup>
import {ref, watch} from "vue";
import {useDark, useToggle} from '@vueuse/core'
import {weblink, attempt1, attempt2} from "./composables/commonFunctions.js";
import ModalParams from "./ModalParams.vue";

const isDark = useDark()
const toggleDark = useToggle(isDark)
const avitoData = ref([])
const avitoDataFiltered = ref([])
const activeItem = ref(null)
const filtertext = ref('')
const isFuture = ref(true)
const isReady = ref(true)
const operatorName = ref('')
const isDescription = ref(false)
const isDev = ref(false)
const isOpen = ref(false)
const currentRow = ref('')
const currentParams = ref({brand: '33'})


const openModal = (row) => {
  currentRow.value = row
  isOpen.value = !isOpen.value
}

watch(currentRow, function () {
  currentParams.value = weblink(currentRow.value.link)
})

watch(avitoData, () => {
      let oldTel = localStorage.getItem('BARABAN_TELEFON')
      if (oldTel) {
        oldTel = JSON.parse(oldTel)
        console.log('oldTel', oldTel)

        avitoData.value.map(el => {
          let row = oldTel.find(item => item.id == el.id)
          console.log('row', row)

          if (row) el.tel = row.tel
        })
        console.log('В С П О М Н И Л')

      }


      let telBaza = []
      avitoData.value.forEach(el => {
        if (el.tel) telBaza.push({id: el.id, tel: el.tel})
      })
      console.log('telBaza', telBaza)
      if (telBaza.length) localStorage.setItem('BARABAN_TELEFON', JSON.stringify(telBaza))
      else {
        telBaza = [{
          "id": "i3565929340",
          "tel": "data:image/png;base64,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"
        },
          {
            "id": "i3565929342",
            "tel": "data:image/png;base64,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"
          }]
        // todo localStorage.setItem('BARABAN_TELEFON', JSON.stringify(telBaza))
      }
    }
)

const closeModal = () => isOpen.value = false

const tableRowClassName = ({row, rowIndex,}) => {

  if (rowIndex === 1) return 'warning-row'
  else if (rowIndex === 3) return 'success-row'
  return ''
}


chrome.runtime && chrome.runtime.onMessage.addListener(function (message) {

  switch (message.action) {
    case "pass":
    case "showData":

      console.log('ВСЕ ДАННЫЕ ПОЛУЧИЛ - периодически', message);

      if (message && message.data && message.data.length) {
        avitoData.value = message.data
        avitoDataFiltered.value = [...message.data]
      }

      if (message.nameAccont) operatorName.value = message.nameAccont
      break
    default:
      console.log('DEFAULT Не обработанные message=', message)
  }
  return true
})


if (!chrome.tabs) {
  // для локальной настройки
  avitoData.value = JSON.parse('[{"diler":"Автодилер","time":"3 часа назад","id":"i3409068315","price":"736923","link":"https://www.avito.ru/kazan/avtomobili/volkswagen_tiguan_2.0_at_2013_138_289_km_3645932601","title":"Новый УАЗ 2206 2.7 MT, 2023, цена от 1 188 000 руб. - Автомобили в Казани","content":"Уаз Сгр Автобус 2023 г. В.\\n\\n- В наличии есть различные цвета и комплектации.\\n\\nФинансовые Услуги:\\n\\nКредитование.\\n\\nОформим без первоначального взноса Оформим 2 документам за 1 один день Дистанционная подача документов на одобрение кредита 9 банков-партнеров."},{"id":"i3601532031","title":"Новый УАЗ Pickup 2.7 MT, 2023, цена от 1 467 200 руб. - Автомобили в Казани","content":"Уaз Пикап Вasе Иkар 2023 г. В.\\n\\n- В нaличии eсть различныe цвeтa и кoмплeктaции.\\n\\nДополнительныe опции:\\n\\n- Koвpы в салон.\\n\\nФинансовые Услуги:\\n\\nКредитование.\\n\\nОформим без первоначального взноса Оформим 2 документам за 1 один день Дистанционная подача докуме"},{"id":"i3408880048","title":"Новый УАЗ 3741 2.7 MT, 2023, цена от 1 124 000 руб. - Автомобили в Казани","content":"Уаз 374195 (остекленный фургон) 2023 г. В.\\n\\n- Варианты салона: 5 мест, 2 места + откидные лавки.\\n\\nРазмеры грузового отсека (дхшхв), мм — 2733х1818х1317.\\n\\nФинансовые Услуги.\\n\\nКредитование.\\n\\nОформим без первоначального взноса.\\nОформим 2 документам за 1 один "},{"id":"i3769652662","title":"Новый BAIC X35 1.5 CVT, 2023, цена от 2 000 000 руб. - Автомобили в Ульяновске","content":"Новoгоднеe cпец. Предложениe только до 31.12.2023!\\n\\n- Выгoда дo 300 000₽*.\\n\\n- Aвтоpaсcpoчкa 0%*.\\n\\nАрмада-Авто — официальный дилер Baic.\\n\\nBaic X35 — Динамика И Управляемость!\\n\\nСтильные цвета кузова подчеркивают яркий дизайн Baic X35.\\n\\nРасполагайтесь с комфо"},{"id":"i3514103919","title":"Новый BAIC U5 Plus 1.5 CVT, 2023, цена от 1 745 000 руб. - Автомобили в Ульяновске","content":"Новoгоднеe cпец. Предложениe только до 31.12.2023!\\n\\n- Выгoда дo 300 000₽*.\\n\\n- Aвтоpaсcpoчкa 0% Срок рассрочки 12 мес., с возможностью увеличения до 18 месяцев. Первый взнос от 0%. *.\\n\\nАрмада-Авто — официальный дилер Baic.\\nBaic U5 Plus — Это Практичность И "},{"id":"i3513939240","title":"Новый BAIC U5 Plus 1.5 CVT, 2023, цена от 1 745 000 руб. - Автомобили в Ульяновске","content":"Новoгоднеe cпец. Предложениe только до 31.12.2023!\\n\\n- Выгoда дo 300 000₽*.\\n\\n- Aвтоpaсcpoчкa 0% Срок рассрочки 12 мес., с возможностью увеличения до 18 месяцев. Первый взнос от 0%. *.\\n\\nАрмада-Авто — официальный дилер Baic.\\nBaic U5 Plus — Это Практичность И "},{"id":"i3518262676","title":"Kia Rio X 1.6 AT, 2021, 27 000 км, с пробегом, цена 1 895 000 руб. - Автомобили в Ульяновске","content":"Суперпредложение в салонах Автобери — авторассрочка на все авто с пробегом!\\n\\nПродается Kia Rio X.\\nТехнически в хорошем состоянии.\\nГарантия до 2-х лет!\\n\\nКомплектация:\\nУсилитель руля.\\n4 электростеклоподъёмника.\\nЭлектрорегулировка зеркал.\\nШтатная аудиосистема"},{"id":"i3770240518","title":"Новый BAIC U5 Plus 1.5 CVT, 2023, цена от 2 015 000 руб. - Автомобили в Ульяновске","content":"Hовогоднee cпец. Предложениe толькo до 31.12.2023!\\n\\n- Выгoдa до 300 000₽*.\\n\\n- Aвтopaccpoчкa 0% Срок pаccpoчки 12 мeс., c вoзмoжноcтью увeличeния до 18 мecяцeв. Пepвый взноc oт 0%. *.\\n\\nApмада-Автo — oфициальный дилер Ваiс.\\nBаic U5 Рlus — Эto Практичность И "},{"id":"i3601601418","title":"Новый УАЗ Pickup 2.7 MT, 2023, цена от 1 480 000 руб. - Автомобили в Казани","content":"Уaз Пикап Вasе Иkар 2023 г. В.\\n\\n- В нaличии eсть различныe цвeтa и кoмплeктaции.\\n\\nДополнительныe опции:\\n\\n- Koвpы в салон.\\n\\nФинансовые Услуги:\\n\\nКредитование.\\n\\nОформим без первоначального взноса Оформим 2 документам за 1 один день Дистанционная подача докуме"},{"id":"i3514537788","title":"Новый BAIC U5 Plus 1.5 CVT, 2023, цена от 1 745 000 руб. - Автомобили в Ульяновске","content":"Новoгоднеe cпец. Предложениe только до 31.12.2023!\\n\\n- Выгoда дo 300 000₽*.\\n\\n- Aвтоpaсcpoчкa 0%*.\\nСрок рассрочки 12 мес., с возможностью увеличения до 18 месяцев. Первый взнос от 0%. *.\\n\\nАрмада-Авто — официальный дилер Baic.\\nBaic U5 Plus — Это Практичность "},{"id":"i3730883861","title":"Kia Rio 1.6 MT, 2013, 154 802 км, с пробегом, цена 889 000 руб. - Автомобили в Казани","content":"Преимущества Автомобиля:\\n1 владелец.\\nПтс оригинал.\\nКоличество ключей 1.\\nАвтомобиль прошел полную техническую проверку. Предоставляем результат диагностики.\\n\\nДополнительно установлено:\\nСигнализация с обратной связью.\\nЗащита картера.\\nТонировка.\\n\\nЗвоните прям"},{"id":"i3409472538","title":"Новый УАЗ 3909 2.7 MT, 2023, цена от 1 124 000 руб. - Автомобили в Казани","content":"Уаз 390995 (грузопассажирский фургон) 2023 г. В.\\n\\n- Варианты салона: 5 мест, 7 мест.\\n\\nФинансовые Услуги.\\n\\nКредитование.\\n\\nОформим без первоначального взноса.\\nОформим 2 документам за 1 один день.\\nДистанционная подача документов на одобрение кредита.\\n9 банков"},{"id":"i3614475991","title":"MINI Cooper S Countryman 1.6 AT, 2011, 103 535 км, с пробегом, цена 1 460 000 руб. - Автомобили в Ульяновске","content":"В продаже Mini Countryman Cooper S 2011 г. В.!\\nАвтомобиль в отличном состоянии!\\n\\nПодтвержденный пробег!\\nПтс оригинал!\\n\\nБогатая комплектация Cooper S All4:\\n4 электростеклоподьемника.\\nКлимат-контроль 2-зонный.\\nМультимедийная система.\\nУправление аудиосистемой"},{"id":"i3612900530","title":"Kia Rio X-Line 1.6 AT, 2018, 69 293 км, с пробегом, цена 1 469 000 руб. - Автомобили в Нижнекамске","content":"Продленная гарантия на 3 года в подарок.\\n\\nВнимание Розыгрыш!\\nСтаньте участником розыгрыша от Диалог Авто и выиграйте Автомобиль!\\nПриз — экономичный и комфортабельный Opel Astra G.\\nПобедитель будет объявлен 23 февраля.\\nУсловия участия уточняйте по телефону."},{"id":"i3666788621","title":"Kia K5 2.0 AT, 2020, 77 000 км, с пробегом, цена 2 800 000 руб. - Автомобили в Казани","content":"Киа К5 2020г. Чистокровная корейская.\\n\\nПривезенная из Южной Кореи.\\n\\nСейчас в Казани. Документы уже имеются на авто.\\n\\nПробег 77000км.\\n\\n2.0л.\\n\\nПред максимальная комплектация.\\n\\nКомплект зимних шин, ран флэт.\\n\\nСостояние отличное. Ухоженная. Чистая, без Дтп.\\n\\nК"},{"id":"i2766270443","title":"ВАЗ (LADA) Vesta 1.6 MT, 2017, 225 000 км, с пробегом, цена 799 999 руб. - Автомобили в Чебоксарах","content":"Цена ДО Конца Праздников!\\nЯ второй владелец! Пробег 90% Трасса. Не такси! Работаю в соседнем регионе. Кузов весь в оригинале! Не бита не крашена. Кожаный руль. Без ключевой доступ с автозапуском старт стоп кнопка. Мультимедиа 6 колонок. Регулировка вод. Си"},{"id":"i3449090496","title":"ВАЗ (LADA) XRAY 1.6 MT, 2019, 63 773 км, с пробегом, цена 970 000 руб. - Автомобили в Казани","content":"Ваз Xray I 1.6 MT (106 л. С.) Хэтчбек 5 дв. 2019 года.\\n\\nПреимущества:\\n- Гарантия Ттс.\\n- Заводской окрас кузова.\\n- Птс оригинал.\\n- Оригинальный пробег.\\n- Количество владельцев: 1.\\n\\nКомплектация: Электростеклоподъемники; Усилитель рулевого управления.\\n\\nЧестн"},{"id":"i3418399178","title":"Ford Explorer 3.5 AT, 2013, 170 000 км, с пробегом, цена 1 850 000 руб. - Автомобили в Казани","content":"Продаю реально живой Ford Explorer в комплектации спорт. Большая 7-ми местная динамичная машина. По машине технически в идеале. Много, что было сделано. Из основных замена всех цепей Грм, помпа, акктуаторы (все оригинал), установлены Bi-Led линзы Dixel, пр"},{"id":"i3677492393","title":"ВАЗ (LADA) Granta 1.6 MT, 2017, 90 049 км, с пробегом, цена 576 000 руб. - Автомобили в Нижнекамске","content":"Продленная гарантия на 3 года в подарок.\\n\\nВнимание Розыгрыш!\\nСтаньте участником розыгрыша от Диалог Авто и выиграйте Автомобиль!\\nПриз — экономичный и комфортабельный Opel Astra G.\\nПобедитель будет объявлен 23 февраля.\\nУсловия участия уточняйте по телефону."},{"id":"i3630300906","title":"Nissan Qashqai 1.6 CVT, 2013, 136 606 км, с пробегом, цена 1 275 000 руб. - Автомобили в Казани","content":"Продам Nissan Qashqai, купленый в 2013 году у официального дилера. Сборка Великобритания, Пилкинстон. Отличная предтоповая комплектация SE+ с камерой заднего вида, штатной навигацией и большим дисплеем. Один некурящий хозяин, аккуратное вождение по хорошим"},{"id":"i3496202232","title":"Hawtai Boliger 1.8 AT, 2015, 100 367 км, с пробегом, цена 698 000 руб. - Автомобили в Новочебоксарске","content":"Автомобиль в образе Порше каена. В отличном техническом состоянии. Автомат не пинает переключает плавно. Мотор работает хорошо. Ходовка от хендай Санта фе что очень надежно. Опрятный не прокуренный салон. Люк работает во всех положениях. Хорошее состояние "},{"id":"i3613797327","title":"Skoda Fabia 1.2 AMT, 2012, 67 101 км, с пробегом, цена 1 020 000 руб. - Автомобили в Ульяновске","content":"Супер предложение в салонах Автобери- авто рассрочка на все авто с пробегом!\\n\\nПродается Skoda Fabia 2012.\\nТехнически в хорошем состоянии.\\nГарантия до 2-х лет!\\n\\nКомплектация:\\n4 электростеклоподъёмника.\\nПодогрев передних сидений.\\nКондиционер.\\nЗадние партрони"},{"id":"i3508856328","title":"ВАЗ (LADA) Vesta 1.6 MT, 2020, 128 000 км, с пробегом, цена 1 079 000 руб. - Автомобили в Чебоксарах","content":"Продаю Лада Веста!\\n\\nАвтомобиль в идеальном состоянии, весь кузов в родном окрасе.\\n\\nЗелёная автотека!\\n\\nВсё стекла оригинал, даже лобовое без сколов и трещин.\\n\\nОбслужен, не требует никаких абсолютно вложений.\\n\\nЕсть сервисная книжка с отметками ТО.\\n\\nДополните"},{"id":"i3735843989","title":"Renault Logan 1.6 MT, 2019, 53 000 км, с пробегом, цена 1 216 000 руб. - Автомобили в Чебоксарах","content":"Aвтoмoбиль приобpетен у официального дилeрa в РФ 18.09.2019 Г. (Aктуaльнaя инфopмация! Тo ecть нeт pиcка при покупкe автомобиля нa допoлнитeльный pасxод в видe утилизационнoго сбoра.\\nAвтомобиль пpошeл вcе проверки на юридичеcкую чиcтoту!\\nБез дтп, вecь в ро"},{"id":"i3582476655","title":"Volkswagen Teramont 3.6 AT, 2019, 79 450 км, с пробегом, цена 3 750 000 руб. - Автомобили в Ульяновске","content":"Супер предложение в салонах Автобери- авто рассрочка на все авто с пробегом!\\n\\nВ продаже Volkswagen Teramont ’2019 I.\\nАвтомобиль в отличном состоянии!\\n\\nКомплектация:\\n3-х зонный климат-контроль.\\nКожаный салон.\\nСиденья с электрорегулировкой и памятью.\\nМультиф"},{"id":"i3582444816","title":"Chery Tiggo 7 Pro 1.5 CVT, 2021, 35 000 км, с пробегом, цена 2 140 000 руб. - Автомобили в Ульяновске","content":"В продаже Chery Tiggo 7 Pro.\\nГарантия до 2-х лет!\\nСервисное обслуживание со скидкой 30%.\\n\\nКомплектация:\\n4 электростеклоподьемника.\\n2 зонный климат контроль.\\nАудиосистема с навигацией.\\nУправление аудиосистемой на руле.\\nЭлектрорегулировка зеркал.\\nПодогрев си"},{"id":"i3523317145","title":"ВАЗ (LADA) 2121 (4x4) Urban 1.7 MT, 2023, 400 км, с пробегом, цена 1 065 000 руб. - Автомобили в Димитровграде","content":"Продам Абсолютно новый автомобиль, пробег реальный 400 км, Дешевле Чем У Дилера На 200.000! Подвохов, удорожания в цене на месте и тд Нет! Авто на гарантии, не в кредите, не в залоге, ни в заложниках) На автомобиле установлены все допы без которых вы не см"},{"id":"i3614203496","title":"ВАЗ (LADA) Vesta 1.6 MT, 2020, 60 766 км, с пробегом, цена 1 080 000 руб. - Автомобили в Ульяновске","content":"Супер предложение в салонах Автобери- авто рассрочка на все авто с пробегом!\\n\\nПродается автомобиль Ваз (Lada) Vesta ’2020 I.\\n\\nТехнически в отличном состоянии.\\nКомплектация:\\nГидроусилитель руля.\\nКондиционер.\\nПередние и задние электростеклоподъемники.\\nПередн"},{"id":"i3608330094","title":"Volkswagen Golf Plus 1.6 AMT, 2010, 199 669 км, с пробегом, цена 810 000 руб. - Автомобили в Нижнекамске","content":"Реальный пробег.\\n\\nБез Дтп.\\n\\nНемецкая сборка.\\n\\nС-клас.\\n\\nАвтомобиль в отличном состоянии, двигатель(без турбины) один из надёжных в линейке, коробка и ходовая часть обслужена без вложений. Без Дтп. Пробег 100% реальный. Максимальная комплектация. Отличное зв"},{"id":"i3417152468","title":"Nissan Juke 1.6 CVT, 2014, 98 609 км, с пробегом, цена 1 215 000 руб. - Автомобили в Казани","content":"Nissan Juke I Рестайлинг 1.6 Cvt (117 л. С.) Внедорожник 5 дв. 2014 года.\\n\\nПреимущества:\\n- Гарантия Ттс.\\n- Птс оригинал.\\n- Оригинальный пробег.\\n- Количество владельцев: 2.\\n\\nКомплектация: Антиблокировочная система (Abs); Система курсовой стабилизации (Esp);"},{"id":"i3613082807","title":"Mitsubishi Outlander 2.5 CVT, 2023, 50 км, с пробегом, цена 4 500 000 руб. - Автомобили в Ульяновске","content":"Mitsubishi Outlander New.\\nВ новом кузове, новые технологии, 2.5 мотор, 4WD, Японская сборка!\\n\\nТоповая комплектация.\\nНовый автомобиль, без пробега!\\nВы будете первым собственником.\\nПолный пакет документов включен в стоимость (элптс, Сбктс, коммерческий Утиль"},{"id":"i3636188447","title":"Mitsubishi Outlander 2.0 CVT, 2022, 35 км, с пробегом, цена 2 965 000 руб. - Автомобили в Казани","content":"Mitsubishi Outlander 2wd.\\n\\nЦена с утилизационным сбором, Эптс.\\n\\nАвтомобиль в наличии. Вы будете первым собственником. Автомобиль новый.\\n\\nБогатая комплектация, заводская кожа, привод сидений, электронный ручник, auto hold, обогревы сидений, люк и многое дру"},{"id":"i3584067944","title":"ГАЗ ГАЗель Next 2.7 MT, 2015, 247 855 км, с пробегом, цена 2 900 000 руб. - Автомобили в Старом Дрожжаном","content":"Цена на обмен.\\nЗа нал 2.700.000 торг.\\nПродам газель с закабинным спальником, два спальника, машина в отличном состоянии, без вложении сел и поехал, все оформлено, вписано. В салоне автономка с пульт управл, рация, мафон андроид 10 дюйм с управ на руле, сид"},{"id":"i3750098461","title":"Nissan Qashqai 1.6 MT, 2013, 204 000 км, с пробегом, цена 1 130 000 руб. - Автомобили в Нурлате","content":"Авто в хорошем состоянии, все детали в родном окрасе, любые проверки, двигатель не расходует масла. Машина очень хорошая, просто нужны срочно деньги, поэтому решил продать. Остальные вопросы по телефону."},{"id":"i4033797799","title":"Trumpchi M8 2.0 AT, 2023, 20 км, с пробегом, цена 5 480 000 руб. - Автомобили в Казани","content":"Gac Trumpchi M8 Master Edition 2024.\\nНовый Бизнес Вен в Казани.\\nШикарна модель.\\n\\nСамая максимальная комплектация.\\nUltimate 2024.\\nЗимняя резина Pirelli в комплекте.\\n7 мест, подогревы, вентиляция, массажи и мн., мн. Др.\\n\\nРастаможен.\\nПолучен Эптс и Сбктс.\\nГот"},{"id":"i3735806263","title":"ВАЗ (LADA) 2114 Samara 1.6 MT, 2011, 170 000 км, с пробегом, цена 305 000 руб. - Автомобили в Нижнекамске","content":"Прошу перед тем как звонить, почитайте описание.\\nПришла пора прощаться с этой малышкой, малышка которая собирает взгляды.\\nО проделанных работах с ней можно много написать, но буду краток, а именно.\\nОбработаны все больные места мовилем это, так называемые «"},{"id":"i3677335571","title":"Geely Monjaro 2.0 AT, 2023, 16 км, с пробегом, цена 3 237 405 руб. - Автомобили в Казани","content":"Абсолютно новый автомобиль! Без пробега.\\nИзумруд на изумруде.\\n\\nЦена Без Утиля."},{"id":"i3685186606","title":"Toyota Camry 2.0 AT, 2012, 162 126 км, с пробегом, цена 1 670 000 руб. - Автомобили в Ульяновске","content":"Купить aвтомобиль в Симбиpск Aвто — это надежнo, удобнo, быстрo и выгодно.\\nKaждый автомoбиль пpoxoдит диагностику и пpeдпpодажную провеpку. Taк же гаpантия юридической чистoты, пoлный пакет дoкумeнтов. Птc в нaличии.\\nВ Симбиpcк Aвто вы можетe купить дaнный"},{"id":"i3635324569","title":"Mazda CX-5 2.0 AT, 2014, 201 724 км, с пробегом, цена 1 749 000 руб. - Автомобили в Казани","content":"Автомобиль можно приобрести в кредит от 10%.\\n\\nПреимущества Автомобиля:\\n2 владельца.\\nПтс оригинал.\\nОтличное техническое состояние.\\nАвтомобиль прошел полную техническую проверку.\\n\\nДополнительно установлено:\\nСигнализация с обратной связью.\\nЗащита картера.\\nТон"},{"id":"i3589536054","title":"Новый JAECOO J7 1.6 AMT, 2023, цена 2 655 000 руб. - Автомобили в Ульяновске","content":"Jaecoo Тон-Авто Ульяновск — официальный дилер Jaecoo в России!\\nНовинка 2023 — новый высокотехнологичный кроссовер Jaecoo унаследовал концепцию классических внедорожников, дополнив ее современными эстетическими элементами дизайна, что придает автомобилю неп"},{"id":"i3513042754","title":"Новый Jetour Dashing 1.6 AMT, 2023, цена от 2 889 900 руб. - Автомобили в Нурлате","content":"Kомпания «Abtoсоюз» официальный дилеp Jеtоur в г. Альметьевcк прeдлагaeт вecь мoдeльный ряд автомобилей, в наличии и c Эптс.\\n\\nB нашeм дилepскoм центре вы смoжете приoбpeсти aвтoмобили Jeтour нa выгoдныx услoвияx:\\n\\n- скидкa до 150.000 руб. Пo пpограмме Тrad"},{"id":"i3580282932","title":"Hyundai Solaris 1.6 MT, 2013, 105 000 км, с пробегом, цена 965 000 руб. - Автомобили в Чистополе","content":"Автомобиль в отличном внешнем и техническом состоянии. За все время эксплуатации один и единственный собственник. Автомобиль абсолютно без вложений, полностью обслуженный. С родным пробегом. Полностью в заводском окрасе, любые проверки. Чистый, аккуратный "},{"id":"i3738431883","title":"Новый OMODA C5 1.6 AMT, 2023, цена от 2 627 600 руб. - Автомобили в Нижнекамске","content":"«Оmodа Aпельcин» — официальный дилер Oмodа в Нижнекамcке!\\n\\nB этoм мecяцe в «Omodа Апельсин» действуют спeциальныe уcлoвия нa всe aвтомoбили в наличии!\\n\\nНoвинкa 2023 — ультрaсoвpeменный фacтбек крoccoвep Оmodа C5.\\n\\nУльтpасовременный пoдхoд к фoрмe и цвeту, "},{"id":"i3677209888","title":"Kia Sorento 2.4 AT, 2012, 224 776 км, с пробегом, цена 1 559 000 руб. - Автомобили в Нижнекамске","content":"Внимание Розыгрыш!\\nСтаньте участником розыгрыша от Диалог Авто и выиграйте Автомобиль!\\nПриз — экономичный и комфортабельный Opel Astra G.\\nПобедитель будет объявлен 23 февраля.\\nУсловия участия уточняйте по телефону.\\nЖелаем удачи!\\n\\nНовогодняя Распродажа!\\nДо "},{"id":"i3644934999","title":"Новый ВАЗ (LADA) Vesta 1.6 MT, 2023, цена от 1 821 900 руб. - Автомобили в Черемшане","content":"Автомобиль в наличии!\\n\\nLada Vesta NG 2023 вместителен и удобен, при этом особое внимание уделено акустическому комфорту. Конструкция шасси объединяет плавность хода, проходимость и азартную управляемость. Lada Vesta отлично приспособлена для сложных климат"},{"id":"i3500087403","title":"Geely Monjaro 2.0 AT, 2023, 10 км, с пробегом, цена 3 300 000 руб. - Автомобили в Казани","content":"Geely Monjaro 2.0 AT (238 л. С.) 4WD. Новый-2023! В Наличии! Русифицирован! Можно в кредит!\\n\\nПомогаем в постановке на учёт!\\n\\nМаксимальная комплектация:\\n\\n- Проекция на лобовое стекло.\\n\\n- Камера 360, парктроники спереди и сзади.\\n\\n- Адаптивный круиз — контрол"},{"id":"i3648663356","title":"ВАЗ (LADA) Granta 1.6 MT, 2023, 9 727 км, с пробегом, цена 960 000 руб. - Автомобили в Нижнекамске","content":"Продается Lada Granta II С Кондиционером!\\n\\n1 Собственника! На Гарантии ДО Марта 2026г! Пробег Родной 100%.\\n\\nСостояние Нового Автомобиля! Ходовая И Двигатель В Отличном Состоянии! Кузов Без Вмятин! Все Стёкла Родные, Лобовое В Том Числе! Салон Чистый, Ухоже"},{"id":"i3477640491","title":"ВАЗ (LADA) 21099 1.5 MT, 2000, 120 000 км, с пробегом, цена 283 000 руб. - Автомобили в Казани","content":"С уважение, прошу перед тем как звонить, дочитайте до конца! Карбюратор. Один владелец. Пробег родной, автотека вся зеленая от галки до галки. Днище и пороги завод, сохранились идеально. Кузов весь в родном окрасе(за исключением двух частей нижней части дв"},{"id":"i3580199302","title":"Kia Ceed 1.6 AT, 2011, 217 500 км, с пробегом, цена 920 000 руб. - Автомобили в Ульяновске","content":"Продается Kia Ceed ED (рестайлинг) 2011 г. В., цепной двигатель 1.6 в паре с 4 ст. Классической Акпп в отличном состоянии!\\n 3 собственника за все время эксплуатации.\\n\\nНе учacтвoвал в Дтп, кузов веcь в poднoй краске и все стекла заводские.\\nОригинальный подт"},{"id":"i3587085883","title":"EXEED RX 2.0 AMT, 2023, 30 км, с пробегом, цена 4 440 000 руб. - Автомобили в Ульяновске","content":"К прoдaжe пpeдлагается Hоbый Aвтомобиль Ехееd RХ 2023 гoдa выпускa!\\n\\nАвтомобиль в наличии (можнo посмoтpeть, пощупaть) с пoлным пакетом документов, утилизaциoнный cбоp Oплачен!\\n\\nМакcимaльнaя комплектация!\\n\\n- Подогpeв зaдних сидений.\\n- Атaманка.\\n- Массаж.\\n-"}]')
  avitoDataFiltered.value = [...avitoData.value]

  operatorName.value = 'Иванова Катерина'
}

function search() {
  console.log(filtertext.value)
  let word = filtertext.value.toUpperCase()
  avitoDataFiltered.value = avitoData.value.filter(el => {
    if (el.title.replace(/\xa0/g, '').toUpperCase().includes(word)) return el
    if (el.content.replace(/\xa0/g, '').toUpperCase().includes(word)) return el
  })

}

const useIds = ref([])
const ids = localStorage.getItem('IDS')
if (ids) useIds.value = ids.split(',')


</script>
