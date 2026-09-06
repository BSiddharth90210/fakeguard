import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { BarChart3, TrendingUp, AlertTriangle, CheckCircle2, RefreshCw, Clock } from 'lucide-react'
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts'
import './Dashboard.css'

export default function Dashboard() {
  const [stats, setStats] = useState({ total: 0, fake: 0, real: 0, avg_confidence: 0 })
  const [history, setHistory] = useState([])
  const [loading, setLoading] = useState(true)

  const API_URL = import.meta.env.VITE_API_URL || '';

  const load = async () => {
    setLoading(true)
    try {
      const [sRes, hRes] = await Promise.all([fetch(API_URL + '/stats'), fetch(API_URL + '/history')])
      setStats(await sRes.json())
      setHistory(await hRes.json())
    } catch {} finally { setLoading(false) }
  }

  useEffect(() => { load() }, [])

  const pieData = [
    { name: 'Fake', value: stats.fake || 0 },
    { name: 'Real', value: stats.real || 0 },
  ]
  const COLORS = ['#ff4757', '#2ed573']

  return (
    <div className="dashboard-page page-section">
      <div className="grid-bg" />
      <div className="container dash-container">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <div className="section-tag">Analytics</div>
          <h1 className="section-title">Prediction <span className="gradient-text">Dashboard</span></h1>
          <p className="section-subtitle">Real-time session analytics and prediction history</p>
        </motion.div>

        {/* ── Stat Cards ── */}
        <div className="stat-cards">
          {[
            { label: 'Total Predictions', value: stats.total, icon: BarChart3, color: '#6C63FF' },
            { label: 'Detected Fake', value: stats.fake, icon: AlertTriangle, color: '#ff4757' },
            { label: 'Confirmed Real', value: stats.real, icon: CheckCircle2, color: '#2ed573' },
            { label: 'Avg Confidence', value: stats.avg_confidence ? `${stats.avg_confidence}%` : '-', icon: TrendingUp, color: '#2D9CDB' },
          ].map((s, i) => (
            <motion.div
              className="dash-stat glass-card" key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 + i * 0.08, duration: 0.4 }}
            >
              <div className="dash-stat-icon" style={{ background: `${s.color}12`, color: s.color }}>
                <s.icon size={20} />
              </div>
              <div className="dash-stat-body">
                <span className="dash-stat-value">{s.value}</span>
                <span className="dash-stat-label">{s.label}</span>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="dash-grid">
          {/* ── Pie Chart ── */}
          <motion.div className="pie-card glass-card"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 }}
          >
            <h3>Distribution</h3>
            {stats.total > 0 ? (
              <ResponsiveContainer width="100%" height={220}>
                <PieChart>
                  <Pie data={pieData} cx="50%" cy="50%" innerRadius={55} outerRadius={85} paddingAngle={4} dataKey="value" stroke="none">
                    {pieData.map((_, i) => <Cell key={i} fill={COLORS[i]} />)}
                  </Pie>
                  <Tooltip contentStyle={{ background: '#12141c', border: '1px solid #1e2234', borderRadius: '8px', color: '#f0f1f8', fontSize: '0.85rem' }} />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="pie-empty">No data yet</div>
            )}
            <div className="pie-legend">
              <span className="legend-item"><span className="legend-dot" style={{ background: '#ff4757' }} /> Fake ({stats.fake})</span>
              <span className="legend-item"><span className="legend-dot" style={{ background: '#2ed573' }} /> Real ({stats.real})</span>
            </div>
          </motion.div>

          {/* ── History List ── */}
          <motion.div className="history-card glass-card"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.35 }}
          >
            <div className="history-header">
              <h3><Clock size={16} /> Recent Predictions</h3>
              <button className="refresh-btn" onClick={load} disabled={loading}>
                <RefreshCw size={14} className={loading ? 'spin' : ''} />
              </button>
            </div>

            <div className="history-list">
              {history.length === 0 ? (
                <div className="history-empty">
                  <p>No predictions yet. Go to the <strong>Detect</strong> page to analyze articles!</p>
                </div>
              ) : (
                history.map((p, i) => (
                  <motion.div className="history-row" key={p.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.05 * i }}
                  >
                    <div className="hist-text">{p.text.substring(0, 80)}...</div>
                    <div className="hist-right">
                      <span className={`badge ${p.prediction === 'FAKE' ? 'badge-fake' : 'badge-real'}`}>
                        {p.prediction}
                      </span>
                      <span className="hist-conf">{p.confidence}%</span>
                    </div>
                  </motion.div>
                ))
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
