<script setup lang="ts">
import {computed} from "vue";

interface Props {
  title?: string,
  width?: number;
  top?: number,
  draggable?: boolean,
  resizable?: boolean
}

const {width, top, title, draggable, resizable} = defineProps<Props>()
const emits = defineEmits(['closeModal'])

const defaultWidth = 400
const panelWidth = computed(() => width ? (width + 'px') : (defaultWidth + 'px'))
const panelTop = computed(() => top != undefined ? (top + 'px') : '100px')
const panelCenter = computed(() => (document.body.clientWidth / 2 - (width ? width : defaultWidth) / 2 - 10 + 'px'))
let dragObject = {elem: {}, x: 0, y: 0};

function mousedown(e: MouseEvent) {
  if (!draggable) return false;
  if (e.which != 1) return false; // если клик правой кнопкой мыши
  let elem = (e.target as HTMLElement).closest('.draggable');
  if (!elem) return false;
  dragObject.elem = elem
  dragObject.x = e.offsetX;
  dragObject.y = e.offsetY;
  document.onmousemove = move
  e.preventDefault();
}

function move(e: MouseEvent) {
  if (!dragObject.elem) return;
  (dragObject.elem as HTMLElement).style.left = e.pageX - dragObject.x + 'px';
  (dragObject.elem as HTMLElement).style.top = e.pageY - dragObject.y + 'px';
  e.preventDefault();
}

const mouseup = () => {
  dragObject.elem = {}
  document.onmousemove = null
}
</script>
<template>
  <Teleport to="body">
    <div class="modal">
      <div class="modal__fon" @click="emits('closeModal')"></div>
      <div class="modal__content draggable" :class="{resizable}">
        <div class="modal__head"
             @mouseup="mouseup"
             @mousedown="mousedown"></div>
        <div class="modal__title">
          <h2>{{ title }}</h2>
        </div>
        <div class="close_cross" @click="emits('closeModal')">❌</div>
        <div class="modal__info">
          <slot/>
        </div>
      </div>
    </div>
  </Teleport>
</template>
<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Roboto:wght@300;400;500&display=swap');

.modal {
  top: 0;
  width: 100%;
  height: 100vh;
  position: fixed;
  z-index: 1000;
  font-family: 'Roboto', sans-serif;
}

.modal__fon {
  width: 100%;
  height: 100vh;
  background: black;
  opacity: .5;
}

.modal__head {
  position: absolute;
  width: calc(100% - 35px);
  height: 30px;
  background: yellow;
  top: 0;
  left: 0;
  opacity: 0;
  cursor: pointer;
}

.modal__content {
  position: absolute;

  width: v-bind(panelWidth);
  top: v-bind(panelTop);
  left: v-bind(panelCenter);
  padding: 10px;
  border-radius: 10px;
  box-shadow: 0 0 5px black;
  background: #ddd;

  font-size: large;
}
.dark .modal__content{
  background: #333;
}

.resizable {
  resize: both;
  overflow: auto;
}

.close_cross {
  position: absolute;
  top: 5px;
  right: 5px;
  cursor: pointer;
}

.modal__info {
  background: #eee;
}

.dark .modal__info {
  background: #222;
}


.modal__info {
  padding: 10px;
}
</style>