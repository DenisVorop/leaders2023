import { ETrends } from '@/types/enums';
import { NextApiRequest, NextApiResponse } from 'next';

const POSTHOG_API_KEY = process.env.NODE_POSTHOG_KEY;
const POSTHOG_PROJECT_ID = process.env.NODE_POSTHOG_PROJECT_ID;
const POSTHOG_HOST = process.env.NODE_POSTHOG_HOST;

function objectToQueryParams(obj: { [key: string]: string }) {
  const params = new URLSearchParams();

  for (const key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      params.append(key, obj[key]);
    }
  }

  return params.toString();
}

function typeToInsightUrl(type: string) {
  switch (type) {
    case ETrends.REFERRER:
      return "insights/trend/?insight=TRENDS";
    default:
      return "insights/trend/?insight=TRENDS";
  }
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { method, body } = req;

  if (method === 'POST') {
    try {
      const { type, query } = body;
      const suffix = `${typeToInsightUrl(type)}&${objectToQueryParams(query)}`;

      const endpoint = `${POSTHOG_HOST}/api/projects/${POSTHOG_PROJECT_ID}/${suffix}`
      console.log(endpoint)
      const data = await fetch(endpoint, {
        method: "GET",
        headers: {
          "Authorization": `Bearer ${POSTHOG_API_KEY}`
        }
      });
      
      const stats = await data.json();
      console.log(stats)
      res.status(200).json(stats);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  } else {
    res.status(405).json({ message: 'Method Not Allowed' });
  }
}
