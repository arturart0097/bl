
import r from "@/components/r.svg?url"
import t from "@/components/t.svg?url"
import y from "@/components/y.svg?url"
import u from "@/components/u.svg?url"
import f from "@/components/f.svg?url"
import b from "@/components/b.svg?url"
import c from "@/components/c.svg?url"
import d from "@/components/d.svg?url"
import q from "@/components/q.svg?url"
import w from "@/components/w.svg?url"
import QweUrl from "@/components/Qwe.svg?url"
import qwe2 from "@/components/qwe2.svg?url"
import HomeUrl from "@/components/Home.svg?url"
import a from "@/components/a.svg?url"
import e from "@/components/e.svg?url"
import type { Building } from "./types/mainpageCanvasTypes"

export const defaultBuildings: Building[] = [
  { x: 30, y: 30, w: 284, h: 297, label: "A", icon: HomeUrl },
  { x: 370, y: 110, w: 104, h: 112, label: "B", icon: QweUrl },
  { x: 495, y: 65, w: 93, h: 159, label: "C", icon: qwe2 },
  { x: 310, y: 210, w: 211.5, h: 170, label: "D", icon: a },
  { x: 267, y: 320, w: 80, h: 80, label: "D", icon: b },
  { x: 335, y: 370, w: 75, h: 75, label: "D", icon: b },
  { x: 405, y: 425, w: 70, h: 70, label: "D", icon:c },
  { x: 225, y: 380, w: 77, h: 77, label: "D", icon: d },
  { x: 295, y: 430, w: 77, h: 77, label: "D", icon: d },
  { x: 165, y: 355, w: 57, h: 57, label: "D", icon: q },
  { x: 300, y: 405, w: 27, h: 30, label: "D", icon: w },
  { x: 265, y: 458, w: 30, h: 27, label: "w2", icon: w },
  { x: 365, y: 495, w: 30, h: 27, label: "w3", icon: w },
  { x: 397, y: 495, w: 191, h: 120, label: "w3", icon: e },
  { x: 127, y: 485, w: 221, h: 120, label: "w3", icon: r },
  { x: 20, y: 375, w: 111, h: 140, label: "w3", icon: t },
  { x: 25, y: 75, w: 51, h: 100, label: "w3", icon: y },
  { x: 25, y: 515, w: 30, h: 70, label: "w3", icon: y },
  { x: 60, y: 35, w: 55, h: 25, label: "w3", icon: u },
  { x: 240, y: 35, w: 55, h: 25, label: "w3", icon: u },
  { x: 290, y: 35, w: 95, h: 45, label: "w3", icon: u },
  { x: 480, y: 35, w: 95, h: 45, label: "w3", icon: f },
];
