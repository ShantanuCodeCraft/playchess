import { create } from "zustand";
import { combine } from "zustand/middleware";

type statusType =  "IN_PROGRESS"
| "COMPLETED"
| "ABANDONED"
| "TIME_UP"
| "PLAYER_EXIT";

interface MetaDataType {
    id: string;
    playerAsWhite: string;
    playerAsBlack: string;
    status: statusType;
    result: string | null;
}

export const useGameStore = create(
    combine<
        {
            MetaData: null | MetaDataType;
            IsStart: boolean;
            IsBoardFlipped: boolean;
            IsOpponentDisconnect: boolean;
            LastMoveTime: number;
            AutoResignTimer: number;
        },
        {
            setBoardFlipped: (value: boolean) => void;
            setMetaData: (data: MetaDataType) => void;
            setLastMoveTime: (value: number) => void;
            setIsoponnetDisconnect: (value: boolean) => void;
            setAutoResignTimer: (value: number) => void;
            setvalue: (name: string, value: string | boolean | number) => void;
        },
        [],
        []
    >(
        {
            MetaData: null,
            IsBoardFlipped: false,
            IsOpponentDisconnect: false,
            IsStart: false,
            LastMoveTime: 0,
            AutoResignTimer: 0
        },
        (set) => ({
            setBoardFlipped: (value) => set(() => ({ IsBoardFlipped: value })),
            setMetaData: (data) => set(() => ({ MetaData: data })),
            setLastMoveTime: (value) => set(() => ({ LastMoveTime: value })),
            setIsoponnetDisconnect: (value) => set(() => ({ IsOpponentDisconnect: value })),
            setAutoResignTimer: (value) => set(() => ({ AutoResignTimer: value })),
            setvalue: (name, value) => set(() => ({ [name]: value }))
        })
    )
);
