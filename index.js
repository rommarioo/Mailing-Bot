import dotenv from "dotenv";
import TelegramBot from "node-telegram-bot-api";
import sequelize from "./db.js";
import ModelUser from "./ModelUser.js";
dotenv.config();

sequelize.sync().then(() => {
  console.log("Connection has been established successfully.");
});

const bot = new TelegramBot(process.env.TOKEN, {
  polling: { interval: 300, autoStart: true, params: { timeout: 30 } },
});

bot.setMyCommands([
  { command: "/start", description: "Начало работы" },
  { command: "/unsubscribe", description: "Отписаться от рассылки" },
]);

bot.on("message", async (msg) => {
  const chatId = msg.chat.id;
  const text = msg.text;
  if (text === "/start") {
    const user = await ModelUser.findOne({ where: { telegram_id: chatId } });
    if (user) {
      if (user.is_active) {
        await bot.sendMessage(
          chatId,
          "Вы уже подписаны на рассылку. Чтобы отписаться от рассылки, нажмите /unsubscribe"
        );
      } else {
        user.update({ is_active: true });
        await bot.sendMessage(
          chatId,
          `Привет, я Бот Максим. Рад знакомству. `,
          {
            reply_markup: {
              inline_keyboard: [
                [
                  {
                    text: "Перейти на сайт",
                    web_app: { url: process.env.SITE },
                  },
                ],
              ],
            },
          }
        );
      }
    } else {
      ModelUser.create({
        telegram_id: chatId,
        username: msg.from.username,
        first_name: msg.from.first_name,
        last_name: msg.from.last_name,
        is_active: true,
        access_right: false,
      });
      await bot.sendMessage(chatId, `Привет, я Бот Максим. Рад знакомству.`, {
        reply_markup: {
          inline_keyboard: [
            [
              {
                text: "Перейти на сайт",
                web_app: { url: process.env.SITE },
              },
            ],
          ],
        },
      });
    }
  }

  if (text === "/unsubscribe") {
    const user = await ModelUser.findOne({ where: { telegram_id: chatId } });
    if (user) {
      if (user.is_active === false) {
        await bot.sendMessage(
          chatId,
          "Вы не подписаны на рассылку. Чтобы подписаться, нажмите /start"
        );
      } else {
        user.update({ is_active: false });
        await bot.sendMessage(chatId, "Вы отписались от рассылки");
      }
    }
  }
  const user = await ModelUser.findOne({ where: { telegram_id: chatId } });
  if (user) {
    if (text === "/admin") {
      if (user.access_right) {
        await bot.sendMessage(
          chatId,
          "Добрый день, введите текст для рассылки"
        );
        // напиши рассылку здесь

        bot.on("message", async (msg) => {
          const text = msg.text;
          const users = await ModelUser.findAll({ where: { is_active: true } });
          for (const user of users) {
            await bot.sendMessage(user.telegram_id, text);
          }
          await bot.stopPolling();
        });
        await bot.stop("message");
      } else {
        await bot.sendMessage(chatId, "Нет такой команды :(");
      }
    }
  }
});
