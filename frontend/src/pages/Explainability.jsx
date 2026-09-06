import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Brain, AlertTriangle, CheckCircle2, Info } from 'lucide-react'
import './Explainability.css'

export default function Explainability() {
  const [limeData, setLimeData] = useState([])
  const [loading, setLoading] = useState(true)

  const API_URL = import.meta.env.VITE_API_URL || '';

  useEffect(() => {
    fetch(API_URL + '/lime')
      .then(r => r.json())
      .then(d => { setLimeData(d); setLoading(false) })
      .catch(() => setLoading(false))
  }, [])

  return (
    <div className="explain-page page-section">
      <div className="grid-bg" />
      <div className="container explain-container">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <div className="section-tag">LIME Explainability</div>
          <h1 className="section-title">Why Did the Model <span className="gradient-text">Decide This?</span></h1>
          <p className="section-subtitle">LIME (Local Interpretable Model-agnostic Explanations) reveals which words most influenced each prediction</p>
        </motion.div>

        {/* ── Info Banner ── */}
        <motion.div
          className="info-banner glass-card"
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Info size={20} />
          <div>
            <strong>How LIME Works:</strong> LIME perturbs the input text by randomly removing words, observes how the prediction changes, and fits a local linear model to identify which words are most influential.
            Words pushing toward <span className="inline-fake">FAKE</span> are shown in red, words pushing toward <span className="inline-real">REAL</span> are shown in green.
          </div>
        </motion.div>

        {/* ── LIME Cards ── */}
        {loading ? (
          <div className="lime-loading">
            <span className="spinner" /> Loading explainability results...
          </div>
        ) : limeData.length === 0 ? (
          <div className="lime-loading">No LIME results available. Run Phase 4 to generate them.</div>
        ) : (
          <div className="lime-grid">
            {limeData.map((item, i) => (
              <motion.div
                className="lime-card glass-card"
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-30px' }}
                transition={{ delay: i * 0.08, duration: 0.4 }}
              >
                <div className="lime-card-top">
                  <span className={`badge ${item.prediction === 'FAKE' ? 'badge-fake' : 'badge-real'}`}>
                    {item.prediction === 'FAKE' ? <AlertTriangle size={12} /> : <CheckCircle2 size={12} />}
                    {item.prediction}
                  </span>
                  <span className="lime-conf">{(item.confidence * 100).toFixed(2)}%</span>
                </div>

                <p className="lime-text">"{item.text.substring(0, 120)}..."</p>

                <div className="lime-words-section">
                  <span className="lime-words-title">Key Influencing Words</span>
                  <div className="lime-words">
                    {(item.top_words || []).slice(0, 8).map(([word, weight], j) => {
                      const isFake = weight < 0
                      const absW = Math.abs(weight)
                      const intensity = Math.min(absW * 10000, 1)
                      return (
                        <motion.div
                          className={`lime-word ${isFake ? 'fake' : 'real'}`}
                          key={j}
                          initial={{ opacity: 0, scale: 0.8 }}
                          whileInView={{ opacity: 1, scale: 1 }}
                          viewport={{ once: true }}
                          transition={{ delay: 0.05 * j }}
                          style={{ '--intensity': intensity }}
                        >
                          <span className="lw-text">{word}</span>
                          <span className="lw-dir">{isFake ? 'FAKE' : 'REAL'}</span>
                        </motion.div>
                      )
                    })}
                  </div>
                </div>

                {/* ── Mini Bar Chart ── */}
                <div className="lime-bars">
                  {(item.top_words || []).slice(0, 6).map(([word, weight], j) => {
                    const isFake = weight < 0
                    const barWidth = Math.min(Math.abs(weight) * 100000, 100)
                    return (
                      <div className="lime-bar-row" key={j}>
                        <span className="bar-word">{word}</span>
                        <div className="bar-track">
                          <motion.div
                            className={`bar-fill ${isFake ? 'bar-fake' : 'bar-real'}`}
                            initial={{ width: 0 }}
                            whileInView={{ width: `${Math.max(barWidth, 4)}%` }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.3 + j * 0.06, duration: 0.6 }}
                          />
                        </div>
                      </div>
                    )
                  })}
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
