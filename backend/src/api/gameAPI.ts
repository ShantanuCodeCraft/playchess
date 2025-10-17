import express from "express";
import { prisma } from "../prisma/index.js";

const gameapi = express.Router();

gameapi.get("/:userId/games", async (req, res) => {
    const { userId } = req.params;

    if (!userId) return;
    const games = await prisma.game.findMany({
        where: {
            OR: [
                {
                    whitePlayerId: userId,
                },
                { blackPlayerId: userId },
            ],
        },
        select: {
            id: true,
            whitePlayerId: true,
            blackPlayerId: true,
        },
    });

    res.status(200).json(games);
});

export default gameapi;
