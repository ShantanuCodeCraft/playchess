import { BiSolidChess } from "react-icons/bi";
import { FaSearch } from "react-icons/fa";
import { HiUsers } from "react-icons/hi";
import { ImStopwatch } from "react-icons/im";
import { RiAddBoxFill } from "react-icons/ri";
import { moves } from "../helper/makeMove";
import { useEffect, useState } from "react";
import { IconType } from "react-icons";
import { useUserStore } from "../hooks/useUserStore";
import { INIT_GAME } from "../types/messageTypes";
import { Socket } from "socket.io-client";
import { useGameStore } from "../hooks/useGameStore";

const navs: Nav[] = [
    {
        name: "play",
        type: "PLAY",
        Icon: ImStopwatch,
    },
    {
        name: "new game",
        type: "NEW_GAME",
        Icon: RiAddBoxFill,
    },
    {
        name: "games",
        type: "GAMES",
        Icon: BiSolidChess,
    },
    {
        name: "players",
        type: "PLAYERS",
        Icon: HiUsers,
    },
];
type BoardType = "PLAY" | "GAMES" | "NEW_GAME" | "PLAYERS";
type Nav = {
    name: string;
    type: BoardType;
    Icon: IconType;
};

type Game = {
    id: string;
    whitePlayerId: string;
    blackPlayerId: string;
};
const SideBoard = ({ moves, socket }: { moves: moves; socket: Socket }) => {
    const [boardType, setboardType] = useState<BoardType>("NEW_GAME");
    const [games, setgames] = useState<Game[]>([]);
    const { user } = useUserStore();
    const { IsStart } = useGameStore();
    const [intializeGame, setintializeGame] = useState(false);
    const  SERVER_PATH = import.meta.env.VITE_SERVER_PATH;

    useEffect(() => {
        async function fetchAllGames() {
            const responce = await fetch(
                `${SERVER_PATH}/api/${user?.username}/games`,
                {
                    method: "GET",
                    credentials: "include",
                }
            );
            const data = await responce.json();
            setgames(data);
        }
        fetchAllGames();
    }, [user?.username]);

    return (
        <div className="col-span-5 h-full min-h-[500px] bg-[#262522] rounded-lg overflow-hidden lg:col-span-2 ">
            <div className=" h-full w-full overflow-y-scroll ">
                <header className={` flex w-full text-white capitalize text-sm`}>
                    {navs.map(({ name, type, Icon }, index) => (
                        <div
                            key={index}
                            className={` w-full flex flex-col gap-1 justify-center items-center cursor-pointer py-3 ${boardType === type ? "" : "bg-[#1e1e1e]  text-[#BBBBBB] "
                                } ${type !== "PLAY" || intializeGame ? "block" : "hidden"}`}
                            onClick={() => {
                                setboardType(type);
                            }}
                        >
                            <Icon className="  text-xl leading-none" />
                            <div className=" text-sm capitalize font-medium leading-none">
                                {name}
                            </div>
                        </div>
                    ))}
                </header>
                {boardType === "NEW_GAME" && (
                    <div className=" flex flex-col gap-8 px-10  h-full py-12">
                        <button
                            className="w-full flex flex-col items-start  overflow-hidden  bg-[#416e38]  h-20 rounded-2xl text-white  font-bold text-2xl leading-none capitalize"
                            onClick={() => {
                                socket?.send({
                                    type: INIT_GAME,
                                });
                                setintializeGame(true);
                                setboardType("PLAY");
                            }}
                        >
                            <div
                                className=" hover:bg-[#a1ce5f] bg-[#81b64c] w-full rounded-2xl flex flex-col justify-center items-center "
                                style={{ height: "calc(100% - 4px)" }}
                            >
                                play
                            </div>
                        </button>
                        <button
                            className="w-full flex flex-col items-start  overflow-hidden  bg-[#000000]  h-16 rounded text-white  font-bold text-lg leading-none capitalize"
                            onClick={() => { }}
                        >
                            <div
                                className=" hover:bg-[#2a2a26] bg-[#1e1e1b] w-full rounded flex flex-col justify-center items-center "
                                style={{ height: "calc(100% - 4px)" }}
                            >
                                play with friend
                            </div>
                        </button>
                    </div>
                )}
                {boardType === "PLAY" && (
                    <div className=" w-full h-full flex flex-col ">
                        <div className=" py-3 px-4 border-[#333333] border-b text-sm leading-none text-[#AAAAAA]">
                            {IsStart ? (
                                "Anderssen Opening"
                            ) : (
                                <span>
                                    pending.<span className=" animate-ping">.</span>
                                    <span className=" animate-ping">.</span>
                                </span>
                            )}
                        </div>
                        {moves.map((move, index) => (
                            <div
                                key={index}
                                className={`px-4 py-2 flex  text-[#AAAAAA] text-sm font-semibold leading-none ${index % 2 === 0 ? " " : " bg-[#1f1f1f] "
                                    }`}
                            >
                                <div>{index + 1}.</div>
                                {move.map((m, i) => {
                                    return (
                                        <div
                                            key={i}
                                            className=" w-1/2  flex  justify-center items-center "
                                        >
                                            {m.Piece && m.Piece !== "p" && (
                                                <img
                                                    className=" w-4 h-4"
                                                    src={`/src/assets/${m.color}${m.Piece}.png`}
                                                    alt="p"
                                                />
                                            )}

                                            {["N", "K", "Q", "B", "R"].some((symbol) =>
                                                m.san.startsWith(symbol)
                                            )
                                                ? m.san
                                                : m.san}
                                        </div>
                                    );
                                })}
                            </div>
                        ))}
                    </div>
                )}
                {boardType === "GAMES" && !user?.isGuest && (
                    <div className=" w-full h-full">
                        <div className=" w-full flex justify-center items-center font-medium text-white text-sm border-b border-[#444444]">
                            <div className="h-full border-b-[3px] border-white py-3 w-[30%] text-center">
                                Game History
                            </div>
                        </div>
                        <div className=" flex items-center   border-b border-[#444444]">
                            <div className="py-2 px-3">
                                <FaSearch className=" text-base text-[#999999]" />
                            </div>
                            <div className=" w-full h-full text-sm leading-none font-medium text-[#999999] relative">
                                <label
                                    htmlFor="username"
                                    className=" absolute  h-full w-full flex items-center "
                                >
                                    Username..
                                </label>
                                <input
                                    id="username"
                                    type="text"
                                    className="w-full h-full bg-transparent text-white outline-none"
                                />
                            </div>
                        </div>
                        {games.map(({ id, blackPlayerId, whitePlayerId }) => (
                            <div
                                key={id}
                                className=" w-full flex items-center pl-3 py-2  border-b border-[#444444] "
                            >
                                <ImStopwatch className=" text-xl text-[#739552]" />
                                <div className=" w-full flex items-center  text-white justify-between pl-2 pr-3 text-sm leading-none">
                                    <div className=" font-medium max-w-[30%] text-ellipsis  overflow-x-clip">
                                        {whitePlayerId}
                                    </div>
                                    <div className=" font-medium max-w-[30%] text-ellipsis  overflow-x-clip">
                                        {blackPlayerId}
                                    </div>
                                    <div className="text-red-500">0-1</div>
                                    <div className=" text-[#999999] font-medium">10 min</div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default SideBoard;
