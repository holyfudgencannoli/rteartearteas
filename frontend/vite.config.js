import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

// https://vite.dev/config/
export default defineConfig({
  base: '/',
  plugins: [react()],
  server: {
    // host: true,
    // strictPort: true,
    // port: 5173,
    // cors: true,
    // hmr: {
    //   clientPort: 443
    // }
    historyApiFallback: true,
  }
})
