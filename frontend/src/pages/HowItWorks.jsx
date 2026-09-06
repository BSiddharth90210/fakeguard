import { motion } from 'framer-motion'
import { FileText, Activity, Cpu, Clock, BarChart3, ArrowDown, Database, Layers } from 'lucide-react'
import './HowItWorks.css'

const steps = [
  { icon: FileText, title: 'Text Input', desc: 'Raw news article text is received via the FastAPI /predict endpoint', tech: 'FastAPI · Pydantic', color: '#6C63FF' },
  { icon: Activity, title: 'Preprocessing', desc: 'Text is lowercased, URLs removed, punctuation stripped via regex', tech: 'Regex · NLP', color: '#2D9CDB' },
  { icon: Cpu, title: 'Tokenization', desc: 'HuggingFace AutoTokenizer converts text to 128-token BERT embeddings', tech: 'Transformers · PyTorch', color: '#00d2ff' },
  { icon: Clock, title: 'Inference', desc: 'Fine-tuned BERT classifies as FAKE or REAL with softmax probabilities', tech: 'BERT · 99.98% Accuracy', color: '#2ed573' },
  { icon: BarChart3, title: 'Explainability', desc: 'LIME generates word-level attributions showing prediction drivers', tech: 'LIME · SHAP', color: '#ffa502' },
  { icon: Database, title: 'Storage', desc: 'Results saved to session history for analytics dashboard tracking', tech: 'In-Memory · FastAPI', color: '#ff4757' },
]

const models = [
  { name: 'Logistic Regression', algo: 'TF-IDF (50k features) + LR', accuracy: 98.80, f1: 98.74, best: false },
  { name: 'XGBoost', algo: 'TF-IDF (50k features) + 100 trees', accuracy: 99.80, f1: 99.79, best: false },
  { name: 'BERT (fine-tuned)', algo: 'DistilBERT + GPU (CUDA)', accuracy: 99.98, f1: 99.98, best: true },
]

const dataInfo = [
  { label: 'Dataset', value: 'Kaggle Fake and Real News' },
  { label: 'Total Articles', value: '44,898' },
  { label: 'Distribution', value: '52% Fake · 48% Real' },
  { label: 'Train Split', value: '35,000 articles' },
  { label: 'Validation', value: '5,000 articles' },
  { label: 'Test Split', value: '4,898 articles' },
]

export default function HowItWorks() {
  return (
    <div className="hiw-page page-section">
      <div className="grid-bg" />
      <div className="container hiw-container">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <div className="section-tag">Architecture</div>
          <h1 className="section-title">How FakeGuard <span className="gradient-text">Works</span></h1>
          <p className="section-subtitle">A multi-stage ML pipeline from raw text to explainable predictions</p>
        </motion.div>

        {/* ── Pipeline ── */}
        <div className="pipeline">
          {steps.map((s, i) => (
            <div key={i}>
              <motion.div
                className="pipeline-step glass-card"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{ delay: i * 0.08, duration: 0.4 }}
              >
                <div className="step-num">{String(i + 1).padStart(2, '0')}</div>
                <div className="step-icon" style={{ background: `${s.color}15`, color: s.color }}>
                  <s.icon size={24} />
                </div>
                <h3>{s.title}</h3>
                <p>{s.desc}</p>
                <span className="step-tech">{s.tech}</span>
              </motion.div>
              {i < steps.length - 1 && (
                <div className="pipeline-connector"><ArrowDown size={16} /></div>
              )}
            </div>
          ))}
        </div>

        {/* ── Model Comparison ── */}
        <motion.div
          className="model-compare glass-card"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <div className="compare-header">
            <Layers size={20} />
            <h2>Model Performance Comparison</h2>
          </div>
          <div className="compare-table">
            <div className="compare-row compare-head">
              <span>Model</span><span>Algorithm</span><span>Accuracy</span><span>F1 Score</span>
            </div>
            {models.map((m, i) => (
              <motion.div
                className={`compare-row ${m.best ? 'best' : ''}`}
                key={i}
                initial={{ opacity: 0, x: -15 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 + i * 0.1 }}
              >
                <span className="model-name">
                  {m.name}
                  {m.best && <span className="best-badge">BEST</span>}
                </span>
                <span className="model-algo">{m.algo}</span>
                <span className="model-acc">
                  <div className="acc-bar-track">
                    <motion.div
                      className={`acc-bar-fill ${m.best ? 'gold' : ''}`}
                      initial={{ width: 0 }}
                      whileInView={{ width: `${m.accuracy}%` }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.3 + i * 0.15, duration: 0.8 }}
                    />
                  </div>
                  {m.accuracy}%
                </span>
                <span>{m.f1}%</span>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* ── Dataset Info ── */}
        <motion.div
          className="dataset-section glass-card"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h2><Database size={18} /> Dataset Details</h2>
          <div className="dataset-grid">
            {dataInfo.map((d, i) => (
              <div className="dataset-item" key={i}>
                <span className="ds-label">{d.label}</span>
                <span className="ds-value">{d.value}</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  )
}
