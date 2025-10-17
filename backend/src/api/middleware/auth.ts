import jwt from "jsonwebtoken";
import { SECREAT_KEY } from "../userApi.js";
import User from "../../User.js";
import { Socket } from "socket.io";
import { prisma } from "../../prisma/index.js";


export interface decodedUser {
    username : string;
    isGuest : boolean
}

export async function auth(token: string, socket : Socket) {
    try {
        
        const decode  = jwt.verify(token,SECREAT_KEY);
        
        const data : decodedUser = decode as decodedUser;
    
        if (data.isGuest) {
            const user =  new User(socket,data);
            return user
        }
        
        const user_db = prisma.user.findUnique({
            where : {
                username : data.username
            },
            select : {
                id : true
            }
        });

        if (!user_db) return null;
    
        const user = new User(socket, data)
    
        return user
    } catch {
        return null
    }
}
