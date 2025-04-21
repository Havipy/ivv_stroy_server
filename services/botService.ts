import TelegramBot from "node-telegram-bot-api";
import { Contact, ContactDocument } from "../models/contacts.model";
import { BotUser } from "../models/bot-user.model";
class BotService {
  private bot: TelegramBot;
  private contactModel: typeof Contact;

  constructor() {
    this.contactModel = Contact;
    this.bot = new TelegramBot(process.env.BOT_TOKEN || "", {
      polling: true,
    });

    this.bot.setMyCommands([
      { command: "/start", description: "Start" },
      { command: "/сontacts", description: "Показать все заявки" },
      { command: "/заявки_за_день", description: "Показать заявки за день" },
      {
        command: "/заявки_за_7_дней",
        description: "Показать заявки за 7 дней",
      },
    ]);

    this.bot.on("message", async (msg) => {
      try {
        if (!msg.text) return;

        switch (msg.text) {
          case "/start":
            const user = await BotUser.findOne({ tgId: msg.chat.id });
            if (!user) {
              await BotUser.create({ tgId: msg.chat.id });
            }
            await this.sendMessage(
              msg.chat.id,
              "Привет! Я бот для обработки заявок."
            );
            break;

          case "/contacts":
            const allContacts = await this.contactModel.find();
            await this.sendMessage(
              msg.chat.id,
              this.formatContacts(allContacts)
            );
            break;

          case "/last_day_contacts":
            const todayContacts = await this.contactModel.find({
              createdAt: {
                $gte: new Date(new Date().setHours(0, 0, 0)),
                $lt: new Date(new Date().setHours(23, 59, 59)),
              },
            });
            await this.sendMessage(
              msg.chat.id,
              this.formatContacts(todayContacts)
            );
            break;

          case "/last_7_days_contacts":
            const weekAgo = new Date(
              new Date().setDate(new Date().getDate() - 7)
            );
            const weekContacts = await this.contactModel.find({
              createdAt: {
                $gte: weekAgo,
                $lt: new Date(),
              },
            });

            await this.sendMessage(
              msg.chat.id,
              this.formatContacts(weekContacts)
            );
            break;

          default:
            await this.sendMessage(
              msg.chat.id,
              "Неизвестная команда. Попробуйте /start, /contacts, /last_day_contacts или /last_7_days_contacts."
            );
            break;
        }
      } catch (error) {
        console.log(error);
      }
    });
  }

  formatNewContact(contact: ContactDocument) {
    return (
      `📌 *Новая заявка:*\n` +
      `👤 *Имя:* ${contact.name}\n` +
      `📞 *Телефон:* ${contact.phone}\n` +
      `💬 *Сообщение:* ${contact.message || "—"}\n` +
      `🕒 *Дата:* ${contact.createdAt}\n`
    );
  }

  formatContacts(messages: ContactDocument[]) {
    return messages
      .map(
        (msg, index) =>
          `📌 *Заявка ${index + 1}:*\n` +
          `👤 *Имя:* ${msg.name}\n` +
          `📞 *Телефон:* ${msg.phone}\n` +
          `💬 *Сообщение:* ${msg.message || "—"}\n` +
          `🕒 *Дата:* ${msg.createdAt}\n`
      )
      .join("\n──────────────\n");
  }

  sendMessage(chatId: number, text: string) {
    return this.bot.sendMessage(chatId, text);
  }

  async sendNewContactNotification(contact: ContactDocument) {
    const users = await BotUser.find();
    users.forEach((user) => {
      this.bot.sendMessage(user.tgId, this.formatNewContact(contact), {
        parse_mode: "Markdown",
      });
    });
  }
}
const botService = new BotService();
export { botService as BotService };
