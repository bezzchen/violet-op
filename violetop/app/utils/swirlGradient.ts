// The homepage swirl: violetdiabolo's ribbon shader (the club's sister site), ported.

const VERTEX_SHADER = `
attribute vec2 a_position;
void main() { gl_Position = vec4(a_position, 0.0, 1.0); }
`;

const FRAGMENT_SHADER = `
precision highp float;

uniform vec2 u_resolution;
uniform float u_time;
uniform vec3 u_deep;
uniform vec3 u_mid;
uniform vec3 u_bright;

// Ashima Arts' 2D simplex noise (MIT).
vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
vec2 mod289(vec2 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
vec3 permute(vec3 x) { return mod289(((x * 34.0) + 1.0) * x); }

float snoise(vec2 v) {
  const vec4 C = vec4(0.211324865405187, 0.366025403784439,
                     -0.577350269189626, 0.024390243902439);
  vec2 i  = floor(v + dot(v, C.yy));
  vec2 x0 = v - i + dot(i, C.xx);
  vec2 i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
  vec4 x12 = x0.xyxy + C.xxzz;
  x12.xy -= i1;
  i = mod289(i);
  vec3 p = permute(permute(i.y + vec3(0.0, i1.y, 1.0)) + i.x + vec3(0.0, i1.x, 1.0));
  vec3 m = max(0.5 - vec3(dot(x0, x0), dot(x12.xy, x12.xy), dot(x12.zw, x12.zw)), 0.0);
  m = m * m; m = m * m;
  vec3 x = 2.0 * fract(p * C.www) - 1.0;
  vec3 h = abs(x) - 0.5;
  vec3 ox = floor(x + 0.5);
  vec3 a0 = x - ox;
  m *= 1.79284291400159 - 0.85373472095314 * (a0 * a0 + h * h);
  vec3 g;
  g.x  = a0.x * x0.x + h.x * x0.y;
  g.yz = a0.yz * x12.xz + h.yz * x12.yw;
  return 130.0 * dot(m, g);
}

// One ribbon: a bright core inside a soft, wide falloff to black.
float ribbon(float d, float w) {
  float f = 1.0 - smoothstep(0.0, w, abs(d));
  float f2 = f * f;
  return f2 * (0.42 + 0.58 * f2 * f2);
}

void main() {
  // Centred before the aspect correction, so a narrower screen sees less of the same pattern.
  vec2 p = gl_FragCoord.xy / u_resolution - 0.5;
  p.x *= u_resolution.x / u_resolution.y;

  float t = u_time;

  // Ribbons run about 36 degrees above horizontal, bottom-left to top-right.
  float a = 0.95;
  mat2 rot = mat2(cos(a), sin(a), -sin(a), cos(a));
  vec2 q = rot * p;

  // Two warp octaves drifting against each other turn straight bands into swirls.
  float w1 = snoise(q * 0.80 + vec2(0.0, t * 0.055));
  float w2 = snoise(q * 1.90 - vec2(t * 0.031, 0.0));
  float warped = q.x + w1 * 0.32 + w2 * 0.14;

  // Three ribbons combined with max(), so overlaps never flatten into a plateau.
  float band = 0.0;
  band = max(band, ribbon(warped + 0.62, 0.30) * 0.85);
  band = max(band, ribbon(warped - 0.02, 0.34) * 1.00);
  band = max(band, ribbon(warped - 0.72, 0.26) * 0.62);

  // Ribbons swell and fade along their length.
  band *= 0.52 + 0.48 * (0.5 + 0.5 * w1);

  vec3 col = mix(u_deep, u_mid, smoothstep(0.0, 1.0, band));
  col = mix(col, u_bright, smoothstep(0.45, 1.0, band));

  gl_FragColor = vec4(col, 1.0);
}
`;

// Near-black ground, then two violets; the shader mixes through them in this order.
const PALETTE = {
  deep: [0.031, 0.024, 0.051],
  mid: [0.322, 0.118, 0.62],
  bright: [0.502, 0.141, 1.0],
} as const;

export type SwirlGradient = {
  /** Advances the swirl by `elapsedSeconds` at `rate` shader-time units per second, then draws. */
  render(elapsedSeconds: number, rate: number): void;
  /** Sets the framebuffer size. This clears the canvas, so draw again afterwards. */
  resize(width: number, height: number): void;
  dispose(): void;
};

function compileShader(gl: WebGLRenderingContext, type: number, source: string) {
  const shader = gl.createShader(type);
  if (!shader) return null;
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  if (gl.getShaderParameter(shader, gl.COMPILE_STATUS)) return shader;
  console.error("[swirl] shader failed to compile:", gl.getShaderInfoLog(shader));
  gl.deleteShader(shader);
  return null;
}

function createProgram(gl: WebGLRenderingContext) {
  const vertex = compileShader(gl, gl.VERTEX_SHADER, VERTEX_SHADER);
  const fragment = compileShader(gl, gl.FRAGMENT_SHADER, FRAGMENT_SHADER);
  const program = vertex && fragment ? gl.createProgram() : null;
  if (program && vertex && fragment) {
    gl.attachShader(program, vertex);
    gl.attachShader(program, fragment);
    gl.linkProgram(program);
  }
  if (vertex) gl.deleteShader(vertex);
  if (fragment) gl.deleteShader(fragment);
  if (!program) return null;
  if (gl.getProgramParameter(program, gl.LINK_STATUS)) return program;
  console.error("[swirl] program failed to link:", gl.getProgramInfoLog(program));
  gl.deleteProgram(program);
  return null;
}

/** Sets up the swirl on a canvas, or returns null when WebGL is missing or software-rendered. */
export function createSwirlGradient(canvas: HTMLCanvasElement): SwirlGradient | null {
  const gl = canvas.getContext("webgl", {
    antialias: false,
    depth: false,
    failIfMajorPerformanceCaveat: true,
    powerPreference: "low-power",
    stencil: false,
  });
  if (!gl) return null;
  const program = createProgram(gl);
  if (!program) return null;
  gl.useProgram(program);

  // Two triangles covering clip space: the whole geometry.
  const buffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1]), gl.STATIC_DRAW);
  const position = gl.getAttribLocation(program, "a_position");
  gl.enableVertexAttribArray(position);
  gl.vertexAttribPointer(position, 2, gl.FLOAT, false, 0, 0);

  const uniform = (name: string) => gl.getUniformLocation(program, name);
  const timeUniform = uniform("u_time");
  const resolutionUniform = uniform("u_resolution");
  gl.uniform3f(uniform("u_deep"), ...PALETTE.deep);
  gl.uniform3f(uniform("u_mid"), ...PALETTE.mid);
  gl.uniform3f(uniform("u_bright"), ...PALETTE.bright);

  let time = 0;

  return {
    render(elapsedSeconds, rate) {
      time += elapsedSeconds * rate;
      gl.uniform1f(timeUniform, time);
      gl.uniform2f(resolutionUniform, canvas.width, canvas.height);
      gl.drawArrays(gl.TRIANGLES, 0, 6);
    },
    resize(width, height) {
      canvas.width = width;
      canvas.height = height;
      gl.viewport(0, 0, width, height);
    },
    dispose() {
      gl.deleteBuffer(buffer);
      gl.deleteProgram(program);
    },
  };
}
