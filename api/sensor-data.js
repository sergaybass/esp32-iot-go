import fetch from 'node-fetch';

export default async function handler(req, res) {
  const AIO_USERNAME = process.env.AIO_USERNAME;
  const AIO_KEY = process.env.AIO_KEY;
  
  // Замените на ваши feed keys в Adafruit IO
  const TEMP_FEED = 'temperature'; 
  const HUMIDITY_FEED = 'humidity';

  try {
    // Запрос температуры
    const tempRes = await fetch(
      `https://io.adafruit.com/api/v2/${AIO_USERNAME}/feeds/${TEMP_FEED}/data/last`,
      { headers: { 'X-AIO-Key': AIO_KEY } }
    );
    const tempData = await tempRes.json();

    // Запрос влажности
    const humidityRes = await fetch(
      `https://io.adafruit.com/api/v2/${AIO_USERNAME}/feeds/${HUMIDITY_FEED}/data/last`,
      { headers: { 'X-AIO-Key': AIO_KEY } }
    );
    const humidityData = await humidityRes.json();

    // Отправка данных на клиент
    res.status(200).json({
      temperature: parseFloat(tempData.value),
      humidity: parseFloat(humidityData.value),
    });

  } catch (error) {
    console.error('Adafruit IO Error:', error);
    res.status(500).json({ error: 'Failed to fetch sensor data' });
  }
}
