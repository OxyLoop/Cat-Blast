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
    sheet: 'sprites/2x2 Block Cat.png',
    frames: 6, fpr: 6, fps: 10,
    earBodyY: 18,  // frame row where ear gap closes (transparent → fully opaque)
  },
  {
    shape: [[1,1,1], [0,0,1], [0,0,1]],
    sheet: 'sprites/3x3 Upper Right Corner.png',
    frames: 6, fpr: 6, fps: 10,
    earBodyY: 18,
  },
  {
    shape: [[1,1,1], [1,0,0], [1,0,0]],
    sheet: 'sprites/3x3 Upper Left Corner.png',
    frames: 6, fpr: 6, fps: 10,
    earBodyY: 18,
  },
  {
    shape: [[1,0], [1,0], [1,1]],
    sheet: 'sprites/2x3 Bottom Left Corner.png',
    frames: 6, fpr: 6, fps: 10,
    earBodyY: 18,
  },
  {
    shape: [[0,1], [0,1], [1,1]],
    sheet: 'sprites/2x3 Bottom Right Corner.png',
    frames: 6, fpr: 6, fps: 10,
    earBodyY: 18,
  },
  {
    shape: [[1]],
    sheet: 'sprites/1x1 Block Cat.png',
    frames: 6, fpr: 6, fps: 10,
    earBodyY: 18,
  },
  {
    shape: [[1],[1]],
    sheet: 'sprites/1x2 Vertical Block.png',
    frames: 6, fpr: 6, fps: 10,
    earBodyY: 18,
  },
  {
    shape: [[1,1,1]],
    sheet: 'sprites/3x1 Horizontal Block Cat.png',
    frames: 5, fpr: 5, fps: 10,
    earBodyY: 18,
  },
  {
    shape: [[1],[1],[1]],
    sheet: 'sprites/1x3 Vertical Block Cat.png',
    frames: 6, fpr: 6, fps: 10,
    earBodyY: 18,
  },
  {
    shape: [[1,1,1],[0,0,1]],
    sheet: 'sprites/3x1 Right Corner Cat.png',
    frames: 1, fpr: 1, fps: 10,
    earBodyY: 18,
  },
  {
    shape: [[1,1,1],[1,0,0]],
    sheet: 'sprites/3x1 Left Corner Cat.png',
    frames: 1, fpr: 1, fps: 10,
    earBodyY: 18,
  },
  {
    shape: [[1,1,]],
    sheet: 'sprites/2x1 Block Cat.png',
    frames: 1, fpr: 1, fps: 10,
    earBodyY: 18,
  },
  {
    shape: [[0,1],[1,1]],
    sheet: 'sprites/2x2 Right Corner Cat.png',
    frames: 6, fpr: 6, fps: 10,
    earBodyY: 18,
  },
  {
    shape: [[1,0],[1,1]],
    sheet: 'sprites/2x2 Left Corner Cat.png',
    frames: 6, fpr: 6, fps: 10,
    earBodyY: 18,
  },
  {
    shape: [[1,1],[1,0]],
    sheet: 'sprites/2x2 Upper Corner Left.png',
    frames: 6, fpr: 6, fps: 10,
    earBodyY: 18,
  },
  {
    shape: [[1,1],[0,1]],
    sheet: 'sprites/2x2 Upper Corner Right.png',
    frames: 6, fpr: 6, fps: 10,
    earBodyY: 18,
  },
  // ── Buraya yeni tanımlar ekle ──────────────────────────────────
  // { shape: [[1,0],[1,1],[1,0]], sheet: 'tShape.png', frames: 4, fpr: 4, fps: 8, earBodyY: 18 },
];

const CAT_IDLE_MS = 8000; // Animasyonlar arası bekleme (ms)

