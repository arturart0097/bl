"use client"

import { useEffect, useRef, useState, useMemo } from "react"
import { Stage, Layer, Line, Rect, Text, Group, Image, Ellipse } from "react-konva"
import React from "react"
import useImage from 'use-image'
import s from "@/components/s.svg?url"
import doroga from "@/components/doroga.svg?url"
import bardur from "@/components/bardur.svg?url"
import kuchi from "@/components/kuchi.svg?url"
import kuchi3 from "@/components/kuchi3.svg?url"
import kuchi2 from "@/components/kuchi2.svg?url"
import cars from "@/components/cars.svg?url"

function rgbCycle(time: number, speed = 0.0001) {
  const t = (time * speed) % 1;
  const hue = t * 360;
  const c = 1;
  const x = 1 - Math.abs(((hue / 60) % 2) - 1);
  let r = 0, g = 0, b = 0;
  if (hue < 60) [r, g, b] = [c, x, 0];
  else if (hue < 120) [r, g, b] = [x, c, 0];
  else if (hue < 180) [r, g, b] = [0, c, x];
  else if (hue < 240) [r, g, b] = [0, x, c];
  else if (hue < 300) [r, g, b] = [x, 0, c];
  else[r, g, b] = [c, 0, x];
  r = Math.round(r * 255);
  g = Math.round(g * 255);
  b = Math.round(b * 255);
  return `rgb(${r},${g},${b})`;
}

function catmullRom(points: number[], t: number, seg: number) {
  const i = seg * 2
  const x0 = points[i],
    y0 = points[i + 1]
  const x1 = points[i + 2],
    y1 = points[i + 3]
  const x2 = points[i + 4],
    y2 = points[i + 5]
  const x3 = points[i + 6],
    y3 = points[i + 7]
  const tt = t * t
  const ttt = tt * t
  const x = 0.5 * (2 * x1 + (-x0 + x2) * t + (2 * x0 - 5 * x1 + 4 * x2 - x3) * tt + (-x0 + 3 * x1 - 3 * x2 + x3) * ttt)
  const y = 0.5 * (2 * y1 + (-y0 + y2) * t + (2 * y0 - 5 * y1 + 4 * y2 - y3) * tt + (-y0 + 3 * y1 - 3 * y2 + y3) * ttt)
  return [x, y]
}

function interpolate(points: number[], t: number, tension: number) {
  if (t <= 0) return [points[0], points[1]]
  if (t >= 1) return [points[points.length - 2], points[points.length - 1]]
  const n = points.length / 2 - 1
  if (tension === 0) {
    const idx = Math.floor(t * n)
    const localT = t * n - idx
    const x1 = points[idx * 2],
      y1 = points[idx * 2 + 1]
    const x2 = points[(idx + 1) * 2],
      y2 = points[(idx + 1) * 2 + 1]
    return [x1 + (x2 - x1) * localT, y1 + (y2 - y1) * localT]
  } else {
    const segCount = n - 2
    const tClamped = Math.max(0, Math.min(1, t))
    const seg = Math.max(0, Math.min(segCount - 1, Math.floor(tClamped * segCount)))
    const localT = tClamped * segCount - seg

    const get = (i: number) => {
      if (i < 0) return points[0]
      if (i >= points.length / 2) return points[points.length - 2]
      return points[i * 2]
    }
    const getY = (i: number) => {
      if (i < 0) return points[1]
      if (i >= points.length / 2) return points[points.length - 1]
      return points[i * 2 + 1]
    }

    const p0 = seg
    const p1 = seg + 1
    const p2 = seg + 2
    const p3 = seg + 3
    const crPoints = [get(p0), getY(p0), get(p1), getY(p1), get(p2), getY(p2), get(p3), getY(p3)]
    return catmullRom(crPoints, localT, 0)
  }
}

export type Building = {
  x: number
  y: number
  w: number
  h: number
  label?: string
  icon?: React.ReactNode
  blinking?: boolean
  color?: string
}

type Road = {
  id: string
  points: number[]
  tension: number
  w: number
}

interface MainPageCanvasProps {
  roads?: Road[]
  buildings?: Building[]
  stageWidth?: number
  stageHeight?: number
  selectedRGB: boolean
  showColorGlow?: boolean
  showBlinking?: boolean
}

