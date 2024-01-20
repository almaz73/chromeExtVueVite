<template>
  <AppModal v-if="isOpen"
            @closeModal="emits('closeModal')"
            :width="1000"
            draggable
            resizable>
    <p>
      <el-tabs v-model="activeName" class="demo-tabs">
        <el-tab-pane label="photo" name="first">
          <div style="width: 208px; height: 186px; border: 3px double wheat; padding: 4px; display: inline-block">
            <img alt="фото не загружено" :src="currentRow.photo">
            <img alt="" v-if="currentRow.tel" :src="currentRow.tel" style="width: 200px; height: 30px">
          </div>
          <textarea style="vertical-align: top; width: 500px; height: 193px; font-size: 20px" placeholder="комментарий">

          </textarea>
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
<script setup>
import AppModal from "./components/AppModal.vue";
import {ref} from "vue";

let {currentRow, isOpen} = defineProps(['currentRow', 'isOpen', 'currentParams'])
let emits = defineEmits(['closeModal'])

const activeName = ref('first')
</script>