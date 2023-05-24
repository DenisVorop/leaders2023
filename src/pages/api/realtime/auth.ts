import type { NextApiRequest, NextApiResponse } from 'next'
import * as Ably from "ably/promises";
import { EChannel, ERealtimeRole } from '@/types/integrations';
import { Buffer } from 'buffer';
import crypto from "crypto"

import jwt from "jsonwebtoken"

const API = process.env.NODE_ENV === "production" ? process.env.API_HOST_PROD : process.env.API_HOST_DEV

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (!process.env.ABLY_API_KEY) {
    return res
      .status(500)
      .setHeader("content-type", "application/json")
      .json({
        errorMessage: "Missing ABLY_API_KEY environment variable"
      })
  }
  try {
    const token = req.headers?.["x-ably-validate"] ?? null;
    
    if (!token) throw new Error("Without token")

    const raw = await fetch(`${API}/-auth-/get-me`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      }
    })
    const user = await raw.json()
    const clientId = user?.email ?? ERealtimeRole.Guest;
    const client = new Ably.Rest(process.env.ABLY_API_KEY);

    const tokenRequestData = await client.auth.requestToken({
      clientId: clientId
    })
    
    const header = {
      typ: "JWT",
      alg: "HS256",
      "x-ably-token": tokenRequestData.token,
    };
    
    const claims = getRealtimeClaimsByRole(user.role);
    // const base64Header = Buffer.from(JSON.stringify(header)).toString('base64');
    // const base64Claims = Buffer.from(JSON.stringify(claims)).toString('base64');
    // const signatureInput = base64Header + '.' + base64Claims;
    const secretKey = process.env.NEXT_ABLY_API_KEY.split(":")?.[1];


    // const hmac = crypto.createHash("sha256");
    // hmac.update(signatureInput);

    // const signature = hmac.digest("base64url");

    // const jwt = signatureInput + '.' + signature;

    const r = jwt.sign(claims, secretKey, { header })
    return res.status(200).json(r)
  } catch (e) {
    console.log(e)
    return res.status(401).json({ errorMessage: "Missing valid Authorization token", cause: new Error(e) })
  }

}


const getRealtimeClaimsByRole = (role: ERealtimeRole) => {
  const buildeClaim = (channel: ERealtimeRole | EChannel, isModerator: boolean) => ({
    [`ably.channel.${channel}:*`] : isModerator ? "moderator" : "user"
  })
  

  return {
    "sub": "1234567890",
    "ably.channel.chat:*": "moderator",
    ...buildeClaim(ERealtimeRole.Candidate, role === ERealtimeRole.Candidate),
    ...buildeClaim(ERealtimeRole.Curator, role === ERealtimeRole.Curator),
    ...buildeClaim(ERealtimeRole.Mentor, role === ERealtimeRole.Mentor),
    ...buildeClaim(EChannel.global, role === ERealtimeRole.Mentor),
    "ably.limits.*": 4
  }
}

/*
{
  id: '7',
  email: 'mszx2000@gmail.com',
  email_approved: false,
  role: 'candidate',
  register_date: 1684774239,
  permissions: [
    { id: 3, name: 'create_application' },
    { id: 4, name: 'read_application' },
    { id: 5, name: 'update_application' }
  ]
} user
*/