const elements = [
  { x: 295, y: 505, w: 35, h: 32, label: "doroga", icon: doroga, r: 35 },
  { x: 115, y: 375, w: 35, h: 32, label: "doroga", icon: doroga, r: 35 },
  { x: 465, y: 340, w: 28, h: 28, label: "doroga", icon: doroga, r: -53 },
  { x: 470, y: 225, w: 125, h: 265, label: "bardur", icon: bardur, r: 0 },
  { x: 10, y: 35, w: 455, h: 235, label: "s", icon: s, r: 0 },
  { x: 20, y: 210, w: 155, h: 135, label: "kuchi", icon: kuchi, r: 0 },
  { x: 40, y: 470, w: 110, h: 125, label: "kuchi3", icon: kuchi3, r: -5 },
  { x: 470, y: 55, w: 60, h: 50, label: "kuchi2", icon: kuchi2, r: -5 },
  { x: 520, y: 346, w: 100, h: 25, label: "cars", icon: cars, r: 35 },
  { x: 500, y: 376, w: 100, h: 25, label: "cars", icon: cars, r: 35 },
]

const colors = [
  "#ff0080",
  "#00ff80",
  "#0080ff",
  "#ff8000",
  "#8000ff",
  "#ff0040",
  "#40ff80",
  "#8040ff",
  "#ff4080",
  "#00ffff",
]

interface LightStream {
  id: string
  road: string
  color: string
  speed: number
  length: number
  opacity: number
  startTime: number
  progress: number
  glowIntensity: number
}

// Додаємо тип для кроків
interface Footstep {
  x: number;
  y: number;
  angle: number;
  visible: boolean;
  isLeft: boolean;
  toeOffsetX?: number;
  toeOffsetY?: number;
  toeAngle?: number;
  toeAlpha?: number;
}

