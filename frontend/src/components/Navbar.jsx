import { useState, useEffect } from 'react'
import { NavLink, useLocation } from 'react-router-dom'
import { Shield, Activity, BarChart3, Brain, Sparkles, Menu, X } from 'lucide-react'
import './Navbar.css'

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [status, setStatus] = useState({ online: false, bert: false })
  const [mobileOpen, setMobileOpen] = useState(false)
  const location = useLocation()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 30)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const API_URL = import.meta.env.VITE_API_URL || '';

  useEffect(() => {
    fetch(API_URL + '/health')
      .then(r => r.json())
      .then(d => setStatus({ online: true, bert: d.bert_available }))
      .catch(() => setStatus({ online: false, bert: false }))
  }, [location])

  useEffect(() => { setMobileOpen(false) }, [location])

  const links = [
    { to: '/', label: 'Home', icon: Sparkles },
    { to: '/detect', label: 'Detect', icon: Shield },
    { to: '/dashboard', label: 'Dashboard', icon: BarChart3 },
    { to: '/how-it-works', label: 'Architecture', icon: Activity },
    { to: '/explainability', label: 'Explainability', icon: Brain },
  ]

  return (
    <nav className={`navbar ${scrolled ? 'scrolled' : ''}`}>
      <div className="nav-inner container">
        <NavLink to="/" className="nav-brand">
          <div className="brand-icon">
            <Shield size={20} />
          </div>
          <span className="brand-text">FakeGuard</span>
        </NavLink>

        <div className={`nav-links ${mobileOpen ? 'open' : ''}`}>
          {links.map(l => (
            <NavLink
              key={l.to}
              to={l.to}
              className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
              end={l.to === '/'}
            >
              <l.icon size={15} />
              <span>{l.label}</span>
            </NavLink>
          ))}
        </div>

        <div className="nav-right">
          <div className={`status-badge ${status.online ? 'online' : 'offline'}`}>
            <span className="status-dot" />
            <span>{status.online ? (status.bert ? 'BERT Online' : 'API Online') : 'Offline'}</span>
          </div>
          <button className="mobile-toggle" onClick={() => setMobileOpen(!mobileOpen)}>
            {mobileOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>
    </nav>
  )
}
