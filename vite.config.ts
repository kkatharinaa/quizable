import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react-swc'

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {

  process.env = {...process.env, ...loadEnv(mode, process.cwd(), '')}

  return {
    plugins: [react()],
    envDir: './',
    define: {
      
      
    }
  }
})
