// Управление реле
async function sendCommand(value) {
  try {
    const response = await fetch('/api/send', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ value }),
    });
    if (!response.ok) throw new Error('Command failed');
  } catch (error) {
    console.error('Error:', error);
  }
}

// Получение данных с датчиков
async function fetchSensorData() {
  try {
    const response = await fetch('/api/sensor-data');
    if (!response.ok) throw new Error('Failed to fetch data');
    
    const { temperature, humidity } = await response.json();
    
    document.getElementById('temperature').textContent = 
      temperature !== undefined ? temperature.toFixed(1) : '--';
    document.getElementById('humidity').textContent = 
      humidity !== undefined ? humidity.toFixed(1) : '--';
    
  } catch (error) {
    console.error('Sensor error:', error);
    document.getElementById('temperature').textContent = '--';
    document.getElementById('humidity').textContent = '--';
  }
}

// Назначение кнопок
document.getElementById('on').onclick = () => sendCommand('ON');
document.getElementById('off').onclick = () => sendCommand('OFF');

// Загрузка данных и автообновление
document.addEventListener('DOMContentLoaded', () => {
  fetchSensorData();
  setInterval(fetchSensorData, 5000); // Обновление каждые 5 сек
});
