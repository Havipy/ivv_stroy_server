import { BotService } from "../services/botService";
import { ContactService } from "../services/contactsService";
import { Request, Response } from "express";

class ContactController {
  async createContact(req: Request, res: Response) {
    try {
      const { name, phone, comment } = req.body;

      const contactDoc = await ContactService.createContact({
        name,
        phone,
        message: comment,
      });

      BotService.sendNewContactNotification(contactDoc).catch((error) => {
        console.log(error);
      });

      res.status(201).json({
        success: true,
        message: "Contact form submitted successfully",
        data: contactDoc,
      });
    } catch (error) {
      console.log(error);
      res.status(400).json({
        success: false,
        message: "Failed to submit contact form",
      });
    }
  }
}

const contactControllerInstance = new ContactController();
export { contactControllerInstance as ContactController };
