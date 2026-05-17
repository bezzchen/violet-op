"use client";

import { RefObject, useEffect, useRef } from "react";

type PrismCanvasProps = {
  scrollContainerRef: RefObject<HTMLElement | null>;
};

const vertexShaderSource = `
attribute vec2 a_position;

void main() {
  gl_Position = vec4(a_position, 0.0, 1.0);
}
`;

const fragmentShaderSource = `
precision highp float;

uniform vec2 u_resolution;
uniform float u_time;
uniform float u_scroll;

float hash(vec2 p) {
  p = fract(p * vec2(123.34, 456.21));
  p += dot(p, p + 45.32);
  return fract(p.x * p.y);
}

float noise(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  f = f * f * (3.0 - 2.0 * f);

  float a = hash(i);
  float b = hash(i + vec2(1.0, 0.0));
  float c = hash(i + vec2(0.0, 1.0));
  float d = hash(i + vec2(1.0, 1.0));

  return mix(mix(a, b, f.x), mix(c, d, f.x), f.y);
}

float fbm(vec2 p) {
  float value = 0.0;
  float amplitude = 0.5;

  for (int i = 0; i < 4; i++) {
    value += amplitude * noise(p);
    p = mat2(1.6, 1.2, -1.2, 1.6) * p + 9.7;
    amplitude *= 0.5;
  }

  return value;
}

mat2 rotate2d(float angle) {
  float s = sin(angle);
  float c = cos(angle);
  return mat2(c, -s, s, c);
}

float sheet(vec2 p, float offset, float width, float softness) {
  return 1.0 - smoothstep(width, width + softness, abs(p.x - offset));
}

vec3 palette(float t) {
  vec3 ink = vec3(0.015, 0.002, 0.024);
  vec3 deep = vec3(0.105, 0.012, 0.18);
  vec3 violet = vec3(0.33, 0.02, 0.55);
  vec3 electric = vec3(0.72, 0.24, 1.0);
  vec3 pearl = vec3(0.96, 0.86, 1.0);

  vec3 color = mix(ink, deep, smoothstep(0.0, 0.34, t));
  color = mix(color, violet, smoothstep(0.22, 0.72, t));
  color = mix(color, electric, smoothstep(0.52, 0.96, t));
  color = mix(color, pearl, smoothstep(0.9, 1.0, t) * 0.7);

  return color;
}

void main() {
  vec2 uv = gl_FragCoord.xy / u_resolution.xy;
  vec2 p = uv * 2.0 - 1.0;
  p.x *= u_resolution.x / u_resolution.y;

  float scroll = u_scroll;
  float time = u_time * 0.11;
  float sweep = scroll - 0.5;

  vec2 center = p - vec2(0.18 + sweep * 0.34, -0.05 + sin(scroll * 3.14159) * 0.08);
  float radius = length(center);
  float angle = atan(center.y, center.x);
  float swirl = (0.42 + scroll * 0.58) * exp(-radius * 0.95);
  angle += swirl + sin(radius * 6.0 - time * 2.0 + scroll * 4.0) * 0.06;

  vec2 warped = vec2(cos(angle), sin(angle)) * radius;
  warped += vec2(sin(warped.y * 3.4 + time + scroll * 2.0), cos(warped.x * 2.6 - time)) * 0.055;
  warped += (fbm(warped * 2.1 + vec2(time, -time) + scroll * 1.8) - 0.5) * 0.13;

  vec2 prism = rotate2d(-0.42 + scroll * 0.18) * warped;
  prism.x += sweep * -0.5;
  prism.y += sin(scroll * 3.14159) * 0.12;

  float leftShade = smoothstep(-1.2, 0.72, p.x);
  float rightGlow = smoothstep(-0.18, 1.18, p.x);

  float broad = sheet(prism, -0.44, 0.16, 0.34) * 0.45;
  float mid = sheet(prism, -0.04 + scroll * 0.12, 0.07, 0.18) * 0.78;
  float front = sheet(prism, 0.38 + sin(time + scroll * 5.0) * 0.06, 0.10, 0.22);
  float blade = sheet(prism, 0.72 - scroll * 0.16, 0.035, 0.08) * 1.35;
  float shadowCut = smoothstep(0.02, 0.2, abs(prism.x - 0.19)) * 0.2;

  float luminous = broad + mid + front + blade;
  float caustic = pow(max(0.0, sin((prism.x + prism.y * 0.14) * 16.0 + time * 3.0)), 8.0);
  float smoke = fbm(warped * 1.35 + vec2(scroll * 1.2, time));
  float depth = smoothstep(0.12, 1.18, radius);

  vec3 color = palette(leftShade * 0.48 + rightGlow * 0.42 + luminous * 0.4);
  color *= 0.34 + rightGlow * 0.92;
  color += vec3(0.25, 0.02, 0.42) * smoke * (0.2 + rightGlow * 0.44);
  color += vec3(0.96, 0.72, 1.0) * caustic * (0.05 + luminous * 0.2);
  color += vec3(0.66, 0.15, 1.0) * luminous * (0.22 + rightGlow * 0.45);
  color *= 1.0 - depth * 0.3;
  color *= 0.74 + shadowCut;

  float leftVignette = smoothstep(-1.25, 0.35, p.x);
  color *= 0.52 + leftVignette * 0.68;

  float grain = hash(gl_FragCoord.xy + u_time) - 0.5;
  color += grain * 0.018;

  gl_FragColor = vec4(color, 1.0);
}
`;

