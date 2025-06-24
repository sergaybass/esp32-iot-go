// Используем встроенный модуль 'https' вместо 'node-fetch'
import https from 'https';

export default async function handler(req, res) {
  try {
    // Проверяем переменные окружения
    if (!process.env.AIO_USERNAME || !process.env.AIO_KEY) {
      throw new Error("Adafruit IO credentials are missing!");
    }

    const AIO_USERNAME = process.env.AIO_USERNAME;
    const AIO_KEY = process.env.AIO_KEY;
    const TEMP_FEED = "temperature"; // Замените на ваш feed key
    const HUMIDITY_FEED = "humidity"; // Замените на ваш feed key

    // Функция для запроса данных из Adafruit IO
    const fetchData = (feed) => new Promise((resolve, reject) => {
      const options = {
        hostname: 'io.adafruit.com',
        path: `/api/v2/${AIO_USERNAME}/feeds/${feed}/data/last`,
        headers: { 'X-AIO-Key': AIO_KEY },
      };

      https.get(options, (apiRes) => {
        let data = '';
        apiRes.on('data', (chunk) => data += chunk);
        apiRes.on('end', () => resolve(JSON.parse(data)));
      }).on('error', reject);
    });

    // Параллельно запрашиваем температуру и влажность
    const [tempData, humidityData] = await Promise.all([
      fetchData(TEMP_FEED),
      fetchData(HUMIDITY_FEED),
    ]);

    // Отправляем клиенту
    res.status(200).json({
      temperature: parseFloat(tempData.value),
      humidity: parseFloat(humidityData.value),
    });

  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ 
      error: 'Server error',
      details: error.message,
    });
  }
}
