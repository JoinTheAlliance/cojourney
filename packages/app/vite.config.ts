import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

const buildType = process.env.BUILD_TYPE || 'app';

export default defineConfig(() => {
  if (buildType === 'library') {
    return {
      plugins: [react()],
      build: {
        lib: {
          entry: 'src/App.tsx', // Path to your main component
          name: 'cojourney',
          formats: ['es', 'umd'], // Specify library formats
          fileName: (format) => `index.${format}.js`
        },
        rollupOptions: {
          // Externalize React to avoid bundling it into your library
          external: ['react', 'react-dom'],
          output: {
            // Configure globals for external dependencies
            globals: {
              react: 'React',
              'react-dom': 'ReactDOM'
            }
          }
        }
      }
    };
  } else {
    return {
      build: {
        minify: false,
      },
      plugins: [react()],
      base: "/",
      server: {
        port: 3000,
      },
    };
  }
});