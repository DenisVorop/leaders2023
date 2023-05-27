import * as Ably from 'ably/promises.js';
import webpush from 'web-push';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

import { connectToDatabase } from './mongodb.js';
import { Subscription } from './models/subscriptions.js';

const envPath = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../../../../.env.local');
dotenv.config({ path: envPath });

webpush.setVapidDetails(`mailto:${process.env.WEB_PUSH_EMAIL ?? ""}`, process.env.NEXT_PUBLIC_WEB_PUSH_PUBLIC_KEY ?? "", process.env.WEB_PUSH_PRIVATE_KEY ?? "");

let ably = null
const notificationChannel = "notification"

const startDaemon = async () => {
  ably = new Ably.Realtime(process.env.ABLY_API_KEY ?? "");
  const channel = ably.channels.get(notificationChannel);

  channel.subscribe('global', async (message) => {
    console.log('Received message:', message.data);
    const payload  = {
      title: 'Стажировка Правительства Москвы',
      message: message.data,
      // options: {
      //   actions: [
      //     { action: 'action-1', title: 'Действие 1' },
      //     { action: 'action-2', title: 'Действие 2' }
      //   ]
      // }
    };
    
    try {
      await connectToDatabase(process.env.MONGODB_URI);
      const subscriptions = await Subscription.find({ topic: "global" });
      console.log(subscriptions)
      const results = await Promise.all(subscriptions.map(subscription => webpush.sendNotification(subscription.subscription, JSON.stringify(payload))))
      console.log(results)
    } catch (error) {
      console.error("connect db error", error)
    }
  });
};

startDaemon().then(() => {
  console.log("daemon started...")
}).catch((error) => {
  console.error('Error starting daemon:', error);
});

process.on('SIGTERM', () => {
  console.log('Received SIGTERM signal. Closing daemon...');

  ably?.close();
  process.exit(0);
});
