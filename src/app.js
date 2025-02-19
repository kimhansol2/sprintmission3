import express from "express";
import dotenv from "dotenv";
import productRouter from "./routes/product.js";

const app = express();
dotenv.config();
app.use(express.json());

app.use("/products", productRouter);

app.listen(3000, () => {
  console.log("Server is listening on port 3000");
});
