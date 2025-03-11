import TelegramBot from "node-telegram-bot-api";
import { Contact, ContactDocument } from "../models/contacts.model";

export class BotService {
  private bot: TelegramBot;
  private contactModel: typeof Contact;

  constructor() {
    this.bot = new TelegramBot(process.env.BOT_TOKEN || "", { polling: true });
    this.contactModel = Contact;
    this.bot.setMyCommands([
      { command: "/start", description: "Start" },
      { command: "/заявки", description: "Показать все заявки" },
      { command: "/заявки_за_день", description: "Показать заявки за день" },
      {
        command: "/заявки_за_7_дней",
        description: "Показать заявки за 7 дней",
      },
    ]);

    this.bot.on("message", async (msg) => {
      try {
        if (!msg.text) return;

        /*  if (msg.chat.id !== +(process.env.ADMIN_CHAT_ID || "")) {
          await this.sendMessage(
            msg.chat.id,
            "Вы не можете отправлять сообщения этому боту."
          );
        } */

        switch (msg.text) {
          case "/start":
            await this.sendMessage(
              msg.chat.id,
              "Привет! Я бот для обработки заявок. Чтобы увидеть все заявки, введи команду /contacts"
            );
            break;

          case "/заявки":
            const allContacts = await this.contactModel.find();
            await this.sendMessage(
              msg.chat.id,
              this.formatContacts(allContacts)
            );
            break;

          case "/заявки_за_день":
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

          case "/заявки_за_7_дней":
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
              "Неизвестная команда. Попробуйте /start, /заявки или /заявки_за_день, /заявки_за_7_дней."
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

  sendNewContactNotification(contact: ContactDocument) {
    return this.bot.sendMessage(
      process.env.ADMIN_CHAT_ID || "",
      this.formatNewContact(contact),
      { parse_mode: "Markdown" }
    );
  }
}

new BotService();