function createShader(
  gl: WebGLRenderingContext,
  type: number,
  source: string,
) {
  const shader = gl.createShader(type);

  if (!shader) {
    return null;
  }

  gl.shaderSource(shader, source);
  gl.compileShader(shader);

  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    gl.deleteShader(shader);
    return null;
  }

  return shader;
}

function createProgram(gl: WebGLRenderingContext) {
  const vertexShader = createShader(gl, gl.VERTEX_SHADER, vertexShaderSource);
  const fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, fragmentShaderSource);

  if (!vertexShader || !fragmentShader) {
    return null;
  }

  const program = gl.createProgram();

  if (!program) {
    return null;
  }

  gl.attachShader(program, vertexShader);
  gl.attachShader(program, fragmentShader);
  gl.linkProgram(program);
  gl.deleteShader(vertexShader);
  gl.deleteShader(fragmentShader);

  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    gl.deleteProgram(program);
    return null;
  }

  return program;
}

export default function PrismCanvas({ scrollContainerRef }: PrismCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const scrollContainer = scrollContainerRef.current;

    if (!canvas || !scrollContainer) {
      return;
    }

    const gl = canvas.getContext("webgl", {
      alpha: false,
      antialias: false,
      depth: false,
      powerPreference: "high-performance",
      premultipliedAlpha: false,
      stencil: false,
    });

    if (!gl) {
      return;
    }

    const program = createProgram(gl);

    if (!program) {
      return;
    }

    const positionBuffer = gl.createBuffer();
    const positionLocation = gl.getAttribLocation(program, "a_position");
    const resolutionLocation = gl.getUniformLocation(program, "u_resolution");
    const timeLocation = gl.getUniformLocation(program, "u_time");
    const scrollLocation = gl.getUniformLocation(program, "u_scroll");

    if (!positionBuffer || positionLocation < 0) {
      gl.deleteProgram(program);
      return;
    }

    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1]),
      gl.STATIC_DRAW,
    );

    let animationFrame = 0;
    let scrollProgress = 0;
    let targetScrollProgress = 0;

    const updateScrollProgress = () => {
      const maxScroll = Math.max(
        scrollContainer.scrollHeight - scrollContainer.clientHeight,
        1,
      );

      targetScrollProgress = Math.min(
        Math.max(scrollContainer.scrollTop / maxScroll, 0),
        1,
      );
    };

    const resize = () => {
      const pixelRatio = Math.min(window.devicePixelRatio || 1, 1.5);
      const width = Math.max(1, Math.floor(window.innerWidth * pixelRatio));
      const height = Math.max(1, Math.floor(window.innerHeight * pixelRatio));

      if (canvas.width !== width || canvas.height !== height) {
        canvas.width = width;
        canvas.height = height;
      }

      gl.viewport(0, 0, width, height);
    };

    const render = (time: number) => {
      scrollProgress += (targetScrollProgress - scrollProgress) * 0.085;

      gl.useProgram(program);
      gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
      gl.enableVertexAttribArray(positionLocation);
      gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);
      gl.uniform2f(resolutionLocation, canvas.width, canvas.height);
      gl.uniform1f(timeLocation, time * 0.001);
      gl.uniform1f(scrollLocation, scrollProgress);
      gl.drawArrays(gl.TRIANGLES, 0, 6);

      animationFrame = window.requestAnimationFrame(render);
    };

    resize();
    updateScrollProgress();
    animationFrame = window.requestAnimationFrame(render);

    scrollContainer.addEventListener("scroll", updateScrollProgress, { passive: true });
    window.addEventListener("resize", resize);

    return () => {
      scrollContainer.removeEventListener("scroll", updateScrollProgress);
      window.removeEventListener("resize", resize);
      window.cancelAnimationFrame(animationFrame);
      gl.deleteBuffer(positionBuffer);
      gl.deleteProgram(program);
    };
  }, [scrollContainerRef]);

  return (
    <div aria-hidden="true" className="prism-canvas-background">
      <canvas className="prism-canvas" ref={canvasRef} />
    </div>
  );
}
