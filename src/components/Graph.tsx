import { useEffect, useRef } from "react";
const vs = `#version 300 es
    precision highp float;
    layout (location = 0) in vec3 a_Position;
    void main()
    {
       gl_Position = vec4(a_Position, 1.0f);
    } 
`
const fs = `#version 300 es
    precision highp float;
    uniform vec4 u_FragColor;
    uniform float time;
    out vec4 outColor;
    void main() {
        float x = gl_FragCoord.x - 1920.0 / 2.0;
        x /= 50.0;
        float y = gl_FragCoord.y - 1080.0 / 2.0;
        // float fnVal =cos(10. * (pow(x,2.)+pow(y,2.)))/1.;
        // float fn2 = sin(x) / 0.008;
        // float sinTime = cos(time / 30.);
        float fn2 = (sin(x) + sin(x + time / 10.)) / 0.008;
        float fnVal = cosh(fn2 -  y / .5) / 1000.;
        
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
        alert("Unable to initialize the shader program");
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
        alert("Error compiling shader: " + gl.getShaderInfoLog(shader));
        return;
    }
    return shader;
}

export default function Graph() {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    useEffect(() => {
        const canvas = canvasRef.current;
        const gl = canvas.getContext("webgl2");
        if (!gl) {
            console.log("Failed to get the rendering context for WebGL");
            return;
        }

        // Init shaders
        const program = initShaders(gl, vs, fs);
        if (!program) {
            console.log('Failed to intialize shaders.');
            return;
        }

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
            gl.drawArrays(gl.TRIANGLES, 0, n);
            requestAnimationFrame(() => draw(gl, num + 1));
        }
        requestAnimationFrame(() => draw(gl, 0));
    }, []);
    return (
        <main className="w-full h-full bg-blue-200 text-xl grid place-items-center">
            <canvas ref={canvasRef} className="w-full h-full" width={1920} height={1080} />
        </main>
    );
}