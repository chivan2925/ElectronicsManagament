import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

function getPackageName(id) {
  const normalizedId = id.replace(/\\/g, '/')
  const nodeModulesIndex = normalizedId.lastIndexOf('/node_modules/')

  if (nodeModulesIndex < 0) {
    return ''
  }

  const packagePath = normalizedId.slice(nodeModulesIndex + '/node_modules/'.length)
  const [scopeOrName, packageName] = packagePath.split('/')

  return scopeOrName?.startsWith('@') ? `${scopeOrName}/${packageName}` : scopeOrName
}

function manualChunks(id) {
  const packageName = getPackageName(id)

  if (!packageName) {
    return undefined
  }

  if (['react', 'react-dom', 'scheduler'].includes(packageName)) {
    return 'react-vendor'
  }

  if (['react-router', 'react-router-dom'].includes(packageName)) {
    return 'router-vendor'
  }

  if (['framer-motion', 'motion-dom', 'motion-utils'].includes(packageName)) {
    return 'motion-vendor'
  }

  if (packageName === 'axios') {
    return 'http-vendor'
  }

  return undefined
}

// https://vite.dev/config/
export default defineConfig({
  build: {
    rollupOptions: {
      output: {
        manualChunks,
      },
    },
  },
  plugins: [react()],
})
