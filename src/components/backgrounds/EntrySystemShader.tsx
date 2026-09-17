import { useEffect, useRef } from "react";
import * as THREE from "three";
import "./EntrySystemShader.css";

type ShaderUniforms = {
  resolution: THREE.IUniform<THREE.Vector2>;
  time: THREE.IUniform<number>;
  xScale: THREE.IUniform<number>;
  yScale: THREE.IUniform<number>;
  distortion: THREE.IUniform<number>;
};

export default function EntrySystemShader() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animationRef = useRef<number | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const vertexShader = `
      precision highp float;

      attribute vec3 position;

      void main() {
        gl_Position = vec4(position.xy, 0.0, 1.0);
      }
    `;

    const fragmentShader = `
      precision highp float;

      uniform vec2 resolution;
      uniform float time;
      uniform float xScale;
      uniform float yScale;
      uniform float distortion;

      void main() {
        vec2 p =
          (gl_FragCoord.xy * 2.0 - resolution)
          / min(resolution.x, resolution.y);

        float d =
          length(p) * distortion;

        float rx =
          p.x * (1.0 + d);

        float gx =
          p.x;

        float bx =
          p.x * (1.0 - d);

        float waveA =
          0.042 /
          max(
            abs(
              p.y +
              sin(
                (rx + time) * xScale
              ) * yScale
            ),
            0.002
          );

        float waveB =
          0.035 /
          max(
            abs(
              p.y +
              sin(
                (gx + time) * xScale
              ) * yScale
            ),
            0.002
          );

        float waveC =
          0.030 /
          max(
            abs(
              p.y +
              sin(
                (bx + time) * xScale
              ) * yScale
            ),
            0.002
          );

        /*
         * CYBER_SOC palette
         *
         * deep navy
         * violet
         * electric purple
         * subtle blue-violet
         */

        vec3 deep =
          vec3(
            0.005,
            0.004,
            0.025
          );

        vec3 violet =
          vec3(
            0.42,
            0.06,
            0.95
          );

        vec3 purple =
          vec3(
            0.72,
            0.16,
            1.00
          );

        vec3 blueViolet =
          vec3(
            0.04,
            0.28,
            0.62
          );

        float violetStrength =
          clamp(
            waveA,
            0.0,
            2.2
          );

        float purpleStrength =
          clamp(
            waveB,
            0.0,
            1.7
          );

        float blueStrength =
          clamp(
            waveC,
            0.0,
            1.4
          );

        vec3 color = deep;

        color +=
          violet *
          violetStrength *
          0.86;

        color +=
          purple *
          purpleStrength *
          0.42;

        color +=
          blueViolet *
          blueStrength *
          0.32;

        /*
         * Slight cinematic falloff toward
         * the edges of the screen.
         */

        float vignette =
          1.0 -
          smoothstep(
            0.55,
            1.75,
            length(p)
          );

        color *=
          mix(
            0.28,
            1.0,
            vignette
          );

        /*
         * Simple tone mapping keeps the
         * bright line controlled.
         */

        color =
          1.0 -
          exp(
            -color * 1.15
          );

        gl_FragColor =
          vec4(
            color,
            1.0
          );
      }
    `;

    const renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: false,
      alpha: false,
      powerPreference: "high-performance",
    });

    renderer.setClearColor(
      new THREE.Color("#010105"),
      1
    );

    const scene =
      new THREE.Scene();

    const camera =
      new THREE.OrthographicCamera(
        -1,
        1,
        1,
        -1,
        -1,
        1
      );

    const uniforms: ShaderUniforms = {
      resolution: {
        value:
          new THREE.Vector2(
            1,
            1
          ),
      },

      time: {
        value: 0,
      },

      xScale: {
        value: 1.15,
      },

      yScale: {
        value: 0.42,
      },

      distortion: {
        value: 0.065,
      },
    };

    const positions =
      new Float32Array([
        -1, -1, 0,
         1, -1, 0,
        -1,  1, 0,

         1, -1, 0,
        -1,  1, 0,
         1,  1, 0,
      ]);

    const geometry =
      new THREE.BufferGeometry();

    geometry.setAttribute(
      "position",
      new THREE.BufferAttribute(
        positions,
        3
      )
    );

    const material =
      new THREE.RawShaderMaterial({
        vertexShader,
        fragmentShader,
        uniforms,
        side: THREE.DoubleSide,
        depthTest: false,
        depthWrite: false,
      });

    const mesh =
      new THREE.Mesh(
        geometry,
        material
      );

    mesh.frustumCulled = false;

    scene.add(mesh);

    const handleResize = () => {
      const width =
        window.innerWidth;

      const height =
        window.innerHeight;

      const dpr =
        Math.min(
          window.devicePixelRatio || 1,
          2
        );

      renderer.setPixelRatio(dpr);

      renderer.setSize(
        width,
        height,
        false
      );

      /*
       * gl_FragCoord uses physical pixels,
       * therefore resolution must match the
       * real drawing buffer dimensions.
       */
      uniforms.resolution.value.set(
        canvas.width,
        canvas.height
      );
    };

    const reducedMotion =
      window.matchMedia(
        "(prefers-reduced-motion: reduce)"
      ).matches;

    const startTime =
      performance.now();
    let isActive = true;

    const animate = (
      now: number
    ) => {
      if (!isActive) return;

      /*
       * Slow movement.
       * The divisor controls animation speed.
       */
      uniforms.time.value =
        (now - startTime) /
        1450;

      renderer.render(
        scene,
        camera
      );

      if (isActive) {
        animationRef.current =
          requestAnimationFrame(
            animate
          );
      }
    };

    handleResize();

    window.addEventListener(
      "resize",
      handleResize
    );

    if (reducedMotion) {
      uniforms.time.value = 0.35;

      renderer.render(
        scene,
        camera
      );
    } else {
      animate(startTime);
    }

    return () => {
      isActive = false;

      window.removeEventListener(
        "resize",
        handleResize
      );

      if (
        animationRef.current !== null
      ) {
        cancelAnimationFrame(
          animationRef.current
        );
      }

      scene.remove(mesh);

      geometry.dispose();
      material.dispose();

      renderer.setAnimationLoop(null);
      renderer.renderLists.dispose();
      renderer.dispose();
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="cyber-entry-shader"
      aria-hidden="true"
    />
  );
}
