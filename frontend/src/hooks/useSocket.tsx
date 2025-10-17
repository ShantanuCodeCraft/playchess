import { useEffect, useMemo, useState } from "react";
import { io, Socket } from "socket.io-client";

const WS_URL = import.meta.env.VITE_SERVER_PATH;

const useSocket = () => {
    const [Socket, setSocket] = useState<Socket | null>(null);

    const ws = useMemo(() => io(WS_URL, { withCredentials: true }), []);

    useEffect(() => {
        ws.on("connect", () => {
            console.log("connected");
            setSocket(ws);
        });
        ws.on("disconnect", () => {
            setSocket(null);
        });
    }, [ws]);

    return Socket;
};

export default useSocket;
