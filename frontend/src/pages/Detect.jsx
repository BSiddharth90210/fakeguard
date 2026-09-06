import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Shield, AlertTriangle, CheckCircle2, Loader2, RotateCcw, Sparkles } from 'lucide-react'
import './Detect.css'

const EXAMPLES = [
  { label: 'Reuters Article', text: 'WASHINGTON (Reuters) - President Donald Trump signed two executive orders on Wednesday, including one directing federal agencies to use only domestic steel in U.S. infrastructure projects.' },
  { label: 'Suspicious Headline', text: 'BREAKING: Scientists have discovered that drinking bleach cures all known diseases. The government is hiding this miracle cure to protect Big Pharma profits!' },
  { label: 'Financial News', text: 'Federal Reserve raises interest rates by 0.25% as inflation continues to ease, with officials signaling potential rate cuts in 2025 if economic conditions improve.' },
  { label: 'Conspiracy Theory', text: 'SHOCKING: NASA admits the moon is actually a hologram projected by secret lizard people who control the world\'s governments. Anonymous source confirms alien invasion planned for 2026.' },
]

export default function Detect() {
  const [text, setText] = useState('')
  const [model, setModel] = useState('bert')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState(null)
  const [models, setModels] = useState(['bert', 'lr', 'xgb'])

  const API_URL = import.meta.env.VITE_API_URL || '';

  useEffect(() => {
    fetch(API_URL + '/health').then(r => r.json()).then(d => {
      setModels(d.models)
      if (!d.bert_available && model === 'bert') setModel('lr')
    }).catch(() => {})
  }, [])

  const analyze = async () => {
    if (!text.trim()) return
    setLoading(true); setResult(null)
    try {
      const res = await fetch(API_URL + '/predict', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text, model })
      })
      const data = await res.json()
      setResult(data)
    } catch (err) {
      alert('Analysis failed. Is the API running on port 8000?')
    } finally { setLoading(false) }
  }

  const reset = () => { setResult(null); setText('') }

  return (
    <div className="detect-page page-section">
      <div className="grid-bg" />
      <div className="container detect-container">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <div className="section-tag">Live Detection</div>
          <h1 className="section-title">Analyze News <span className="gradient-text">Articles</span></h1>
          <p className="section-subtitle">Paste any news article or headline below and get an AI-powered fake news analysis</p>
        </motion.div>

        <div className="detect-grid">
          {/* ── Input Panel ── */}
          <motion.div
            className="input-panel glass-card"
            initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            <div className="panel-header">
              <h2><Shield size={18} /> Input</h2>
              <div className="model-tabs">
                {['bert', 'lr', 'xgb'].map(m => (
                  <button
                    key={m}
                    className={`model-tab ${model === m ? 'active' : ''} ${!models.includes(m) ? 'disabled' : ''}`}
                    onClick={() => models.includes(m) && setModel(m)}
                    title={!models.includes(m) ? 'Model not available' : ''}
                  >
                    {m === 'bert' ? 'BERT' : m === 'lr' ? 'Log. Reg.' : 'XGBoost'}
                  </button>
                ))}
              </div>
            </div>

            <textarea
              className="article-input"
              value={text}
              onChange={e => setText(e.target.value)}
              onKeyDown={e => e.ctrlKey && e.key === 'Enter' && analyze()}
              placeholder="Paste a news article or headline here...&#10;&#10;Ctrl+Enter to analyze"
              rows={8}
            />

            <div className="input-footer">
              <span className="char-count">{text.length} characters</span>
              <div className="examples">
                {EXAMPLES.map((ex, i) => (
                  <button key={i} className="example-chip" onClick={() => setText(ex.text)}>
                    {ex.label}
                  </button>
                ))}
              </div>
            </div>

            <button className="btn btn-primary analyze-btn" onClick={analyze} disabled={loading || !text.trim()}>
              {loading ? <><span className="spinner" /> Analyzing...</> : <><Sparkles size={18} /> Analyze with AI</>}
            </button>
          </motion.div>

          {/* ── Result Panel ── */}
          <div className="result-panel-wrapper">
            <AnimatePresence mode="wait">
              {result ? (
                <motion.div
                  className="result-panel glass-card"
                  key="result"
                  initial={{ opacity: 0, scale: 0.95, y: 20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ type: 'spring', damping: 20, stiffness: 200 }}
                >
                  {/* Verdict */}
                  <div className={`verdict ${result.prediction === 'FAKE' ? 'fake' : 'real'}`}>
                    {result.prediction === 'FAKE' ? <AlertTriangle size={32} /> : <CheckCircle2 size={32} />}
                    <span className="verdict-label">{result.prediction === 'FAKE' ? 'FAKE NEWS' : 'REAL NEWS'}</span>
                  </div>

                  {/* Confidence */}
                  <div className="conf-section">
                    <div className="conf-header">
                      <span>Confidence</span>
                      <span className="conf-pct">{result.confidence}%</span>
                    </div>
                    <div className="conf-track">
                      <motion.div
                        className={`conf-fill ${result.prediction === 'FAKE' ? 'fake-fill' : 'real-fill'}`}
                        initial={{ width: 0 }}
                        animate={{ width: `${result.confidence}%` }}
                        transition={{ delay: 0.3, duration: 1, ease: [0.34, 1.56, 0.64, 1] }}
                      />
                    </div>
                  </div>

                  {/* Probability Bars */}
                  <div className="prob-section">
                    <ProbBar label="Fake Probability" value={result.fake_prob} color="fake" delay={0.4} />
                    <ProbBar label="Real Probability" value={result.real_prob} color="real" delay={0.5} />
                  </div>

                  {/* Meta */}
                  <div className="result-meta">
                    <span className="meta-model">{result.model_used}</span>
                    <span className="meta-id">#{result.id}</span>
                  </div>

                  <button className="btn btn-ghost reset-btn" onClick={reset}>
                    <RotateCcw size={16} /> Try Another
                  </button>
                </motion.div>
              ) : (
                <motion.div
                  className="empty-result glass-card"
                  key="empty"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <Shield size={48} className="empty-icon" />
                  <h3>Awaiting Analysis</h3>
                  <p>Enter a news article on the left and click "Analyze with AI" to get started</p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  )
}

function ProbBar({ label, value, color, delay }) {
  return (
    <div className="prob-item">
      <div className="prob-header">
        <span className={`prob-dot ${color}`} />
        <span>{label}</span>
        <span className="prob-pct">{value}%</span>
      </div>
      <div className="prob-track">
        <motion.div
          className={`prob-fill ${color}`}
          initial={{ width: 0 }}
          animate={{ width: `${value}%` }}
          transition={{ delay, duration: 1, ease: [0.34, 1.56, 0.64, 1] }}
        />
      </div>
    </div>
  )
}
