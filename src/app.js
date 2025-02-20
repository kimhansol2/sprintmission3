import express from "express";
import dotenv from "dotenv";
import productRouter from "./routes/product.js";
import { Prisma } from "@prisma/client";
import asyncHandler from "./middlewares/async-handler.js";
import { PrismaClientValidationError } from "@prisma/client/runtime/library";

const app = express();
dotenv.config();
app.use(express.json());

app.use("/products", productRouter);

app.use((e, req, res, next) => {
  console.log("Error handleing");
  console.log(e);
  if (
    e.name === "StructError" ||
    (e instanceof Prisma.PrismaClientKnownRequestError && e.code === "P2002") ||
    e instanceof PrismaClientValidationError
  ) {
    console.log("Error code", e.code);
    res.status(400).send({ message: e.message });
  } else if (
    e instanceof Prisma.PrismaClientKnownRequestError &&
    e.code === "P2025"
  ) {
    res.status(404).send({ message: e.message });
  } else {
    res.status(500).send({ message: e.message });
  }
});

app.listen(3000, () => {
  console.log("Server is listening on port 3000");
});
