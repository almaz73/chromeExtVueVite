<template>
  <AppModal v-if="isOpen"
            @closeModal="emits('closeModal')"
            :width="1000"
            draggable
            resizable>
    <p>
      <el-tabs v-model="activeName" class="demo-tabs">
        <el-tab-pane label="Сохранение" name="first">
          <div style="display: flex">
            <div style="width: 208px; height: 186px; border: 3px double wheat; padding: 4px; display: inline-block">
              <img alt="фото не загружено" :src="currentRow.photo">
              <img alt="" v-if="currentRow.tel" :src="currentRow.tel" style="width: 200px; height: 30px">
            </div>
            <div style="margin: 0 30px">

              <div class="label">Имя</div>
              <input v-model="body.lead.person.firstName"><br>
              <div class="label">Отчество</div>
              <input v-model="body.lead.person.middleName"><br>
              <div class="label">Фамилия</div>
              <input v-model="body.lead.person.lastName"><br>
              <div class="label">Телефон</div>
              <input v-model="body.lead.person.phone"><br>

              <div class="label">
                Клиент
              </div>
              <el-select v-model="body.lead.leadType" placeholder="Выберите" style="width: 180px">
                <el-option
                    v-for="item in leadTypes"
                    :key="item.id"
                    :label="item.label"
                    :value="item.id"
                />
              </el-select>
              <br>
              <div class="label">
                Обращение
              </div>
              <el-select v-model="body.communication.callType" placeholder="Выберите" style="width: 180px">
                <el-option
                    v-for="item in callTypes"
                    :key="item.id"
                    :label="item.label"
                    :value="item.id"
                />
              </el-select>

              <br>
              <div class="label">Город</div>
              <input v-model="body.communication.city"><br>

<br>
            </div>
            <div style="margin: 0 30px">
              <el-button size="large" @click="attempt3()"> Сохранить</el-button>
            </div>
          </div>
        </el-tab-pane>
        <el-tab-pane label="title">
          {{ currentRow.title }}
        </el-tab-pane>
        <el-tab-pane label="content">
          {{ currentRow.content }}
        </el-tab-pane>
        <el-tab-pane label="head">
          {{ currentRow.head }}
        </el-tab-pane>
        <el-tab-pane label="link">
          {{ currentRow.link }}
          <a :href="currentRow.link">Ссылка</a>
          <br>
          <br><br>
          brand: {{ currentParams.brand }}<br>
          model: {{ currentParams.model }}<br>
          year: {{ currentParams.year }}<br>
          line: {{ currentParams.line }}<br>
          capacity: {{ currentParams.capacity }}<br>
        </el-tab-pane>
        <el-tab-pane label="price">
          {{ currentRow.price }}
        </el-tab-pane>
        <el-tab-pane label="time">
          {{ currentRow.time }}
        </el-tab-pane>
        <el-tab-pane label="diler">
          {{ currentRow.diler }}
        </el-tab-pane>
        <el-tab-pane label="text">
          {{ currentRow.text }}
        </el-tab-pane>
        <el-tab-pane label="specific">
          {{ currentRow.specific }}
        </el-tab-pane>
        <el-tab-pane label="corresponds">
          {{ currentRow.corresponds }}
        </el-tab-pane>
        <el-tab-pane label="tel">
          {{ currentRow.tel }}
        </el-tab-pane>

      </el-tabs>
    </p>
  </AppModal>
</template>
<style>
.label {
  min-width: 130px;
  display: inline-block;
}
</style>
<script setup>
import AppModal from "./components/AppModal.vue";
import {ElNotification} from 'element-plus'
import {ref, h} from "vue";


const {currentRow, isOpen} = defineProps(['currentRow', 'isOpen', 'currentParams'])
const emits = defineEmits(['closeModal'])
const activeName = ref('first')
const leadTypes = [{id: 10, label: 'Физическое лицо',}, {id: 20, label: 'Юридическое лицо'}]
const callTypes = [{id: 10, label: 'Входящий звонок',}, {id: 20, label: 'Исходящий звонок'}]


let body = ref({
  "workflow": {
    "source": 10,
    "auto": {},
    "workflowLeadType": 2,
    "carBrand": "ВАЗ (LADA)",
    "brandId": 255,
    "carModelId": 2685,
    "yearReleased": 2022,
    "BuyCategory": 10,
    "locationId": 0
  },
  "lead": {
    // "source": 10,
    "person": {
      "firstName": "Иван",
      "middleName": "Иванч",
      "lastName": "Иванов",
      "phone": ""
    },
    // "leadId": 0,
    "leadType": 10
  },
  "communication": {
    "callType": 20,
    "type": 10,
    "sourceId": 15,
    "city": "Казань"
  }
})


async function attempt3() {
  if (!body.value.lead.person.phone) {
    ElNotification({
      title: 'Предупреждение',
      message: h('i', {style: 'color: teal'}, 'Поле "Телефон" обязателен для заполнения'),
    })
    return false
  }
  // сохрании

  const response = await fetch('https://dev.autonet.pro/api/communication/callCenterCommunication?id=', {
    headers: {'content-type': 'application/json;charset=UTF-8'},
    method: 'POST',
    "body": JSON.stringify(body.value)
  }).then(res => {
    console.log(' РЕЗУАЛТАТ ', res)
    if(res.ok){
      // localStorage
      console.log('body.value.id', body.value.id)

    }
  })

  if (response.ok) {
    console.log('ОК', response)
  } else {
    alert(`Ошибка HTTP: ${response.status}`)
  }

}
</script>