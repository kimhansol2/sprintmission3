import express from "express";
import { assert } from "superstruct";
import { PrismaClient } from "@prisma/client";
import { CreateProduct, PatchProduct } from "../structs.js";
import asyncHandler from "../middlewares/async-handler.js";

const prisma = new PrismaClient();
const productRouter = express.Router();

productRouter
  .route("/")
  .post(
    asyncHandler(async (req, res) => {
      assert(req.body, CreateProduct);
      const product = await prisma.product.create({ data: req.body });

      res.status(201).json({ message: product });
    })
  )
  .get(async (req, res) => {
    const { offset, limit, create = "recent", name, description } = req.query;
    let orderBy;
    switch (create) {
      case "old":
        orderBy = { createdAt: "asc" };
        break;
      case "recent":
        orderBy = { createdAt: "desc" };
        break;
      default:
        orderBy = { createdAt: "desc" };
    }
    const where = {};
    if (name) {
      const nameTrimmed = name.replace(/\s+/g, " ").trim();
      where.name = { contains: nameTrimmed, mode: "insensitive" };
    }
    if (description) {
      const descriptionTrimmed = description.replace(/\s+/g, " ").trim();
      where.description = { contains: descriptionTrimmed, mode: "insensitive" };
    }

    const product = await prisma.product.findMany({
      where,
      orderBy,
      skip: parseInt(offset) || 0,
      take: parseInt(limit) || 10,
      select: {
        id: true,
        name: true,
        price: true,
        createdAt: true,
      },
    });
    res.send(product);
  });

productRouter
  .route("/:id")
  .get(
    asyncHandler(async (req, res) => {
      const { id } = req.params;
      const product = await prisma.product.findUniqueOrThrow({
        where: { id },
      });
      res.send(product);
    })
  )
  .patch(
    asyncHandler(async (req, res) => {
      const { id } = req.params;
      assert(req.body, PatchProduct);
      const product = await prisma.product.update({
        where: { id },
        data: req.body,
      });
      res.send(product);
    })
  )
  .delete(async (req, res) => {
    const { id } = req.params;
    const product = await prisma.product.delete({
      where: { id },
    });
    res.send(product);
  });

export default productRouter;
