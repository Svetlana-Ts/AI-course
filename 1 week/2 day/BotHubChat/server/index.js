/**
 * Главный файл Express.js приложения
 * Демонстрирует интеграцию OpenAI API
 */

import dotenv from 'dotenv';
import express from 'express';
import chatRoutes from './routes/chat.js';
import { errorHandler } from './middleware/errorHandler.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware для CORS
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  if (req.method === 'OPTIONS') {
    res.sendStatus(200);
  } else {
    next();
  }
});

// Middleware для парсинга JSON
app.use(express.json());

// Middleware для логирования запросов
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// Проверка наличия API ключа при старте
if (!process.env.OPENAI_API_KEY) {
  console.error('⚠️  ВНИМАНИЕ: OPENAI_API_KEY не установлен в переменных окружения!');
  console.error('Создайте файл .env и добавьте OPENAI_API_KEY=your_key_here');
}

// Роуты
app.use('/api', chatRoutes);

// Корневой роут
app.get('/', (req, res) => {
  res.json({
    message: 'OpenAI API Integration Server',
    endpoints: {
      'POST /api/chat': 'Отправка сообщения и получение ответа',
      'POST /api/chat/stream': 'Стриминг ответа',
      'POST /api/chat/completion': 'Расширенный метод с несколькими сообщениями',
    },
    example: {
      url: '/api/chat',
      method: 'POST',
      body: {
        message: 'Привет! Расскажи о Node.js',
        systemPrompt: 'Ты опытный разработчик',
      },
    },
  });
});

// Обработка 404
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: {
      message: 'Маршрут не найден',
    },
  });
});

// Middleware для обработки ошибок (должен быть последним)
app.use(errorHandler);

// Запуск сервера
app.listen(PORT, () => {
  console.log(`🚀 Сервер запущен на http://localhost:${PORT}`);
  console.log(`📝 Документация API доступна на http://localhost:${PORT}/`);
});
