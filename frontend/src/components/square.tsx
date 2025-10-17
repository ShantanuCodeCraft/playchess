import { useDroppable } from "@dnd-kit/core";
import { Square } from "chess.js";
import { useGameStore } from "../hooks/useGameStore";

const Squaree = ({
    children,
    rowindex,
    columnindex,
}: {
    children: React.ReactNode;
    rowindex: number;
    columnindex: number;
}) => {
    const square = (String.fromCharCode(65 + columnindex) +
        "" +
        rowindex) as Square;

    const { isOver, setNodeRef } = useDroppable({
        id: square,
    });


    const style = {
        border: isOver ? " solid white 3.5px" : "",
    };

    const { IsBoardFlipped } = useGameStore()

    return (
        <div
            id={square}
            style={style}
            className={`w-[53px] h-[53px]  ${(rowindex + columnindex) % 2 ? "bg-[#739552]" : "bg-[#ebecd0]"
                }
            max-[400px]:w-9 max-[400px]:h-9 flex flex-col justify-end items-end shadow-inner shadow-[#00000031] `}
            ref={setNodeRef}
            data-position={square}
        >
            {children}
            {(IsBoardFlipped ? 8 === rowindex : 1 === rowindex) && (
                <div
                    className={` absolute text-xs p-0.5 font-bold leading-none  ${!((rowindex + columnindex) % 2)
                        ? "text-[#739552]"
                        : "text-[#ebecd0]"
                        }`}
                >
                    {String.fromCharCode(65 + columnindex).toLowerCase()}
                </div>
            )}
        </div>
    );
};

export default Squaree;
