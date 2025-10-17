import express from "express";
import { prisma } from "../prisma/index.js";
import bcrypt from "bcrypt";
import jwt, { JwtPayload } from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

export const SECREAT_KEY = process.env.SECREAT_KEY!;
const userapi = express.Router();

// signup API
userapi.post("/signup", async (req, res) => {
  const { username, email, password } = req.body;

  if (!(username && email && password)) return;

  const salt = await bcrypt.genSalt(10);
  const securePassword = await bcrypt.hash(password, salt);

  const user = await prisma.user.create({
    data: { username, email, password: securePassword },
  });

  const token = jwt.sign(
    {
      username: user.username,
      isGuest: false,
    },
    SECREAT_KEY
  );

  res.cookie("token", token).status(201).json(user);
});

// login API
userapi.post("/login", async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) return;

  const user = await prisma.user.findUnique({ where: { username } });

  if (!user) return;
  if (!(await bcrypt.compare(password, user.password))) return;

  const token = jwt.sign(
    {
      username: user.username,
      isGuest: false,
    },
    SECREAT_KEY
  );

  const updateduser = await prisma.user.update({
    where: { username: user.username },
    data : {lastLogin : new Date()}
  });

  res.cookie("token", token);
  res.status(200).json(updateduser);
});

// login as guest API
// guest user cannot store in DB
userapi.get("/guest", async (req, res) => {
  const username =
    "Guest" +
    (Date.now() - Math.floor(Math.random() * 20999999998) + 1299999999);
  1;
  const token = jwt.sign(
    {
      username,
      isGuest: true,
    },
    SECREAT_KEY);
  res.cookie("token", token);
  res.status(200).json({ username, isGuest: true });
});

// refresh token
// resend user and send new token
userapi.get("/refresh/user", async (req, res, next) => {
  if (!req.cookies.token) {
    res.status(404).send("user not found");
  }
  const token = req.cookies.token;
  if (!token) return;
  const payload = jwt.verify(token, SECREAT_KEY) as JwtPayload;
  if (!payload) return;
  const user = { username: payload.username, isGuest: payload.isGuest };
  const newtoken = jwt.sign(user, SECREAT_KEY);
  res.cookie("token", newtoken);
  res.status(201).json(user);
});

export default userapi;
