// 导入workbox
importScripts('https://g.alicdn.com/kg/workbox/3.6.3/workbox-sw.js')

workbox.setConfig({
  modulePathPrefix: 'https://g.alicdn.com/kg/workbox/3.6.3/'
})

/* globals workbox */
// 设置缓存的前缀和后缀
workbox.core.setCacheNameDetails({
  prefix: 'pwa-cache',
  suffix: 'v1',
  precache: 'install-time',
  runtime: 'run-time',
  googleAnalytics: 'ga'
})

// 激活workbox来实现pwa
// workbox.skipWaiting(); //强制等待的service worker被激活
workbox.clientsClaim() // service worker被激活后使其立即获得页面控制权

// 设置预加载
workbox.precaching.precacheAndRoute(self.__precacheManifest || [])

// 配置service workd的更新激活策略
self.addEventListener('message', event => {
  const replyPort = event.ports[0]
  const message = event.data
  if (replyPort && message && message.type === 'skip-waiting') {
    event.waitUntil(
      self
        .skipWaiting()
        .then(() => replyPort.postMessage({ error: null }))
        .catch(error => replyPort.postMessage({ error }))
    )
  }
})

// self.addEventListener('install', function (e) {
//     console.log('SW Install')
//     e.waitUntil(
//       caches.open(cacheName).then(function (cache) {
//         console.log('SW precaching')
//         return cache.addAll(filesToCache)
//       })
//     )
//     self.skipWaiting()
//   })

// use
// self.addEventListener('activate', function(e) {
//   console.log('SW Activate')
//   e.waitUntil(
//     caches.keys().then(function(keyList) {
//       return Promise.all(keyList.map(function(key) {
//         if (key !== cacheName && key !== dataCacheName) {
//           console.log('SW Removing old cache', key)
//           return caches.delete(key)
//         }
//       }))
//     })
//   )
//   return self.clients.claim()
// })

// 缓存策略
// workbox.routing.registerRoute(
//   /^https:\/\/endday.github.io\/pwa-vue-cli-demo\//i,
//   workbox.strategies.networkFirst({
//     cacheName: 'pwa-static-cache'
//   })
// )

/**
 * example runningCache with api
 */
// workbox.routing.registerRoute(/^https:\/\/lavas\.baidu\.com\/some\/api/,
//     workbox.strategies.networkFirst());

/**
 * example runningCache with resources from CDN
 * including maxAge, maxEntries
 * cacheableResponse is important for CDN
 */
/* workbox.routing.registerRoute(/^https:\/\/cdn\.baidu\.com/i,
    workbox.strategies.cacheFirst({
        cacheName: 'lavas-cache-images',
        plugins: [
            new workbox.expiration.Plugin({
                maxEntries: 100,
                maxAgeSeconds: 7 * 24 * 60 * 60
            }),
            new workbox.cacheableResponse.Plugin({
                statuses: [0, 200]
            })
        ]
    })
);*/
