import express from "express";
import {
  createContact,
  deleteContact,
  getAllContacts,
} from "../controllers/contact.controller.js";
import validate from "../middlewares/validate.middleware.js";
import { contactSchema } from "../validation/contact.validator.js";
import { isAuth } from "../middlewares/auth.middleware.js";
import { checkRole } from "../middlewares/role.middleware.js";

const router = express.Router();

router.post("/create", validate(contactSchema), createContact);
router.get("/get-all", isAuth, checkRole("client"), getAllContacts);
router.delete("/delete/:id",isAuth,checkRole("client"),deleteContact);

export default router;
