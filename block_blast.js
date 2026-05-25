// ── LEVEL DEFINITIONS ─────────────────────────────────────────────
const LEVELS=[
  {n:1,grid:7,obstacles:0, target:400, color:'#a8c5e8',label:'Başlangıç',desc:'7×7 grid, engel yok.'},
  {n:2,grid:8,obstacles:4, target:700, color:'#a8d5b8',label:'Orta',     desc:'8×8 grid, 4 engel.'},
  {n:3,grid:8,obstacles:10,target:1100,color:'#f0d8a0',label:'Zor',      desc:'8×8 grid, 10 engel.'},
  {n:4,grid:9,obstacles:14,target:1600,color:'#f0b8cc',label:'Çok Zor',  desc:'9×9 grid, 14 engel.'},
  {n:5,grid:9,obstacles:20,target:2200,color:'#c5b8e8',label:'Uzman',    desc:'9×9 grid, 20 engel!'},
];

const SHAPES=[
  [[1,1,1]],[[1],[1],[1]],[[1,1],[1,1]],
  [[1,1,1],[0,0,1]],[[1,1,1],[1,0,0]],
  [[1,0],[1,0],[1,1]],[[0,1],[0,1],[1,1]],
  [[1,1,1,1]],[[1],[1],[1],[1]],
  [[1,1,0],[0,1,1]],[[0,1,1],[1,1,0]],
  [[1,1,1],[0,1,0]],
  [[1]],[[1,1]],[[1],[1]],
  [[1,1],[1,0]],[[1,1],[0,1]],[[0,1],[1,1]],[[1,0],[1,1]],
  [[1,0,0],[1,0,0],[1,1,1]],[[0,0,1],[0,0,1],[1,1,1]],
  [[1,1,1],[1,0,0],[1,0,0]],[[1,1,1],[0,0,1],[0,0,1]],
];

const COLORS=[
  '#a8c5e8','#a8d5b8','#f0b8a8','#c5b8e8',
  '#f0d8a0','#f0b8cc','#a8d8d0','#d8c8a8','#c8e0a8'
];

// ── CAT SPRITE DEFINITIONS ────────────────────────────────────────
// Her giriş, belirli bir blok şekline hangi kedi sprite'ının geleceğini tanımlar.
//
//   shape  : Blok şekliyle birebir eşleşen 2D dizi (1 = dolu, 0 = boş)
//   sheet  : Sprite sheet dosya adı (block_blast.js ile aynı klasörde olmalı)
//   frames : Sheet'teki toplam frame sayısı
//   fpr    : Satır başına frame sayısı (frames per row)
//   fps    : Animasyon hızı (frame/saniye)
//
// Yeni bir kedi eklemek için buraya yeni bir nesne ekle. ▼
const CAT_DEFS = [
  {
    shape: [[1, 1], [1, 1]],
    sheet: '2x2 Block Cat.png',
    frames: 6, fpr: 6, fps: 10,
    earBodyY: 18,  // frame row where ear gap closes (transparent → fully opaque)
  },
  {
    shape: [[1,1,1], [0,0,1], [0,0,1]],
    sheet: '3x3 Upper Right Corner.png',
    frames: 6, fpr: 6, fps: 10,
    earBodyY: 18,
  },
  {
    shape: [[1,0], [1,0], [1,1]],
    sheet: '2x3 Bottom Left Corner.png',
    frames: 6, fpr: 6, fps: 10,
    earBodyY: 18,
  },
  // ── Buraya yeni tanımlar ekle ──────────────────────────────────
  // { shape: [[1,0],[1,1],[1,0]], sheet: 'tShape.png', frames: 4, fpr: 4, fps: 8, earBodyY: 18 },
];

const CAT_IDLE_MS = 8000; // Animasyonlar arası bekleme (ms)

// ── STATE ─────────────────────────────────────────────────────────
let board, obstacles, score, levelScore, bestScore, currentLevel, COLS, ROWS;
let pieces, selectedPiece, usedFlags;
let placedGroups = [], cellToGroup = {}; // group hover tracking
let soundOn = true, paused = false, gameActive = false;
let darkMode = false;
let audioCtx;
let catSprites = [], catAnimTimer = null;

try { bestScore = parseInt(localStorage.getItem('bb_lv2_best') || '0'); }
catch(e) { bestScore = 0; }
try { darkMode = localStorage.getItem('bb_dark') === '1'; }
catch(e) {}

// ── INIT (called on page load) ────────────────────────────────────
function init() {
  applyDark();
  buildLevelCards();
  if (bestScore > 0) {
    document.getElementById('start-best').style.display = 'inline-block';
    document.getElementById('start-best-val').textContent = bestScore;
  }
  document.getElementById('bv').textContent = bestScore;
  buildGrid(7, 7);
  initDragHandlers();
}

function buildLevelCards() {
  const el = document.getElementById('level-cards');
  LEVELS.forEach(lv => {
    el.innerHTML += `<div class="lc" style="border-top-color:${lv.color}"><div class="ln">Lv.${lv.n}</div>${lv.label}<br><span style="font-size:10px">${lv.target} puan</span></div>`;
  });
}

