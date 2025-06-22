export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();
  
  const { value } = req.body;
  const feed = 'led-control';
  const url = `https://io.adafruit.com/api/v2/${process.env.AIO_USERNAME}/feeds/${feed}/data`;

  const response = await fetch(url, {
    method: "POST",
    headers: {
      "X-AIO-Key": process.env.AIO_KEY,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ value })
  });

  if (!response.ok) {
    return res.status(500).json({ error: "Failed to send command" });
  }

  res.status(200).json({ success: true });
}
