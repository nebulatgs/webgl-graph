import { useRecoilState, useSetRecoilState } from "recoil";
import { equationAtom } from "../atoms/equation";
import { settingsAtom } from "../atoms/settings";
import { uniformsAtom } from "../atoms/uniforms";

export default function Sidebar() {
    const [equations, setEquations] = useRecoilState(equationAtom);
    const [settings, setSettings] = useRecoilState(settingsAtom);
    const [uniforms, setUniforms] = useRecoilState(uniformsAtom);
    return (
        <section className="flex flex-col items-center bg-gray-600 text-gray-200 text-xl h-full w-2/5">
            {equations.map((equation, i) => (
                <input className="outline-none text-gray-200 bg-gray-700 w-full h-10" type="text" key={i} onChange={(e) => {
                    let thing = [...equations];
                    thing[i] = e.target.value;
                    setEquations(thing)
                }} />
            ))}
            <div className="w-full flex flex-col items-center mt-5">
                {[...uniforms].map(([k, v], i) => (
                    <div className="flex w-full items-center h-10 text-gray-200 bg-gray-700 pl-5" key={k}>
                        <span className="text-center italic">
                            {k}:
                        </span>
                        <input className="outline-none w-full h-10 text-gray-200 bg-gray-700" type="text" value={uniforms.get(k)} onChange={(e) => {
                            const thing = new Map(uniforms);
                            thing.set(k, e.target.value);
                            setUniforms(thing);
                        }} />
                    </div>
                ))}
            </div>
            <div className="w-full mt-auto bg-gray-900 flex h-10 justify-around items-center">
                <span className="px-10 py-1 h-full hover:bg-gray-800 cursor-pointer" onClick={() => setSettings({ ...settings, system: 'cartesian' })}>
                    <img className="h-full rounded-full" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAFAAAABQCAQAAAAkGDomAAABO0lEQVR4Ae2ZJ1AzARBGz7v4GbyJF9h4P9FUS5d0zU+v8lQckt6LpRdD773DDzzO366j8+2bVc88c7kkG8SHEAgDcygENh2XBCDLsRdA2nHjQKvtFKhABSrwzwfSEWMdou0wGQeuHZcBIHTsIzDouH1g0XYB33wC+mPsQ7T9JsvAveOmARh37H9g3nHnwLbtfvtDokAFKlCBClQgqRiDEG3K5B9w6LhcANKOvQHqHTcP9Nou4JvPDwhMxMhAtAmTYmDbcdkAJB17CeQ6bhrosZ2eYgUqUIEKVOBvD+QsxiNEe2ZyC7w47hKAC8e+AjeO+w882O4HfJvJizEL0eaZhMCp46oAqHDsHdDtuHVgxHZ6SBSoQAUqUIE6hekUplOYnmIFKlCBClSgTmE6hX3Q6BSmp1iBClSgAhX4BgYE6hY3llM6AAAAAElFTkSuQmCC" />
                </span>
                <span className="px-10 py-1 h-full hover:bg-gray-800 cursor-pointer" onClick={() => setSettings({ ...settings, system: 'polar' })}>
                    <img className="h-full rounded-full" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAFAAAABQCAQAAAAkGDomAAAHMElEQVR4AeXbA4wk+xbH8f9gbc+1bdu2bdu2bXNxbdu+s+9ac7W2dwerQffnJZPOS6fTtdPVW0k6ed/FoJBf8ZzzO6dD21hMWSgIX+HQUBAGqAxJ4BJzHZ68QF+osXESAm/HeF2TFegANFs9CYE9TMW1SQrU0WjcH5LBCZhnqQQFXoHp+oRkUOFnvJiUQItpwJkhOWwFtkxI4FOoURmSxIv4WfnCC7SxNHYMyWIZ83D8wgpUZijeDMnjOkzVfSEFHoVGK4Tk0dV43B5fYMQ+kseRuUcfW+D1mJK5CsmjTDXeCjnoYysnuNEjJuET97jEvlZVEXEfJ07EE6jMZu5UIy0/9d5xit4hg5ci3gRJ4knUqNTLpYYDmGWoJ91mHN50v3cM0wKY73XbhGBrsEVIlogo8K460OQtp1ol3z2oq13cZjTgGzV4MRSDJUMMvAAY41z923pIlNnS81KATWPd8Uu0fmNfjW4qMJ3q5TXAp9oX/hTbUBrUOiAUhHV8bozOmVsXEx3bZiDbwBi0eCsil4sWeDsm+AvcqyIsEH0NlEKz3UMIyh1rIhi6oAzXHmZjkm1C8Dk+KlSglTThcJ0NBm/oFCLQ3nlmgfetmv2Gv1Uj0p61SMiDPTViqKrWn9bWgr0LFPg2qpVlcssWfKlzyIOd/QuG2SfkYnmvggaX5R6hbc3Be/63W49hmA5tC7QT0jbMOtS5+CT3HraK90CDCzLL8h5BDRhtn+xLpBafZMvRTy0ubEugdv7CkBzJjRiY9ZuebteIlIEWCQtCpdPMAp9ZO1M//Izf9MhZ8zzUqWpD4JlosFjOtoeDY1q/L3eiaaDaBqEQ9PWAZjR7QF/3od6KIQft/IuBCxKoj1m4NIRcPIjZlrO1n8A4hygLhWN1n4FaqagMxW5IWT9k0EE1js+RMVLHPNt28AumgLmu1zXExz6Gg7l2DnnxAb7U3q4GZkXfOp+5xJJW14L9Qx509iTgFUuGYnEQgDctn2f5KpoxVT5SJuLTvEHsEGMA/ypbmPzvRwzxpDQa3Z6balrEaNDgKYdZRTUusLVL/Qa4I1eAdVSDaS4yH/uEYrE1Gi0Wgo1VkxsQrWcc4Lrch0QHEwBPapd1QJkg5g49Q/AQvgjFYhCez3xf5mgTwU82af3Numrxj9sxx5I5Ai/GLLdJ42llmSBWB96TCWJWQ9oyoRh0Uo9dskse15ufCYjrGocf9VHpdzyTLVCVOpwbgmOkcak9DQPD7Bay8COuCMVge9RpFxEQYYJ+rb/bDmmbZgkcjL+1butypMEs5+UGMefhm1AMbogqsG3jbzDeQZnfvIbvlWsVaH0p7JYJYveAtIGq8uxrVTTrFuLja5wTsex1AJ9ZJwTLm4+jfYXDfI33QlDpVNMArB/xppiKHUJ81GObkAf9NGOPTEBMeVRfN2OSX/A2mqxsaz+DMQ7xPu4LefEZzghxUQUWC3lwBEZnLtBHYJZrzADA614Fc12rU6bkHxHy4iE8EOJiPcyLWHYvBmUFxGFySSPtWZkgZnHQN+TBxXh7wYVQvj/7YHrEsg9wZdbPA9yiEQCZnFj2Ng3YPu/ezkO1XlF/ghInKHGiLvEumBmx7B1cE+sS9zYP2xR1iSMTVhqVR3ZOno31kCyHtB4hDy7HGyEu+kD+1oP9MVl5jNfMKfgj5MXjuDvExwzsFPKgu7k4LMaL+hvcHB2xnBzi4xNcEmXCxQ51KStF9GBqsVWIjyvwUUSy8BeYVFCy8ABIGagqKiDoGOJjM8zVOTrdUmv5AtKth9ESmW5diU9CMWhnKg6ISFhX9gdGW76NhPVacHRkwvoXzg3F4V68E5nyL20cpnpMdMr/PLgphIiUfyM0qwrFYT2krBhZNC3pZ8BduUWTbmaCtGtCiCyansPboXh8gldEl51d/AHSvnG5Xf2MWx3rcTMA54cQWXZeKYWtQ/HYpaDCvUY+av1bQOH+U4ggjvXRZNcFWh9lVna5D4zRjAY/G+hgndqwPl6KaX1EmEezzMe5bZlHEe5WtHnU00iMjWUeRdhvl6HRRknab8q8iqn6x7LfIgzMCh9jnMUTNDAvRtqusQ3MCAu4yjj8pndCFvCx0rgmlgXchom+hqn4Ub8ETPQzpPCksrZN9DhtiI3UYrjVF6YNodz14DkVhbUh4jRy1jcZcxxddCOnyifgPuUxGjkxWmFL+x78p6hW2GTT0BRhp0S0wuI2Ezu4Qxr8oEcMgXsCRto4bjMxfjv2AUCdu63XlkBdHe1bAKvGa8cW39B+2nDA7263i165AlVaxaleMQc0e8qvMRraCYwEVDrYR1IApvraK6ZiqHf8pRHARHdaLrGRgHhjTZZwtrfVykfK7+6zk4r4QxWJjqVkhG7vBBcZheec7SDr6Bw9XvX/OdhT8qNRJT5cVvLjeSU+4FjiI6IlP2Rb4mPKJT/oXfqj8iX9YYMS+LjGfwFgmWfRuP1uXwAAAABJRU5ErkJggg==" />
                </span>
            </div>
            <div className="w-full bg-gray-900 flex h-10 justify-around items-center">
                <span className="px-10 py-1 h-full hover:bg-gray-800 cursor-pointer" onClick={() => setSettings({ ...settings, symbol: '+' })}>+</span>
                <span className="px-10 py-1 h-full hover:bg-gray-800 cursor-pointer" onClick={() => setSettings({ ...settings, symbol: '-' })}>-</span>
                <span className="px-10 py-1 h-full hover:bg-gray-800 cursor-pointer" onClick={() => setSettings({ ...settings, symbol: '*' })}>×</span>
                <span className="px-10 py-1 h-full hover:bg-gray-800 cursor-pointer" onClick={() => setSettings({ ...settings, symbol: '/' })}>÷</span>
            </div>
        </section>
    );
}