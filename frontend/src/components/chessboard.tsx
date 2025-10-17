import {  DndContext, DragEndEvent } from "@dnd-kit/core";
import Piecee from "./piece";
import { Chess, Color, PieceSymbol, Square } from "chess.js";
import Squaree from "./square";
import { Socket } from "socket.io-client";
import { moves } from "../helper/makeMove";
import { useParams } from "react-router-dom";
import { useGameStore } from "../hooks/useGameStore";

const Chessboard = ({
    chess,
    board,
    setboard,
    socket,
    myPieceColor,
}: {
    chess: Chess;
    board: ({
        square: Square;
        type: PieceSymbol;
        color: Color;
    } | null)[][];
    setboard: React.Dispatch<
        React.SetStateAction<
            ({
                square: Square;
                type: PieceSymbol;
                color: Color;
            } | null)[][]
        >
    >;
    socket: Socket;
    moves: moves;
    setmoves: React.Dispatch<React.SetStateAction<moves>>;
    myPieceColor: string;
}) => {
    const gameId = useParams().id;
    const { IsBoardFlipped } = useGameStore();

    function onDragEnd(event: DragEndEvent) {
        const { over, active } = event;
        if (over) {
            try {
                const fromElement = document.getElementById(active.id as string);
                

                const to = over.id.toString().toLowerCase() as Square;

                if (myPieceColor === chess.turn() && fromElement) {
                    const from = fromElement.parentElement!.id.toString().toLowerCase();

                    const validMove = chess
                        .moves({
                            verbose: true,
                            square: from as Square,
                        })
                        .map((move) => move.to);

                    if (validMove.includes(to)) {
                        chess.move({
                            from,
                            to,
                            promotion: "r",
                        });
                    } else return;

                    socket.send({
                        type: "move",
                        payload: {
                            gameId,
                            move: {
                                from,
                                to,
                            },
                        },
                    });

                    setboard(chess.board());
                }
            } catch {
                return;
            }
        }
    }
    return (
        <div className=" overflow-hidden">
            <DndContext onDragEnd={onDragEnd}>
                {(IsBoardFlipped ? board.slice().reverse() : board).map(
                    (row, rowindex) => {
                        rowindex = IsBoardFlipped ? 1 + rowindex : 8 - rowindex;
                        return (
                            <div className=" grid grid-cols-8" key={rowindex}>
                                <div
                                    className={`absolute  text-xs font-bold p-1  leading-none ${!((IsBoardFlipped ? rowindex - 1 : rowindex) % 2)
                                            ? "text-[#739552]"
                                            : "text-[#ebecd0]"
                                        }`}
                                >
                                    {rowindex}
                                </div>
                                {(IsBoardFlipped ? row.slice().reverse() : row).map(
                                    (piece, columnindex) => {
                                        columnindex = IsBoardFlipped
                                            ? 7 - columnindex
                                            : columnindex;
                                        return (
                                            <Squaree
                                                key={columnindex}
                                                columnindex={columnindex}
                                                rowindex={rowindex}
                                            >
                                                {piece && (
                                                    <Piecee
                                                        id={
                                                            piece.color + piece.type + columnindex + rowindex
                                                        }
                                                        type={piece.type}
                                                    >
                                                        <img
                                                            onClick={() => {
                                                                setboard(chess.board());
                                                            }}
                                                            src={`/src/assets/${piece.color}${piece.type}.png`}
                                                            alt="pawns"
                                                        />
                                                    </Piecee>
                                                )}
                                            </Squaree>
                                        );
                                    }
                                )}
                            </div>
                        );
                    }
                )}
            </DndContext>
        </div>
    );
};

export default Chessboard;
