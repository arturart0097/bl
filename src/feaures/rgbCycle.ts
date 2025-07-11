export function rgbCycle(time: number, speed = 0.0001) {
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