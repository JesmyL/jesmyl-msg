/// <reference lib="webworker" />
/* eslint-disable no-restricted-globals */

// This service worker can be customized!
// See https://developers.google.com/web/tools/workbox/modules
// for the list of available Workbox modules, or add any other
// code you'd like.
// You can also remove this file if you'd prefer not to use a
// service worker, and the Workbox build step will be skipped.

// import { clientsClaim } from 'workbox-core';
import { precacheAndRoute } from 'workbox-precaching';
import { registerRoute } from 'workbox-routing';
import { NetworkFirst } from 'workbox-strategies';

declare const self: ServiceWorkerGlobalScope;

precacheAndRoute(self.__WB_MANIFEST);

registerRoute(
  ({ url }) =>
    !url.pathname.endsWith('.mp3') &&
    !url.pathname.endsWith('.png') &&
    !url.pathname.endsWith('.svg') &&
    !url.pathname.endsWith('.jpg'),
  new NetworkFirst(),
);

// const CACHE_NAME = 'v1';

// const errorHTML = `
//   <h2>Приложение не успело прогрузиться и сохраниться</h2>
//   <p>На данном этапе необходимо иметь соединение с сетью</p>
// `;

// const itIt = <T>(it: T) => it!;

// self.addEventListener('fetch', event => {
//   event.respondWith(
//     (async function () {
//       try {
//         const resp = await fetch(event.request);

//         (await caches.open(CACHE_NAME)).put(event.request, resp.clone());

//         return resp;
//       } catch (err) {
//         try {
//           return await caches.match(event.request).then(itIt);
//         } catch (error) {
//           return new Response(errorHTML, { headers: { 'Content-Type': 'text/html' } });
//         }
//       }
//     })(),
//   );
// });

// self.addEventListener('activate', async () => {
//   // получаем имена кэшей
//   const cacheNames = await caches.keys();
//   await Promise.all(
//     cacheNames.map(async cacheName => {
//       // Удаляем кэши, которые не относятся к текущей версии
//       if (cacheName !== CACHE_NAME) {
//         await caches.delete(cacheName);
//       }
//     }),
//   );
// });

// const fromNetwork = async (request: Request) => {
//   const response = await fetch(request);
//   update(request);

//   return response;
// };

// const fromCache = (request: Request) => caches.open(CACHE_NAME).then(cache => cache.match(request));
// const update = (request: Request) =>
//   caches.open(CACHE_NAME).then(cache => fetch(request).then(response => cache.put(request, response)));

// Precache all of the assets generated by your build process.
// Their URLs are injected into the manifest variable below.
// This variable must be present somewhere in your service worker file,
// even if you decide not to use precaching. See https://cra.link/PWA
// precacheAndRoute(self.__WB_MANIFEST);

// registerRoute(
//   ({ url }) => !url.pathname.endsWith('.mp3'),
//   createHandlerBoundToURL(process.env.PUBLIC_URL + '/index.html'),
// );

// registerRoute(({ url }) => !url.pathname.endsWith('.mp3'), new NetworkFirst());

// Кешируем запросы на получение `CSS`, `JS` и веб-воркеров с помощью стратегии `Stale While Revalidate` (считается устаревшим после запроса)
// registerRoute(
//   // проверяем, что цель запроса - это таблица стилей, скрипт или воркер
//   ({ request }) =>
//     request.destination === 'style' || request.destination === 'script' || request.destination === 'worker',
//   new StaleWhileRevalidate({
//     // помещаем файлы в кеш с названием 'assets'
//     cacheName: 'assets',
//     plugins: [
//       new CacheableResponsePlugin({
//         statuses: [200],
//       }),
//     ],
//   }),
// );

// An example runtime caching route for requests that aren't handled by the
// precache, in this case same-origin .png requests like those from in public/
// registerRoute(
//   // Add in any other file extensions or routing criteria as needed.
//   ({ url }) => url.origin === self.location.origin && url.pathname.endsWith('.png'),
//   // Customize this strategy as needed, e.g., by changing to CacheFirst.
//   new StaleWhileRevalidate({
//     cacheName: 'images',
//     plugins: [
//       // Ensure that once this runtime cache reaches a maximum size the
//       // least-recently used images are removed.
//       new ExpirationPlugin({ maxEntries: 50 }),
//     ],
//   }),
// );

// This allows the web app to trigger skipWaiting via
// registration.waiting.postMessage({type: 'SKIP_WAITING'})
// self.addEventListener('message', event => {
//   if (event.data && event.data.type === 'SKIP_WAITING') {
//     self.skipWaiting();
//   }
// });

// Any other custom service worker logic can go here.

// self.addEventListener('fetch', evt => {
//   evt.respondWith(
//     (async () => {
//       try {
//         return await fromNetwork(evt.request);
//       } catch (error) {
//         return (await fromCache(evt.request)) || new Response(errorHTML, { headers: { 'Content-Type': 'text/html' } });
//       }
//     })(),
//   );

//   evt.waitUntil(update(evt.request));
// });