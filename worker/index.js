'use strict'

self.addEventListener('push', async function (event) {
  const data = await event.data.json()

  event.waitUntil(
    self.registration.showNotification(data.title, {
      body: data.message,
      icon: '/icons/icon-192x192.png',
      requireInteraction: true,
    // badge: '/icons/icon-256x256.png',
    // image: '/icons/icon-512x512.png',
    actions: [
    //   { action: 'action-1', title: 'Действие 1' },
    //   { action: 'action-2', title: 'Действие 2' }
    ]
    })
  )
})

self.addEventListener('notificationclick', function (event) {
  const destination = event?.data?.target
  console.log("click")
  event.notification.close()
  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then(function (clientList) {
      if (clientList.length > 0) {
        let client = clientList[0]
        for (let i = 0; i < clientList.length; i++) {
          if (clientList[i].focused) {
            client = clientList[i]
          }
        }
        client.focus()
        destination && client.openWindow(destination)
      }
      return clients.openWindow('/')
    })
  )
})
