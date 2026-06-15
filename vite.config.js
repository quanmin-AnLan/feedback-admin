import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import { defineConfig } from 'vite'
import { createVuePlugin } from 'vite-plugin-vue2'
import { resolveBuildId } from './scripts/resolve-build-id.mjs'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const buildId = resolveBuildId()
const builtAt = new Date().toISOString()

function manualChunk(id) {
  if (!id.includes('node_modules')) return undefined
  // element-ui 每个 lib/*.js 都是独立 webpack 打包体；强行合并到同一 chunk 会在生产包中产生
  // TDZ 报错（如 Cannot access 'X' before initialization）。不指定 chunk，让其跟随入口同步打包。
  if (id.includes('element-ui')) return undefined
  if (/node_modules[/\\]vue-router[/\\]/.test(id)) return 'vue-vendor'
  if (/node_modules[/\\]vuex[/\\]/.test(id)) return 'vue-vendor'
  if (/node_modules[/\\]vue[/\\]/.test(id)) return 'vue-vendor'
  if (id.includes('axios')) return 'axios'
  return 'vendor'
}

/** 写入 dist/build-meta.json，便于部署后核对是否为新包 */
function adminBuildMetaPlugin() {
  return {
    name: 'feedback-admin-build-meta',
    transformIndexHtml(html) {
      return html.replace(
        /<!--\s*admin-build-id:[^>]*-->/,
        `<!-- admin-build-id: ${buildId} builtAt=${builtAt} -->`,
      )
    },
    closeBundle() {
      const outDir = path.resolve(__dirname, 'dist')
      const meta = {
        name: 'feedback-admin',
        buildId,
        builtAt,
      }
      fs.mkdirSync(outDir, { recursive: true })
      fs.writeFileSync(
        path.join(outDir, 'build-meta.json'),
        `${JSON.stringify(meta, null, 2)}\n`,
        'utf8',
      )
    },
  }
}

export default defineConfig({
  plugins: [createVuePlugin(), adminBuildMetaPlugin()],
  define: {
    __ADMIN_BUILD_ID__: JSON.stringify(buildId),
    __ADMIN_BUILT_AT__: JSON.stringify(builtAt),
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
      // element-ui 内部以 CommonJS require('vue')，与 Vite 的 ESM Vue 会产生两个
      // Vue 实例，导致 el-table 等组件静默渲染空白。强制全应用共用同一份 ESM Vue。
      vue: 'vue/dist/vue.esm.js',
    },
  },
  server: {
    port: 5174,
    open: true,
  },
  build: {
    target: 'es2019',
    emptyOutDir: true,
    cssCodeSplit: true,
    // 避免沿用上次构建缓存导致产物 hash 与内容不一致
    rollupOptions: {
      output: {
        manualChunks: manualChunk,
        // 使用较长 hash，降低碰撞；内容或 buildId 变化时文件名会变
        chunkFileNames: 'assets/js/[name]-[hash:12].js',
        entryFileNames: 'assets/js/[name]-[hash:12].js',
        assetFileNames: 'assets/[ext]/[name]-[hash:12].[ext]',
      },
    },
    chunkSizeWarningLimit: 900,
  },
})
