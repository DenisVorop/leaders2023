const base64ToUint8Array = (base64: string): Uint8Array => {
  const padding = '='.repeat((4 - (base64.length % 4)) % 4);
  const b64 = (base64 + padding).replace(/-/g, '+').replace(/_/g, '/');

  const rawData = window.atob(b64);
  const outputArray = new Uint8Array(rawData.length);

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
};

const registerWebPush = (config, successCb: (sub: any) => void, failedCb: (error: Error) => void): Promise<any> => {
  if (typeof window !== 'undefined' && 'serviceWorker' in navigator && (window as any)?.workbox !== undefined) {
    return navigator.serviceWorker.ready
      .then((registration) => {
        return registration.pushManager.getSubscription().then(async (subscription) => {
          if (subscription) {
            return successCb(subscription);
          }

          const response = await fetch('/api/notification/register', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              ...config,
              subscription: await registration.pushManager.subscribe({
                userVisibleOnly: true,
                applicationServerKey: base64ToUint8Array(process.env.NEXT_PUBLIC_WEB_PUSH_PUBLIC_KEY),
              }),
            }),
          });

          if (response.ok) {
            console.log('Пользователь успешно зарегистрирован на уведомления');
            successCb(true);
          }
        });
      })
      .catch((error) => {
        console.error('Ошибка регистрации сервисного работника:', error);
        failedCb(error);
      });
  }
};

const unregisterWebPush = async (subscription: any, successCb: () => void, failedCb: (error: Error | unknown) => void) => {
  try {
    await subscription.unsubscribe()
    successCb()
  } catch (e: unknown) {
    console.error("Error unsubscribe", e)
    failedCb(e)
  }
}


export default {
  registerWebPush,
  unregisterWebPush
}
