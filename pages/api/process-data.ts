export default function handler(req, res) {
	console.log('executed');
  res.status(200).json({ name: 'John Doe' });
}
