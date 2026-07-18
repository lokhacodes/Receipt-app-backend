import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";

import cookieParser from "cookie-parser";

import routes from "./routes";
import receiptRoutes from "./routes/receipt.routes";

const app = express();

app.use(
    cors({
        origin: process.env.CLIENT_ORIGIN,
        credentials: true,
    })
);

app.use(express.json());

app.use(cookieParser());

app.get("/health", (_, res) => {
    res.json({ ok: true });
});

app.use("/api", routes);

app.use("/api/receipts", receiptRoutes);

const port = Number(process.env.PORT) || 4001;

app.listen(port, () => {
    console.log(`Server running on ${port}`);
});