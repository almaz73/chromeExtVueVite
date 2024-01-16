<template>
  <main>
    <div>
      <div>1. Авторизоваться на
        <a href="https://dev.autonet.pro/#/appeal/391850">
          dev.autonet.pro
        </a>
      </div>
      <div v-if="!operatorName" class="note red">Не сделано</div>
      <div v-else class="note green">::::✅Готово:::: Оператор: {{ operatorName }}</div>

      <div>2. Отфильтровать автомобили на
        <a href="https://www.avito.ru/kazan/avtomobili?radius=100&searchRadius=100">
          avito.ru
        </a>
      </div>
      <div v-if="isNeedAvito" class="note red">Не сделано</div>
      <div v-else class="note green">::::✅Готово::::</div>

      <div :style="{'opacity':isReady?1:0.5, 'pointer-events': isReady?'auto':'none'}">3.
        <button
            :disabled="!isReady"
            @click="askData()">Забрать
        </button>
        данные со страницы Авито
      </div>
    </div>
  </main>
</template>

<script setup>

import {ref} from "vue";


const avitoData = ref([])
const avitoDataFiltered = ref([])
const isReady = ref(false)
const operatorName = ref('')
const isNeedAvito = ref(true)

if (chrome.runtime) askAccount() // нужно авторизроваться и получить


chrome.tabs && chrome.tabs.query({active: true, lastFocusedWindow: true}, tabs => {
  let url = tabs[0].url;
  console.log('url', url)
  if (url.includes('avtomobili')) isReady.value = true
});


const useIds = ref([])
const ids = localStorage.getItem('IDS')
if (ids) useIds.value = ids.split(',')

function askData() {
  console.log('1. askData')
  sendQustionToContent({currentWindow: true, active: true}, '1. Parsing site', answerAutoList)
}

function askAccount() {
  console.log('2. askAccount')
  sendQustionToContent({}, '2. Get my account', answerAccountName)
}

function sendQustionToContent(params, question, callback) {
  // посылает запрос ко всем  вкладкам если в params не оговорено
  chrome.tabs.query(params, function (tabs) {
    for (let i = 0; i < tabs.length; i++) {
      chrome.tabs.sendMessage(tabs[i].id, question, callback);
    }
  })
}


function answerAccountName(val) {
  console.log('????? val', val)

  if (val === true) isNeedAvito.value = false
  if (val && val !== 'null' && val !== true) operatorName.value = val
  console.log('isNeedAvito.value', isNeedAvito.value)
  // chrome.runtime.sendMessage({">>>>> operatorName": operatorName.value}); // открываю вкладку опций
}

function answerAutoList(val) {
  // получает данные из сайта
  if (!chrome.runtime.lastError) {
    if (val) {
      console.log('answerAutoList val', val)
      avitoData.value = val
      avitoDataFiltered.value = [...avitoData.value]
    }
  }
}

</script>