const MainPageCanvas: React.FC<MainPageCanvasProps> = ({
  roads = [],
  buildings,
  stageWidth = 587,
  stageHeight = 610,
  selectedRGB = false,
  showColorGlow = true,
  showBlinking = true
}) => {
  const [lightStreams, setLightStreams] = useState<LightStream[]>([])
  const [blinkTime, setBlinkTime] = useState(3)
  const animationRef = useRef<number | null>(null)
  const lastSpawnTime = useRef<number>(0)
  const spawnInterval = 600
  const maxStreamsPerRoad = 4

  const footstepRoutes: number[][][] = [
    [
      [100, 420],
      [140, 370],
      [30, 270],
    ],

    [
      [160, 150],
      [270, 300]
    ],
    [
      [270, 290],
      [280, 300],
      [330, 150],
      [370, 100],
      [400, 90],
      [410, 85],
      [430, 75],
      [450, 50],
      [450, 15],
      [475, -10],
    ],
    [
      [475, -10],
      [450, 15],
      [450, 50],
      [430, 75],
      [410, 85],
      [400, 90],
      [370, 100],
      [330, 150],
      [280, 300],
      [270, 290],
    ],
    [
      [270, 300],
      [160, 150]
    ],

    [
      [170, 500],
      [100, 600],
      [100, 700],
    ],
    [
      [100, 700],
      [100, 600],
      [170, 500],
    ],
    [
      [170, 500],
      [100, 600],
      [100, 800],
    ],

    [
      [30, 270],
      [140, 370],
      [100, 420],
    ],

    [
      [-10, -10],
      [-20, -20]
    ]
  ];

  const [footsteps, setFootsteps] = useState<Footstep[]>([]);
  const [footstepAnimTime, setFootstepAnimTime] = useState(0);
  const footstepAnimRef = useRef<number | null>(null);

  useEffect(() => {
    let running = true;
    const start = Date.now();
    function animate() {
      if (!running) return;
      const now = Date.now();
      setBlinkTime(now - start);
      setTimeout(animate, 60); // ~16fps, зменшуємо частоту оновлення
    }
    animate();
    return () => { running = false; };
  }, []);

  const spawnLightStream = (now: number) => {
    const validRoads = roads.filter((r) => r.points.length >= 8)
    if (validRoads.length === 0) return

    const road = validRoads[Math.floor(Math.random() * validRoads.length)]
    const count = lightStreams.filter((s) => s.road === road.id).length
    if (count >= maxStreamsPerRoad) return

    const newStream: LightStream = {
      id: Math.random().toString(36).substr(2, 9),
      road: road.id,
      color: colors[Math.floor(Math.random() * colors.length)],
      speed: 0.4 + Math.random() * 0.2,
      length: 0.04 + Math.random() * 0.03,
      opacity: 0.7 + Math.random() * 0.2,
      startTime: now,
      progress: 0,
      glowIntensity: 0.8 + Math.random() * 0.2,
    }

    setLightStreams((prev) => [...prev, newStream])
    lastSpawnTime.current = now
  }

  const updateStreams = (now: number) => {
    setLightStreams((prev) =>
      prev
        .map((stream) => ({
          ...stream,
          progress: Math.min(1, stream.progress + (stream.speed * (now - stream.startTime)) / 1000),
          startTime: now,
        }))
        .filter((stream) => stream.progress < 1),
    )
  }

  useEffect(() => {
    const animate = () => {
      const now = Date.now()
      if (now - lastSpawnTime.current > spawnInterval) {
        spawnLightStream(now)
      }
      updateStreams(now)
      animationRef.current = requestAnimationFrame(animate)
    }

    animationRef.current = requestAnimationFrame(animate)
    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current)
    }
  }, [])

  // Генеруємо кроки вздовж polyline (маршруту з кількох точок)
  function generateFootstepsOnRoute(route: number[][]): Footstep[] {
    if (route.length < 2) return [];
    // Розрахунок довжин сегментів
    const segLens = [];
    let totalLen = 0;
    for (let i = 0; i < route.length - 1; i++) {
      const dx = route[i + 1][0] - route[i][0];
      const dy = route[i + 1][1] - route[i][1];
      const len = Math.sqrt(dx * dx + dy * dy);
      segLens.push(len);
      totalLen += len;
    }
    // Кроки з фіксованою довжиною по всьому маршруту
    const steps: Footstep[] = [];
    let dist = 0;
    let segIdx = 0;
    let isLeft = true;
    while (dist < totalLen) {
      // Довжина кроку (з випадковістю)
      const stepLen = 16 + Math.random() * 6; // 16–22 px
      // Знаходимо сегмент
      let acc = 0;
      segIdx = 0;
      while (segIdx < segLens.length && acc + segLens[segIdx] < dist) {
        acc += segLens[segIdx];
        segIdx++;
      }
      if (segIdx >= segLens.length) break;
      const segStart = route[segIdx];
      const segEnd = route[segIdx + 1];
      const segDist = dist - acc;
      const segLen = segLens[segIdx] || 1;
      const t = segDist / segLen;
      const x = segStart[0] + (segEnd[0] - segStart[0]) * t;
      const y = segStart[1] + (segEnd[1] - segStart[1]) * t;
      const angleRad = Math.atan2(segEnd[1] - segStart[1], segEnd[0] - segStart[0]);
      const angleDeg = angleRad * 180 / Math.PI;
      // Відстань між лівою і правою ногою
      const footOffset = 4 + Math.random() * 2; // px
      // Перпендикулярний вектор
      const perpX = Math.cos(angleRad + Math.PI / 2);
      const perpY = Math.sin(angleRad + Math.PI / 2);
      // Для реалістичності: носок трохи попереду та збоку, випадковий нахил і прозорість
      const toeOffsetX = 3 + Math.random() * 1.5; // px вперед
      const toeOffsetY = (Math.random() - 0.5) * 1.2; // px вбік
      const toeAngle = (Math.random() - 0.5) * 20; // градусів
      const toeAlpha = 0.6 + Math.random() * 0.3;
      steps.push({
        x: x + (isLeft ? perpX * footOffset : -perpX * footOffset),
        y: y + (isLeft ? perpY * footOffset : -perpY * footOffset),
        angle: angleDeg + (Math.random() - 0.5) * 10,
        visible: false,
        isLeft: isLeft,
        toeOffsetX: toeOffsetX,
        toeOffsetY: (isLeft ? -2 : 2) + toeOffsetY,
        toeAngle: isLeft ? toeAngle : -toeAngle,
        toeAlpha: toeAlpha,
      });
      dist += stepLen;
      isLeft = !isLeft;
    }
    return steps;
  }

  useEffect(() => {
    let all: Footstep[] = [];
    for (const route of footstepRoutes) {
      all = all.concat(generateFootstepsOnRoute(route));
    }
    setFootsteps(all);
    setFootstepAnimTime(0);
  }, [/* footstepRoutes */]);

  useEffect(() => {
    function animate() {
      setFootstepAnimTime((prev) => {
        const stepsCount = footsteps.length;
        const appearTime = stepsCount * 14;
        const pauseFrames = 60; // ~1 секунда паузи між циклами
        if (prev >= appearTime + pauseFrames) {
          return 0;
        }
        return prev + 0.6;
      });
      footstepAnimRef.current = requestAnimationFrame(animate);
    }
    footstepAnimRef.current = requestAnimationFrame(animate);
    return () => {
      if (footstepAnimRef.current) {
        cancelAnimationFrame(footstepAnimRef.current);
      }
    };
  }, [footsteps]);

  const animatedFootsteps = footsteps.map((step, i) => ({
    ...step,
    visible: i < footstepAnimTime / 14,
  }));

  const lastVisibleIndex = animatedFootsteps.map(f => f.visible).lastIndexOf(true);
  const footstepsToShow =
    lastVisibleIndex >= 0
      ? animatedFootsteps.slice(Math.max(0, lastVisibleIndex - 3), lastVisibleIndex + 1)
      : [];

  // --- МЕМОІЗАЦІЯ ---
  const memoElements = React.useMemo(() => elements, []);
  // const memoFootstepRoutes = React.useMemo(() => footstepRoutes, []);
  const memoBuildings = React.useMemo(() => buildings, [buildings]);
  const memoRoads = React.useMemo(() => roads, [roads]);

  // --- МЕМОІЗАЦІЯ КОЛЬОРУ RGB ---
  const rgbColor = useMemo(() => rgbCycle(blinkTime), [blinkTime]);

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
      <Stage
        width={stageWidth}
        height={stageHeight}
        style={{
          border: "1px solid #000",
          background: "#222",
        }}
      >
        <Layer>
          {(roads ?? []).map((r: Road) => (
            <Line
              key={r.id}
              points={r.points}
              stroke="#181818"
              strokeWidth={r.w}
              tension={r.tension}
              lineCap="round"
              lineJoin="round"
              shadowBlur={10}
              shadowColor="#fff"
            />
          ))}
          <MemoBuildings buildings={memoBuildings} blinkTime={blinkTime} showBlinking={showBlinking} showColorGlow={showColorGlow} selectedRGB={selectedRGB} rgbColor={rgbColor} />
          <MemoElements elements={memoElements} />
          <MemoLightStreams lightStreams={lightStreams} roads={memoRoads} />
          <MemoFootsteps footstepsToShow={footstepsToShow} blinkTime={blinkTime} lastVisibleIndex={lastVisibleIndex} />
        </Layer>
      </Stage>
    </div>
  )
}

