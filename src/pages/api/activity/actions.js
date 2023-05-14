

const POSTHOG_API_KEY = process.env.NODE_POSTHOG_KEY
const POSTHOG_PROJECT_ID = process.env.NODE_POSTHOG_PROJECT_ID;
const POSTHOG_HOST = process.env.NODE_POSTHOG_HOST

export default async function handler(req, res) {
  const { method } = req;

  if (method === 'GET') {
    const userId = req?.query?.userId || 'mszx2000@gmail.com';

    try {
      
      const data = await fetch(`${POSTHOG_HOST}/api/projects/${POSTHOG_PROJECT_ID}/actions/`, {
        method: "GET",
        headers: {
          "Authorization": `Bearer ${POSTHOG_API_KEY}`
        }
      });
      
      const actions = await data.json()
      const actionsIds = actions.results.map(el => el.id)

      let counts = await Promise.all(actionsIds.map(id => fetch(`${POSTHOG_HOST}/api/projects/${POSTHOG_PROJECT_ID}/actions/${id}/count`,{
        method: "GET",
        headers: {
          "Authorization": `Bearer ${POSTHOG_API_KEY}`
        }
      })))
      counts = await Promise.all(counts.map(el => el.json()))

      res.status(200).json({ actions, counts });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  } else {
    res.status(405).json({ message: 'Method Not Allowed' });
  }
}
