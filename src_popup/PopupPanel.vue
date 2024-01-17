<template>
  <main>
    <div>
      <div>
        <span v-if="!isAutorization" class="note red">Не готово</span>
        <span v-else class="note green">✅Готово </span>
        Авторизоваться на
        <a href="https://dev.autonet.pro/#/appeal/391850">
          dev.autonet.pro
        </a>
      </div>


      <div>
        <span v-if="!isAvitoReady" class="note red">Не готово</span>
        <span v-else class="note green">✅Готово</span>
        Найти автомобили на
        <a href="https://www.avito.ru/kazan/avtomobili?radius=100&searchRadius=100">
          avito.ru
        </a>
      </div>


      <div :style="{'opacity':isReady?1:0.5, 'pointer-events': isReady?'auto':'none'}">
        <button
            :disabled="!isReady"
            @click="askData()">Забирать
        </button>
        данные с периодом 30 секунд
      </div>
    </div>
  </main>
</template>

<script setup>

import {computed, ref} from "vue";

const avitoDataFiltered = ref([])
const isAutorization = ref(false)
const isAvitoReady = ref(false)
const isReady = computed(() => isAvitoReady.value && isAutorization.value)


if (chrome.runtime) askAccount() // нужно авторизроваться и получить


chrome.tabs && chrome.tabs.query({active: true, lastFocusedWindow: true}, tabs => {
  let url = tabs[0].url;
  console.log('Актиная страница url', url)
});


// const useIds = ref([])
// const ids = localStorage.getItem('IDS')
// if (ids) useIds.value = ids.split(',')

function askData() {
  console.log('1. askData')
  // sendQustionToContent({currentWindow: true, active: true}, '1. Parsing site', answerAutoList)
  sendQustionToContent({}, '1. Parsing site')
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
  console.log('из закладок  приходит в расширение - ', val)

  if (val === 'avitoReady') isAvitoReady.value = true
  if (val === 'autoNetProReady') isAutorization.value = true
}


</script>
