import mongoose, { Document, Schema } from 'mongoose';

interface PushSubscription {
    endpoint: string;
    expirationTime?: number | null;
    keys: {
        p256dh: string;
        auth: string;
    };
}

export interface SubscriptionDocument extends Document {
    subscription: PushSubscription;
    userUID: string;
    topic: string
}

export const SubscriptionSchema = new Schema<SubscriptionDocument>({
    subscription: Object,
    userUID: String,
    topic: String,
}, {autoCreate: true, collection: "web-push"});

let Subscription: mongoose.Model<SubscriptionDocument>;

try {
    Subscription = mongoose.model('subscription');
} catch {
    Subscription = mongoose.model<SubscriptionDocument>('subscription', SubscriptionSchema, "web-push");
}
export async function upsertSubscription(subscriptionData: any) {
    try {
        const filter = { userUID: subscriptionData.userUID };
        const update = { ...subscriptionData };
        let result = await Subscription.findOne(filter);
    
        if (result) {
          // Если запись уже существует, обновляем ее
          result = await Subscription.findOneAndUpdate(filter, update, { new: true });
          console.log('Подписка успешно обновлена:', result);
        } else {
          // Если запись не существует, создаем новую
          result = await Subscription.create(update);
        }
    
        return result;
    } catch (error) {
        console.error('Ошибка при обновлении или добавлении подписки:', error);
        throw error;
    }
}

export { Subscription }