// ── HELPERS ───────────────────────────────────────────────────────
function getLv(n) { return LEVELS[Math.min(n, LEVELS.length) - 1]; }
function randShape() { return SHAPES[Math.floor(Math.random() * SHAPES.length)]; }
function randColor() { return COLORS[Math.floor(Math.random() * COLORS.length)]; }
function newPiece() { return { shape: randShape(), color: randColor() }; }
const cs = () => {
  const vw = window.innerWidth;
  const isMobile = vw <= 520;
  const containerW = isMobile ? vw : Math.min(vw * 0.95, 680);
  const available = containerW - (isMobile ? 10 : 22) * 2 - 8 * 2;
  const maxCell = COLS <= 8 ? 58 : 50;
  return Math.min(maxCell, Math.floor((available - (COLS - 1) * 5) / COLS));
};

// ── AUDIO ─────────────────────────────────────────────────────────
function getACtx() {
  if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  return audioCtx;
}
function beep(f, d, t = 'sine', v = 0.09) {
  if (!soundOn) return;
  try {
    const c = getACtx(), o = c.createOscillator(), g = c.createGain();
    o.connect(g); g.connect(c.destination);
    o.type = t; o.frequency.value = f;
    g.gain.setValueAtTime(v, c.currentTime);
    g.gain.exponentialRampToValueAtTime(0.001, c.currentTime + d);
    o.start(c.currentTime); o.stop(c.currentTime + d);
  } catch(e) {}
}
function playSelect()    { beep(520, 0.08, 'sine', 0.1); }
function playPlace()     { beep(300, 0.07, 'sine', 0.1); setTimeout(() => beep(400, 0.09, 'sine', 0.08), 65); }
function playLineClear(n){ [440,554,659,880].slice(0,n+1).forEach((f,i) => setTimeout(() => beep(f, 0.18, 'sine', 0.13), i*85)); }
function playCombo()     { [523,659,784,1046,1318].forEach((f,i) => setTimeout(() => beep(f, 0.14, 'sine', 0.15), i*55)); }
function playGameOver()  { [350,280,220,170].forEach((f,i) => setTimeout(() => beep(f, 0.2, 'sine', 0.1), i*130)); }
function playNewPieces() { [370,440,550].forEach((f,i) => setTimeout(() => beep(f, 0.1, 'sine', 0.09), i*70)); }
function playLevelUp()   { [523,659,784,880,1046].forEach((f,i) => setTimeout(() => beep(f, 0.16, 'sine', 0.14), i*70)); }
function playVictory()   { [523,659,784,1046,1318,1568].forEach((f,i) => setTimeout(() => beep(f, 0.18, 'sine', 0.15), i*80)); }
function playClick()     { beep(440, 0.07, 'sine', 0.08); }

function toggleSound() {
  soundOn = !soundOn;
  const icon = soundOn ? '🔊' : '🔇';
  document.getElementById('sound-btn').textContent = icon;
  const m = document.getElementById('sound-btn-menu');
  if (m) m.textContent = icon;
}

function applyDark() {
  document.body.classList.toggle('dark', darkMode);
  const icon = darkMode ? '☀️' : '🌙';
  document.getElementById('dark-btn').textContent = icon;
  const m = document.getElementById('dark-btn-menu');
  if (m) m.textContent = icon;
}

function toggleDark() {
  darkMode = !darkMode;
  try { localStorage.setItem('bb_dark', darkMode ? '1' : '0'); } catch(e) {}
  applyDark();
}

// ── OVERLAYS ──────────────────────────────────────────────────────
const OVERLAYS = ['start-overlay','pause-overlay','levelup-overlay','gameover-overlay','victory-overlay'];
function showOverlay(id) { OVERLAYS.forEach(o => document.getElementById(o).classList.toggle('hidden', o !== id)); }
function hideAll() { OVERLAYS.forEach(o => document.getElementById(o).classList.add('hidden')); }

// ── GAME FLOW ─────────────────────────────────────────────────────
function startGame(lvNum) {
  playClick(); hideAll();
  currentLevel = lvNum || 1;
  const lv = getLv(currentLevel);
  COLS = lv.grid; ROWS = lv.grid;
  board = Array.from({length: ROWS}, () => Array(COLS).fill(null));
  obstacles = new Set();
  placedGroups = []; cellToGroup = {};
  if (lvNum === 1) score = 0;
  levelScore = 0;
  paused = false; gameActive = true;
  placeObstacles(lv.obstacles);
  clearAllCats();
  stopCatTimer();
  CAT_DEFS.forEach(def => loadCatSheetByDef(def, () => {})); // preload all sheets
  catAnimTimer = setInterval(() => catSprites.forEach(playCatAnim), CAT_IDLE_MS);
  buildGrid(COLS, ROWS);
  _lastCellSize = cs();
  renderGrid();
  updateScoreUI();
  updateProgress();
  newPieces();
}

