"use client"

import { useEffect, useRef, useState, useMemo } from "react"
import { Stage, Layer, Line, Rect, Text, Group, Image, Ellipse } from "react-konva"
import React from "react"
import useImage from 'use-image'
import type { Footstep, LightStream, MainPageCanvasProps, Road } from "@/assets/types/mainpageCanvasTypes"
import { rgbCycle } from "@/feaures/rgbCycle"
import { interpolate } from "@/feaures/interpolate"
import { generateFootstepsOnRoute } from "@/feaures/generateFootstepsOnRoute"

const MainPageCanvas: React.FC<MainPageCanvasProps> = ({
  roads = [],
  buildings,
  stageWidth = 587,
  stageHeight = 610,
  selectedRGB = false,
  showColorGlow = true,
  showBlinking = true,
  footstepRoutes,
  elements,
  colors
}) => {
  const [lightStreams, setLightStreams] = useState<LightStream[]>([])
  const [blinkTime, setBlinkTime] = useState(3)
  const animationRef = useRef<number | null>(null)
  const lastSpawnTime = useRef<number>(0)
  const spawnInterval = 600
  const maxStreamsPerRoad = 4

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

            {/* {b.label &&
              <Text text={b.label} x={100} y={100} fill="#fff" fontSize={20} />
            } */}

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
