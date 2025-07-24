"use client"

import { useState } from "react"
import HomeGreen from "@/components/HomeGreen.svg?url"
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
import { FOOTSTEPROUTES } from "@/assets/FOOTSTEPROUTES"
import { ELEMENTS } from "@/assets/ELEMENTS"
import { COLORSLINE } from "@/assets/COLORSLINE"
import type { Building } from "@/assets/types/mainpageCanvasTypes"
import MainPageCanvas from "./MainPageCanvas"
import { DEFAULTROADS } from "@/assets/DEFAULTROADS"

const MainPage = () => {
  const [selectedRGB, setSelectedRGB] = useState(false)
  const [settings, setSettings] = useState({
    showColorGlow: true,
    showGreyColor: true,
    showRoads: true,
  })
  const isMobile = useMediaQuery({ maxWidth: 1366 });

  const defaultBuildingsRGB: Building[] = [
    { x: 35, y: 25, w: 274, h: 287, label: "A", icon: settings.showColorGlow ? HomeGreen : HomeRGB, blinking: settings.showColorGlow },
    { x: 370, y: 110, w: 104, h: 105, label: "B", icon: QweRGB },
    { x: 495, y: 65, w: 93, h: 159, label: "C", icon: qwe2RGB },
    { x: 315, y: 217, w: 200, h: 153, label: "D1", icon: !settings.showGreyColor ? aRGB : a, blinking: settings.showGreyColor },
    { x: 267, y: 320, w: 80, h: 80, label: "D2", icon: bRGB },
    { x: 335, y: 370, w: 75, h: 75, label: "D3", icon: bRGB },
    { x: 405, y: 425, w: 70, h: 70, label: "D4", icon: cRGB },
    { x: 225, y: 380, w: 77, h: 77, label: "D5", icon: dRGB },
    { x: 295, y: 430, w: 77, h: 77, label: "D6", icon: dRGB },
    { x: 165, y: 348, w: 57, h: 60, label: "D7", icon: qRGB },
    { x: 300, y: 405, w: 27, h: 30, label: "D8", icon: wRGB },
    { x: 267, y: 452, w: 30, h: 27, label: "W2", icon: wRGB },
    { x: 370, y: 490, w: 30, h: 27, label: "W3", icon: wRGB },
    { x: 403, y: 495, w: 180, h: 100, label: "E1", icon: !settings.showGreyColor ? eRGB : e, blinking: settings.showGreyColor },
    { x: 133, y: 485, w: 220, h: 110, label: "R1", icon: rRGB },
    { x: 20, y: 365, w: 101, h: 150, label: "T1", icon: tRGB },
    { x: 25, y: 60, w: 60, h: 125, label: "Y1", icon: yRGB },
    { x: 25, y: 515, w: 30, h: 70, label: "Y2", icon: yRGB },
    { x: 60, y: 35, w: 55, h: 30, label: "U1", icon: uRGB },
    { x: 240, y: 35, w: 55, h: 30, label: "U2", icon: uRGB },
    { x: 290, y: 35, w: 95, h: 45, label: "U3", icon: uRGB },
    { x: 480, y: 35, w: 90, h: 45, label: "F1", icon: fRGB, }
  ]

  return (
    <div style={{ display: isMobile ? '' : "flex", flexDirection: 'row', alignItems: 'flex-start' }}>
      <div style={{ flex: 1 }}>
        <MainPageCanvas
          selectedRGB={selectedRGB}
          buildings={!selectedRGB ? defaultBuildingsRGB : defaultBuildings}
          showColorGlow={settings.showColorGlow}
          roads={!settings.showRoads ? undefined : DEFAULTROADS}
          footstepRoutes={FOOTSTEPROUTES}
          elements={ELEMENTS}
          colors={COLORSLINE}
        />
      </div>
      <HighlightPanel selectedRGB={selectedRGB} setSelectedRGB={setSelectedRGB} settings={settings} setSettings={setSettings} />
    </div>
  )
}

export default MainPage