function placeObstacles(count) {
  if (!count) return;
  const cands = [];
  for (let r = 1; r < ROWS - 1; r++)
    for (let c = 1; c < COLS - 1; c++)
      cands.push([r, c]);
  for (let i = cands.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [cands[i], cands[j]] = [cands[j], cands[i]];
  }
  let placed = 0;
  for (const [r, c] of cands) {
    if (placed >= count) break;
    board[r][c] = '__obstacle__';
    obstacles.add(r * COLS + c);
    placed++;
  }
}

function goNextLevel() {
  playClick(); hideAll();
  currentLevel++;
  if (currentLevel > LEVELS.length) { showVictory(); return; }
  startGame(currentLevel);
}

function pauseGame() {
  if (!gameActive || paused) return;
  paused = true; playClick();
  document.getElementById('pause-lv').textContent = currentLevel;
  document.getElementById('pause-sc').textContent = score;
  showOverlay('pause-overlay');
}

function resumeGame() { playClick(); paused = false; hideAll(); }

function quitToMenu() {
  playClick(); paused = false; gameActive = false;
  stopCatTimer(); clearAllCats();
  if (bestScore > 0) {
    document.getElementById('start-best').style.display = 'inline-block';
    document.getElementById('start-best-val').textContent = bestScore;
  }
  showOverlay('start-overlay');
}

document.addEventListener('keydown', e => {
  if (e.key === 'Escape') {
    if (dragState) { cancelDrag(); return; }
    if (gameActive && !paused) pauseGame();
    else if (paused) resumeGame();
  }
});

// ── GRID ──────────────────────────────────────────────────────────
function buildGrid(cols, rows) {
  COLS = cols; ROWS = rows;
  const size = cs();
  const g = document.getElementById('grid');
  g.innerHTML = '';
  g.style.gridTemplateColumns = `repeat(${cols}, ${size}px)`;
  g.style.gridTemplateRows    = `repeat(${rows}, ${size}px)`;
  for (let y = 0; y < rows; y++) {
    for (let x = 0; x < cols; x++) {
      const c = document.createElement('div');
      c.style.width  = size + 'px';
      c.style.height = size + 'px';
      c.dataset.r = y;
      c.dataset.c = x;
      c.addEventListener('mouseenter',  () => applyGroupHover(y * COLS + x, true));
      c.addEventListener('mouseleave',  () => { if (!dragState) clearPreview(); applyGroupHover(y * COLS + x, false); });
      g.appendChild(c);
    }
  }
}

function allCells() { return document.querySelectorAll('#grid div'); }

function applyGroupHover(idx, on) {
  const gIdx = cellToGroup[idx];
  if (gIdx === undefined || !on) return;
  const gSet = placedGroups[gIdx];
  if (!gSet) return;
  catSprites.forEach(s => {
    if (gSet.has(s.r * COLS + s.c)) playCatAnim(s);
  });
}

function renderGrid() {
  allCells().forEach(c => {
    const r   = +c.dataset.r;
    const col = +c.dataset.c;
    const idx = r * COLS + col;
    const s   = cs();
    c.style.width  = s + 'px';
    c.style.height = s + 'px';
    c.style.background = '';
    if (obstacles.has(idx)) {
      c.className = 'gcell obstacle';
    } else if (board[r][col] && board[r][col] !== '__obstacle__') {
      c.className = 'gcell filled';
      c.style.background = board[r][col];
    } else {
      c.className = 'gcell';
    }
  });
}

// ── ANCHOR HELPERS ────────────────────────────────────────────────
// Returns row/col offset of the top-left filled cell in a shape.
function firstFilledOffset(shape) {
  for (let dr = 0; dr < shape.length; dr++)
    for (let dc = 0; dc < shape[dr].length; dc++)
      if (shape[dr][dc]) return { dr, dc };
  return { dr: 0, dc: 0 };
}

// Given a clicked cell, return the bounding-box top-left so the first
// filled cell aligns with the click. Clamped to stay inside the grid.
function adjustedAnchor(shape, row, col) {
  const { dr, dc } = firstFilledOffset(shape);
  const r = Math.max(0, Math.min(ROWS - shape.length,    row - dr));
  const c = Math.max(0, Math.min(COLS - shape[0].length, col - dc));
  return { r, c };
}

// ── PREVIEW ───────────────────────────────────────────────────────
function showPreview(row, col) {
  if (selectedPiece === null || paused) return;
  clearPreview();
  const p = pieces[selectedPiece];
  const { r, c } = adjustedAnchor(p.shape, row, col);
  const valid = canPlace(p.shape, r, c);
  p.shape.forEach((rr, dy) => rr.forEach((v, dx) => {
    if (!v) return;
    const nr = r + dy, nc = c + dx;
    if (nr < 0 || nr >= ROWS || nc < 0 || nc >= COLS) return;
    const cell = allCells()[nr * COLS + nc];
    if (board[nr][nc] || obstacles.has(nr * COLS + nc)) return;
    if (valid) { cell.classList.add('preview'); cell.style.background = p.color; }
    else cell.classList.add('invalid');
  }));
}

