"use client"

import { useState } from "react"
import MainPageCanvas, { type Building } from "./MainPageCanvas"
import HomeUrl from "@/components/Home.svg?url"
import a from "@/components/a.svg?url"
import e from "@/components/e.svg?url"
import aRGB from "@/components/aRGB.svg?url"
import bRGB from "@/components/bRGB.svg?url"
import cRGB from "@/components/cRGB.svg?url"
import dRGB from "@/components/dRGB.svg?url"
import eRGB from "@/components/eRGB.svg?url"
import HomeRGB from "@/components/HomeRGB.svg?url"
import QweRGB from "@/components/QweRGB.svg?url"
import qwe2RGB from "@/components/qwe2RGB.svg?url"
import rRGB from "@/components/rRGB.svg?url"
import tRGB from "@/components/tRGB.svg?url"
import yRGB from "@/components/yRGB.svg?url"
import uRGB from "@/components/uRGB.svg?url"
import wRGB from "@/components/wRGB.svg?url"
import qRGB from "@/components/qRGB.svg?url"
import fRGB from "@/components/fRGB.svg?url"
import { defaultBuildings } from "@/assets/BUILDINGS"
import HighlightPanel from "./HighlightPanel"
import { useMediaQuery } from 'react-responsive';


const MainPage = () => {
  const [selectedRGB, setSelectedRGB] = useState(false)
  const [settings, setSettings] = useState({
    showColorGlow: true,
    showGreyColor: true,
    showRoads: true,
  })
  const isMobile = useMediaQuery({ maxWidth: 1366 });

  const defaultBuildingsRGB: Building[] = [
    { x: 30, y: 30, w: 284, h: 297, label: "A", icon: settings.showColorGlow ? HomeUrl : HomeRGB, color: "#00ff00" },
    { x: 370, y: 110, w: 104, h: 112, label: "B", icon: QweRGB },
    { x: 495, y: 65, w: 93, h: 159, label: "C", icon: qwe2RGB },
    { x: 310, y: 210, w: 211.5, h: 170, label: "D", icon: !settings.showGreyColor ? aRGB : a, blinking: settings.showGreyColor },
    { x: 267, y: 320, w: 80, h: 80, label: "D", icon: bRGB },
    { x: 335, y: 370, w: 75, h: 75, label: "D", icon: bRGB },
    { x: 405, y: 425, w: 70, h: 70, label: "D", icon: cRGB },
    { x: 225, y: 380, w: 77, h: 77, label: "D", icon: dRGB },
    { x: 295, y: 430, w: 77, h: 77, label: "D", icon: dRGB },
    { x: 165, y: 355, w: 57, h: 57, label: "D", icon: qRGB },
    { x: 300, y: 405, w: 27, h: 30, label: "D", icon: wRGB },
    { x: 265, y: 458, w: 30, h: 27, label: "w2", icon: wRGB },
    { x: 365, y: 495, w: 30, h: 27, label: "w3", icon: wRGB },
    { x: 397, y: 495, w: 191, h: 120, label: "w3", icon: !settings.showGreyColor ? eRGB : e, blinking: settings.showGreyColor },
    { x: 127, y: 485, w: 221, h: 120, label: "w3", icon: rRGB },
    { x: 20, y: 375, w: 111, h: 140, label: "w3", icon: tRGB },
    { x: 25, y: 75, w: 51, h: 100, label: "w3", icon: yRGB },
    { x: 25, y: 515, w: 30, h: 70, label: "w3", icon: yRGB },
    { x: 60, y: 35, w: 55, h: 25, label: "w3", icon: uRGB },
    { x: 240, y: 35, w: 55, h: 25, label: "w3", icon: uRGB },
    { x: 290, y: 35, w: 95, h: 45, label: "w3", icon: uRGB },
    { x: 480, y: 35, w: 95, h: 45, label: "w3", icon: fRGB }
  ]

  const defaultRoads = [
    { id: "horizontal1", points: [470, 650, -160, 200, 0, 2000, 0, 0], tension: 0, w: 30 },
    { id: "horizontal2", points: [830, 720, 440, 400, 490, 330, 745, 0], tension: 0, w: 25 },
  ]

  return (
    <div style={{ display: isMobile ? '' : "flex", flexDirection: 'row', alignItems: 'flex-start' }}>
      <div style={{ flex: 1 }}>
        <MainPageCanvas
          selectedRGB={selectedRGB}
          buildings={!selectedRGB ? defaultBuildingsRGB : defaultBuildings}
          showColorGlow={settings.showColorGlow}
          roads={!settings.showRoads ? undefined : defaultRoads}
        />
      </div>
      <HighlightPanel selectedRGB={selectedRGB} setSelectedRGB={setSelectedRGB} settings={settings} setSettings={setSettings} />
    </div>
  )
}

export default MainPage
