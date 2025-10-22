import { create } from "zustand";
import { combine } from "zustand/middleware";

export interface user {
    username: string;
    isGuest: boolean;
}

export const useUserStore = create(
    combine<
        { user: user | null },
        {
            setUser: (user: user) => void;
            removeUser: () => void;
        },
        [],
        []
    >(
        {
            user: null,
        },
        (set) => ({
            setUser: (user: user) => set({ user }),
            removeUser: () => set({ user: null }),
        })
    )
);