function clearPreview() {
  allCells().forEach(c => {
    if (c.classList.contains('preview') || c.classList.contains('invalid')) {
      c.classList.remove('preview', 'invalid');
      const r = +c.dataset.r, col = +c.dataset.c, idx = r * COLS + col;
      if (!board[r][col] && !obstacles.has(idx)) c.style.background = '';
    }
  });
}

// ── PLACEMENT LOGIC ───────────────────────────────────────────────
function canPlace(shape, row, col) {
  for (let dy = 0; dy < shape.length; dy++)
    for (let dx = 0; dx < shape[dy].length; dx++) {
      if (!shape[dy][dx]) continue;
      const nr = row + dy, nc = col + dx;
      if (nr >= ROWS || nc >= COLS || nr < 0 || nc < 0) return false;
      if (board[nr][nc] || obstacles.has(nr * COLS + nc)) return false;
    }
  return true;
}

function boardHasRoom(shape) {
  for (let r = 0; r < ROWS; r++)
    for (let c = 0; c < COLS; c++)
      if (canPlace(shape, r, c)) return true;
  return false;
}

function anyRemainingCanPlace() {
  return pieces.some((p, i) => !usedFlags[i] && boardHasRoom(p.shape));
}

function applyClears() {
  const rowsC = [], colsC = [];
  for (let r = 0; r < ROWS; r++)
    if (board[r].every((c, ci) => c !== null || obstacles.has(r * COLS + ci))) rowsC.push(r);
  for (let c = 0; c < COLS; c++)
    if (board.every((row, ri) => row[c] !== null || obstacles.has(ri * COLS + c))) colsC.push(c);
  if (!rowsC.length && !colsC.length) return { cleared: 0, toClear: new Set() };

  const toClear = new Set();
  rowsC.forEach(r => { for (let c = 0; c < COLS; c++) if (!obstacles.has(r * COLS + c)) toClear.add(r * COLS + c); });
  colsC.forEach(c => { for (let r = 0; r < ROWS; r++) if (!obstacles.has(r * COLS + c)) toClear.add(r * COLS + c); });
  toClear.forEach(idx => {
    const r = Math.floor(idx / COLS), c = idx % COLS; board[r][c] = null;
    const g = cellToGroup[idx];
    if (g !== undefined) { placedGroups[g]?.delete(idx); delete cellToGroup[idx]; }
  });
  return { cleared: rowsC.length + colsC.length, toClear };
}

function animateClears(toClear) {
  const ac = allCells();
  toClear.forEach(idx => {
    const cell = ac[idx];
    cell.classList.remove('filled');
    cell.classList.add('clearing');
    cell.style.animationDelay = (Math.random() * 0.07) + 's';
  });
  setTimeout(() => {
    toClear.forEach(idx => {
      const cell = ac[idx];
      const s = cs();
      cell.className = 'gcell';
      cell.style.width  = s + 'px';
      cell.style.height = s + 'px';
      cell.style.background = '';
      cell.style.animationDelay = '';
    });
  }, 340);
}

function dismissPiece(i) {
  const card = document.getElementById('p' + i);
  card.classList.add('vanish');
  setTimeout(() => {
    card.style.visibility    = 'hidden';
    card.style.pointerEvents = 'none';
  }, 220);
}

function selectPiece(i) {
  if (!gameActive || paused || usedFlags[i]) return;
  selectedPiece = i; playSelect();
  document.querySelectorAll('.piece-card').forEach((c, j) => c.classList.toggle('selected', j === i && !usedFlags[j]));
  setMsg('Bloğu yerleştirmek için grid üzerine tıkla');
}

