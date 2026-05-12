import express from "express";
import {
  createCategory,
  deleteCategory,
  getCategories,
  getCategoryById,
  updateCategory,
} from "../controllers/category.controller.js";
import validate from "../middlewares/validate.middleware.js";
import {
  categorySchema,
  updateCategorySchema,
} from "../validation/category.validator.js";
import { checkRole } from "../middlewares/role.middleware.js";

const router = express.Router();

router.post("/", validate(categorySchema), checkRole("client"), createCategory);
router.get("/", getCategories);
router.get("/:id", getCategoryById);
router.patch(
  "/:id",
  validate(updateCategorySchema),
  checkRole("client"),
  updateCategory,
);
router.delete("/:id", checkRole("client"), deleteCategory);

export default router;
