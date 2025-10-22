import { Chess, Move } from "chess.js";
import { randomUUID } from "crypto";
import User from "./User.js";
import { io } from "./app.js";
import {
    GAME_OVER,
    INIT_GAME,
    JOIN_GAME,
    MOVE,
    OPPONENT_DISCONECT,
    OPPONENT_RECONNECT,
} from "./messageType.js";
import { prisma } from "./prisma.js";

export type move = {
    from: string;
    to: string;
};

type status =
    | "IN_PROGRESS"
    | "COMPLETED"
    | "ABANDONED"
    | "TIME_UP"
    | "PLAYER_EXIT";

type result = "WHITE_WINS" | "BLACK_WINS" | "DRAW";

type GAME_TYPE = "USER" | "AI" | "GUEST";

export default class Game {
    public Id: string;
    public player1: string;
    public player2: string;
    private chess: Chess = new Chess();
    public moves: move[] = [];
    public result: result | null = null;
    public moveTimer: NodeJS.Timeout | null = null;
    public autoResignTimer: NodeJS.Timeout | null = null;
    public PlayerReconnectTimer: NodeJS.Timeout | null = null;
    public moveTime: number = 600; //10 min in seconds
    public lastmoveTime = Date.now();
    public palyerDisconnectsAt = Date.now();
    private gameType: GAME_TYPE = "USER";

    constructor(player1: User, player2: User, isGuest: boolean) {
        this.player1 = player1.username;
        this.player2 = player2.username;

        this.Id = randomUUID();

        if (!isGuest) {
            this.createGameIndb(this.Id).then((game) => {
                if (!game) return;
            });
        } else this.gameType = "GUEST";

        player1.socket.join(this.Id);
        player2.socket.join(this.Id);

        io.to(this.Id).emit("message", {
            type: INIT_GAME,
            payload: {
                gameId: this.Id,
                startTime: this.lastmoveTime,
                playerAsWhite: this.player1,
                playerAsBlack: this.player2,
            },
        });

        this.resetMoveTimer();
    }

    async makeMove(user: User, move: move) {
        if (this.moves.length % 2 === 0 && user.username !== this.player1) return;

        if (this.moves.length % 2 === 1 && user.username !== this.player2) return;

        let validmove: Move;

        try {
            validmove = this.chess.move(move);
        } catch {
            return;
        }

        const moveTimeStamp = Date.now();
        const timeTaken = Math.floor((moveTimeStamp - this.lastmoveTime) / 1000);

        this.moves.push(move);
        io.to(this.Id).emit("message", {
            type: MOVE,
            payload: {
                move,
                san: validmove.san,
                color: validmove.color,
                piece: validmove.piece,
                timeTaken: timeTaken,
                lastmoveTime: moveTimeStamp,
            },
        });

        this.addMoveToDb(validmove, timeTaken);

        this.lastmoveTime = moveTimeStamp;

        this.resetMoveTimer();

        if (this.chess.isGameOver()) {
            this.result = this.chess.isDraw()
                ? "DRAW"
                : this.chess.turn() === "b"
                    ? "WHITE_WINS"
                    : "BLACK_WINS";
            this.endGame("COMPLETED", this.result);
        }
    }

    resetMoveTimer() {
        if (this.moveTimer) {
            clearInterval(this.moveTimer);
            this.moveTimer = null;
        }

        this.moveTimer = setInterval(() => {
            const elipsedTime = Math.floor((Date.now() - this.lastmoveTime) / 1000); // get the time in seconds
            const remainingTime = this.moveTime - elipsedTime;

            if (remainingTime <= 0) {
                clearInterval(this.moveTimer!);
                this.result = this.chess.turn() === "b" ? "WHITE_WINS" : "BLACK_WINS";
                io.in(this.Id).emit("message", {
                    type: GAME_OVER,
                    payload: {
                        result: this.result,
                        status: "TIME_UP",
                    },
                });
                this.endGame("TIME_UP", this.result);
            }
        }, 1000);
    }

    playerDisonnect(user: User) {
        // wait for the player to reconnect in 30 sec
        //  lot of time player refresh the page
        this.PlayerReconnectTimer = setTimeout(() => {
            // frontend knows the opponet disconnect
            this.palyerDisconnectsAt = Date.now();
            user.socket.to(this.Id).emit("message", {
                type: OPPONENT_DISCONECT,
                time: this.palyerDisconnectsAt,
            });
            // auto resign in another 30 sec
            this.autoResignTimer = setInterval(() => {
                const elipsedTime = Math.floor(
                    (Date.now() - this.palyerDisconnectsAt) / 1000
                );
                const remainingTime = 30 - elipsedTime;

                if (remainingTime <= 0) {
                    clearInterval(this.autoResignTimer!);
                    this.result =
                        user.username === this.player1 ? "BLACK_WINS" : "WHITE_WINS";
                    io.to(this.Id).emit("message", {
                        type: GAME_OVER,
                        payload: {
                            result: this.result,
                            status: "PLAYER_EXIT",
                        },
                    });
                    this.endGame("PLAYER_EXIT", this.result);
                    this.clearMoveTimer();
                }
            }, 1000);
        }, 30 * 1000);
    }

    playerReconnect(user: User) {
        if (this.PlayerReconnectTimer) clearTimeout(this.PlayerReconnectTimer);
        if (this.autoResignTimer) clearInterval(this.autoResignTimer);

        user.socket.emit("message", {
            type: JOIN_GAME,
            payload: {
                gameId: this.Id,
                moves: this.moves,
                playerAsWhite: this.player1,
                playerAsBlack: this.player2,
                lastmoveTime: this.lastmoveTime,
            },
        });
        user.socket.to(this.Id).emit("message", {
            type: OPPONENT_RECONNECT,
        });

        this.resetMoveTimer();
    }

    async createGameIndb(id: string) {
        try {
            return await prisma.game.create({
                data: {
                    id,
                    currentFen:
                        "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1",
                    status: "IN_PROGRESS",
                    whitePlayerId: this.player1,
                    blackPlayerId: this.player2,
                },
            });
        } catch {
            return null;
        };
    };

    async endGame(status: status, result: result) {
        if (this.gameType === "GUEST") {
            return;
        };
        try {
            await prisma.game.update({
                where: {
                    id: this.Id,
                },
                data: {
                    endAt: new Date(),
                    status,
                    result,
                },
            });
        } catch {
            return;
        }
    };

    async addMoveToDb(Move: Move, timeTaken: number) {
        if (this.gameType === "GUEST") {
            return;
        };
        try {
            await prisma.move.create({
                data: {
                    gameId: this.Id,
                    from: Move.from,
                    to: Move.to,
                    san: Move.san,
                    color: Move.color,
                    piece: Move.piece,
                    timeTaken,
                },
            });

            await prisma.game.update({
                where: {
                    id: this.Id,
                },
                data: {
                    currentFen: this.chess.fen(),
                },
            });
        } catch {
            return;
        }
    }

    clearMoveTimer() {
        if (this.moveTimer) {
            clearInterval(this.moveTimer);
        }
    }
}