function placeOnGrid(row, col) {
  if (!gameActive || paused) return;
  if (selectedPiece === null) { setMsg('Önce bir blok seç!'); return; }
  if (usedFlags[selectedPiece]) return;
  const p = pieces[selectedPiece];
  const { r, c } = adjustedAnchor(p.shape, row, col);
  if (!canPlace(p.shape, r, c)) { setMsg('Buraya sığmıyor!'); return; }
  playPlace();

  const placed = [];
  p.shape.forEach((rr, dy) => rr.forEach((v, dx) => {
    if (!v) return;
    board[r + dy][c + dx] = p.color;
    placed.push({ r: r + dy, c: c + dx });
  }));

  // Register group so all cells hover together
  const gIdx = placedGroups.length;
  const gSet = new Set(placed.map(({r, c}) => r * COLS + c));
  placedGroups.push(gSet);
  gSet.forEach(i => { cellToGroup[i] = gIdx; });

  const catDef = findCatDef(p.shape);
  const usedIdx = selectedPiece;
  usedFlags[usedIdx] = true;
  selectedPiece = null;
  document.querySelectorAll('.piece-card').forEach(c => c.classList.remove('selected'));
  clearPreview();
  dismissPiece(usedIdx);

  const ac = allCells();
  placed.forEach(({ r, c }, i) => {
    const cell = ac[r * COLS + c];
    cell.classList.add('filled', 'placing');
    cell.style.background = board[r][c];
    cell.style.animationDelay = (i * 0.025) + 's';
  });

  setTimeout(() => {
    if (catDef) createCatSprite(r, c, catDef);
    const { cleared, toClear } = applyClears();
    if (toClear.size) removeCatSprites(toClear);
    const pts = placed.length * 10 + cleared * 60;
    score += pts; levelScore += pts;
    if (score > bestScore) {
      bestScore = score;
      try { localStorage.setItem('bb_lv2_best', bestScore); } catch(e) {}
    }
    updateScoreUI(); updateProgress();
    showScoreFly(pts, row, col);
    if (cleared > 0) {
      playLineClear(cleared); animateClears(toClear);
      if (cleared >= 2) setTimeout(() => { playCombo(); showCombo(cleared); }, 360);
    }
    const lv = getLv(currentLevel);
    if (levelScore >= lv.target) { setTimeout(showLevelUp, cleared > 0 ? 500 : 250); return; }
    const allUsed = usedFlags.every(Boolean);
    if (allUsed) setTimeout(() => newPieces(), cleared > 0 ? 420 : 200);
    else if (!anyRemainingCanPlace()) setTimeout(showGameOver, cleared > 0 ? 420 : 200);
    else setMsg('Bir blok seç, sonra grid üzerine tıkla');
  }, placed.length * 25 + 100);
}

// ── UI HELPERS ────────────────────────────────────────────────────
function showScoreFly(pts, row, col) {
  const gridEl = document.getElementById('grid');
  const fly = document.createElement('div');
  fly.className = 'score-fly';
  fly.textContent = '+' + pts;
  const s = cs(), gap = 5, pad = 8;
  fly.style.top  = (pad + row * (s + gap) + 16) + 'px';
  fly.style.left = (pad + col * (s + gap) + 16) + 'px';
  gridEl.appendChild(fly);
  setTimeout(() => fly.remove(), 850);
}

function showCombo(n) {
  const t = document.getElementById('combo-toast');
  t.textContent = n >= 4 ? 'harika combo! x' + n : n + 'x combo!';
  t.className = 'show';
  setTimeout(() => t.className = '', 760);
}

function updateScoreUI() {
  document.getElementById('sv').textContent = score;
  document.getElementById('bv').textContent = bestScore;
  document.getElementById('lv-val').textContent = currentLevel;
  const sc = document.getElementById('score-card');
  sc.classList.remove('bump');
  void sc.offsetWidth;
  sc.classList.add('bump');
}

function updateProgress() {
  const lv  = getLv(currentLevel);
  const pct = Math.min(100, (levelScore / lv.target) * 100);
  document.getElementById('progress-bar').style.width      = pct + '%';
  document.getElementById('progress-bar').style.background = lv.color;
  document.getElementById('prog-left').textContent  = 'Seviye ' + currentLevel + ' — ' + lv.label;
  document.getElementById('prog-right').textContent = levelScore + ' / ' + lv.target;
}

function setMsg(t) {
  const m = document.getElementById('msg');
  m.style.opacity = 0;
  setTimeout(() => { m.textContent = t; m.style.opacity = 1; }, 120);
}

// ── END SCREENS ───────────────────────────────────────────────────
function showLevelUp() {
  gameActive = false; playLevelUp();
  const lv = getLv(currentLevel);
  document.getElementById('lu-title').textContent = 'Seviye ' + currentLevel + ' Tamam!';
  document.getElementById('lu-sub').textContent   = currentLevel < LEVELS.length
    ? 'Sıradaki: Seviye ' + (currentLevel + 1) + ' — ' + getLv(currentLevel + 1).label
    : 'Son seviyeyi de geçtin!';
  document.getElementById('lu-score').textContent = score;
  document.getElementById('lu-stars').textContent = levelScore >= lv.target * 1.5 ? '⭐⭐⭐' : levelScore >= lv.target * 1.2 ? '⭐⭐' : '⭐';
  document.getElementById('lu-btn').textContent   = currentLevel < LEVELS.length ? 'Seviye ' + (currentLevel + 1) + ' →' : 'Bitiş →';
  showOverlay('levelup-overlay');
}

function showVictory() {
  stopCatTimer();
  playVictory();
  document.getElementById('vic-sc').textContent   = score;
  document.getElementById('vic-best').textContent = bestScore;
  showOverlay('victory-overlay');
}

function showGameOver() {
  gameActive = false; playGameOver();
  stopCatTimer();
  document.getElementById('go-lv').textContent   = currentLevel;
  document.getElementById('go-sc').textContent   = score;
  document.getElementById('go-best').textContent = bestScore;
  showOverlay('gameover-overlay');
}

