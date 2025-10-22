import { Socket } from "socket.io";
import Game from "./Game.js";
import User from "./User.js";
import { io } from "./app.js";
import { INIT_GAME, JOIN_GAME, MOVE, PENDING } from "./messageType.js";

export default class GameManager {
    public games: Game[];
    private pendingUser: User | null;
    private pendingGuest: User | null = null;
    public users: User[];

    constructor() {
        this.games = [];
        this.pendingUser = null;
        this.users = [];
    }

    addUser(user: User) {
        this.users.push(user);
        this.handler(user);
    }

    removeUser(socket: Socket) {
        const user = this.users.find((user) => user.socket === socket);
        if (!user) return;

        this.users.splice(
            this.users.findIndex((user_a) => user_a.username !== user.username),
            1
        );

        const game = this.games.find(
            (game) => game.player1 === user.username || game.player2 === user.username
        );
        if (!game) return;

        game.playerDisonnect(user);

        if (this.pendingUser && this.pendingUser.username === user.username)
            this.pendingUser === null;
    };

    private handler(user: User) {
        user.socket.on("message", async (message) => {
            if (message.type === INIT_GAME) {
                if (user.isGuest) {
                    if (this.pendingGuest) {
                        if (this.pendingGuest.username === user.username) return;
                        const game = new Game(this.pendingGuest, user, true);
                        this.games.push(game);
                        this.pendingGuest = null;
                    } else {
                        this.pendingGuest = user;
                        user.socket.send({
                            type: PENDING,
                        });
                    };
                } else {
                    if (this.pendingUser) {
                        if (this.pendingUser.username === user.username) return;
                        const game = new Game(this.pendingUser, user, false);

                        this.games.push(game);
                        this.pendingUser = null;
                    } else {
                        this.pendingUser = user;
                        user.socket.send({
                            type: PENDING,
                        });
                    };
                };
            };

            if (message.type === JOIN_GAME) {
                const { game_id } = message.payload;

                const game = this.games.find((game) => game.Id === game_id);
                if (!game) return;

                if (user.username === game.player1 || game.player2) {
                    if ((await io.in(game.Id).fetchSockets()).length === 1)
                        user.socket.join(game_id);
                    else return;

                    game.playerReconnect(user);
                };
            };

            if (message.type === MOVE) {
                const game_id = message.payload.gameId;
                if (!game_id) return;

                const game = this.games.find((g) => game_id === g.Id);

                if (!game || game.result) return;

                game.makeMove(user, message.payload.move);
            };
        });
    }
}
