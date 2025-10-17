// import { create } from "zustand";
// import { combine } from "zustand/middleware";
// import { moves } from "../helper/makeMove";

// export const useMakeMove = create(
//     combine<
//     { moves : moves[],
//         lastMove : Date | null
//      },
//     {
//         setUser: (user: user) => void;
//         removeUser: () => void;
//     },
//     [],
//     []
// >(
//         {
//             moves: [],
//             lastMove: new Date(Date.now())
//         },
//         (set) => ({
//             setmove: () =>
//                 // set((state) => ({ IsBoardFlipped: !state.IsBoardFlipped })),
//         })
//     )
// );
