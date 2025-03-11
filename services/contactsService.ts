import { Contact } from "../models/contacts.model";

class ContactService {
  async createContact(contactsData: {
    name: string;
    phone: string;
    message?: string;
  }) {
    const contact = new Contact(contactsData);
    return contact.save();
  }
}

const contactServiceInstance = new ContactService();
export { contactServiceInstance as ContactService };