// ── PIECES ────────────────────────────────────────────────────────
function renderPieces() {
  pieces.forEach((p, i) => {
    const card = document.getElementById('p' + i);
    card.className       = 'piece-card';
    card.style.display       = '';
    card.style.visibility    = '';
    card.style.pointerEvents = '';

    const catDef = findCatDef(p.shape);
    if (catDef) {
      const cSz = 24, gap = 2;
      const bW = catDef.shape[0].length * cSz + (catDef.shape[0].length - 1) * gap;
      const bH = catDef.shape.length    * cSz + (catDef.shape.length    - 1) * gap;
      card.innerHTML = '';
      const wrap = document.createElement('div');
      wrap.style.cssText = `position:relative;width:${bW}px;height:${bH}px;`;
      card.appendChild(wrap);
      loadCatSheetByDef(catDef, (frameW, frameH) => {
        const rawScale = bH / (frameH - catDef.earBodyY);
        const earPx = Math.round(catDef.earBodyY * rawScale);
        const sFW   = Math.round(frameW * rawScale);
        const sFH   = bH + earPx;
        const sRows = Math.ceil(catDef.frames / catDef.fpr);
        const el = document.createElement('div');
        el.style.cssText = `position:absolute;left:0;top:${-earPx}px;width:${sFW}px;height:${sFH}px;`
          + `background-image:url('${catDef.sheet}');`
          + `background-size:${catDef.fpr * sFW}px ${sRows * sFH}px;`
          + `background-position:0 0;background-repeat:no-repeat;pointer-events:none;`;
        wrap.appendChild(el);
      });
    } else {
      const cols = p.shape[0].length;
      card.innerHTML = `<div class="pmini" style="grid-template-columns:repeat(${cols},24px);gap:2px;"></div>`;
      const grid = card.querySelector('.pmini');
      p.shape.forEach(row => row.forEach(v => {
        const c = document.createElement('div');
        c.className = v ? 'pmini-cell' : 'pmini-cell empty';
        if (v) c.style.background = p.color;
        grid.appendChild(c);
      }));
    }
  });
}

function newPieces() {
  playNewPieces();
  pieces    = [newPiece(), newPiece(), newPiece()];
  usedFlags = [false, false, false];
  selectedPiece = null;
  renderPieces();
  setMsg('Bir blok seç, sonra grid üzerine tıkla');
  if (!anyRemainingCanPlace()) setTimeout(showGameOver, 400);
}

// ── CAT SPRITE SYSTEM ─────────────────────────────────────────────

// İki shape'in dolu hücrelerini karşılaştırır.
function shapesMatch(a, b) {
  if (a.length !== b.length) return false;
  return a.every((row, r) =>
    row.length === b[r]?.length && row.every((v, c) => !!v === !!b[r][c])
  );
}

// Yerleştirilen shape için CAT_DEFS içinde eşleşen tanımı döner (yoksa null).
function findCatDef(shape) {
  return CAT_DEFS.find(def => shapesMatch(def.shape, shape)) ?? null;
}

function clearAllCats() {
  catSprites.forEach(s => s.el.remove());
  catSprites = [];
}

function stopCatTimer() {
  if (catAnimTimer) { clearInterval(catAnimTimer); catAnimTimer = null; }
}

// Her sheet dosyası için { fw, fh } cache'i.
const _catSheetCache = {};

function loadCatSheetByDef(def, cb) {
  const key = def.sheet;
  if (_catSheetCache[key]) {
    const { fw, fh } = _catSheetCache[key];
    cb(fw, fh);
    return;
  }
  const img = new Image();
  img.onload = () => {
    const sheetRows = Math.ceil(def.frames / def.fpr);
    const fw = img.naturalWidth  / def.fpr;
    const fh = img.naturalHeight / sheetRows;
    _catSheetCache[key] = { fw, fh };
    cb(fw, fh);
  };
  img.onerror = () => console.warn('Cat sheet bulunamadı:', key);
  img.src = key;
}

function playCatAnim(sprite) {
  if (sprite.going || !sprite.el.parentNode) return;
  sprite.going = true;
  let f = 0;
  const { el, fw, fh, def } = sprite;
  (function step() {
    if (!el.parentNode) { sprite.going = false; return; }
    if (f >= def.frames) {
      el.style.backgroundPositionX = '0px';
      el.style.backgroundPositionY = '0px';
      sprite.going = false;
      return;
    }
    const sRow = Math.floor(f / def.fpr), sCol = f % def.fpr;
    el.style.backgroundPositionX = `${-(sCol * fw)}px`;
    el.style.backgroundPositionY = `${-(sRow * fh)}px`;
    f++;
    setTimeout(step, 1000 / def.fps);
  })();
}

