import r from "@/components/r.svg?url";
import t from "@/components/t.svg?url";
import y from "@/components/y.svg?url";
import u from "@/components/u.svg?url";
import f from "@/components/f.svg?url";
import b from "@/components/b.svg?url";
import c from "@/components/c.svg?url";
import d from "@/components/d.svg?url";
import q from "@/components/q.svg?url";
import w from "@/components/w.svg?url";
import QweUrl from "@/components/Qwe.svg?url";
import qwe2 from "@/components/qwe2.svg?url";
import HomeUrl from "@/components/Home.svg?url";
import a from "@/components/a.svg?url";
import e from "@/components/e.svg?url";
import type { Building } from "./types/mainpageCanvasTypes";

export const defaultBuildings: Building[] = [
  { x: 30, y: 30, w: 274, h: 287, label: "A", icon: HomeUrl },
  { x: 370, y: 110, w: 104, h: 112, label: "B", icon: QweUrl },
  { x: 495, y: 65, w: 93, h: 159, label: "C", icon: qwe2 },
  { x: 315, y: 217, w: 200, h: 153, label: "D1", icon: a },
  { x: 267, y: 320, w: 80, h: 80, label: "D2", icon: b },
  { x: 335, y: 370, w: 75, h: 75, label: "D3", icon: b },
  { x: 405, y: 425, w: 70, h: 70, label: "D4", icon: c },
  { x: 225, y: 380, w: 77, h: 77, label: "D5", icon: d },
  { x: 295, y: 430, w: 77, h: 77, label: "D6", icon: d },
  { x: 165, y: 355, w: 57, h: 57, label: "D7", icon: q },
  { x: 300, y: 405, w: 27, h: 30, label: "D8", icon: w },
  { x: 265, y: 458, w: 30, h: 27, label: "W2", icon: w },
  { x: 365, y: 495, w: 30, h: 27, label: "W3", icon: w },
  { x: 403, y: 495, w: 180, h: 100, label: "E1", icon: e },
  { x: 133, y: 485, w: 220, h: 110, label: "R1", icon: r },
  { x: 20, y: 375, w: 101, h: 140, label: "T1", icon: t },
  { x: 25, y: 75, w: 51, h: 100, label: "Y1", icon: y },
  { x: 25, y: 515, w: 30, h: 70, label: "Y2", icon: y },
  { x: 60, y: 35, w: 55, h: 25, label: "U1", icon: u },
  { x: 240, y: 35, w: 55, h: 25, label: "U2", icon: u },
  { x: 290, y: 35, w: 95, h: 45, label: "U3", icon: u },
  { x: 480, y: 35, w: 95, h: 45, label: "F1", icon: f },
];
