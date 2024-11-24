import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    // Specify the output directory relative to the project's root
    outDir: '../backend/client',
  },
});
