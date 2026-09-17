import { useEffect, useRef } from "react";
import "./InteractiveNeuralVortexBackground.css";

export default function InteractiveNeuralVortexBackground() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animationRef = useRef<number | null>(null);

  const pointer = useRef({
    x: 0,
    y: 0,
    targetX: 0,
    targetY: 0,
  });

  useEffect(() => {
    const canvas = canvasRef.current;

    if (!canvas) return;

    const gl = canvas.getContext("webgl", {
      alpha: true,
      antialias: true,
      powerPreference: "high-performance",
    });

    if (!gl) {
      console.warn("WebGL no está disponible en este navegador.");
      return;
    }

    // =========================================================
    // SHADERS
    // =========================================================

    const vertexShaderSource = `
      precision mediump float;

      attribute vec2 a_position;

      varying vec2 vUv;

      void main() {
        vUv = 0.5 * (a_position + 1.0);

        gl_Position = vec4(
          a_position,
          0.0,
          1.0
        );
      }
    `;

    const fragmentShaderSource = `
      precision mediump float;

      varying vec2 vUv;

      uniform float u_time;
      uniform float u_ratio;
      uniform vec2 u_pointer_position;

      vec2 rotate2D(
        vec2 point,
        float angle
      ) {
        float s = sin(angle);
        float c = cos(angle);

        return mat2(
          c, s,
          -s, c
        ) * point;
      }

      float neuroShape(
        vec2 uv,
        float time,
        float pointerForce
      ) {
        vec2 sineAccumulator = vec2(0.0);
        vec2 result = vec2(0.0);

        float scale = 8.0;

        for (int i = 0; i < 15; i++) {
          uv = rotate2D(
            uv,
            1.0
          );

          sineAccumulator = rotate2D(
            sineAccumulator,
            1.0
          );

          vec2 layer =
            uv * scale +
            float(i) +
            sineAccumulator -
            time;

          sineAccumulator +=
            sin(layer) +
            2.4 * pointerForce;

          result +=
            (
              0.5 +
              0.5 * cos(layer)
            ) / scale;

          scale *= 1.2;
        }

        return result.x + result.y;
      }

      void main() {
        vec2 uv = 0.5 * vUv;

        uv.x *= u_ratio;

        vec2 pointerDistance =
          vUv -
          u_pointer_position;

        pointerDistance.x *=
          u_ratio;

        float pointerForce =
          clamp(
            length(pointerDistance),
            0.0,
            1.0
          );

        pointerForce =
          0.5 *
          pow(
            1.0 - pointerForce,
            2.0
          );

        float time =
          0.001 * u_time;

        float noise =
          neuroShape(
            uv,
            time,
            pointerForce
          );

        noise =
          1.2 *
          pow(
            noise,
            3.0
          );

        noise +=
          pow(
            noise,
            10.0
          );

        noise =
          max(
            0.0,
            noise - 0.5
          );

        float vignette =
          1.0 -
          length(
            vUv - 0.5
          );

        noise *=
          max(
            vignette,
            0.0
          );

        // =====================================================
        // CYBER_SOC COLOR PALETTE
        // =====================================================

        vec3 deepPurple =
          vec3(
            0.20,
            0.015,
            0.42
          );

        vec3 cyberPurple =
          vec3(
            0.55,
            0.10,
            0.95
          );

        vec3 blueViolet =
          vec3(
            0.05,
            0.26,
            0.55
          );

        float pulse =
          0.5 +
          0.5 *
          sin(
            time * 0.45
          );

        vec3 color =
          mix(
            deepPurple,
            cyberPurple,
            0.62
          );

        color =
          mix(
            color,
            blueViolet,
            0.12 +
            pulse * 0.08
          );

        color *= noise;

        gl_FragColor =
          vec4(
            color,
            noise * 0.60
          );
      }
    `;

    // =========================================================
    // SHADER COMPILATION
    // =========================================================

    const compileShader = (
      source: string,
      type: number
    ): WebGLShader | null => {
      const shader =
        gl.createShader(type);

      if (!shader) return null;

      gl.shaderSource(
        shader,
        source
      );

      gl.compileShader(
        shader
      );

      const compiled =
        gl.getShaderParameter(
          shader,
          gl.COMPILE_STATUS
        );

      if (!compiled) {
        console.error(
          "Shader compilation error:",
          gl.getShaderInfoLog(shader)
        );

        gl.deleteShader(shader);

        return null;
      }

      return shader;
    };

    const vertexShader =
      compileShader(
        vertexShaderSource,
        gl.VERTEX_SHADER
      );

    const fragmentShader =
      compileShader(
        fragmentShaderSource,
        gl.FRAGMENT_SHADER
      );

    if (
      !vertexShader ||
      !fragmentShader
    ) {
      return;
    }

    // =========================================================
    // PROGRAM
    // =========================================================

    const program =
      gl.createProgram();

    if (!program) return;

    gl.attachShader(
      program,
      vertexShader
    );

    gl.attachShader(
      program,
      fragmentShader
    );

    gl.linkProgram(
      program
    );

    const linked =
      gl.getProgramParameter(
        program,
        gl.LINK_STATUS
      );

    if (!linked) {
      console.error(
        "WebGL program error:",
        gl.getProgramInfoLog(program)
      );

      gl.deleteProgram(program);

      return;
    }

    gl.useProgram(program);

    // =========================================================
    // FULLSCREEN QUAD
    // =========================================================

    const vertices =
      new Float32Array([
        -1, -1,
         1, -1,
        -1,  1,
         1,  1,
      ]);

    const vertexBuffer =
      gl.createBuffer();

    if (!vertexBuffer) return;

    gl.bindBuffer(
      gl.ARRAY_BUFFER,
      vertexBuffer
    );

    gl.bufferData(
      gl.ARRAY_BUFFER,
      vertices,
      gl.STATIC_DRAW
    );

    const positionLocation =
      gl.getAttribLocation(
        program,
        "a_position"
      );

    gl.enableVertexAttribArray(
      positionLocation
    );

    gl.vertexAttribPointer(
      positionLocation,
      2,
      gl.FLOAT,
      false,
      0,
      0
    );

    // =========================================================
    // UNIFORMS
    // =========================================================

    const timeLocation =
      gl.getUniformLocation(
        program,
        "u_time"
      );

    const ratioLocation =
      gl.getUniformLocation(
        program,
        "u_ratio"
      );

    const pointerLocation =
      gl.getUniformLocation(
        program,
        "u_pointer_position"
      );

    // =========================================================
    // RESIZE
    // =========================================================

    const resize = () => {
      const dpr =
        Math.min(
          window.devicePixelRatio || 1,
          2
        );

      const width =
        window.innerWidth;

      const height =
        window.innerHeight;

      canvas.width =
        Math.floor(
          width * dpr
        );

      canvas.height =
        Math.floor(
          height * dpr
        );

      gl.viewport(
        0,
        0,
        canvas.width,
        canvas.height
      );

      if (ratioLocation) {
        gl.uniform1f(
          ratioLocation,
          canvas.width /
            canvas.height
        );
      }
    };

    // =========================================================
    // POINTER
    // =========================================================

    const handlePointerMove = (
      event: PointerEvent
    ) => {
      pointer.current.targetX =
        event.clientX;

      pointer.current.targetY =
        event.clientY;
    };

    // =========================================================
    // ANIMATION
    // =========================================================

    const reducedMotion =
      window.matchMedia(
        "(prefers-reduced-motion: reduce)"
      ).matches;

    const render = () => {
      pointer.current.x +=
        (
          pointer.current.targetX -
          pointer.current.x
        ) * 0.08;

      pointer.current.y +=
        (
          pointer.current.targetY -
          pointer.current.y
        ) * 0.08;

      if (timeLocation) {
        gl.uniform1f(
          timeLocation,
          performance.now()
        );
      }

      if (pointerLocation) {
        gl.uniform2f(
          pointerLocation,
          pointer.current.x /
            window.innerWidth,
          1 -
            pointer.current.y /
              window.innerHeight
        );
      }

      gl.drawArrays(
        gl.TRIANGLE_STRIP,
        0,
        4
      );

      if (!reducedMotion) {
        animationRef.current =
          requestAnimationFrame(
            render
          );
      }
    };

    // =========================================================
    // START
    // =========================================================

    resize();

    pointer.current.x =
      window.innerWidth / 2;

    pointer.current.y =
      window.innerHeight / 2;

    pointer.current.targetX =
      window.innerWidth / 2;

    pointer.current.targetY =
      window.innerHeight / 2;

    window.addEventListener(
      "resize",
      resize
    );

    window.addEventListener(
      "pointermove",
      handlePointerMove
    );

    render();

    // =========================================================
    // CLEANUP
    // =========================================================

    return () => {
      window.removeEventListener(
        "resize",
        resize
      );

      window.removeEventListener(
        "pointermove",
        handlePointerMove
      );

      if (
        animationRef.current !== null
      ) {
        cancelAnimationFrame(
          animationRef.current
        );
      }

      gl.deleteBuffer(
        vertexBuffer
      );

      gl.deleteProgram(
        program
      );

      gl.deleteShader(
        vertexShader
      );

      gl.deleteShader(
        fragmentShader
      );
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="cyber-neural-vortex"
      aria-hidden="true"
    />
  );
}