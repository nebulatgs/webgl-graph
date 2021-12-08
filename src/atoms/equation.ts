import { atom } from "recoil";
export const equationAtom = atom<string[]>({
    key: "equationAtom",
    default: ["","","",""],
});