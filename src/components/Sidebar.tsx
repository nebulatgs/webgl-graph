import { useRecoilState, useSetRecoilState } from "recoil";
import { equationAtom } from "../atoms/equation";
import { uniformsAtom } from "../atoms/uniforms";

export default function Sidebar() {
    const setEquation = useSetRecoilState(equationAtom);
    const [uniforms, setUniforms] = useRecoilState(uniformsAtom);
    return (
        <section className="flex flex-col items-center bg-gray-600 text-gray-200 text-xl h-full w-2/5">
            <input className="outline-none text-gray-200 bg-gray-700 w-full h-10" type="text" onChange={(e) => setEquation(e.currentTarget.value)} />
            {uniforms.map((uniform, i) => (
                <div className="flex w-full items-center h-10 text-gray-200 bg-gray-700 pl-5">
                    <span className="text-center italic">
                        {uniform.name}:
                    </span>
                    <input className="outline-none w-full h-10 text-gray-200 bg-gray-700" type="text" value={uniforms[i].value} onChange={(e) => {
                        let thing = [...uniforms];
                        thing[i] = { ...thing[i], value: e.target.value };
                        setUniforms(thing)
                    }} />
                </div>
            ))}
        </section>
    );
}