export default MainPageCanvas

// --- МЕМО-КОМПОНЕНТИ ---
const MemoBuildings = React.memo(function MemoBuildings({ buildings, blinkTime, showBlinking, showColorGlow, selectedRGB, rgbColor }: any) {
  return (
    <>
      {(buildings ?? []).map((b: any, i: number) => {
        const [iconImage] = useImage(b.icon as string);
        const isBlinking = b.blinking;
        const phaseOffset = (i * Math.PI * 2) / (buildings?.length ?? 1);
        let opacity = 1;
        if (isBlinking && showBlinking) {
          const t = ((blinkTime % 10000) / 1000);
          const raw = 0.85 + 0.15 * Math.sin(t * 2 * Math.PI + phaseOffset);
          const ease = (v: number) => 0.7 + 0.3 * ((1 - Math.cos(Math.PI * (v - 0.7) / 0.3)) / 2);
          opacity = ease(Math.max(0.7, Math.min(1, raw)));
        }
        return b.icon ? (
          <Group key={"icon-" + i} x={b.x} y={b.y} opacity={opacity}>
            {iconImage && b.color && showColorGlow && (
              <Image
                image={iconImage}
                x={0}
                y={0}
                width={b.w}
                height={b.h}
                opacity={0.5 + 0.5 * Math.sin(((blinkTime % 2000) / 2000) * 2 * Math.PI + phaseOffset)}
                shadowBlur={32}
                shadowColor={b.color}
                globalCompositeOperation="lighter"
                listening={false}
              />
            )}
            {iconImage && (
              <Image
                image={iconImage}
                x={0}
                y={0}
                width={b.w}
                height={b.h}
                {...(b.color && !showColorGlow ? {} : {
                  shadowBlur: b.color ? 1 : (!selectedRGB ? undefined : 2),
                  shadowColor: b.color ? b.color : (!selectedRGB ? undefined : rgbColor),
                  globalCompositeOperation: "lighter"
                })}
                listening={false}
              />
            )}
          </Group>
        ) : (
          <React.Fragment key={"rect-" + i}>
            <Rect
              x={b.x}
              y={b.y}
              width={b.w}
              height={b.h}
              fill="#222"
              cornerRadius={6}
              shadowBlur={8}
              shadowColor="#000"
              opacity={opacity}
            />
            {b.label && (
              <Text
                x={b.x + b.w / 2 - 8}
                y={b.y + b.h / 2 - 10}
                text={b.label}
                fontSize={18}
                fill="#ffffff0"
                fontStyle="normal"
              />
            )}
          </React.Fragment>
        );
      })}
    </>
  );
});

