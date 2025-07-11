import type { Footstep } from "@/assets/types/mainpageCanvasTypes";

  // Генеруємо кроки вздовж polyline (маршруту з кількох точок)
  export function generateFootstepsOnRoute(route: number[][]): Footstep[] {
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