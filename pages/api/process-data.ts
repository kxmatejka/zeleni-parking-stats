import kv from "@vercel/kv";

export default async function handler(req, res) {
	console.log('started');

	await await kv.set('key', new Date().toString());

	const redisRes = await kv.get('key');

	console.log('res', redisRes);

  res.status(200).json({ name: 'John Doe' });
}
