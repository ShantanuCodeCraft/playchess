import { JwtPayload } from "jsonwebtoken";
import { Socket } from "socket.io";
import { v4 } from "uuid";
import { decodedUser } from "./api/middleware/auth.js";

export default class User {
    public id: string;
    public username: string;
    public isGuest: boolean;
    public socket: Socket;

    constructor(socket :  Socket,decode : decodedUser ) {
            this.id = v4(),
            this.username = decode.username,
            this.isGuest = decode.isGuest,
            this.socket = socket
    }
}