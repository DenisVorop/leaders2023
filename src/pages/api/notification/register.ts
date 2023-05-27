import type { NextApiRequest, NextApiResponse } from 'next'

import { connectToDatabase } from '@/services/notification/webpush/mongodb';
import { upsertSubscription } from '@/services/notification/webpush/models/subscriptions';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (!process.env.WEB_PUSH_PRIVATE_KEY || !process.env.NEXT_PUBLIC_WEB_PUSH_PUBLIC_KEY) {
    return res
      .status(500)
      .setHeader("content-type", "application/json")
      .json({
        errorMessage: "Missing WEB_PUSH_PRIVATE_KEY environment variable"
      })
  }
  const { subscription, userUID, topic } = req.body;
  try {
    await connectToDatabase()
    console.log({subscription, userUID, topic})
    await upsertSubscription({subscription, userUID, topic})
    return res.status(200).json({success: true})
  } catch (e: unknown) {
    console.error("Error while upsert", e)
    return res.status(500).json({success: false})
  }
}


