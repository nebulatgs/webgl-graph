import { atom } from "recoil";
import { Uniform } from "../interfaces/uniform";
export const uniformsAtom = atom<Uniform[]>({
    key: "uniformsAtom",
    default: [],
});