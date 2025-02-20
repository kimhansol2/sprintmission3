import express from "express";
import { assert } from "superstruct";
import { PrismaClient } from "@prisma/client/extension";
import asyncHandler from "../middlewares/async-handler";
import { CreateArticle, PatchArticle } from "../structs";

const prisma = PrismaClient();
const articleRouter = express.Router();

articleRouter.route("/").post(
  asyncHandler(async (req, res) => {
    const article = await prisma.article.create({ data: req.body });
    res.status(201).send(article);
  })
);

export default articleRouter;
