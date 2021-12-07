import { useEffect, useRef, useState } from "react";
import { parse, ConstantNode, config, create, all, SymbolNode, FunctionNode, evaluate, unit } from 'mathjs';
import { useRecoilState, useRecoilValue } from "recoil";
import { equationAtom } from "../atoms/equation";
import { Uniform } from "../interfaces/uniform";
import { uniformsAtom } from "../atoms/uniforms";
import { settingsAtom } from "../atoms/settings";
const width = 1920;
const height = 1080;
const vs = `#version 300 es
    precision highp float;
    layout (location = 0) in vec3 a_Position;
    void main()
    {
       gl_Position = vec4(a_Position, 1.0f);
    } 
`
const fsCartesian = `#version 300 es
    precision highp float;
    uniform vec4 u_FragColor;
    uniform float time;

    #{{uniforms}}

    out vec4 outColor;

    float aastep(float threshold, float value) {
        float afwidth = 0.7 * length(vec2(dFdx(value), dFdy(value)));
        return smoothstep(threshold-afwidth, threshold+afwidth, value);
    }
      
    void main() {
        float x = gl_FragCoord.x - ${width.toFixed(1)} / 2.0;
        x /= 50.0;
        float y = gl_FragCoord.y - ${height.toFixed(1)} / 2.0;
        y /= 50.0;
        float sinTime = sin(time / 30.);
        
        float r = sqrt(pow(x, 2.0) + pow(y, 2.0));
        float theta = mod(atan(y,x) , 2.0 * 3.141592);

        float fn2 = (#{{equation}});
        float fnVal = aastep(0.02, pow(fn2 #{{symbol}} y, 2.0));
        
        outColor = vec4(fnVal, fnVal, fnVal, 1.0);
        // outColor = vec4(x, y, 1.0, 1.0);
    }
`
const fsPolar = `#version 300 es
    precision highp float;
    uniform vec4 u_FragColor;
    uniform float time;

    #{{uniforms}}

    out vec4 outColor;

    float aastep(float threshold, float value) {
        float afwidth = 0.7 * length(vec2(dFdx(value), dFdy(value)));
        return smoothstep(threshold-afwidth, threshold+afwidth, value);
    }
    
    void main() {
        float x = gl_FragCoord.x - ${width.toFixed(1)} / 2.0;
        x /= 50.0;
        float y = gl_FragCoord.y - ${height.toFixed(1)} / 2.0;
        y /= 50.0;
        float sinTime = sin(time / 30.);

        float r = sqrt(pow(x, 2.0) + pow(y, 2.0));
        float theta = mod(atan(y,x) , 2.0 * 3.141592);

        float fn2 = (#{{equation}});
        float fnVal = aastep(0.02, pow(fn2 #{{symbol}} r, 2.0));
        
        outColor = vec4(fnVal, fnVal, fnVal, 1.0);

    }
`

function initVertexBuffers(gl: WebGL2RenderingContext, program: WebGLProgram) {
    // Vertices
    const dim = 2;
    const vertices = new Float32Array([
        -1.0, 1.0, 1.0, 1.0, 1.0, -1.0, // Triangle 1
        -1.0, 1.0, 1.0, -1.0, -1.0, -1.0 // Triangle 2 
    ]);

    // Fragment color
    const rgba = [0.0, 1, 0.0, 1.0];

    // Create a buffer object
    const vertexBuffer = gl.createBuffer();
    if (!vertexBuffer) {
        console.log('Failed to create the buffer object');
        return -1;
    }
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);

    // Assign the vertices in buffer object to a_Position constiable
    const a_Position = gl.getAttribLocation(program, 'a_Position');
    if (a_Position < 0) {
        console.log('Failed to get the storage location of a_Position');
        return -1;
    }
    gl.vertexAttribPointer(a_Position, dim, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(a_Position);

    // Assign the color to u_FragColor constiable
    const u_FragColor = gl.getUniformLocation(program, 'u_FragColor');
    if (u_FragColor < 0) {
        console.log('Failed to get the storage location of u_FragColor');
        return -1;
    }
    gl.uniform4fv(u_FragColor, rgba);

    // Return number of vertices
    return vertices.length / dim;
}

function initShaders(gl: WebGL2RenderingContext, vs_source: string, fs_source: string) {
    // Compile shaders
    const vertexShader = makeShader(gl, vs_source, gl.VERTEX_SHADER);
    const fragmentShader = makeShader(gl, fs_source, gl.FRAGMENT_SHADER);

    // Create program
    const glProgram = gl.createProgram();

    // Attach and link shaders to the program
    gl.attachShader(glProgram, vertexShader);
    gl.attachShader(glProgram, fragmentShader);
    gl.linkProgram(glProgram);
    if (!gl.getProgramParameter(glProgram, gl.LINK_STATUS)) {
        console.log("Unable to initialize the shader program");
        return false;
    }

    // Use program
    gl.useProgram(glProgram);

    return glProgram;
}

