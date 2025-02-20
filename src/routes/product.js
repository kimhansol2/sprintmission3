import express from "express";
import { assert } from "superstruct";
import { PrismaClient } from "@prisma/client";
import { CreateProduct, PatchProduct } from "../structs.js";

const prisma = new PrismaClient();
const productRouter = express.Router();

productRouter.route("/").post(async (req, res) => {
  assert(req.body, CreateProduct);
  const product = await prisma.product.create({ data: req.body });

  res.status(201).json({ message: product });
});

productRouter
  .route("/:id")
  .get(async (req, res) => {
    const { id } = req.params;
    const product = await prisma.product.findUniqueOrThrow({
      where: id,
    });
    res.json({ message: product });
  })
  .patch(async (req, res) => {
    const { id } = req.params;
    assert(req.body, PatchProduct);
    const product = prisma.product.update({
      where: id,
      data: req.body,
    });
  });

export default productRouter;
