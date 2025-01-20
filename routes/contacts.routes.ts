import express from 'express'
import { ContactController } from '../controllers/contact.controller';

export const router = express.Router();

router.post('/contact', ContactController.createContact);

