import { WebSocketServer } from "ws";
import GameManager from "./GameManager.js";
import { createServer } from "http";
import express, { Request, Response } from "express";
import { Server } from "socket.io";
import cors from "cors";
import userapi from "./api/userApi.js";
import cookieParser from "cookie-parser";
import { auth } from "./api/middleware/auth.js";
import gameapi from "./api/gameAPI.js";
import dotenv from "dotenv";

dotenv.config()

const corsOptions = {
    origin: process.env.AUTHORIZED_ORIGIN,
    credentials: true,
    methods: ["GET", "POST"],
};

const port = 8080;
const app = express();
const serve = createServer(app);
export const io = new Server(serve, {
    cors: corsOptions,
});

app.use(cookieParser());
app.use(express.json());
app.use(cors(corsOptions));
app.use("/api", userapi, gameapi);

const gameManager = new GameManager();

io.on("connection", function connection(socket) {
    const Request = socket.request as Request;

    cookieParser()(Request, Request.res as Response, async () => {
        const token = Request.cookies.token;
        if (!token) return;
        const user = await auth(token, socket);
        if (!user) return;
        gameManager.addUser(user);
    });

    socket.on("disconnect", () => {
        gameManager.removeUser(socket);
    });
});

serve.listen(port, () => {
    console.log(`app listening on ${port}`);
});
