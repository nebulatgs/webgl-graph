import { useEffect, useRef } from "react";

export default function Graph() {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    useEffect(() => {
        const ctx = canvasRef.current?.getContext("2d");
        ctx.fillStyle = "red";
        for (let i = 0; i < 1920; i+=0.01) {
            ctx.fillRect(i, (Math.sin(i / 100) * 100 + 500), 1, 1);
        }
    }, []);
    return (
        <main className="w-full h-full bg-blue-200 text-xl grid place-items-center">
            <canvas ref={canvasRef} className="w-full h-full" width={1920} height={1080}/>
        </main>
    );
}