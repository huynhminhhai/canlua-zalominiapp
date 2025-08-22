import { removeDataFromStorage, setDataToStorage } from "services/zalo";
import { useStoreApp } from "./store";

type Account = {
    accessToken?: string;
    refreshToken?: string;
    expireInSeconds?: number;
    expiresAt?: number;
    name?: string;
    phoneNumber?: string;
    userId?: number;
    userName?: string;
    [key: string]: any;
};

export interface AuthSliceType {
    account: Account | null;
    // accessToken: string | null;
    setAccount: (account: Account | null) => void;
    // setToken: (tokens: { accessToken: string | null }) => void;
    clearAuth: () => void;
}

export const createAuthSlice = (set: any, get: any): AuthSliceType => ({
    account: null,
    // accessToken: null,

    setAccount: (account) => {
        set({ account });
        if (account) {
            setDataToStorage({ account: JSON.stringify(account) });
        } else {
            removeDataFromStorage(["account"]);
        }
    },

    // setToken: ({ accessToken }) => {
    //     set({ accessToken });
    //     if (accessToken) {
    //         setDataToStorage({ accessToken });
    //     } else {
    //         removeDataFromStorage(["accessToken"]);
    //     }
    // },

    clearAuth: () => {
        set({ account: null });
        removeDataFromStorage(["account"]);
    },
});

export const useRole = () => {
    return useStoreApp((state) => {
        const roles = state.account?.vaiTros;
        return roles && roles.length > 0 ? roles.map((role) => role.tenVaiTro).join(", ") : "guest";
    });
};
