
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
  
  export type Road = {
    id: string
    points: number[]
    tension: number
    w: number
  }
  
 export interface MainPageCanvasProps {
    roads?: Road[]
    buildings?: Building[]
    stageWidth?: number
    stageHeight?: number
    selectedRGB: boolean
    showColorGlow?: boolean
    showBlinking?: boolean
    footstepRoutes: any
    elements: any
    colors: string[]
  }
  
 export interface LightStream {
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
 export interface Footstep {
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
  