import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Shield, Zap, Brain, BarChart3, ArrowRight, Sparkles, Github } from 'lucide-react'
import './Home.css'

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i = 0) => ({ opacity: 1, y: 0, transition: { delay: i * 0.12, duration: 0.6, ease: [0.34, 1.56, 0.64, 1] } })
}

const stats = [
  { value: '99.98%', label: 'BERT Accuracy', icon: Brain },
  { value: '56ms', label: 'Avg Latency', icon: Zap },
  { value: '44,898', label: 'Articles Trained', icon: BarChart3 },
  { value: '3', label: 'ML Models', icon: Shield },
]

const features = [
  {
    icon: Brain, title: 'Fine-Tuned BERT',
    desc: 'State-of-the-art transformer model fine-tuned on 35,000 news articles with 99.98% accuracy',
    color: '#6C63FF',
  },
  {
    icon: Zap, title: 'Real-Time Analysis',
    desc: 'Sub-200ms inference latency powered by PyTorch with GPU acceleration on NVIDIA RTX 3050',
    color: '#2D9CDB',
  },
  {
    icon: BarChart3, title: '3 Model Pipeline',
    desc: 'Logistic Regression, XGBoost, and BERT — compare predictions across different algorithms',
    color: '#00d2ff',
  },
  {
    icon: Sparkles, title: 'LIME Explainability',
    desc: 'Understand why the model made its decision with word-level attribution analysis using LIME & SHAP',
    color: '#2ed573',
  },
]

const techStack = [
  'HuggingFace', 'PyTorch', 'FastAPI', 'XGBoost', 'Scikit-learn',
  'LIME', 'SHAP', 'React', 'Vite', 'CUDA'
]

export default function Home() {
  const navigate = useNavigate()

  return (
    <div className="home-page">
      <div className="grid-bg" />
      <div className="hero-orb orb-purple" />
      <div className="hero-orb orb-blue" />
      <div className="hero-orb orb-cyan" />

      {/* ── Hero Section ── */}
      <section className="hero container">
        <motion.div className="hero-content" initial="hidden" animate="visible" variants={{ visible: { transition: { staggerChildren: 0.1 } } }}>
          <motion.div className="hero-tag" variants={fadeUp} custom={0}>
            <Sparkles size={14} />
            <span>Powered by BERT &middot; 99.98% Accuracy</span>
          </motion.div>

          <motion.h1 className="hero-title" variants={fadeUp} custom={1}>
            Detect Fake News<br />
            <span className="gradient-text">in Milliseconds</span>
          </motion.h1>

          <motion.p className="hero-subtitle" variants={fadeUp} custom={2}>
            FakeGuard is an AI-powered fake news detection system that combines fine-tuned BERT,
            XGBoost, and Logistic Regression with LIME explainability — all served via a FastAPI backend.
          </motion.p>

          <motion.div className="hero-actions" variants={fadeUp} custom={3}>
            <button className="btn btn-primary" onClick={() => navigate('/detect')}>
              <Shield size={18} />
              Start Detecting
              <ArrowRight size={16} />
            </button>
            <a className="btn btn-ghost" href="https://github.com/BSiddharth90210/fakeguard" target="_blank" rel="noreferrer">
              <Github size={18} />
              View Source
            </a>
          </motion.div>
        </motion.div>

        {/* ── Stats Strip ── */}
        <motion.div className="stats-strip" initial="hidden" animate="visible" variants={{ visible: { transition: { staggerChildren: 0.08, delayChildren: 0.4 } } }}>
          {stats.map((s, i) => (
            <motion.div className="stat-item" key={i} variants={fadeUp}>
              <s.icon size={18} className="stat-icon" />
              <span className="stat-value">{s.value}</span>
              <span className="stat-label">{s.label}</span>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* ── Features Section ── */}
      <section className="features-section container">
        <div className="section-tag">Capabilities</div>
        <h2 className="section-title">Built for <span className="gradient-text">Serious Analysis</span></h2>
        <p className="section-subtitle">Every component is designed for production-grade fake news detection</p>

        <div className="features-grid">
          {features.map((f, i) => (
            <motion.div
              className="feature-card glass-card"
              key={i}
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ delay: i * 0.1, duration: 0.5 }}
            >
              <div className="feature-icon" style={{ background: `${f.color}15`, color: f.color }}>
                <f.icon size={24} />
              </div>
              <h3>{f.title}</h3>
              <p>{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── Tech Stack ── */}
      <section className="tech-section container">
        <div className="section-tag">Tech Stack</div>
        <h2 className="section-title">Powered By</h2>
        <div className="tech-marquee">
          <div className="tech-track">
            {[...techStack, ...techStack].map((t, i) => (
              <span className="tech-chip" key={i}>{t}</span>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA Section ── */}
      <section className="cta-section container">
        <motion.div
          className="cta-card glass-card"
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <h2>Ready to detect fake news?</h2>
          <p>Paste any news article and get an AI-powered analysis with confidence scores and explainability</p>
          <button className="btn btn-primary" onClick={() => navigate('/detect')}>
            <Shield size={18} /> Try the Detector <ArrowRight size={16} />
          </button>
        </motion.div>
      </section>

      {/* ── Footer ── */}
      <footer className="footer">
        <div className="container footer-inner">
          <div className="footer-brand">
            <Shield size={18} />
            <span>FakeGuard</span>
          </div>
          <p className="footer-text">AI-Powered Fake News Detection &middot; BERT &middot; FastAPI &middot; LIME</p>
          <p className="footer-sub">Dataset: Kaggle Fake and Real News &middot; 44,898 articles &middot; RTX 3050 GPU</p>
        </div>
      </footer>
    </div>
  )
}
