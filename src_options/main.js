import 'element-plus/theme-chalk/dark/css-vars.css'
import {createApp} from 'vue'
import './style.css'
import OptionsPage from './OptionsPage.vue'
import ElementPlus from 'element-plus'
// @ts-ignore
import ru from 'element-plus/dist/locale/ru.min.mjs'
import 'element-plus/dist/index.css'

let app = createApp(OptionsPage)
app.use(ElementPlus, {locale: ru})
app.mount('#app')
