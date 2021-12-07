import { atom } from "recoil";
interface Settings {
    symbol: string;
    system: 'cartesian' | 'polar';
}
export const settingsAtom = atom<Settings>({
    key: "settingsAtom",
    default: {
        symbol: '-',
        system: 'cartesian'
    },
});