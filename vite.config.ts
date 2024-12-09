// import devtools from 'solid-devtools/vite';
import suidPlugin from '@suid/vite-plugin';
import { defineConfig } from 'vite';
import solidPlugin from 'vite-plugin-solid';

export default defineConfig({
  plugins: [
    /* 
    Uncomment the following line to enable solid-devtools.
    For more info see https://github.com/thetarnav/solid-devtools/tree/main/packages/extension#readme
    */
    // devtools(),
    suidPlugin(),
    solidPlugin(),
  ],
  server: {
    port: 3359,
    host: '0.0.0.0',
  },
  build: {
    target: 'esnext',
  },
});