// ── LANGUAGE / i18n ───────────────────────────────────────────────
const LEVEL_NAMES = {
  tr:  ['Başlangıç', 'Orta', 'Zor', 'Çok Zor', 'Uzman'],
  en:  ['Beginner', 'Medium', 'Hard', 'Expert', 'Master'],
  cat: ['Mew', 'Meow', 'Mrrr', 'Nyaaa', 'PURRRR'],
};
const TEXTS = {
  tr: {
    btnPlay:'Oyna', btnSettings:'Ayarlar', btnAbout:'Hakkımızda',
    btnLevelMode:'Level Modu', btnEndless:'♾️ Sonsuz Mod', btnBack:'← Geri',
    settingsTitle:'Ayarlar', labelSound:'Ses', labelMusic:'Müzik', labelSfx:'Efektler', labelTheme:'Tema', labelLang:'Dil',
    aboutTitle:'Hakkımızda',
    aboutTagline:'Blokları yerleştir, sıraları temizle.',
    aboutDesc:'Pixel ruhlu bağımlılık yapan bulmaca.',
    aboutTeamLabel:'GELİŞTİRİCİ EKİP', aboutContactLabel:'İLETİŞİM',
    pauseTitle:'Duraklatıldı', pauseSub:'Seviye {lv} — Skor {sc}',
    btnResume:'Devam', btnMenu:'Menü',
    btnNextLevel:'Seviye {n} →', btnFinish:'Bitiş →',
    luTitle:'Seviye {n} Tamam!',
    luNext:'Sıradaki: Seviye {n} — {label}', luLast:'Son seviyeyi de geçtin!',
    gameOverTitle:'Oyun Bitti',
    btnPlayAgain:'Tekrar Oyna', btnPlayAgainEndless:'♾️ Tekrar Oyna',
    goEndlessLv:'♾️ Sonsuz',
    victoryTitle:'🏆 Tebrikler!', victoryMsg:'Tüm seviyeleri geçtin.', btnRestart:'Yeniden Başla',
    labelScore:'Skor', labelBest:'En İyi', labelLevel:'Seviye',
    endlessLabel:'♾️ Sonsuz Mod', endlessPoints:'{score} puan',
    levelLabel:'Seviye {n} — {label}',
    msgInit:'Başlamak için oyunu başlat.',
    msgSelectPiece:'Bir blok seç, sonra grid üzerine tıkla',
    msgPlacePiece:'Bloğu yerleştirmek için grid üzerine tıkla',
    msgNoPiece:'Önce bir blok seç!', msgNoFit:'Buraya sığmıyor!',
    msgDebugStart:'Önce oyunu başlat!', msgDebugAdded:"Test bloğu slot 0'a eklendi — yerleştir!",
    comboGreat:'harika combo! x{n}', combo:'{n}x combo!',
    pwClawName:'Pençe Darbesi', pwGazeName:'Kedi Bakışı',
    pwSelectCell:'Silmek için dolu bir hücreye tıkla',
    pwSelectPiece:'Tüm bloklar yenilendi!',
    pwNoCharge:'Şarj yok! Her 300 puanda dolar.',
    pwChargeGained:'⚡ Güç şarjı!',
    pwClawInvalid:'Sadece dolu hücrelere uygulanır!',
    pwClawTip:'Dolu bir hücreyi yok et · her 300 puanda şarj',
    pwGazeTip:'Tüm blokları yenile · her 300 puanda şarj',
    pwBombName:'Bomba', pwBombTip:'3×3 alanı temizle · her 300 puanda şarj', pwSelectBomb:'Patlatmak için bir hücreye tıkla',
    labelUndo:'Geri Al', undoTip:'Son yerleştirmeyi geri al', undoNoCharge:'Geri alma hakkı kalmadı!', undoUsed:'↩ Geri alındı!',
    labelHint:'İpucu', hintTip:'Seçili blok için geçerli yerleri göster',
    timerMode:'⏱ Süre Modu', timerTimeUp:'Süre bitti!',
    shareBtn:'Skoru Paylaş', shareMsg:'Cat Blast 🐱\nSkor: {score} | Seviye: {level}\nEn İyi: {best}\nSen de oyna!', scoreCopied:'Kopyalandı! 📋',
    statsTitle:'İstatistikler', statGames:'Oyun', statLines:'Satır', statPlacements:'Hamle', statBestScore:'Rekor',
    topScores:'Yüksek Skorlar', noScores:'Henüz skor yok.',
    stoneSpawned:'🪨 Taş blok çıktı!',
    btnTimerMode:'⏱ Süre Modu',
  },
  en: {
    btnPlay:'Play', btnSettings:'Settings', btnAbout:'About',
    btnLevelMode:'Level Mode', btnEndless:'♾️ Endless', btnBack:'← Back',
    settingsTitle:'Settings', labelSound:'Sound', labelMusic:'Music', labelSfx:'Effects', labelTheme:'Theme', labelLang:'Language',
    aboutTitle:'About',
    aboutTagline:'Place blocks, clear the rows.',
    aboutDesc:'The pixel-style addictive puzzle.',
    aboutTeamLabel:'DEVELOPER TEAM', aboutContactLabel:'CONTACT',
    pauseTitle:'Paused', pauseSub:'Level {lv} — Score {sc}',
    btnResume:'Resume', btnMenu:'Menu',
    btnNextLevel:'Level {n} →', btnFinish:'Finish →',
    luTitle:'Level {n} Done!',
    luNext:'Next: Level {n} — {label}', luLast:'All levels cleared!',
    gameOverTitle:'Game Over',
    btnPlayAgain:'Play Again', btnPlayAgainEndless:'♾️ Play Again',
    goEndlessLv:'♾️ Endless',
    victoryTitle:'🏆 Congrats!', victoryMsg:'You beat all levels.', btnRestart:'Restart',
    labelScore:'Score', labelBest:'Best', labelLevel:'Level',
    endlessLabel:'♾️ Endless', endlessPoints:'{score} pts',
    levelLabel:'Level {n} — {label}',
    msgInit:'Start the game to play.',
    msgSelectPiece:'Pick a block, then tap the grid',
    msgPlacePiece:'Tap the grid to place the block',
    msgNoPiece:'Pick a block first!', msgNoFit:'Does not fit here!',
    msgDebugStart:'Start the game first!', msgDebugAdded:'Test block added to slot 0 — place it!',
    comboGreat:'great combo! x{n}', combo:'{n}x combo!',
    pwClawName:'Cat Claw', pwGazeName:'Cat Gaze',
    pwSelectCell:'Click a filled cell to destroy it',
    pwSelectPiece:'All blocks refreshed!',
    pwNoCharge:'No charge! Earn 300 pts to charge.',
    pwChargeGained:'⚡ Power charged!',
    pwClawInvalid:'Only filled cells can be clawed!',
    pwClawTip:'Destroy a filled cell · charges every 300 pts',
    pwGazeTip:'Refresh all blocks · charges every 300 pts',
    pwBombName:'Bomb', pwBombTip:'Clear 3×3 area · charges every 300 pts', pwSelectBomb:'Click a cell to blast',
    labelUndo:'Undo', undoTip:'Undo last placement', undoNoCharge:'No undo charges left!', undoUsed:'↩ Undone!',
    labelHint:'Hint', hintTip:'Show valid placements for selected block',
    timerMode:'⏱ Timer Mode', timerTimeUp:'Time is up!',
    shareBtn:'Share Score', shareMsg:'Cat Blast 🐱\nScore: {score} | Level: {level}\nBest: {best}\nPlay now!', scoreCopied:'Copied! 📋',
    statsTitle:'Statistics', statGames:'Games', statLines:'Lines', statPlacements:'Moves', statBestScore:'Best Score',
    topScores:'High Scores', noScores:'No scores yet.',
    stoneSpawned:'🪨 Stone block appeared!',
    btnTimerMode:'⏱ Timer Mode',
  },
  cat: {
    btnPlay:'Meow!', btnSettings:'Purrr~', btnAbout:'Mrrrow',
    btnLevelMode:'Mew Mew', btnEndless:'♾️ Meeeow', btnBack:'← Mew',
    settingsTitle:'Purrr~', labelSound:'Miyav', labelMusic:'Purrr~', labelSfx:'Miyav!', labelTheme:'Mrrr', labelLang:'Mew',
    aboutTitle:'Mrrrow',
    aboutTagline:'Meow mew mew, purr nyaa!',
    aboutDesc:'Purrrr miyav meow mrrr.',
    aboutTeamLabel:'MEOW MEOW MIYAV', aboutContactLabel:'MRRROW',
    pauseTitle:'Mrrr...', pauseSub:'Nyaa {lv} — Mew {sc}',
    btnResume:'Purr!', btnMenu:'Mew',
    btnNextLevel:'Nyaa {n} →', btnFinish:'Meow →',
    luTitle:'Nyaa {n} Purrrr!',
    luNext:'Mew: Nyaa {n} — {label}', luLast:'Purrrr meow meow!',
    gameOverTitle:'Mrrrrow...',
    btnPlayAgain:'Meow Meow!', btnPlayAgainEndless:'♾️ Meow!',
    goEndlessLv:'♾️ Meeeow',
    victoryTitle:'🏆 Nyaaa!!', victoryMsg:'Purr meow mew mrrr!', btnRestart:'Mew Meow!',
    labelScore:'Mew', labelBest:'Purr', labelLevel:'Nyaa',
    endlessLabel:'♾️ Meeeow', endlessPoints:'{score} mew',
    levelLabel:'Nyaa {n} — {label}',
    msgInit:'Meow... mew mrrr?',
    msgSelectPiece:'Mew mew, nyaa meow tıkla',
    msgPlacePiece:'Purrr mew nyaa tıkla',
    msgNoPiece:'Mew seç önce!', msgNoFit:'Mrrow! Sığmaz!',
    msgDebugStart:'Meow başlat önce!', msgDebugAdded:"Mew slot 0 meow — nyaa!",
    comboGreat:'purrrr!! x{n}', combo:'{n}x meow!',
    pwClawName:'PENÇE!', pwGazeName:'Miyav!',
    pwSelectCell:'Mew! Pençe hücre nyaa~',
    pwSelectPiece:'Mew mew purrrr!',
    pwNoCharge:'Mrr.. şarj yok! 300 mew!',
    pwChargeGained:'⚡ Purrrr!',
    pwClawInvalid:'Mrrow! Dolu mew lazım!',
    pwClawTip:'Mew nyaa pençe! · 300 mew = şarj',
    pwGazeTip:'Tüm mew yenile · 300 mew = şarj',
    pwBombName:'PATLAT!', pwBombTip:'3×3 BOOM meow · 300 mew', pwSelectBomb:'Mew BOOM tıkla~',
    labelUndo:'Geri Mew', undoTip:'Mew geri al purr!', undoNoCharge:'Mrr geri yok!', undoUsed:'↩ Meeow!',
    labelHint:'İpucu', hintTip:'Mew purr göster nyaa',
    timerMode:'⏱ Mew Mew!', timerTimeUp:'Mrroww süre bitti!',
    shareBtn:'Purr~', shareMsg:'Cat Blast 🐱\nMew: {score} | Nyaa: {level}\nPurr: {best}\nMeow meow!', scoreCopied:'Mew kopyalandı! 📋',
    statsTitle:'Mew Mew', statGames:'Oyun', statLines:'Satır', statPlacements:'Hamle', statBestScore:'Purr Rekor',
    topScores:'Top Mew Skorlar', noScores:'Henüz mew yok.',
    stoneSpawned:'🪨 Taş mew çıktı!',
    btnTimerMode:'⏱ Meeeow!',
  },
};
let currentLang = 'tr';
try { currentLang = localStorage.getItem('bb_lang') || 'tr'; } catch(e) {}
function T(key, vars) {
  let s = (TEXTS[currentLang] || TEXTS.tr)[key] || key;
  if (vars) Object.keys(vars).forEach(k => { s = s.replace(new RegExp('\\{' + k + '\\}', 'g'), vars[k]); });
  return s;
}
function getLevelName(n) {
  const names = LEVEL_NAMES[currentLang] || LEVEL_NAMES.tr;
  return names[n - 1] || names[names.length - 1];
}
function setLang(lang) {
  currentLang = lang;
  try { localStorage.setItem('bb_lang', lang); } catch(e) {}
  applyLang();
}
function applyLang() {
  document.querySelectorAll('[data-i18n]').forEach(el => { el.textContent = T(el.dataset.i18n); });
  document.querySelectorAll('.lang-btn').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.lang === currentLang);
  });
  const clawBtn = document.getElementById('claw-btn');
  const gazeBtn = document.getElementById('gaze-btn');
  const bombBtn = document.getElementById('bomb-btn');
  const undoBtn = document.getElementById('undo-btn');
  const hintBtn = document.getElementById('hint-btn');
  if (clawBtn) clawBtn.dataset.tooltip = T('pwClawTip');
  if (gazeBtn) gazeBtn.dataset.tooltip = T('pwGazeTip');
  if (bombBtn) bombBtn.dataset.tooltip = T('pwBombTip');
  if (undoBtn) undoBtn.dataset.tooltip = T('undoTip');
  if (hintBtn) hintBtn.dataset.tooltip = T('hintTip');
  if (gameActive) updateProgress();
}