function makeShader(gl: WebGL2RenderingContext, src: string, type: number) {
    const shader = gl.createShader(type);
    gl.shaderSource(shader, src);
    gl.compileShader(shader);
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        console.log("Error compiling shader: " + gl.getShaderInfoLog(shader));
        return;
    }
    return shader;
}


function populateUniforms(gl: WebGL2RenderingContext, program: WebGLProgram, uniforms: Uniform[]) {
    uniforms.forEach(u => {
        const shaderU = gl.getUniformLocation(program, u.name);
        const e = evaluate(u.value, {
            pi: Math.PI,
            // all uniform names to values
            ...uniforms.reduce((acc, curr) => ({ ...acc, [curr.name]: curr.value }), {})
        });
        const f = parseFloat(e);
        gl.uniform1f(shaderU, isNaN(f) ? 0 : f);
    })
    return 0;
}
function generateShader(shader: string, uniforms: Uniform[], equation: string, symbol: string) {
    shader = shader.replace(/#{{equation}}/g, equation);
    shader = shader.replace(/#{{symbol}}/g, symbol);
    shader = shader.replace(/#{{uniforms}}/g, uniforms.map(u => `uniform float ${u.name};`).join(''))
    return shader;
}

export default function Graph() {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const rawEquation = useRecoilValue(equationAtom);
    const settings = useRecoilValue(settingsAtom);
    const [rawUniforms, setRawUniforms] = useRecoilState(uniformsAtom);
    useEffect(() => {
        let cancelDraw = false;
        try {
            const canvas = canvasRef.current;
            const gl = canvas.getContext("webgl2");
            if (!gl) {
                console.log("Failed to get the rendering context for WebGL");
                return;
            }

            // Init shaders
            const uniforms: Uniform[] = [];
            const reserved = [
                'pi',
                'time',
                'width',
                'height',
                'x',
                'y',
                'r',
                'theta'
            ]
            const fns: string[] = [];
            const mathjs = create(all);
            const eq = mathjs.parse(rawEquation);
            eq.traverse((n, _, _p) => {
                if (n.type === "FunctionNode") {
                    const f = (n as FunctionNode);
                    fns.push(f.fn.name);
                    return;
                }
                if (n.type === "SymbolNode") {
                    console.log(n);
                    const s = (n as SymbolNode);
                    if (!(reserved.includes(s.name) || uniforms.includes({ name: s.name, value: "0" }) || fns.includes(s.name))) {
                        uniforms.push({ name: s.name, value: rawUniforms.find(u => u.name === s.name)?.value ?? "0" });
                    }
                }
            })
            console.log(uniforms, fns);
            if (JSON.stringify(uniforms) !== JSON.stringify(rawUniforms)) {
                setRawUniforms(uniforms);
            }
            const equation = mathjs.format(mathjs.simplify(eq, ['n1^n2 -> pow(n1,n2)', `pi -> ${Math.PI}`]), { notation: "fixed", precision: 10 });
            const fs = generateShader(settings.system === 'cartesian' ? fsCartesian : fsPolar, uniforms, equation, settings.symbol);
            const program = initShaders(gl, vs, fs);

            if (!program) {
                console.log('Failed to intialize shaders.');
                return;
            }
            populateUniforms(gl, program, uniforms);


            // Write the positions of vertices to a vertex shader
            const n = initVertexBuffers(gl, program);
            if (n < 0) {
                console.log('Failed to set the positions of the vertices');
                return;
            }

            // Clear canvas
            gl.clearColor(0.0, 0.0, 0.0, 1.0);
            gl.clear(gl.COLOR_BUFFER_BIT);

            // Draw
            const draw = (gl: WebGL2RenderingContext, num: number) => {
                const time = gl.getUniformLocation(program, 'time');
                if (time < 0) {
                    console.log('Failed to get the storage location of time');
                    return -1;
                }
                gl.uniform1f(time, num);
                populateUniforms(gl, program, rawUniforms);
                gl.drawArrays(gl.TRIANGLES, 0, n);
                if (!cancelDraw) {
                    requestAnimationFrame(() => draw(gl, num + 1));
                }
            }
            requestAnimationFrame(() => draw(gl, 0));
        } catch (e) {
            console.log(e);
            return;
        }
        return () => { cancelDraw = true; }
    }, [rawEquation, rawUniforms, settings]);
    return (
        <main className="w-full h-full bg-blue-200 text-xl grid place-items-center">
            <canvas ref={canvasRef} className="w-full h-full" width={width} height={height} />
        </main>
    );
}