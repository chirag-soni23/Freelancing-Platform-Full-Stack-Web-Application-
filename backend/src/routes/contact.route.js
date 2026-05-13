import express from "express";
import { createContact } from "../controllers/contact.controller.js";
import validate from "../middlewares/validate.middleware.js";
import { contactSchema } from "../validation/contact.validator.js";

const router = express.Router();

router.post("/create", validate(contactSchema), createContact);

export default router;
