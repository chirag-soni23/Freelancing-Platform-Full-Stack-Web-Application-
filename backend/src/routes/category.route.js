import express from "express";
import {
  createCategory,
  deleteCategory,
  getAllUniqueCategories,
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
import { isAuth } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.post(
  "/",
  isAuth,
  validate(categorySchema),
  checkRole("admin"),
  createCategory,
);
router.get("/", isAuth, getCategories);
router.get("/unique", getAllUniqueCategories);
router.get("/:id", getCategoryById);
router.patch(
  "/:id",
  isAuth,
  validate(updateCategorySchema),
  checkRole("admin"),
  updateCategory,
);
router.delete("/:id", isAuth, checkRole("admin"), deleteCategory);

export default router;
