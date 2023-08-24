const TelegramApi = require("node-telegram-bot-api");
const token = "";//ТУТ БУДЕТ ПЕРЕМЕННАЯ ОКРУЖЕНИЯ С ТОКЕНОМ БОТА

// Инициализация Telegram бота
const bot = new TelegramApi(token, { polling: true });

// Состояние диалога для каждого чата
const dialogState = {};

// Вопросы для диалога
const questions = ["Вопрос 1", "Вопрос 2", "Вопрос 3"];

// Функция для отправки вопроса пользователю
const sendQuestion = (chatId, questionNumber) => {
  bot.sendMessage(chatId, questions[questionNumber]);
};

// Обработка ответа пользователя
const processAnswer = (chatId, answer) => {
  if (dialogState[chatId]) {
    dialogState[chatId].answers.push(answer);

    // Если не все вопросы заданы, переход к следующему вопросу
    if (dialogState[chatId].state < questions.length - 1) {
      dialogState[chatId].state++;
      sendQuestion(chatId, dialogState[chatId].state);
    } else {
      // Все вопросы заданы, завершение диалога
      bot.sendMessage(chatId, "Данные получены, спасибо!");
      console.log("Диалог завершен:", dialogState[chatId]);
      delete dialogState[chatId];
    }
  }
};

// Обработка входящего сообщения
const handleMessage = (msg) => {
  const text = msg.text;
  const chatId = msg.chat.id;

  if (dialogState[chatId]) {
    // Если диалог уже идет
    if (dialogState[chatId].completed) {
      bot.sendMessage(chatId, "Данные получены, спасибо!");
    } else {
      processAnswer(chatId, text);
    }
  } else if (text === "/start") {
    // Начало нового диалога
    dialogState[chatId] = { state: 0, answers: [] };
    bot.sendMessage(chatId, "Добро пожаловать! Ответьте на вопрос:");
    sendQuestion(chatId, 0);
  } else {
    bot.sendMessage(chatId, "Для начала диалога, нажмите /start");
  }
};

// Слушаем входящие сообщения
bot.on("message", handleMessage);
