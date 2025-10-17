import { useGameStore } from "../hooks/useGameStore";
import { Chess } from "chess.js";
import { useUserStore } from "../hooks/useUserStore";
import { useEffect, useState } from "react";

const Avatar = ({
    username,
    chess
}: {
    username: string;
    chess : Chess
}) => {
    const { MetaData,setBoardFlipped ,IsBoardFlipped,IsOpponentDisconnect,AutoResignTimer,IsStart,LastMoveTime} = useGameStore();
    const { user } = useUserStore();
    const isopponent = !(user?.username === username);
    const myColor =  MetaData?.playerAsBlack === username ? "b" : "w";
    const isMyTurn = myColor === chess.turn();
    const [autoResignTimer, setautoResignTimer] = useState({
        min: 0,
        sec: 30,
    });

    const [moveTimer, setmoveTimer] = useState({
        min: 10,
        sec: 0,
    });

    useEffect(() => {
        if (!IsOpponentDisconnect) return;
        let timeInterval: number;
        if (!(autoResignTimer.sec <= 0)) {
            timeInterval = setInterval(() => {
                const elipsedTime = Math.floor(
                    (Date.now() - AutoResignTimer) / 1000
                );
                const remainingTime = 30 - elipsedTime;
                setautoResignTimer({
                    min: Math.floor(remainingTime / 60),
                    sec: remainingTime % 60,
                });
                if (remainingTime === 0) {
                    clearInterval(timeInterval);
                }
            }, 1000);
        }

        return () => clearInterval(timeInterval);
    }, [autoResignTimer, IsOpponentDisconnect, AutoResignTimer]);

    // Timer for the move
    useEffect(() => {
        if (!(isMyTurn && IsStart)) return;
        const timeInterval = setInterval(() => {
            const elipsedtime = Math.floor((Date.now() - LastMoveTime ) / 1000);
            const remainingTime = 600 - elipsedtime;

            setmoveTimer({
                min: Math.floor(remainingTime / 60),
                sec: remainingTime % 60,
            });
            if (remainingTime <= 0) {
                clearInterval(timeInterval);
            }
        }, 1000);
        return () => clearInterval(timeInterval);
    }, [IsStart, isMyTurn, LastMoveTime, setmoveTimer]);

    return (
        <div className="w-full flex gap-2 text-white">
            <div onClick={() => setBoardFlipped(!IsBoardFlipped)} className=" w-12 h-12">
                <img
                    src={`/src/assets/${MetaData?.playerAsBlack === username ? "playerAsblack" : "playerAswhite"
                        }.jpg`}
                    alt="user"
                />
            </div>
            <div className=" w-full text-sm font-semibold flex items-start justify-between">
                <div className=" flex flex-col gap-2">
                    <div className=" leading-none">{username}</div>
                    <div className=" text-xs text-red-500  leading-none">
                        {IsOpponentDisconnect &&
                            isopponent &&
                            `player disconnect (${autoResignTimer.min < 10 && 0}${autoResignTimer.min
                            }
                            : 
                            ${autoResignTimer.sec < 10 ? 0 : ""}${autoResignTimer.sec
                            }) min left for auto resign`}
                    </div>
                </div>
                <div
                    className={`text-xl font-semibold rounded-sm ${moveTimer.min < 1 ? "bg-red-600" : "text-[#333333]"
                        } bg-[#DDDDDD]  p-2 leading-none`}
                >
                    <span className=" mr-1">
                        {moveTimer.min < 10 && 0}
                        {moveTimer.min}
                    </span>
                    :
                    <span className="ml-1">
                        {moveTimer.sec < 10 ? 0 : ""}
                        {moveTimer.sec}
                    </span>
                </div>
            </div>
        </div>
    );
};

export default Avatar;