const MemoElements = React.memo(function MemoElements({ elements }: any) {
  return (
    <>
      {elements.map((b: any, i: number) => {
        const [iconImage] = useImage(b.icon as string);
        return b.icon ? (
          <Group key={"icon-" + i} x={b.x} y={b.y}>
            <Image
              image={iconImage}
              x={0}
              y={0}
              width={b.w}
              height={b.h}
              rotation={b.r}
            />
          </Group>
        ) : (
          <React.Fragment key={"rect-" + i}>
            <Rect
              x={b.x}
              y={b.y}
              width={b.w}
              height={b.h}
              fill="#222"
              cornerRadius={6}
              shadowBlur={8}
              shadowColor="#000"
            />
            {b.label && (
              <Text
                x={b.x + b.w / 2 - 8}
                y={b.y + b.h / 2 - 10}
                text={b.label}
                fontSize={18}
                fill="#fff"
                fontStyle="bold"
              />
            )}
          </React.Fragment>
        );
      })}
    </>
  );
});

const MemoLightStreams = React.memo(function MemoLightStreams({ lightStreams, roads }: any) {
  return (
    <>
      {lightStreams.map((stream: any) => {
        if (!roads) return null;
        const road = roads.find((r: any) => r.id === stream.road);
        if (!road) return null;
        const pStart = Math.max(0, Math.min(1, stream.progress));
        const pEnd = Math.max(0, Math.min(1, stream.progress + stream.length));
        if (pStart === pEnd) return null;
        const start = interpolate(road.points, pStart, road.tension)
        const end = interpolate(road.points, pEnd, road.tension)
        return (
          <Line
            key={stream.id}
            points={[start[0], start[1], end[0], end[1]]}
            stroke={stream.color}
            strokeWidth={8}
            opacity={stream.opacity}
            lineCap="round"
            shadowBlur={30 * stream.glowIntensity}
            shadowColor={stream.color}
            globalCompositeOperation="lighter"
          />
        )
      })}
    </>
  );
});

const MemoFootsteps = React.memo(function MemoFootsteps({ footstepsToShow, blinkTime, lastVisibleIndex }: any) {
  return (
    <>
      {footstepsToShow.map((step: any, i: number) => {
        const appearDuration = 600;
        const delayBetweenPairs = 400;
        const pairIndex = Math.floor(i / 2);
        const appearStart = pairIndex * delayBetweenPairs;
        const timeSinceAppear = Math.max(0, blinkTime * 1 - appearStart);
        const appearProgress = Math.max(0, Math.min(1, timeSinceAppear / appearDuration));
        const baseAlpha = appearProgress * (0.5 + 0.5 * (i + 1) / footstepsToShow.length);
        const pulse = 0.85 + 0.15 * Math.sin((blinkTime / 400) + i);
        const alpha = baseAlpha * pulse;
        const footColor = "#ccc";
        return (
          <Group
            key={"footstep-" + (lastVisibleIndex - 3 + i)}
            x={step.x}
            y={step.y}
            rotation={step.angle + (step.isLeft ? -10 : 10)}
            opacity={alpha}
          >
            <Ellipse
              x={0}
              y={0}
              radiusX={4}
              radiusY={2}
              fill={footColor}
              shadowBlur={12}
              shadowColor={footColor}
              opacity={0.85}
              listening={false}
              globalCompositeOperation="lighter"
            />
          </Group>
        );
      })}
    </>
  );
});
