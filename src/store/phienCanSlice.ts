import { PhienCan } from "components/farmer/type";
import { removeDataFromStorage, setDataToStorage } from "services/zalo";

export interface PhienCanSliceType {
    phienCan: PhienCan | null;
    setPhienCan: (phienCan: PhienCan | null) => void;
    clearPhienCan: () => void;
}

export const createPhienCanSlice = (set: any, get: any): PhienCanSliceType => ({
    phienCan: null,

    setPhienCan: (phienCan) => {
        set({ phienCan });
        if (phienCan) {
            setDataToStorage({ phienCan: JSON.stringify(phienCan) });
        } else {
            removeDataFromStorage(["phienCan"]);
        }
    },

    clearPhienCan: () => {
        set({ phienCan: null });
        removeDataFromStorage(["phienCan"]);
    },
});