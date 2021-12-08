import { atom } from "recoil";
import { Uniform } from "../interfaces/uniform";
export const uniformsAtom = atom<Map<string, string>>({
    key: "uniformsAtom",
    default: new Map(),
});