function createCatSprite(row, col, def) {
  loadCatSheetByDef(def, (frameW, frameH) => {
    const s   = cs(), gap = 5;
    const shapeCols = def.shape[0].length;
    const shapeRows = def.shape.length;
    const blockPxW  = shapeCols * s + (shapeCols - 1) * gap;
    const blockPxH  = shapeRows * s + (shapeRows - 1) * gap;

    // Scale so the body zone covers exactly blockPxH; round to integers to
    // prevent subpixel gaps at the bottom and animation jitter left-right.
    const rawScale = blockPxH / (frameH - def.earBodyY);
    const earPx = Math.round(def.earBodyY * rawScale);
    const sFW   = Math.round(frameW * rawScale);
    const sFH   = blockPxH + earPx;  // exact: sprite_bottom = cellY + blockPxH

    // Matematiksel konum: getBoundingClientRect yerine sabit grid metriklerini kullan.
    // #grid: padding=8px, gap=5px — layout değişse de bu değerler sabit kalır.
    const pad  = 8;
    const cellX = pad + col * (s + gap);
    const cellY = pad + row * (s + gap);

    const sheetRows = Math.ceil(def.frames / def.fpr);

    const el = document.createElement('div');
    el.className = 'cat-sprite';
    el.style.left               = cellX + 'px';
    el.style.top                = (cellY - earPx) + 'px';
    el.style.width              = sFW + 'px';
    el.style.height             = sFH + 'px';
    el.style.backgroundImage    = `url('${def.sheet}')`;
    el.style.backgroundSize     = `${def.fpr * sFW}px ${sheetRows * sFH}px`;
    el.style.backgroundPosition = '0px 0px';
    el.style.backgroundRepeat   = 'no-repeat';
    document.getElementById('grid').appendChild(el);

    catSprites.push({ r: row, c: col, el, fw: sFW, fh: sFH, going: false, def });
  });
}

function removeCatSprites(toClear) {
  catSprites = catSprites.filter(({ r, c, el, def }) => {
    const occupied = [];
    def.shape.forEach((row, dr) => row.forEach((v, dc) => {
      if (v) occupied.push((r + dr) * COLS + (c + dc));
    }));
    if (occupied.some(i => toClear.has(i))) { el.remove(); return false; }
    return true;
  });
}

// ── DEBUG / TEST PANEL ────────────────────────────────────────────
let debugOpen = false;

function toggleDebugPanel() {
  debugOpen = !debugOpen;
  const panel = document.getElementById('debug-panel');
  const btn   = document.getElementById('debug-btn');
  panel.classList.toggle('hidden', !debugOpen);
  btn.style.outline = debugOpen ? '2px solid #5d8ed8' : '';
  if (debugOpen && !document.getElementById('debug-shapes').children.length)
    buildDebugPanel();
}

function buildDebugPanel() {
  const container = document.getElementById('debug-shapes');
  SHAPES.forEach((shape, i) => {
    const card = document.createElement('div');
    card.className = 'debug-card';
    card.title = 'Şekil ' + (i + 1);
    const cols  = Math.max(...shape.map(r => r.length));
    const inner = document.createElement('div');
    inner.style.cssText = `display:grid;grid-template-columns:repeat(${cols},14px);gap:2px;`;
    shape.forEach(row => {
      for (let x = 0; x < cols; x++) {
        const cell = document.createElement('div');
        const filled = row[x];
        cell.style.cssText = `width:14px;height:14px;border-radius:3px;background:${filled ? '#5d8ed8' : 'transparent'};${filled ? 'box-shadow:inset 0 -2px 0 rgba(0,0,0,.15);' : ''}`;
        inner.appendChild(cell);
      }
    });
    card.appendChild(inner);
    card.addEventListener('click', () => debugPickShape(i));
    container.appendChild(card);
  });
}

function debugPickShape(i) {
  if (!gameActive) { setMsg('Önce oyunu başlat!'); return; }
  pieces[0]    = { shape: SHAPES[i], color: randColor() };
  usedFlags[0] = false;
  selectedPiece = null;
  renderPieces();
  selectPiece(0);
  setMsg('Test bloğu slot 0\'a eklendi — yerleştir!');
}

// ── DRAG & DROP ───────────────────────────────────────────────────
let dragState = null; // { idx, shape, ghostEl, isTouch }

function startDrag(idx, clientX, clientY, isTouch) {
  if (!gameActive || paused || usedFlags[idx]) return;
  if (dragState) cancelDrag();
  playSelect();
  selectedPiece = idx;
  document.querySelectorAll('.piece-card').forEach((c, j) =>
    c.classList.toggle('selected', j === idx));

  const p = pieces[idx];
  const size = cs(), gap = 5, cols = p.shape[0].length;
  const catDef = findCatDef(p.shape);

  const ghost = document.createElement('div');
  ghost.style.cssText = 'position:fixed;pointer-events:none;z-index:999;opacity:.75;transition:none;';
  const gr = document.createElement('div');
  gr.style.cssText = `position:relative;display:grid;grid-template-columns:repeat(${cols},${size}px);gap:${gap}px;`;
  p.shape.forEach(row => row.forEach(v => {
    const cell = document.createElement('div');
    cell.style.cssText = v
      ? `width:${size}px;height:${size}px;border-radius:9px;background:${p.color};box-shadow:inset 0 -4px 0 rgba(0,0,0,.13);`
      : `width:${size}px;height:${size}px;`;
    gr.appendChild(cell);
  }));
  if (catDef) {
    const bW = catDef.shape[0].length * size + (catDef.shape[0].length - 1) * gap;
    const bH = catDef.shape.length    * size + (catDef.shape.length    - 1) * gap;
    loadCatSheetByDef(catDef, (frameW, frameH) => {
      const rawScale = bH / (frameH - catDef.earBodyY);
      const earPx = Math.round(catDef.earBodyY * rawScale);
      const sFW   = Math.round(frameW * rawScale);
      const sFH   = bH + earPx;
      const sRows = Math.ceil(catDef.frames / catDef.fpr);
      const el = document.createElement('div');
      el.style.cssText = `position:absolute;left:0;top:${-earPx}px;width:${sFW}px;height:${sFH}px;`
        + `background-image:url('${catDef.sheet}');`
        + `background-size:${catDef.fpr * sFW}px ${sRows * sFH}px;`
        + `background-position:0 0;background-repeat:no-repeat;pointer-events:none;`;
      gr.appendChild(el);
    });
  }
  ghost.appendChild(gr);
  document.body.appendChild(ghost);
  document.body.style.cursor = 'grabbing';

  dragState = { idx, shape: p.shape, ghostEl: ghost, isTouch };
  moveDrag(clientX, clientY);
}

