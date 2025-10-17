import { Chess } from "chess.js";
import Chessboard from "../components/chessboard";
import { useEffect, useMemo, useState } from "react";
import { useGameStore } from "../hooks/useGameStore";

// import icons
import { Socket } from "socket.io-client";
import makeMove, { isValidMove, moves } from "../helper/makeMove";
import { useNavigate, useParams } from "react-router-dom";
import Avatar from "../components/Avatar";
import ResultPopup from "../components/result-popup";
import {
    GAME_OVER,
    INIT_GAME,
    JOIN_GAME,
    MOVE,
    OPPONENT_DISCONECT,
    OPPONENT_RECONNECT,
} from "../types/messageTypes";
import SideBoard from "../components/sideBoard";
import useUser from "../hooks/useUser";



const Game = ({ socket }: { socket: Socket }) => {
    const gameID = useParams().id;
    const chess = useMemo(() => new Chess(), []);
    const [board, setboard] = useState(chess.board());
    const [moves, setmoves] = useState<moves>([]);
    const [showResult, setshowResult] = useState(false);
    const navigate = useNavigate();
    const {
        IsBoardFlipped,
        setBoardFlipped,
        MetaData,
        setMetaData,
        setLastMoveTime,
        setvalue,
    } = useGameStore();

    const user = useUser()

    useEffect(() => {
        if (socket) {
            socket.on("message", (data) => {
                if (!user) return;
                const massage = data;

                switch (massage.type) {

                    case INIT_GAME:
                        setMetaData(massage.payload);
                        if (massage.payload.playerAsBlack === user.username) setBoardFlipped(true);
                        setvalue("IsStart", true);
                        setLastMoveTime(massage.payload.startTime);
                        navigate(`/game/${massage.payload.gameId}`);
                        break;

                    case JOIN_GAME:
                        massage.payload.moves.map((move: { from: string; to: string }) => {
                            const mademove = chess.move(move);
                            makeMove(moves, { ...mademove, timeTaken: 0 });
                        });
                        setboard(chess.board());
                        setMetaData(massage.payload);
                        if (massage.payload.playerAsBlack === user.username) setBoardFlipped(true);
                        setvalue("IsStart", true);
                        setLastMoveTime(massage.payload.lastmoveTime);
                        break;

                    case OPPONENT_DISCONECT:
                        setvalue("AutoResignTimer", massage.payload.AutoResignTimer);
                        setvalue("IsOpponetDisconnect", true);
                        break;

                    case OPPONENT_RECONNECT:
                        setvalue("IsOpponetDisconnect", false);
                        break;

                    case MOVE:
                        if (isValidMove(massage.payload.move, chess)) {
                            try {
                                chess.move(massage.payload.move);
                            } catch {
                                return;
                            }
                        }
                        makeMove(moves, { ...massage.payload, ...massage.payload.move });
                        setLastMoveTime(massage.payload.lastmoveTime);
                        setboard(chess.board());
                        break;

                    case GAME_OVER:
                        setvalue("result", massage.payload.result);
                        setvalue("status", massage.payload.status);
                        break;

                    default:
                        break;
                }
            });

            if (gameID !== "online") {
                socket.send({
                    type: JOIN_GAME,
                    payload: {
                        gameId: gameID,
                    },
                });
            }
        }
    }, [socket, moves, chess, user]);

    useEffect(() => {
        
        if (MetaData && MetaData.status !== "IN_PROGRESS") {
            setshowResult(true)
        }

        return () => {
            setshowResult(false)
        }
    }, [MetaData])


    return (
        <div className=" w-full min-h-screen">
            {user && (
                <div className="w-full min-h-screen  grid grid-cols-5 p-4 gap-y-8">
                    {/* {MetaData && MetaData.status !== "IN_PROGRESS" && <Win />} */}
                    {showResult && <ResultPopup setshowResult={setshowResult}/>}
                    <div className="col-span-5 lg:col-span-3 flex flex-col items-center justify-center">
                        <div className=" flex flex-col gap-3">
                            <Avatar
                                chess={chess}
                                username={
                                    MetaData
                                        ? IsBoardFlipped
                                            ? MetaData.playerAsWhite
                                            : MetaData.playerAsBlack
                                        : "opponent"
                                }
                            />
                            <Chessboard
                                moves={moves}
                                setmoves={setmoves}
                                socket={socket as Socket}
                                chess={chess}
                                board={board}
                                setboard={setboard}
                                myPieceColor={
                                    MetaData?.playerAsBlack === user.username ? "b" : "w"
                                }
                            />
                            <Avatar
                                chess={chess}
                                username={
                                    MetaData
                                        ? IsBoardFlipped
                                            ? MetaData.playerAsBlack
                                            : MetaData.playerAsWhite
                                        : user.username
                                }
                            />
                        </div>
                    </div>
                    <SideBoard moves={moves} socket={socket!} />

                </div>
            )}
        </div>
    );
};

export default Game;
