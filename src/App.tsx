import { Route, Routes } from 'react-router-dom'
import { AboutPage } from './pages/AboutPage'
import { MainPage } from './pages/MainPage'

function App() {

  return (
    <div style={{
      marginTop: 80
    }}>
      <Routes>
        <Route path="/" element={<MainPage />} />
        <Route path="/about" element={<AboutPage />} />
      </Routes>
    </div>
  )
}

export default App
