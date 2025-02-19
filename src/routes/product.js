import express from "express";
import { assert } from "superstruct";
import { PrismaClient } from "@prisma/client";
import { CreateProduct, PatchProduct } from "../structs.js";

const prisma = new PrismaClient();
const productRouter = express.Router();

productRouter.route("/").post(async (req, res) => {
  const product = await prisma.product.create({ data: req.body });

  res.status(201).json({ message: product });
});

export default productRouter;