// ── DEBUG LOG SYSTEM ──────────────────────────────────────────────
const _debugLog = [];
const _DEBUG_MAX = 300;
let _debugVisible = false;

function glog(type, msg, extra) {
  const ts = new Date().toISOString().slice(11, 23);
  const entry = { ts, type, msg, extra: extra ? JSON.stringify(extra) : '' };
  _debugLog.push(entry);
  if (_debugLog.length > _DEBUG_MAX) _debugLog.shift();
  console.log(`[${type}] ${msg}`, extra || '');
  _renderDebugLog();
}

function _renderDebugLog() {
  const panel = document.getElementById('debug-log-panel');
  if (!panel || !_debugVisible) return;
  const list = document.getElementById('debug-log-list');
  if (!list) return;
  list.innerHTML = _debugLog.slice().reverse().map(e => {
    const color = e.type === 'FAIL' ? '#f88' : e.type === 'SPLIT' ? '#fc8' : e.type === 'PLACE' ? '#8f8' : '#adf';
    return `<div style="color:${color};font-size:10px;border-bottom:1px solid #333;padding:2px 0">
      <span style="opacity:.6">${e.ts}</span> <b>[${e.type}]</b> ${e.msg}
      ${e.extra ? `<div style="opacity:.7;font-size:9px;word-break:break-all">${e.extra}</div>` : ''}
    </div>`;
  }).join('');
}

function toggleDebugLog() {
  _debugVisible = !_debugVisible;
  const panel = document.getElementById('debug-log-panel');
  if (panel) panel.style.display = _debugVisible ? 'flex' : 'none';
  if (_debugVisible) _renderDebugLog();
}