function moveDrag(clientX, clientY) {
  if (!dragState) return;
  const { shape, ghostEl, isTouch } = dragState;
  const size = cs(), gap = 5;
  const { dr, dc } = firstFilledOffset(shape);
  const uplift = isTouch ? shape.length * (size + gap) + 24 : 0;

  ghostEl.style.left = (clientX - dc * (size + gap)) + 'px';
  ghostEl.style.top  = (clientY - dr * (size + gap) - uplift) + 'px';

  const hitEl = document.elementFromPoint(clientX, clientY - uplift);
  if (hitEl && hitEl.dataset.r !== undefined) {
    showPreview(+hitEl.dataset.r, +hitEl.dataset.c);
  } else {
    clearPreview();
  }
}

function endDrag(clientX, clientY) {
  if (!dragState) return;
  const { ghostEl, shape, isTouch } = dragState;
  const uplift = isTouch ? shape.length * (cs() + 5) + 24 : 0;
  ghostEl.remove();
  document.body.style.cursor = '';
  dragState = null;

  const hitEl = document.elementFromPoint(clientX, clientY - uplift);
  if (hitEl && hitEl.dataset.r !== undefined) {
    placeOnGrid(+hitEl.dataset.r, +hitEl.dataset.c);
  } else {
    clearPreview();
    selectedPiece = null;
    document.querySelectorAll('.piece-card').forEach(c => c.classList.remove('selected'));
  }
}

function cancelDrag() {
  if (!dragState) return;
  dragState.ghostEl.remove();
  document.body.style.cursor = '';
  dragState = null;
  clearPreview();
  selectedPiece = null;
  document.querySelectorAll('.piece-card').forEach(c => c.classList.remove('selected'));
}

function initDragHandlers() {
  for (let i = 0; i < 3; i++) {
    const card = document.getElementById('p' + i);
    const idx  = i;
    card.addEventListener('mousedown', e => {
      if (e.button !== 0) return;
      e.preventDefault();
      startDrag(idx, e.clientX, e.clientY, false);
    });
    card.addEventListener('touchstart', e => {
      e.preventDefault();
      const t = e.touches[0];
      startDrag(idx, t.clientX, t.clientY, true);
    }, { passive: false });
  }

  document.addEventListener('mousemove', e => {
    if (!dragState) return;
    if (!(e.buttons & 1)) { cancelDrag(); return; }
    moveDrag(e.clientX, e.clientY);
  });
  document.addEventListener('mouseup', e => {
    if (dragState) endDrag(e.clientX, e.clientY);
  });
  document.addEventListener('touchmove', e => {
    if (!dragState) return;
    e.preventDefault();
    moveDrag(e.touches[0].clientX, e.touches[0].clientY);
  }, { passive: false });
  document.addEventListener('touchend', e => {
    if (!dragState) return;
    e.preventDefault();
    endDrag(e.changedTouches[0].clientX, e.changedTouches[0].clientY);
  }, { passive: false });
  document.addEventListener('touchcancel', cancelDrag);
}

// ── RESIZE / ORIENTATION CHANGE ───────────────────────────────────
function repositionCatSprites() {
  const snapshot = catSprites.splice(0);
  snapshot.forEach(s => { s.el.remove(); createCatSprite(s.r, s.c, s.def); });
}

let _resizeTimer, _lastCellSize = 0;
window.addEventListener('resize', () => {
  clearTimeout(_resizeTimer);
  _resizeTimer = setTimeout(() => {
    if (!gameActive) return;
    const newSize = cs();
    if (newSize === _lastCellSize) return; // boyut değişmediyse yeniden çizme
    _lastCellSize = newSize;
    buildGrid(COLS, ROWS);
    renderGrid();
    repositionCatSprites();
  }, 150);
});

// ── BOOTSTRAP ─────────────────────────────────────────────────────
init();
