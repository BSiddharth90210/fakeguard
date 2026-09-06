/* ═══════════════════════════════════════════════════════════
   FakeGuard — Frontend JavaScript
   ═══════════════════════════════════════════════════════════ */

const API = '';   // empty = same origin

let selectedModel = 'bert';
let totalPredictions = 0;

// ── DOM refs ──────────────────────────────────────────────
const articleInput  = document.getElementById('articleInput');
const analyzeBtn    = document.getElementById('analyzeBtn');
const resultPanel   = document.getElementById('resultPanel');
const detectionCard = document.getElementById('detectionCard');
const charCount     = document.getElementById('charCount');
const statusBadge   = document.getElementById('statusBadge');
const statusText    = document.getElementById('statusText');
const livePredEl    = document.getElementById('livePred');

// ── Init ──────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', async () => {
  await checkHealth();
  await loadHistory();
  await loadLimeResults();
  setupListeners();
  setupNavScroll();
});

// ── Health check ──────────────────────────────────────────
async function checkHealth() {
  try {
    const res  = await fetch(`${API}/health`);
    const data = await res.json();
    statusBadge.classList.remove('offline');
    statusText.textContent = data.bert_available
      ? 'BERT Online'
      : 'LR/XGB Online';
    // Disable BERT tab if not available
    if (!data.bert_available) {
      document.getElementById('tab-bert').classList.add('disabled');
      document.getElementById('tab-bert').title = 'BERT model not loaded';
      selectModel('lr');
    }
  } catch {
    statusBadge.classList.add('offline');
    statusText.textContent = 'API Offline';
  }
}

// ── Model selection ───────────────────────────────────────
function selectModel(m) {
  selectedModel = m;
  document.querySelectorAll('.model-tab').forEach(t => {
    t.classList.toggle('active', t.dataset.model === m);
  });
}

// ── Event listeners ───────────────────────────────────────
function setupListeners() {
  // Model tabs
  document.querySelectorAll('.model-tab').forEach(tab => {
    tab.addEventListener('click', () => selectModel(tab.dataset.model));
  });

  // Char counter
  articleInput.addEventListener('input', () => {
    charCount.textContent = articleInput.value.length;
  });

  // Quick examples
  document.querySelectorAll('.example-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      articleInput.value = btn.dataset.text;
      charCount.textContent = btn.dataset.text.length;
      articleInput.focus();
    });
  });

  // Analyze
  analyzeBtn.addEventListener('click', runAnalysis);
  articleInput.addEventListener('keydown', e => {
    if (e.ctrlKey && e.key === 'Enter') runAnalysis();
  });

  // Try another
  document.getElementById('tryAnother').addEventListener('click', resetForm);

  // Refresh history
  document.getElementById('refreshHistory').addEventListener('click', loadHistory);

  // Navbar links smooth
  document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', e => {
      e.preventDefault();
      const target = document.querySelector(link.getAttribute('href'));
      if (target) target.scrollIntoView({ behavior: 'smooth' });
      document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
      link.classList.add('active');
    });
  });
}

// ── Navbar scroll effect ──────────────────────────────────
function setupNavScroll() {
  window.addEventListener('scroll', () => {
    const navbar = document.getElementById('navbar');
    navbar.classList.toggle('scrolled', window.scrollY > 40);

    // Update active nav link based on section
    const sections = ['detect', 'how-it-works', 'history', 'explainability'];
    let current = sections[0];
    for (const id of sections) {
      const el = document.getElementById(id);
      if (el && el.getBoundingClientRect().top <= 100) current = id;
    }
    document.querySelectorAll('.nav-link').forEach(l => {
      l.classList.toggle('active', l.getAttribute('href') === `#${current}`);
    });
  });
}

// ── Run analysis ──────────────────────────────────────────
async function runAnalysis() {
  const text = articleInput.value.trim();
  if (!text) {
    shakeElement(articleInput);
    return;
  }

  // Show loading
  analyzeBtn.disabled = true;
  analyzeBtn.querySelector('.btn-text').style.display = 'none';
  analyzeBtn.querySelector('.btn-loader').style.display = 'flex';
  resultPanel.classList.add('hidden');

  try {
    const res  = await fetch(`${API}/predict`, {
      method:  'POST',
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify({ text, model: selectedModel })
    });

    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    showResult(data);

    // Update live counter
    totalPredictions++;
    livePredEl.textContent = totalPredictions;

    // Refresh history
    await loadHistory();
  } catch (err) {
    showError(`Analysis failed: ${err.message}. Is the API running?`);
  } finally {
    analyzeBtn.disabled = false;
    analyzeBtn.querySelector('.btn-text').style.display = 'flex';
    analyzeBtn.querySelector('.btn-loader').style.display = 'none';
  }
}

