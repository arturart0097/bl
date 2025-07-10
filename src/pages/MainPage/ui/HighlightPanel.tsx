import React from "react"
import styles from "./MainPage.module.css"
import { useMediaQuery } from "react-responsive"

interface HighlightPanelProps {
  selectedRGB: boolean
  setSelectedRGB: (v: boolean) => void
  settings: {
    showColorGlow: boolean
    showGreyColor: boolean
    showRoads: boolean
  }
  setSettings: React.Dispatch<React.SetStateAction<{
    showColorGlow: boolean
    showGreyColor: boolean
    showRoads: boolean
  }>>
}

const HighlightPanel: React.FC<HighlightPanelProps> = ({ selectedRGB, setSelectedRGB, settings, setSettings }) => {
  const isMobile = useMediaQuery({ maxWidth: 1366 })

  return (
    <div style={{ minWidth: 340, marginRight: 20, border: '2px solid #5c5c5c', borderRadius: 16, background: '#222', padding: 24, boxShadow: '0 4px 16px #38a16911', marginTop: isMobile ? 150 : 0 }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
        <label className={styles.checkboxLabel} style={{ fontSize: 14, fontWeight: 700, color: '#bfbfbf' }}>
          <input
            type="checkbox"
            className={`${styles.checkbox} ${styles.checkboxGreen}`}
            checked={selectedRGB}
            onChange={e => setSelectedRGB(e.target.checked)}
          />
          Увімкнути RGB тему
        </label>
        <label className={styles.checkboxLabel} style={{ fontSize: 14, fontWeight: 700, color: '#bfbfbf' }}>
          <input
            type="checkbox"
            className={`${styles.checkbox} ${styles.checkboxGreen}`}
            checked={!selectedRGB}
            onChange={e => setSelectedRGB(!e.target.checked)}
          />
          Увімкнути білу тему
        </label>
        <label className={styles.checkboxLabel} style={{ fontSize: 14, fontWeight: 700, color: '#bfbfbf' }}>
          <input
            type="checkbox"
            className={`${styles.checkbox} ${styles.checkboxGreen}`}
            checked={settings.showColorGlow}
            onChange={e => setSettings(prev => ({ ...prev, showColorGlow: e.target.checked }))}
          />
          Увімкнути зелену підсвітку для будинків БЛАГО
        </label>
        <label className={styles.checkboxLabel} style={{ fontSize: 14, fontWeight: 700, color: '#bfbfbf' }}>
          <input
            type="checkbox"
            className={`${styles.checkbox} ${styles.checkboxGreen}`}
            checked={settings.showGreyColor}
            onChange={e => setSettings(prev => ({ ...prev, showGreyColor: e.target.checked }))}
          />
          Увімкнути сіру підсвітку для будинків
        </label>
        <label className={styles.checkboxLabel} style={{ fontSize: 14, fontWeight: 700, color: '#bfbfbf' }}>
          <input
            type="checkbox"
            className={`${styles.checkbox} ${styles.checkboxGreen}`}
            checked={settings.showRoads}
            onChange={e => setSettings(prev => ({ ...prev, showRoads: e.target.checked }))}
          />
          Показати дороги
        </label>
      </div>
    </div>
  )
}

export default HighlightPanel 