function exportDebugLog() {
  const txt = _debugLog.map(e => `[${e.ts}][${e.type}] ${e.msg} ${e.extra}`).join('\n');
  try { localStorage.setItem('catblast_debug', txt); } catch(e) {}
  const blob = new Blob([txt], { type: 'text/plain' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url; a.download = 'catblast_debug.txt'; a.click();
  URL.revokeObjectURL(url);
}

// ── STATE ─────────────────────────────────────────────────────────
let board, obstacles, score, levelScore, bestScore, currentLevel, COLS, ROWS;
let bestScores = { level: 0, endless: 0, timer: 0 };
let pieces, selectedPiece, usedFlags;
let _easterClicks = 0, _easterTimer = null;
let placedGroups = [], cellToGroup = {}; // group hover tracking
let musicOn = true, sfxOn = true, paused = false, gameActive = false;
let endlessMode = false;
let darkMode = false;
let bgMusic = null;
let musicVolume = 0.7, sfxVolume = 0.7;
let audioCtx;
let catSprites = [], catAnimTimer = null;
let clawCharges = 0, gazeCharges = 0, bombCharges = 0;
let clawActive = false, gazeActive = false, bombActive = false;
let undoCharges = 0, _savedState = null;
let hintActive = false;
let timerMode = false, timerSeconds = 0, _timerInterval = null;
let stoneSpawnCounter = 0;
let scoreHistory = { level: [], endless: [], timer: [] };
let gameStats = { games: 0, linesCleared: 0, totalPlacements: 0 };
const PW_MAX = 3, PW_THRESHOLD = 300;

try {
  const _bs = JSON.parse(localStorage.getItem('bb_best_scores') || 'null');
  if (_bs && typeof _bs.level === 'number') {
    bestScores = _bs;
  } else {
    const _old = parseInt(localStorage.getItem('bb_lv2_best') || '0');
    if (_old > 0) bestScores.level = _old;
  }
} catch(e) {}
bestScore = 0;
try { darkMode = localStorage.getItem('bb_dark') === '1'; }
catch(e) {}
try { const v = parseFloat(localStorage.getItem('bb_vol'));     musicVolume = (isFinite(v) && v > 0) ? v : 0.7; } catch(e) {}
try { const v = parseFloat(localStorage.getItem('bb_sfx_vol')); sfxVolume   = (isFinite(v) && v > 0) ? v : 0.7; } catch(e) {}
try {
  const _raw = JSON.parse(localStorage.getItem('bb_scores') || 'null');
  if (_raw && !Array.isArray(_raw) && _raw.level !== undefined) {
    scoreHistory = _raw; // yeni format
  } else if (Array.isArray(_raw)) {
    // eski format → migrate
    scoreHistory = { level: [], endless: [], timer: [] };
    _raw.forEach(e => {
      const m = e.level === '⏱' ? 'timer' : e.level === '∞' ? 'endless' : 'level';
      scoreHistory[m].push({ score: e.score, lv: (m === 'level' ? e.level : null), date: e.date });
    });
  } else {
    scoreHistory = { level: [], endless: [], timer: [] };
  }
} catch(e) { scoreHistory = { level: [], endless: [], timer: [] }; }
try { gameStats = Object.assign({ games: 0, linesCleared: 0, totalPlacements: 0 }, JSON.parse(localStorage.getItem('bb_stats') || '{}')); } catch(e) {}

// ── INIT (called on page load) ────────────────────────────────────
function init() {
  applyDark();
  applyLang();
  syncVolumeSliders();
  updatePlayOverlayBests();
  document.getElementById('bv').textContent = 0;
  buildGrid(7, 7);
  initDragHandlers();
}

function easterEggClick() {
  _easterClicks++;
  clearTimeout(_easterTimer);
  _easterTimer = setTimeout(() => { _easterClicks = 0; }, 2000);
  if (_easterClicks >= 5) {
    _easterClicks = 0;
    clearTimeout(_easterTimer);
    const wrap = document.getElementById('easter-egg-wrap');
    wrap.classList.remove('pop');
    void wrap.offsetWidth;
    wrap.classList.add('pop');
  }
}

// ── HELPERS ───────────────────────────────────────────────────────
function getLv(n) {
  if (n <= LEVELS.length) return LEVELS[n - 1];
  // Sonsuz level modu: dinamik üret
  const obstacles = Math.min(35, 20 + (n - LEVELS.length));
  const target    = Math.round(400 + (n - 1) * (200 + 50 * n));
  const color     = COLORS[(n - 1) % COLORS.length];
  return { n, grid: 9, obstacles, target, color, label: `Uzman+`, desc: `9×9 grid, ${obstacles} engel.` };
}
function currentModeKey() { return timerMode ? 'timer' : endlessMode ? 'endless' : 'level'; }
function updatePlayOverlayBests() {
  const map = { level: 'best-level', endless: 'best-endless', timer: 'best-timer' };
  Object.entries(map).forEach(([mode, id]) => {
    const el = document.getElementById(id);
    if (el) el.textContent = bestScores[mode] > 0 ? bestScores[mode] : '—';
  });
}
function saveBestScore() {
  try { localStorage.setItem('bb_best_scores', JSON.stringify(bestScores)); } catch(e) {}
}
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
const _comboAudios = {};
function _getComboAudio(name) {
  if (!_comboAudios[name]) {
    const a = new Audio(`Sounds/${name}.m4a`);
    a.load();
    _comboAudios[name] = a;
  }
  return _comboAudios[name];
}
function preloadComboSounds() {
  ['firstcombo', 'secondcombo', 'thirdcombo'].forEach(n => _getComboAudio(n));
}
function beep(f, d, t = 'sine', v = 0.09) {
  if (!sfxOn) return;
  try {
    const c = getACtx();
    if (c.state === 'suspended') { c.resume(); }
    const o = c.createOscillator(), g = c.createGain();
    o.connect(g); g.connect(c.destination);
    o.type = t; o.frequency.value = f;
    g.gain.setValueAtTime(v * sfxVolume, c.currentTime);
    g.gain.exponentialRampToValueAtTime(0.001, c.currentTime + d);
    o.start(c.currentTime); o.stop(c.currentTime + d);
  } catch(e) {}
}
function playSelect()    { beep(520, 0.08, 'sine', 0.1); }
function playPlace()     { beep(300, 0.07, 'sine', 0.1); setTimeout(() => beep(400, 0.09, 'sine', 0.08), 65); }
function playLineClear(n){ [440,554,659,880].slice(0,n+1).forEach((f,i) => setTimeout(() => beep(f, 0.18, 'sine', 0.13), i*85)); }
function playCombo(n = 2) {
  if (!sfxOn) return;
  const file = n >= 4 ? 'thirdcombo' : n === 3 ? 'secondcombo' : 'firstcombo';
  const snd = _getComboAudio(file);
  snd.volume = sfxVolume;
  snd.currentTime = 0;
  snd.play().catch(() => {
    [523,659,784,1046,1318].forEach((f,i) => setTimeout(() => beep(f, 0.14, 'sine', 0.15), i*55));
  });
}
function playGameOver()  {
  if (sfxOn) {
    const snd = new Audio('Sounds/gameoversound.wav');
    snd.volume = sfxVolume;
    snd.play().catch(() => {
      [350,280,220,170].forEach((f,i) => setTimeout(() => beep(f, 0.2, 'sine', 0.1), i*130));
    });
  }
}
function playNewPieces() { [370,440,550].forEach((f,i) => setTimeout(() => beep(f, 0.1, 'sine', 0.09), i*70)); }
function playLevelUp()   { [523,659,784,880,1046].forEach((f,i) => setTimeout(() => beep(f, 0.16, 'sine', 0.14), i*70)); }
function playVictory()   { [523,659,784,1046,1318,1568].forEach((f,i) => setTimeout(() => beep(f, 0.18, 'sine', 0.15), i*80)); }
function playClick()     { beep(440, 0.07, 'sine', 0.08); }
function playBomb()      { [220, 160, 110, 80].forEach((f,i) => setTimeout(() => beep(f, 0.18, 'sawtooth', 0.1), i*40)); }
function playUndo()      { [440, 330, 220].forEach((f,i) => setTimeout(() => beep(f, 0.1, 'sine', 0.09), i*60)); }
function playTimerTick() { beep(880, 0.06, 'square', 0.06); }

function haptic(pattern) {
  try { if (navigator.vibrate) navigator.vibrate(pattern); } catch(e) {}
}

function spawnParticles(idx, color) {
  const gridEl = document.getElementById('grid');
  const s = cs(), gap = 5, pad = 8;
  const row = Math.floor(idx / COLS), col = idx % COLS;
  const cx = pad + col * (s + gap) + s / 2;
  const cy = pad + row * (s + gap) + s / 2;
  for (let i = 0; i < 5; i++) {
    const p = document.createElement('div');
    p.className = 'particle';
    const angle = (i / 5) * Math.PI * 2 + (Math.random() - .5) * 1.3;
    const dist  = 16 + Math.random() * 34;
    const size  = 3 + Math.random() * 5;
    const dur   = (.34 + Math.random() * .22).toFixed(2);
    const rot   = Math.round(Math.random() * 360);
    p.style.cssText =
      `left:${cx}px;top:${cy}px;width:${size}px;height:${size}px;` +
      `background:${color};border-radius:${Math.random() > .4 ? '50%' : '3px'};` +
      `--pdx:${(Math.cos(angle) * dist).toFixed(1)}px;` +
      `--pdy:${(Math.sin(angle) * dist).toFixed(1)}px;` +
      `--pdur:${dur}s;--prot:${rot}deg;`;
    gridEl.appendChild(p);
    setTimeout(() => p.remove(), Math.round(parseFloat(dur) * 1000) + 60);
  }
}

function initBgMusic() {
  if (bgMusic) return;
  bgMusic = new Audio('Sounds/Theme%20song.mp3');
  bgMusic.loop   = true;
  bgMusic.volume = musicOn ? musicVolume : 0;
}

function playBgMusic() {
  if (!musicOn) return;
  initBgMusic();
  bgMusic.play().catch(() => {
    const retry = () => { bgMusic.play().catch(() => {}); };
    document.addEventListener('touchstart', retry, { once: true });
    document.addEventListener('click',      retry, { once: true });
  });
}

function pauseBgMusic() {
  if (bgMusic) bgMusic.pause();
}

function syncVolumeSliders() {
  const mVal = Math.round(musicVolume * 100);
  const sVal = Math.round(sfxVolume   * 100);
  document.querySelectorAll('.vol-slider-music').forEach(s => { s.value = mVal; });
  document.querySelectorAll('.vol-slider-sfx').forEach(s =>   { s.value = sVal; });
}

function setMusicVolume(val) {
  musicVolume = val / 100;
  if (bgMusic) bgMusic.volume = musicOn ? musicVolume : 0;
  document.querySelectorAll('.vol-slider-music').forEach(s => { s.value = val; });
  try { localStorage.setItem('bb_vol', musicVolume); } catch(e) {}
}

function setSfxVolume(val) {
  sfxVolume = val / 100;
  document.querySelectorAll('.vol-slider-sfx').forEach(s => { s.value = val; });
  try { localStorage.setItem('bb_sfx_vol', sfxVolume); } catch(e) {}
}

function toggleMusic() {
  musicOn = !musicOn;
  const icon = musicOn ? '🎵' : '🔇';
  document.getElementById('music-btn').textContent = icon;
  const m = document.getElementById('music-btn-menu');
  if (m) m.textContent = icon;
  if (musicOn) { if (!paused) playBgMusic(); } else { pauseBgMusic(); }
}

function toggleSfx() {
  sfxOn = !sfxOn;
  const icon = sfxOn ? '🔊' : '🔈';
  document.getElementById('sfx-btn').textContent = icon;
  const m = document.getElementById('sfx-btn-menu');
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
const OVERLAYS = ['main-menu-overlay','play-overlay','settings-overlay','about-overlay','stats-overlay','pause-overlay','levelup-overlay','gameover-overlay','victory-overlay'];
function showOverlay(id) { OVERLAYS.forEach(o => document.getElementById(o).classList.toggle('hidden', o !== id)); }
function hideAll() { OVERLAYS.forEach(o => document.getElementById(o).classList.add('hidden')); }

function showMainMenu()  { playClick(); showOverlay('main-menu-overlay'); }
function showPlayMenu()  { playClick(); showOverlay('play-overlay'); }
function showSettings()  { playClick(); showOverlay('settings-overlay'); }
function showAbout()     { playClick(); showOverlay('about-overlay'); }

// ── GAME FLOW ─────────────────────────────────────────────────────
function startEndless() {
  timerMode = false;
  endlessMode = true;
  startGame(1, true);
}

function startGame(lvNum, endless = false) {
  endlessMode = !!endless;
  playClick(); hideAll(); preloadComboSounds();
  const loading = document.getElementById('level-loading');
  loading.classList.remove('hidden');
  setTimeout(() => {
    loading.classList.add('hidden');
    _initLevel(lvNum);
  }, 900);
}

function restartAfterGameOver() {
  playClick(); hideAll();
  _initLevel(1);
}

function _initLevel(lvNum) {
  document.getElementById('game-container').style.display = '';
  currentLevel = lvNum || 1;
  const lv = getLv(currentLevel);
  COLS = lv.grid; ROWS = lv.grid;
  board = Array.from({length: ROWS}, () => Array(COLS).fill(null));
  obstacles = new Set();
  placedGroups = []; cellToGroup = {};
  if (lvNum === 1) { score = 0; clawCharges = 0; gazeCharges = 0; bombCharges = 0; undoCharges = 2; _savedState = null; }
  levelScore = 0;
  bestScore = bestScores[currentModeKey()];
  clawActive = false; gazeActive = false; bombActive = false; hintActive = false;
  stoneSpawnCounter = 0;
  stopTimer();
  paused = false; gameActive = true;
  playBgMusic();
  placeObstacles(lv.obstacles);
  clearAllCats();
  stopCatTimer();
  CAT_DEFS.forEach(def => loadCatSheetByDef(def, () => {}));
  catAnimTimer = setInterval(() => catSprites.forEach(playCatAnim), CAT_IDLE_MS);
  document.getElementById('powerup-bar').classList.remove('hidden');
  const timerCardEl = document.getElementById('timer-card');
  if (timerCardEl) timerCardEl.style.display = timerMode ? '' : 'none';
  if (timerMode) setTimeout(startTimer, 1000);
  updatePowerupUI();
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
  _initLevel(currentLevel);
}

function pauseGame() {
  if (!gameActive || paused) return;
  cancelClaw(); cancelGaze(); cancelBomb(); clearHint();
  if (timerMode) stopTimer();
  paused = true; playClick();
  document.getElementById('pause-info').textContent = T('pauseSub', { lv: currentLevel, sc: score });
  showOverlay('pause-overlay');
}

function resumeGame() { playClick(); paused = false; hideAll(); playBgMusic(); if (timerMode && timerSeconds > 0) startTimerCountdown(); }

function quitToMenu() {
  cancelClaw(); cancelGaze(); cancelBomb(); clearHint();
  stopTimer(); timerMode = false;
  playClick(); paused = false; gameActive = false;
  document.getElementById('game-container').style.display = 'none';
  document.getElementById('powerup-bar').classList.add('hidden');
  playBgMusic();
  stopCatTimer(); clearAllCats();
  updatePlayOverlayBests();
  showOverlay('main-menu-overlay');
}

document.addEventListener('keydown', e => {
  if (e.key === 'Escape') {
    if (dragState) { cancelDrag(); return; }
    if (clawActive) { cancelClaw(); return; }
    if (gazeActive) { cancelGaze(); return; }
    if (bombActive) { cancelBomb(); return; }
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
      c.className = 'gcell';
      c.style.width  = size + 'px';
      c.style.height = size + 'px';
      c.dataset.r = y;
      c.dataset.c = x;
      c.addEventListener('click',       () => { if (clawActive) applyClaw(y, x); else if (bombActive) applyBomb(y, x); });
      c.addEventListener('mouseenter',  () => { applyGroupHover(y * COLS + x, true); if (bombActive) showBombPreview(y, x); });
      c.addEventListener('mouseleave',  () => { if (!dragState) clearPreview(); applyGroupHover(y * COLS + x, false); if (bombActive) clearBombPreview(); });
      g.appendChild(c);
    }
  }
}

function allCells() { return document.querySelectorAll('#grid .gcell'); }

function applyGroupHover(idx, on) {
  const gIdx = cellToGroup[idx];
  if (gIdx === undefined || !on) return;
  const gSet = placedGroups[gIdx];
  if (!gSet) return;
  catSprites.forEach(s => {
    const hits = s.def.shape.some((row, dr) =>
      row.some((v, dc) => v && gSet.has((s.r + dr) * COLS + (s.c + dc)))
    );
    if (hits) playCatAnim(s);
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
    } else if (board[r][col] === '__stone__') {
      c.className = 'gcell stone-block';
      c.style.background = '';
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
    const color = cell.style.background;
    if (color) spawnParticles(idx, color);
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
  document.getElementById('p' + i).classList.add('vanish');
}

function selectPiece(i) {
  if (!gameActive || paused || usedFlags[i]) return;
  selectedPiece = i; playSelect();
  document.querySelectorAll('.piece-card').forEach((c, j) => c.classList.toggle('selected', j === i && !usedFlags[j]));
  setMsg(T('msgPlacePiece'));
  if (hintActive) showHint();
}

function placeOnGrid(row, col) {
  if (!gameActive || paused) return;
  if (selectedPiece === null) { setMsg(T('msgNoPiece')); return; }
  if (usedFlags[selectedPiece]) return;
  const p = pieces[selectedPiece];
  const { r, c } = adjustedAnchor(p.shape, row, col);
  if (!canPlace(p.shape, r, c)) {
    setMsg(T('msgNoFit'));
    const blocked = [];
    p.shape.forEach((rr, dy) => rr.forEach((v, dx) => {
      if (!v) return;
      const nr = r + dy, nc = c + dx;
      if (nr >= ROWS || nc >= COLS || nr < 0 || nc < 0) { blocked.push(`(${nr},${nc})OOB`); return; }
      if (board[nr][nc]) blocked.push(`(${nr},${nc})filled:${board[nr][nc].slice(0,8)}`);
      else if (obstacles.has(nr * COLS + nc)) blocked.push(`(${nr},${nc})obstacle`);
    }));
    glog('FAIL', `click(${row},${col}) anchor(${r},${c}) shape${JSON.stringify(p.shape)}`, { blocked });
    return;
  }
  saveUndoState();
  playPlace(); haptic(12);

  const placed = [];
  p.shape.forEach((rr, dy) => rr.forEach((v, dx) => {
    if (!v) return;
    board[r + dy][c + dx] = p.color;
    placed.push({ r: r + dy, c: c + dx });
  }));
  glog('PLACE', `anchor(${r},${c}) cells:${placed.map(x=>`(${x.r},${x.c})`).join('')}`, { shape: p.shape, color: p.color.slice(0,8) });

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
  clearPreview(); clearHint();
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
    const oldScore = score;
    score += pts; levelScore += pts;
    if (score > bestScore) {
      bestScore = score;
      bestScores[currentModeKey()] = bestScore; saveBestScore();
    }
    updateScoreUI(); updateProgress();
    checkAndGrantCharges(oldScore, score);
    showScoreFly(pts, row, col);
    gameStats.totalPlacements++;
    if (cleared > 0) gameStats.linesCleared += cleared;
    maybeSpawnStone();
    if (cleared > 0) {
      playLineClear(cleared); animateClears(toClear);
      haptic(cleared >= 3 ? [20, 8, 20, 8, 50] : [20, 10, 30]);
      if (cleared >= 2) { playCombo(cleared); setTimeout(() => { showCombo(cleared); haptic([15, 8, 15, 8, 55]); }, 360); }
    }
    if (!endlessMode && levelScore >= getLv(currentLevel).target) { setTimeout(showLevelUp, cleared > 0 ? 500 : 250); return; }
    const allUsed = usedFlags.every(Boolean);
    if (allUsed) setTimeout(() => newPieces(), cleared > 0 ? 420 : 200);
    else if (!anyRemainingCanPlace()) setTimeout(showGameOver, cleared > 0 ? 420 : 200);
    else setMsg(T('msgSelectPiece'));
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
  t.textContent = n >= 4 ? T('comboGreat', { n }) : T('combo', { n });
  t.dataset.combo = n;
  t.className = 'show';
  setTimeout(() => { t.className = ''; delete t.dataset.combo; }, 760);
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
  if (endlessMode) {
    const cycle = 500;
    const pct = (score % cycle) / cycle * 100;
    document.getElementById('progress-bar').style.width      = pct + '%';
    document.getElementById('progress-bar').style.background = '#9b7dd4';
    document.getElementById('prog-left').textContent  = T('endlessLabel');
    document.getElementById('prog-right').textContent = T('endlessPoints', { score });
    return;
  }
  const lv  = getLv(currentLevel);
  const pct = Math.min(100, (levelScore / lv.target) * 100);
  document.getElementById('progress-bar').style.width      = pct + '%';
  document.getElementById('progress-bar').style.background = lv.color;
  document.getElementById('prog-left').textContent  = T('levelLabel', { n: currentLevel, label: getLevelName(currentLevel) });
  document.getElementById('prog-right').textContent = levelScore + ' / ' + lv.target;
}

function setMsg(t) {
  const m = document.getElementById('msg');
  m.style.opacity = 0;
  setTimeout(() => { m.textContent = t; m.style.opacity = 1; }, 120);
}

// ── END SCREENS ───────────────────────────────────────────────────
function showLevelUp() {
  gameActive = false; playLevelUp(); haptic([15, 8, 15, 8, 60]);
  const lv = getLv(currentLevel);
  document.getElementById('lu-title').textContent = T('luTitle', { n: currentLevel });
  document.getElementById('lu-sub').textContent   = T('luNext', { n: currentLevel + 1, label: getLevelName(currentLevel + 1) });
  document.getElementById('lu-score').textContent = score;
  document.getElementById('lu-stars').textContent = levelScore >= lv.target * 1.5 ? '⭐⭐⭐' : levelScore >= lv.target * 1.2 ? '⭐⭐' : '⭐';
  document.getElementById('lu-btn').textContent   = T('btnNextLevel', { n: currentLevel + 1 });
  showOverlay('levelup-overlay');
}

function showVictory() {
  cancelClaw(); cancelGaze(); cancelBomb(); clearHint();
  stopTimer();
  stopCatTimer();
  pauseBgMusic();
  playVictory();
  saveScoreHistory();
  document.getElementById('vic-sc').textContent   = score;
  document.getElementById('vic-best').textContent = bestScore;
  showOverlay('victory-overlay');
}

function showGameOver() {
  cancelClaw(); cancelGaze(); cancelBomb(); clearHint();
  stopTimer();
  gameActive = false; playGameOver(); haptic([80, 30, 80]);
  stopCatTimer();
  pauseBgMusic();
  saveScoreHistory();
  document.getElementById('go-lv').textContent   = timerMode ? T('timerMode') : (endlessMode ? T('goEndlessLv') : currentLevel);
  document.getElementById('go-sc').textContent   = score;
  document.getElementById('go-best').textContent = bestScore;
  document.getElementById('go-restart-btn').textContent = endlessMode ? T('btnPlayAgainEndless') : T('btnPlayAgain');
  showOverlay('gameover-overlay');
}

// ── PIECES ────────────────────────────────────────────────────────
function renderPieceCard(i) {
  const p = pieces[i];
  const card = document.getElementById('p' + i);
  card.className = 'piece-card';
  card.style.display = '';
  card.style.visibility = '';
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
}

function renderPieces() {
  pieces.forEach((_, i) => renderPieceCard(i));
}

function newPieces() {
  playNewPieces();
  pieces    = [newPiece(), newPiece(), newPiece()];
  usedFlags = [false, false, false];
  selectedPiece = null;
  renderPieces();
  if (gazeActive) {
    for (let i = 0; i < 3; i++) document.getElementById('p' + i).classList.add('gaze-available');
  }
  setMsg(gazeActive ? T('pwSelectPiece') : T('msgSelectPiece'));
  if (!anyRemainingCanPlace()) { setTimeout(showGameOver, 150); return; }
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

function getHandCatDefs() {
  if (!pieces || !usedFlags) return [];
  return pieces
    .filter((p, i) => p && !usedFlags[i])
    .map(p => findCatDef(p.shape))
    .filter(d => d !== null);
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
    if (!occupied.some(i => toClear.has(i))) return true;
    el.remove();
    const survivors = occupied.filter(i => !toClear.has(i));
    if (survivors.length) {
      glog('SPLIT', `sprite@(${r},${c}) shape${JSON.stringify(def.shape)} cleared:${[...toClear].filter(i=>occupied.includes(i)).map(i=>`(${Math.floor(i/COLS)},${i%COLS})`).join('')} orphans:${survivors.map(i=>`(${Math.floor(i/COLS)},${i%COLS})`).join('')} → plain blocks`);
    }
    return false;
  });
}

// ── POWER-UPS ─────────────────────────────────────────────────────
function updatePowerupUI() {
  const clawBtn = document.getElementById('claw-btn');
  const gazeBtn = document.getElementById('gaze-btn');
  const bombBtn = document.getElementById('bomb-btn');
  const undoBtn = document.getElementById('undo-btn');
  if (!clawBtn) return;
  document.getElementById('claw-charges').textContent = clawCharges;
  document.getElementById('gaze-charges').textContent = gazeCharges;
  if (document.getElementById('bomb-charges')) document.getElementById('bomb-charges').textContent = bombCharges;
  clawBtn.classList.toggle('charged', clawCharges > 0);
  gazeBtn.classList.toggle('charged', gazeCharges > 0);
  if (bombBtn) bombBtn.classList.toggle('charged', bombCharges > 0);
  clawBtn.classList.toggle('active', clawActive);
  gazeBtn.classList.toggle('active', gazeActive);
  if (bombBtn) bombBtn.classList.toggle('active', bombActive);
  if (undoBtn) {
    const canUndo = undoCharges > 0 && !!_savedState;
    undoBtn.classList.toggle('charged', canUndo);
    const chargeEl = undoBtn.querySelector('.pw-charges');
    if (chargeEl) chargeEl.textContent = undoCharges;
  }
}

function checkAndGrantCharges(oldScore, newScore) {
  const gained = Math.floor(newScore / PW_THRESHOLD) - Math.floor(oldScore / PW_THRESHOLD);
  if (gained <= 0) return;
  let granted = false;
  if (clawCharges < PW_MAX) { clawCharges = Math.min(PW_MAX, clawCharges + gained); granted = true; }
  if (gazeCharges < PW_MAX) { gazeCharges = Math.min(PW_MAX, gazeCharges + gained); granted = true; }
  if (bombCharges < PW_MAX) { bombCharges = Math.min(PW_MAX, bombCharges + gained); granted = true; }
  if (granted) { updatePowerupUI(); showPwToast(T('pwChargeGained')); playPowerup(); }
}

function showPwToast(msg) {
  const t = document.getElementById('pw-toast');
  if (!t) return;
  t.textContent = msg;
  t.className = 'show';
  setTimeout(() => { t.className = ''; }, 1400);
}

function playPowerup()    { [660, 880, 1100].forEach((f, i) => setTimeout(() => beep(f, 0.1, 'sine', 0.11), i * 55)); }
function playPowerupUse() { beep(880, 0.12, 'sine', 0.13); setTimeout(() => beep(440, 0.1, 'sine', 0.1), 90); }

// Pençe Darbesi — dolu bir hücreyi sil
function activateClaw() {
  if (!gameActive || paused) return;
  if (clawActive) { cancelClaw(); return; }
  if (clawCharges <= 0) { setMsg(T('pwNoCharge')); return; }
  cancelGaze();
  clawActive = true;
  selectedPiece = null;
  document.querySelectorAll('.piece-card').forEach(c => c.classList.remove('selected'));
  clearPreview();
  document.getElementById('grid').classList.add('claw-mode');
  setMsg(T('pwSelectCell'));
  updatePowerupUI();
  playClick();
}

function cancelClaw() {
  if (!clawActive) return;
  clawActive = false;
  document.getElementById('grid').classList.remove('claw-mode');
  updatePowerupUI();
  if (gameActive) setMsg(T('msgSelectPiece'));
}

function applyClaw(row, col) {
  const idx = row * COLS + col;
  if (!board[row][col] || board[row][col] === '__obstacle__' || obstacles.has(idx)) {
    setMsg(T('pwClawInvalid')); return;
  }
  // stone blocks allowed — treated same as filled cell
  clawCharges--;
  // Şarj kalmadıysa modu kapat, kaldıysa aktif devam et
  if (clawCharges <= 0) {
    clawActive = false;
    document.getElementById('grid').classList.remove('claw-mode');
  }
  updatePowerupUI();
  const removed = new Set([idx]);
  board[row][col] = null;
  const g = cellToGroup[idx];
  if (g !== undefined) { placedGroups[g]?.delete(idx); delete cellToGroup[idx]; }
  removeCatSprites(removed);
  animateClears(removed);
  playPowerupUse(); haptic([10, 5, 35]);
  const pts = 5;
  const oldScore = score;
  score += pts; levelScore += pts;
  if (score > bestScore) { bestScore = score; bestScores[currentModeKey()] = bestScore; saveBestScore(); }
  updateScoreUI(); updateProgress();
  checkAndGrantCharges(oldScore, score);
  showScoreFly(pts, row, col);
  setTimeout(() => {
    const lv = getLv(currentLevel);
    if (!endlessMode && levelScore >= lv.target) { showLevelUp(); return; }
    if (!anyRemainingCanPlace()) { showGameOver(); return; }
    setMsg(clawActive ? T('pwSelectCell') : T('msgSelectPiece'));
  }, 420);
}

// Kedi Bakışı — tüm blokları yenile
function activateGaze() {
  if (!gameActive || paused) return;
  if (gazeCharges <= 0) { setMsg(T('pwNoCharge')); return; }
  cancelClaw(); cancelBomb();
  gazeCharges--;
  selectedPiece = null;
  document.querySelectorAll('.piece-card').forEach(c => c.classList.remove('selected'));
  clearPreview();
  for (let i = 0; i < 3; i++) {
    if (!usedFlags[i]) {
      pieces[i] = newPiece();
      renderPieceCard(i);
    }
  }
  updatePowerupUI();
  playPowerupUse(); haptic([10, 5, 35]);
  setMsg(T('msgSelectPiece'));
  if (!anyRemainingCanPlace()) setTimeout(showGameOver, 400);
}

function cancelGaze() {
  if (!gazeActive) return;
  gazeActive = false;
  for (let i = 0; i < 3; i++) document.getElementById('p' + i).classList.remove('gaze-available');
  updatePowerupUI();
  if (gameActive) setMsg(T('msgSelectPiece'));
}

function applyGaze(idx) {
  gazeCharges--;
  gazeActive = false;
  for (let i = 0; i < 3; i++) document.getElementById('p' + i).classList.remove('gaze-available');
  pieces[idx] = newPiece();
  usedFlags[idx] = false;
  renderPieceCard(idx);
  updatePowerupUI();
  playPowerupUse(); haptic([10, 5, 35]);
  setMsg(T('msgSelectPiece'));
  if (!anyRemainingCanPlace()) setTimeout(showGameOver, 400);
}

// Bomba — 3×3 alanı temizle
function activateBomb() {
  if (!gameActive || paused) return;
  if (bombActive) { cancelBomb(); return; }
  if (bombCharges <= 0) { setMsg(T('pwNoCharge')); return; }
  cancelClaw(); cancelGaze();
  bombActive = true;
  selectedPiece = null;
  document.querySelectorAll('.piece-card').forEach(c => c.classList.remove('selected'));
  clearPreview(); clearHint();
  document.getElementById('grid').classList.add('bomb-mode');
  setMsg(T('pwSelectBomb'));
  updatePowerupUI();
  playClick();
}

function cancelBomb() {
  if (!bombActive) return;
  bombActive = false;
  clearBombPreview();
  document.getElementById('grid').classList.remove('bomb-mode');
  updatePowerupUI();
  if (gameActive) setMsg(T('msgSelectPiece'));
}

function showBombPreview(row, col) {
  clearBombPreview();
  const ac = allCells();
  for (let dr = -1; dr <= 1; dr++) {
    for (let dc = -1; dc <= 1; dc++) {
      const nr = row + dr, nc = col + dc;
      if (nr < 0 || nr >= ROWS || nc < 0 || nc >= COLS) continue;
      const idx = nr * COLS + nc;
      if (!obstacles.has(idx)) ac[idx].classList.add('bomb-preview');
    }
  }
}

function clearBombPreview() {
  document.querySelectorAll('.bomb-preview').forEach(el => el.classList.remove('bomb-preview'));
}

function applyBomb(row, col) {
  bombCharges--;
  clearBombPreview();
  if (bombCharges <= 0) {
    bombActive = false;
    document.getElementById('grid').classList.remove('bomb-mode');
  }
  updatePowerupUI();
  const toClear = new Set();
  for (let dr = -1; dr <= 1; dr++) {
    for (let dc = -1; dc <= 1; dc++) {
      const nr = row + dr, nc = col + dc;
      if (nr < 0 || nr >= ROWS || nc < 0 || nc >= COLS) continue;
      const idx = nr * COLS + nc;
      if (obstacles.has(idx)) continue;
      if (board[nr][nc]) toClear.add(idx);
    }
  }
  toClear.forEach(idx => {
    const r = Math.floor(idx / COLS), c = idx % COLS;
    board[r][c] = null;
    const g = cellToGroup[idx];
    if (g !== undefined) { placedGroups[g]?.delete(idx); delete cellToGroup[idx]; }
  });
  removeCatSprites(toClear);
  animateClears(toClear);
  playBomb(); haptic([30, 10, 30, 10, 60]);
  const pts = toClear.size * 8;
  const oldScore = score;
  score += pts; levelScore += pts;
  if (score > bestScore) { bestScore = score; bestScores[currentModeKey()] = bestScore; saveBestScore(); }
  updateScoreUI(); updateProgress();
  checkAndGrantCharges(oldScore, score);
  if (pts > 0) showScoreFly(pts, row, col);
  setTimeout(() => {
    const lv = getLv(currentLevel);
    if (!endlessMode && levelScore >= lv.target) { showLevelUp(); return; }
    if (!anyRemainingCanPlace()) { showGameOver(); return; }
    setMsg(bombActive ? T('pwSelectBomb') : T('msgSelectPiece'));
  }, 420);
}

// ── GERI AL ───────────────────────────────────────────────────────
function saveUndoState() {
  if (undoCharges <= 0) return;
  _savedState = {
    board: board.map(r => [...r]),
    obstacles: new Set(obstacles),
    score, levelScore,
    pieces: pieces.map(p => ({ shape: p.shape.map(r => [...r]), color: p.color })),
    usedFlags: [...usedFlags],
    clawCharges, gazeCharges, bombCharges,
    placedGroups: placedGroups.map(s => new Set(s)),
    cellToGroup: { ...cellToGroup },
    stoneSpawnCounter,
  };
}

function applyUndo() {
  if (!gameActive || paused) { return; }
  if (!_savedState || undoCharges <= 0) { setMsg(T('undoNoCharge')); return; }
  undoCharges--;
  const s = _savedState;
  _savedState = null;
  board = s.board;
  obstacles = s.obstacles;
  score = s.score; levelScore = s.levelScore;
  pieces = s.pieces; usedFlags = s.usedFlags;
  clawCharges = s.clawCharges; gazeCharges = s.gazeCharges; bombCharges = s.bombCharges;
  placedGroups = s.placedGroups; cellToGroup = s.cellToGroup;
  stoneSpawnCounter = s.stoneSpawnCounter;
  selectedPiece = null;
  cancelClaw(); cancelGaze(); cancelBomb(); clearHint();
  clearAllCats();
  renderGrid();
  renderPieces();
  updateScoreUI(); updateProgress(); updatePowerupUI();
  setMsg(T('undoUsed'));
  playUndo(); haptic([20, 10, 20]);
}

// ── IPUCU ─────────────────────────────────────────────────────────
function toggleHint() {
  if (!gameActive || paused) return;
  hintActive = !hintActive;
  const btn = document.getElementById('hint-btn');
  if (btn) btn.classList.toggle('active', hintActive);
  if (hintActive && selectedPiece !== null) showHint();
  else clearHint();
  playClick();
}

function showHint() {
  clearHint();
  if (selectedPiece === null || !hintActive) return;
  const p = pieces[selectedPiece];
  const cells = allCells();
  for (let r = 0; r < ROWS; r++)
    for (let c = 0; c < COLS; c++)
      if (canPlace(p.shape, r, c)) cells[r * COLS + c].classList.add('hint-cell');
}

function clearHint() {
  allCells().forEach(c => c.classList.remove('hint-cell'));
}

// ── SURE MODU ─────────────────────────────────────────────────────
function startTimer() {
  timerSeconds = 90;
  updateTimerDisplay();
  startTimerCountdown();
}

function startTimerCountdown() {
  if (_timerInterval) clearInterval(_timerInterval);
  _timerInterval = setInterval(() => {
    timerSeconds--;
    updateTimerDisplay();
    if (timerSeconds <= 10 && timerSeconds > 0) { haptic(20); playTimerTick(); }
    if (timerSeconds <= 0) { stopTimer(); setTimeout(showGameOver, 200); }
  }, 1000);
}

function stopTimer() {
  if (_timerInterval) { clearInterval(_timerInterval); _timerInterval = null; }
}

function updateTimerDisplay() {
  const el = document.getElementById('timer-display');
  if (!el) return;
  el.textContent = timerSeconds + 's';
  el.classList.toggle('timer-danger', timerSeconds <= 10);
}

// ── TAS BLOK ──────────────────────────────────────────────────────
function maybeSpawnStone() {
  if (!gameActive) return;
  if (!endlessMode && currentLevel < 2) return;
  stoneSpawnCounter++;
  const threshold = endlessMode ? 6 : 9;
  if (stoneSpawnCounter % threshold !== 0) return;
  const empties = [];
  for (let r = 0; r < ROWS; r++)
    for (let c = 0; c < COLS; c++)
      if (!board[r][c] && !obstacles.has(r * COLS + c)) empties.push([r, c]);
  if (empties.length < 5) return;
  const [r, c] = empties[Math.floor(Math.random() * empties.length)];
  board[r][c] = '__stone__';
  renderGrid();
  showPwToast(T('stoneSpawned'));
  haptic([15, 10, 15]);
}

// ── PAYLASMA / ISTATISTIK ─────────────────────────────────────────
function shareScore() {
  const text = T('shareMsg', { score, level: timerMode ? '⏱' : (endlessMode ? '∞' : currentLevel), best: bestScore });
  if (navigator.clipboard) {
    navigator.clipboard.writeText(text).then(() => showPwToast(T('scoreCopied'))).catch(() => {});
  }
  haptic(30);
}

function saveScoreHistory() {
  gameStats.games++;
  try { localStorage.setItem('bb_stats', JSON.stringify(gameStats)); } catch(e) {}
  if (score <= 0) return;
  const mode = timerMode ? 'timer' : endlessMode ? 'endless' : 'level';
  const entry = { score, lv: mode === 'level' ? currentLevel : null, date: new Date().toLocaleDateString('tr-TR') };
  scoreHistory[mode].push(entry);
  scoreHistory[mode].sort((a, b) => b.score - a.score);
  scoreHistory[mode] = scoreHistory[mode].slice(0, 5);
  try { localStorage.setItem('bb_scores', JSON.stringify(scoreHistory)); } catch(e) {}
  renderTopScores();
}

function _buildScoreSection(mode, entries, label) {
  const wrap = document.createElement('div');
  wrap.style.marginBottom = '10px';
  if (!entries.length) {
    const empty = document.createElement('div');
    empty.style.cssText = 'opacity:.4;font-size:8px;text-align:center;padding:4px';
    empty.textContent = T('noScores');
    wrap.appendChild(empty);
  } else {
    entries.forEach((e, i) => {
      const row = document.createElement('div');
      row.className = 'score-list-row';
      row.innerHTML = mode === 'level'
        ? `<span>#${i+1}</span><span>${e.score}</span><span>Lv${e.lv}</span><span>${e.date}</span>`
        : `<span>#${i+1}</span><span>${e.score}</span><span>${label}</span><span>${e.date}</span>`;
      wrap.appendChild(row);
    });
  }
  return wrap;
}

function renderTopScores() {
  const mode = timerMode ? 'timer' : endlessMode ? 'endless' : 'level';
  const label = mode === 'timer' ? '⏱ Süre' : mode === 'endless' ? '♾️ Sonsuz' : '🎯 Level';
  ['go-score-list', 'vic-score-list'].forEach(id => {
    const list = document.getElementById(id);
    if (!list) return;
    list.innerHTML = '';
    list.appendChild(_buildScoreSection(mode, scoreHistory[mode], label));
  });
}

function showStats() {
  playClick();
  document.getElementById('stat-games').textContent       = gameStats.games;
  document.getElementById('stat-lines').textContent       = gameStats.linesCleared;
  document.getElementById('stat-placements').textContent  = gameStats.totalPlacements;
  document.getElementById('stat-best').textContent        = Math.max(bestScores.level, bestScores.endless, bestScores.timer);
  showOverlay('stats-overlay');
  switchScoreTab('level');
}

function switchScoreTab(mode) {
  const labels = { level: '🎯 Level Modu', endless: '♾️ Sonsuz Mod', timer: '⏱ Süre Modu' };
  document.querySelectorAll('.score-tab').forEach(btn => btn.classList.remove('active'));
  const activeBtn = document.getElementById('stab-' + mode);
  if (activeBtn) activeBtn.classList.add('active');
  const list = document.getElementById('stats-score-list');
  if (!list) return;
  list.innerHTML = '';
  list.appendChild(_buildScoreSection(mode, scoreHistory[mode], labels[mode]));
}

function startTimerGame() {
  timerMode = true;
  endlessMode = true;
  playClick(); hideAll();
  const loading = document.getElementById('level-loading');
  loading.classList.remove('hidden');
  setTimeout(() => { loading.classList.add('hidden'); _initLevel(1); }, 900);
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
  if (!gameActive) { setMsg(T('msgDebugStart')); return; }
  pieces[0]    = { shape: SHAPES[i], color: randColor() };
  usedFlags[0] = false;
  selectedPiece = null;
  renderPieces();
  selectPiece(0);
  setMsg(T('msgDebugAdded'));
}

// ── DRAG & DROP ───────────────────────────────────────────────────
let dragState = null; // { idx, shape, ghostEl, isTouch }

function startDrag(idx, clientX, clientY, isTouch) {
  if (!gameActive || paused || usedFlags[idx]) return;
  if (clawActive) cancelClaw();
  if (bombActive) cancelBomb();
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
