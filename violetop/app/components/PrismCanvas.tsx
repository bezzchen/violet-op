"use client";

import { RefObject, useEffect, useRef } from "react";

type PrismCanvasProps = {
  scrollContainerRef: RefObject<HTMLElement | null>;
};

type NetworkInformationLike = {
  effectiveType?: string;
  saveData?: boolean;
};

type NavigatorWithPerformanceHints = Navigator & {
  connection?: NetworkInformationLike;
  deviceMemory?: number;
  hardwareConcurrency?: number;
};

const HIGH_FRAME_MS = 1000 / 60;
const BALANCED_FRAME_MS = 1000 / 45;
const LOW_POWER_FRAME_MS = 1000 / 30;

const vertexShaderSource = `
attribute vec2 a_position;

void main() {
  gl_Position = vec4(a_position, 0.0, 1.0);
}
`;

const fragmentShaderSource = `
precision highp float;

uniform vec2 u_resolution;
uniform vec2 u_motion;
uniform float u_scroll;
uniform float u_idlePhase;
uniform float u_idleStrength;

const float LEFT_APEX = 0.05;
const float RIGHT_APEX = -0.40;
const float LEFT_CURVATURE = -12.0;
const float RIGHT_CURVATURE = 12.0;

float parabolaField(
  vec2 point,
  float centerX,
  float apexY,
  float curvature
) {
  float x = point.x - centerX;

  return point.y - (apexY + curvature * x * x);
}

float blendForTargetX(
  float targetX,
  float leftCenter,
  float rightCenter,
  float elevation
) {
  vec2 targetPoint = vec2(targetX, 0.0);
  float targetLeftField = parabolaField(
    targetPoint,
    leftCenter,
    LEFT_APEX,
    LEFT_CURVATURE
  );
  float targetRightField = parabolaField(
    targetPoint,
    rightCenter,
    RIGHT_APEX,
    RIGHT_CURVATURE
  );

  return clamp(
    (elevation - targetLeftField) /
      (targetRightField - targetLeftField),
    0.02,
    0.98
  );
}

float interpolatedStreakDistance(
  vec2 point,
  float leftCenter,
  float rightCenter,
  float leftField,
  float rightField,
  float targetX,
  float flow,
  float elevation
) {
  float blend = blendForTargetX(
    targetX,
    leftCenter,
    rightCenter,
    elevation
  );
  float flowingBlend = clamp(blend + flow * point.y, 0.02, 0.98);
  float leftSlope =
    2.0 * LEFT_CURVATURE * (point.x - leftCenter);
  float rightSlope =
    2.0 * RIGHT_CURVATURE * (point.x - rightCenter);
  float field =
    mix(leftField, rightField, flowingBlend) - elevation;
  float slope = mix(leftSlope, rightSlope, flowingBlend);
  float gradientY =
    1.0 + flow * (rightField - leftField);

  return field * inversesqrt(
    slope * slope + gradientY * gradientY
  );
}

float softBand(
  float value,
  float center,
  float halfWidth,
  float feather
) {
  return 1.0 - smoothstep(
    halfWidth,
    halfWidth + feather,
    abs(value - center)
  );
}

vec3 shadeStreak(
  vec3 color,
  float distance,
  float corridor,
  vec3 bodyColor,
  vec3 ridgeColor,
  float intensity
) {
  color +=
    bodyColor *
    softBand(distance, 0.0, 0.035, 0.11) *
    corridor *
    0.20 *
    intensity;
  color +=
    ridgeColor *
    softBand(distance, -0.012, 0.012, 0.045) *
    corridor *
    0.42 *
    intensity;
  color *=
    1.0 -
    softBand(distance, 0.065, 0.035, 0.10) *
    corridor *
    0.30 *
    intensity;

  return color;
}

void main() {
  vec2 uv = gl_FragCoord.xy / u_resolution.xy;
  vec2 p = uv * 2.0 - 1.0;
  p.x *= u_resolution.x / u_resolution.y;

  float aspect = u_resolution.x / u_resolution.y;
  float sweep = u_scroll - 0.5;
  float verticalShift = sweep * 0.58 + u_motion.y * 0.035;
  float idleWave =
    sin((p.x / max(aspect, 0.001)) * 3.14159 + u_idlePhase) *
    0.035 *
    u_idleStrength;
  vec2 foldPoint = vec2(p.x, p.y - verticalShift - idleWave);
  float horizontalShift = u_motion.x * 0.025;
  float spread = max(aspect * 0.60, 0.35);
  float leftCenter = -spread + horizontalShift;
  float rightCenter = spread + horizontalShift;
  float leftInnerX =
    leftCenter +
    sqrt(max(LEFT_APEX / -LEFT_CURVATURE, 0.0));
  float rightInnerX =
    rightCenter -
    sqrt(max(-RIGHT_APEX / RIGHT_CURVATURE, 0.0));
  float innerSpan = rightInnerX - leftInnerX;
  float middleX1 = leftInnerX + innerSpan * 0.155;
  float middleX2 = leftInnerX + innerSpan * 0.325;
  float middleX3 = leftInnerX + innerSpan * 0.50;
  float middleX4 = leftInnerX + innerSpan * 0.68;
  float middleX5 = leftInnerX + innerSpan * 0.845;
  float leftFold = parabolaField(
    foldPoint,
    leftCenter,
    LEFT_APEX,
    LEFT_CURVATURE
  );
  float rightFold = parabolaField(
    foldPoint,
    rightCenter,
    RIGHT_APEX,
    RIGHT_CURVATURE
  );
  float streakClearance = 0.62;
  float corridor =
    smoothstep(streakClearance, streakClearance + 0.18, leftFold) *
    smoothstep(streakClearance, streakClearance + 0.18, -rightFold);
  float leftAnchorSlope =
    2.0 * LEFT_CURVATURE * (foldPoint.x - leftCenter);
  float rightAnchorSlope =
    2.0 * RIGHT_CURVATURE * (foldPoint.x - rightCenter);
  float leftAnchorDistance =
    leftFold *
    inversesqrt(1.0 + leftAnchorSlope * leftAnchorSlope);
  float rightAnchorDistance =
    rightFold *
    inversesqrt(1.0 + rightAnchorSlope * rightAnchorSlope);
  float leftNearDistance =
    leftAnchorDistance - 0.14;
  float leftFarDistance =
    leftAnchorDistance - 0.28;
  float rightNearDistance =
    rightAnchorDistance + 0.14;
  float rightFarDistance =
    rightAnchorDistance + 0.28;
  float leftEdgeMask =
    1.0 -
    smoothstep(leftCenter - 0.02, leftCenter + 0.06, foldPoint.x);
  float rightEdgeMask =
    smoothstep(rightCenter - 0.06, rightCenter + 0.02, foldPoint.x);

  vec3 ink = vec3(0.006, 0.0, 0.014);
  vec3 deep = vec3(0.055, 0.006, 0.12);
  vec3 violet = vec3(0.30, 0.035, 0.56);
  vec3 orchid = vec3(0.44, 0.055, 0.68);
  vec3 electric = vec3(0.56, 0.11, 0.82);
  vec3 lilac = vec3(0.64, 0.18, 0.88);
  vec3 ultraviolet = vec3(0.72, 0.24, 0.94);
  vec3 color = ink;

  float ambient = smoothstep(-1.15, 1.25, p.x);
  color += deep * ambient * 0.22;

  float leftFabric = softBand(leftFold, 0.0, 0.20, 0.38);
  float leftLight = smoothstep(-0.28, 0.30, leftFold);
  color = mix(
    color,
    mix(deep * 0.34, violet * 0.92, leftLight),
    leftFabric * 0.82
  );
  color += violet * softBand(leftFold, -0.13, 0.12, 0.20) * 0.17;
  color += ultraviolet * softBand(leftFold, -0.025, 0.014, 0.05) * 0.48;
  color *= 1.0 - softBand(leftFold, 0.05, 0.035, 0.11) * 0.46;

  float rightFabric = softBand(rightFold, 0.0, 0.20, 0.38);
  float rightLight = 1.0 - smoothstep(-0.30, 0.28, rightFold);
  color = mix(
    color,
    mix(deep * 0.34, violet * 0.92, rightLight),
    rightFabric * 0.82
  );
  color += violet * softBand(rightFold, 0.13, 0.12, 0.20) * 0.17;
  color += ultraviolet * softBand(rightFold, 0.025, 0.014, 0.05) * 0.48;
  color *= 1.0 - softBand(rightFold, -0.05, 0.035, 0.11) * 0.46;

  color += deep * corridor * 0.22;

  color = shadeStreak(
    color,
    leftFarDistance,
    leftEdgeMask,
    electric,
    ultraviolet,
    0.84
  );
  color = shadeStreak(
    color,
    leftNearDistance,
    leftEdgeMask,
    electric,
    ultraviolet,
    1.02
  );
  color = shadeStreak(
    color,
    interpolatedStreakDistance(
      foldPoint,
      leftCenter,
      rightCenter,
      leftFold,
      rightFold,
      middleX1,
      -0.006,
      0.10
    ),
    corridor,
    violet,
    electric,
    0.76
  );
  color = shadeStreak(
    color,
    interpolatedStreakDistance(
      foldPoint,
      leftCenter,
      rightCenter,
      leftFold,
      rightFold,
      middleX2,
      -0.003,
      -0.07
    ),
    corridor,
    orchid,
    lilac,
    0.86
  );
  color = shadeStreak(
    color,
    interpolatedStreakDistance(
      foldPoint,
      leftCenter,
      rightCenter,
      leftFold,
      rightFold,
      middleX3,
      0.0,
      0.03
    ),
    corridor,
    violet,
    ultraviolet,
    0.94
  );
  color = shadeStreak(
    color,
    interpolatedStreakDistance(
      foldPoint,
      leftCenter,
      rightCenter,
      leftFold,
      rightFold,
      middleX4,
      0.003,
      0.08
    ),
    corridor,
    orchid,
    electric,
    0.82
  );
  color = shadeStreak(
    color,
    interpolatedStreakDistance(
      foldPoint,
      leftCenter,
      rightCenter,
      leftFold,
      rightFold,
      middleX5,
      0.006,
      -0.09
    ),
    corridor,
    electric,
    ultraviolet,
    0.88
  );
  color = shadeStreak(
    color,
    rightFarDistance,
    rightEdgeMask,
    electric,
    ultraviolet,
    0.86
  );
  color = shadeStreak(
    color,
    rightNearDistance,
    rightEdgeMask,
    electric,
    ultraviolet,
    1.04
  );

  float horizontalFade =
    1.0 - smoothstep(aspect * 0.72, aspect * 1.02, abs(p.x));
  float verticalFade =
    smoothstep(-1.20, -0.82, p.y) *
    (1.0 - smoothstep(0.92, 1.20, p.y));
  color *=
    (0.68 + horizontalFade * 0.32) *
    (0.80 + verticalFade * 0.20);
  color = clamp(color, vec3(0.0), vec3(0.76, 0.28, 0.98));

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
    const motionLocation = gl.getUniformLocation(program, "u_motion");
    const scrollLocation = gl.getUniformLocation(program, "u_scroll");
    const idlePhaseLocation = gl.getUniformLocation(program, "u_idlePhase");
    const idleStrengthLocation = gl.getUniformLocation(program, "u_idleStrength");

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

    const reducedMotionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const navigatorHints = navigator as NavigatorWithPerformanceHints;
    const connection = navigatorHints.connection;
    let animationFrame = 0;
    let staticFrame = 0;
    let lastRenderTime = 0;
    let lastDrawTime = 0;
    let slowFrameCount = 0;
    let stableFrameCount = 0;
    let scrollProgress = 0;
    let targetScrollProgress = 0;
    let isDocumentVisible = document.visibilityState === "visible";

    const isLowPowerContext = () => {
      const effectiveType = connection?.effectiveType ?? "";
      const hasVeryLowMemory =
        typeof navigatorHints.deviceMemory === "number" &&
        navigatorHints.deviceMemory <= 2;
      const hasLowCoreCount =
        typeof navigatorHints.hardwareConcurrency === "number" &&
        navigatorHints.hardwareConcurrency <= 4;

      return (
        hasVeryLowMemory ||
        hasLowCoreCount ||
        effectiveType === "slow-2g" ||
        effectiveType === "2g"
      );
    };

    const isBalancedContext = () => {
      const effectiveType = connection?.effectiveType ?? "";
      const hasLimitedMemory =
        typeof navigatorHints.deviceMemory === "number" &&
        navigatorHints.deviceMemory <= 4;
      const hasModerateCoreCount =
        typeof navigatorHints.hardwareConcurrency === "number" &&
        navigatorHints.hardwareConcurrency <= 6;

      return hasLimitedMemory || hasModerateCoreCount || effectiveType === "3g";
    };

    const shouldUseStaticCanvas = () =>
      reducedMotionQuery.matches || Boolean(connection?.saveData);

    const getInitialFrameInterval = () => {
      if (isLowPowerContext()) {
        return LOW_POWER_FRAME_MS;
      }

      if (isBalancedContext()) {
        return BALANCED_FRAME_MS;
      }

      return HIGH_FRAME_MS;
    };

    let frameInterval = getInitialFrameInterval();
    const fastestAllowedFrameInterval = isLowPowerContext()
      ? BALANCED_FRAME_MS
      : HIGH_FRAME_MS;

    const getFrameInterval = () => frameInterval;

    const getPixelRatio = () => {
      if (shouldUseStaticCanvas()) {
        return 0.75;
      }

      const pixelRatioCap =
        frameInterval <= HIGH_FRAME_MS
          ? 1.2
          : frameInterval <= BALANCED_FRAME_MS
            ? 1
            : 0.85;

      return Math.min(window.devicePixelRatio || 1, pixelRatioCap);
    };

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
      const pixelRatio = getPixelRatio();
      const viewport = window.visualViewport;
      const width = Math.max(1, Math.floor((viewport?.width ?? window.innerWidth) * pixelRatio));
      const height = Math.max(1, Math.floor((viewport?.height ?? window.innerHeight) * pixelRatio));

      if (canvas.width !== width || canvas.height !== height) {
        canvas.width = width;
        canvas.height = height;
      }

      gl.viewport(0, 0, width, height);
    };

    const resetFrameSampler = () => {
      lastRenderTime = 0;
      lastDrawTime = 0;
      slowFrameCount = 0;
      stableFrameCount = 0;
    };

    const setFrameInterval = (nextFrameInterval: number) => {
      if (frameInterval === nextFrameInterval) {
        return;
      }

      frameInterval = nextFrameInterval;
      resetFrameSampler();
      resize();
    };

    const getSlowerFrameInterval = () => {
      if (frameInterval <= HIGH_FRAME_MS) {
        return BALANCED_FRAME_MS;
      }

      return LOW_POWER_FRAME_MS;
    };

    const getFasterFrameInterval = () => {
      if (frameInterval >= LOW_POWER_FRAME_MS) {
        return BALANCED_FRAME_MS;
      }

      return HIGH_FRAME_MS;
    };

    const tuneFrameInterval = (time: number) => {
      if (!lastDrawTime) {
        lastDrawTime = time;
        return;
      }

      const frameDelta = time - lastDrawTime;
      lastDrawTime = time;

      if (frameDelta > frameInterval * 1.55) {
        slowFrameCount += 1;
        stableFrameCount = 0;
      } else {
        stableFrameCount += 1;
        slowFrameCount = Math.max(0, slowFrameCount - 1);
      }

      if (slowFrameCount >= 8 && frameInterval < LOW_POWER_FRAME_MS) {
        setFrameInterval(getSlowerFrameInterval());
        return;
      }

      if (
        stableFrameCount >= 240 &&
        frameInterval > fastestAllowedFrameInterval
      ) {
        setFrameInterval(getFasterFrameInterval());
      }
    };

    const drawFrame = (time: number, interpolateScroll = true) => {
      if (interpolateScroll) {
        scrollProgress += (targetScrollProgress - scrollProgress) * 0.085;
      } else {
        scrollProgress = targetScrollProgress;
      }

      gl.useProgram(program);
      gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
      gl.enableVertexAttribArray(positionLocation);
      gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);
      gl.uniform2f(resolutionLocation, canvas.width, canvas.height);
      gl.uniform2f(
        motionLocation,
        Math.sin(time * 0.00012),
        Math.cos(time * 0.00009),
      );
      gl.uniform1f(scrollLocation, scrollProgress);
      gl.uniform1f(idlePhaseLocation, time * 0.00022);
      gl.uniform1f(
        idleStrengthLocation,
        shouldUseStaticCanvas() ? 0 : 1,
      );
      gl.drawArrays(gl.TRIANGLES, 0, 6);
    };

    const startRenderLoop = () => {
      if (animationFrame || !isDocumentVisible || shouldUseStaticCanvas()) {
        return;
      }

      animationFrame = window.requestAnimationFrame(render);
    };

    const stopRenderLoop = () => {
      if (!animationFrame) {
        return;
      }

      window.cancelAnimationFrame(animationFrame);
      animationFrame = 0;
    };

    const scheduleStaticRender = () => {
      if (staticFrame || !isDocumentVisible) {
        return;
      }

      staticFrame = window.requestAnimationFrame((time) => {
        staticFrame = 0;
        drawFrame(time, false);
      });
    };

    const render = (time: number) => {
      animationFrame = 0;

      if (!isDocumentVisible || shouldUseStaticCanvas()) {
        return;
      }

      const frameInterval = getFrameInterval();

      if (time - lastRenderTime >= frameInterval - 1) {
        lastRenderTime = time - ((time - lastRenderTime) % frameInterval);
        drawFrame(time);
        tuneFrameInterval(time);
      }

      startRenderLoop();
    };

    const handleScroll = () => {
      updateScrollProgress();

      if (shouldUseStaticCanvas()) {
        scheduleStaticRender();
      }
    };

    const handleResize = () => {
      resize();
      updateScrollProgress();

      if (shouldUseStaticCanvas()) {
        scheduleStaticRender();
      }
    };

    const handleVisibilityChange = () => {
      isDocumentVisible = document.visibilityState === "visible";

      if (!isDocumentVisible) {
        stopRenderLoop();

        if (staticFrame) {
          window.cancelAnimationFrame(staticFrame);
          staticFrame = 0;
        }

        return;
      }

      resize();
      updateScrollProgress();

      if (shouldUseStaticCanvas()) {
        scheduleStaticRender();
      } else {
        startRenderLoop();
      }
    };

    const handleMotionPreferenceChange = () => {
      frameInterval = getInitialFrameInterval();
      resetFrameSampler();
      resize();
      updateScrollProgress();

      if (shouldUseStaticCanvas()) {
        stopRenderLoop();
        scheduleStaticRender();
      } else {
        startRenderLoop();
      }
    };

    resize();
    updateScrollProgress();

    if (shouldUseStaticCanvas()) {
      scheduleStaticRender();
    } else {
      startRenderLoop();
    }

    scrollContainer.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", handleResize);
    window.visualViewport?.addEventListener("resize", handleResize);
    document.addEventListener("visibilitychange", handleVisibilityChange);
    reducedMotionQuery.addEventListener("change", handleMotionPreferenceChange);

    return () => {
      scrollContainer.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleResize);
      window.visualViewport?.removeEventListener("resize", handleResize);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      reducedMotionQuery.removeEventListener("change", handleMotionPreferenceChange);
      stopRenderLoop();

      if (staticFrame) {
        window.cancelAnimationFrame(staticFrame);
      }

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
