export function catmullRom(points: number[], t: number, seg: number) {
  const i = seg * 2;
  const x0 = points[i],
    y0 = points[i + 1];
  const x1 = points[i + 2],
    y1 = points[i + 3];
  const x2 = points[i + 4],
    y2 = points[i + 5];
  const x3 = points[i + 6],
    y3 = points[i + 7];
  const tt = t * t;
  const ttt = tt * t;
  const x =
    0.5 *
    (2 * x1 +
      (-x0 + x2) * t +
      (2 * x0 - 5 * x1 + 4 * x2 - x3) * tt +
      (-x0 + 3 * x1 - 3 * x2 + x3) * ttt);
  const y =
    0.5 *
    (2 * y1 +
      (-y0 + y2) * t +
      (2 * y0 - 5 * y1 + 4 * y2 - y3) * tt +
      (-y0 + 3 * y1 - 3 * y2 + y3) * ttt);
  return [x, y];
}
