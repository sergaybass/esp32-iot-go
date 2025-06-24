import fetch from 'node-fetch';

export default async function handler(req, res) {
  const AIO_USERNAME = process.env.AIO_USERNAME;
  const AIO_KEY = process.env.AIO_KEY;
  
  // Замените на реальные имена feeds из Adafruit IO
  const TEMP_FEED = 'temperature'; 
  const HUMIDITY_FEED = 'humidity';

  try {
    // 1. Запрос температуры
    const tempRes = await fetch(
      `https://io.adafruit.com/api/v2/${AIO_USERNAME}/feeds/${TEMP_FEED}/data/last`,
      { headers: { 'X-AIO-Key': AIO_KEY } }
    );
    
    if (!tempRes.ok) throw new Error('Temperature fetch failed');
    const tempData = await tempRes.json();
    const temperature = parseFloat(tempData.value);

    // 2. Запрос влажности
    const humidityRes = await fetch(
      `https://io.adafruit.com/api/v2/${AIO_USERNAME}/feeds/${HUMIDITY_FEED}/data/last`,
      { headers: { 'X-AIO-Key': AIO_KEY } }
    );
    
    if (!humidityRes.ok) throw new Error('Humidity fetch failed');
    const humidityData = await humidityRes.json();
    const humidity = parseFloat(humidityData.value);

    // 3. Отправка данных клиенту
    res.status(200).json({ temperature, humidity });

  } catch (error) {
    console.error('Adafruit IO Error:', error);
    res.status(500).json({ 
      error: 'Failed to fetch sensor data',
      details: error.message 
    });
  }
}
