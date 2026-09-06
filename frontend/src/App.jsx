import { Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import Home from './pages/Home'
import Detect from './pages/Detect'
import Dashboard from './pages/Dashboard'
import HowItWorks from './pages/HowItWorks'
import Explainability from './pages/Explainability'

export default function App() {
  return (
    <div className="app">
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/detect" element={<Detect />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/how-it-works" element={<HowItWorks />} />
        <Route path="/explainability" element={<Explainability />} />
      </Routes>
    </div>
  )
}
