import {createContext} from "react";

export const SprayCardContext = createContext({
    sprayCardProcess: {},
    sprayCardContents: [],
    sprayData: {},
    sprayOptions: {},
    refreshing: false,
    onRefresh: () => {
    },
});