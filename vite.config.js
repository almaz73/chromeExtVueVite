import {defineConfig} from 'vite'
import vue from '@vitejs/plugin-vue'
import {fileURLToPath} from 'url'

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [vue()],
    base: '',
    server: {port: 7373},
    build: {
        rollupOptions: {
            input: {
                popup: fileURLToPath(new URL('./src_popup/index.html', import.meta.url)),
                options: fileURLToPath(new URL('./src_options/index.html', import.meta.url))
            },
        },
        outDir: 'extendApelsin/panels/'
    }
})