// ── Show result ───────────────────────────────────────────
function showResult(data) {
  const isFake = data.prediction === 'FAKE';

  // Verdict badge
  const badge = document.getElementById('verdictBadge');
  badge.className = `verdict-badge ${isFake ? 'fake-verdict' : 'real-verdict'}`;
  document.getElementById('verdictIcon').textContent = isFake ? '⚠️' : '✅';
  document.getElementById('verdictText').textContent  = isFake ? 'FAKE NEWS' : 'REAL NEWS';

  // Model used
  document.getElementById('modelUsed').textContent = `via ${data.model_used}`;

  // Confidence bar
  document.getElementById('confValue').textContent = `${data.confidence}%`;
  setTimeout(() => {
    document.getElementById('confBar').style.width = `${data.confidence}%`;
  }, 50);

  // Prob bars
  document.getElementById('fakeProb').textContent = `${data.fake_prob}%`;
  document.getElementById('realProb').textContent = `${data.real_prob}%`;
  setTimeout(() => {
    document.getElementById('fakeBar').style.width = `${data.fake_prob}%`;
    document.getElementById('realBar').style.width = `${data.real_prob}%`;
  }, 100);

  // Timestamp
  document.getElementById('resultTimestamp').textContent =
    `Analyzed at ${new Date(data.timestamp).toLocaleTimeString()} · ID #${data.id}`;

  // Show panel
  resultPanel.classList.remove('hidden');
  resultPanel.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

// ── Reset form ────────────────────────────────────────────
function resetForm() {
  resultPanel.classList.add('hidden');
  articleInput.value = '';
  charCount.textContent = '0';
  // Reset bars
  document.getElementById('confBar').style.width = '0';
  document.getElementById('fakeBar').style.width = '0';
  document.getElementById('realBar').style.width = '0';
  articleInput.focus();
}

// ── Load history ──────────────────────────────────────────
async function loadHistory() {
  try {
    const [histRes, statsRes] = await Promise.all([
      fetch(`${API}/history`),
      fetch(`${API}/stats`)
    ]);
    const history = await histRes.json();
    const stats   = await statsRes.json();

    // Update stats
    document.getElementById('histTotal').textContent = stats.total;
    document.getElementById('histFake').textContent  = stats.fake;
    document.getElementById('histReal').textContent  = stats.real;
    document.getElementById('histConf').textContent  = stats.avg_confidence ? `${stats.avg_confidence}%` : '-';
    livePredEl.textContent = stats.total;
    totalPredictions       = stats.total;

    // Render list
    const list = document.getElementById('historyList');
    if (!history.length) {
      list.innerHTML = `
        <div class="empty-history">
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" opacity="0.4"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
          <p>No predictions yet. Try the analyzer above!</p>
        </div>`;
      return;
    }

    list.innerHTML = history.map(p => `
      <div class="history-item">
        <span class="hist-text">${escHtml(p.text.substring(0, 100))}...</span>
        <span class="hist-verdict ${p.prediction.toLowerCase()}">${p.prediction}</span>
        <span class="hist-conf">${p.confidence}%</span>
        <span class="hist-model">${p.model_used.split(' ')[0]}</span>
      </div>
    `).join('');
  } catch (err) {
    console.warn('History load failed:', err);
  }
}

// ── Load LIME results ─────────────────────────────────────
async function loadLimeResults() {
  const container = document.getElementById('limeCards');
  try {
    const res  = await fetch(`${API}/lime`);
    const data = await res.json();

    if (!data.length) {
      container.innerHTML = '<div class="lime-loading">No LIME results available.</div>';
      return;
    }

    container.innerHTML = data.map(item => {
      const isFake = item.prediction === 'FAKE';
      const words  = item.top_words || [];

      const wordTags = words.slice(0, 8).map(([word, weight]) => {
        const dir   = weight < 0 ? 'push-fake' : 'push-real';
        const label = weight < 0 ? '→FAKE' : '→REAL';
        return `<span class="lime-word ${dir}" title="weight: ${weight.toFixed(6)}">${escHtml(word)} <small>${label}</small></span>`;
      }).join('');

      return `
        <div class="lime-card">
          <div class="lime-card-header">
            <span class="lime-verdict ${isFake ? 'fake' : 'real'}">${item.prediction}</span>
            <span class="lime-conf">${(item.confidence * 100).toFixed(2)}% confident</span>
          </div>
          <p class="lime-text">"${escHtml(item.text.substring(0, 120))}..."</p>
          <div class="lime-words-title">Key influencing words</div>
          <div class="lime-words">${wordTags}</div>
        </div>
      `;
    }).join('');
  } catch (err) {
    container.innerHTML = '<div class="lime-loading">Could not load LIME results.</div>';
  }
}

// ── Utilities ─────────────────────────────────────────────
function showError(msg) {
  alert(msg);
}

function shakeElement(el) {
  el.style.animation = 'shake 0.5s ease';
  el.addEventListener('animationend', () => el.style.animation = '', { once: true });
  el.focus();
}

function escHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

// Shake animation (injected)
const shakeStyle = document.createElement('style');
shakeStyle.textContent = `@keyframes shake {
  0%,100%{transform:translateX(0)} 20%{transform:translateX(-8px)} 40%{transform:translateX(8px)} 60%{transform:translateX(-6px)} 80%{transform:translateX(6px)}
}`;
document.head.appendChild(shakeStyle);
