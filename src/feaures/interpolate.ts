import { catmullRom } from "./catmullRom"

export function interpolate(points: number[], t: number, tension: number) {
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