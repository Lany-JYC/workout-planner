/* ============================================
   💪 小可爱的运动计划 — Application Logic
   ============================================ */

// ===== CONSTANTS =====
const STORAGE_KEY = 'workout_planner_data';
const DAY_NAMES = ['周一', '周二', '周三', '周四', '周五', '周六', '周日'];
const DAY_KEYS = ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'];

const TYPE_CONFIG = {
  strength:  { icon: '🏋️', label: '力量训练',  color: '#fce4e9' },
  cardio:    { icon: '🏃', label: '有氧运动',  color: '#fff3e0' },
  flexibility:{ icon: '🧘', label: '柔韧拉伸',  color: '#ede4f7' },
  core:      { icon: '🎯', label: '核心训练',  color: '#e3f2fd' },
};

// ===== DEFAULT EXERCISE LIBRARY =====
const DEFAULT_EXERCISES = {
  '深蹲': {
    type: 'strength', sets: 3, reps: '15次',
    desc: '【动作要领】\n1. 双脚与肩同宽，脚尖微微外展\n2. 背部挺直，核心收紧\n3. 下蹲时臀部向后坐，像坐在椅子上\n4. 大腿与地面平行时停止\n5. 脚跟发力站起\n\n【注意事项】\n⚠️ 膝盖不要超过脚尖过多\n⚠️ 背部不要弓起\n⚠️ 重心放在脚后跟\n\n【呼吸节奏】\n下蹲吸气，站起呼气',
    video: '',
  },
  '平板支撑': {
    type: 'core', sets: 3, reps: '30秒',
    desc: '【动作要领】\n1. 俯卧，手肘在肩膀正下方\n2. 脚尖着地，身体成一条直线\n3. 核心收紧，臀部不要塌陷或抬高\n4. 目视下方，颈部保持中立\n\n【注意事项】\n⚠️ 腰部不要下沉\n⚠️ 不要憋气\n\n【呼吸节奏】\n保持均匀深呼吸',
    video: '',
  },
  '臀桥': {
    type: 'strength', sets: 3, reps: '15次',
    desc: '【动作要领】\n1. 仰卧，双膝弯曲，双脚平放地面\n2. 手臂放在身体两侧\n3. 臀部发力向上抬起\n4. 在最高点夹紧臀部停留1-2秒\n5. 缓慢下放\n\n【注意事项】\n⚠️ 不要用腰部代偿\n⚠️ 下巴微收\n\n【呼吸节奏】\n抬起呼气，下放吸气',
    video: '',
  },
  '开合跳': {
    type: 'cardio', sets: 3, reps: '30秒',
    desc: '【动作要领】\n1. 站立，双脚并拢，手臂放在身体两侧\n2. 跳起同时双脚分开，双手在头顶击掌\n3. 再跳回起始位置\n4. 保持节奏均匀\n\n【注意事项】\n⚠️ 落地时膝盖微弯缓冲\n⚠️ 穿运动鞋，在平坦地面进行\n\n【呼吸节奏】\n保持自然呼吸，不要憋气',
    video: '',
  },
  '卷腹': {
    type: 'core', sets: 3, reps: '20次',
    desc: '【动作要领】\n1. 仰卧，双膝弯曲，双脚平放\n2. 双手轻放在耳侧（不要用力拉头部）\n3. 用腹部力量将上半身卷起\n4. 肩胛骨离开地面即可\n5. 缓慢下放\n\n【注意事项】\n⚠️ 不要用颈部发力\n⚠️ 下背部保持贴地\n\n【呼吸节奏】\n卷起呼气，下放吸气',
    video: '',
  },
  '弓步蹲': {
    type: 'strength', sets: 3, reps: '每侧12次',
    desc: '【动作要领】\n1. 站立，双脚与髋同宽\n2. 向前迈一大步\n3. 双膝弯曲至约90度\n4. 后膝接近地面但不触地\n5. 前脚发力推回起始位置\n\n【注意事项】\n⚠️ 前膝不要超过脚尖\n⚠️ 上身保持直立\n⚠️ 核心收紧保持平衡\n\n【呼吸节奏】\n下蹲吸气，推起呼气',
    video: '',
  },
  '拉伸放松': {
    type: 'flexibility', sets: 1, reps: '每个动作30秒',
    desc: '【动作要领】\n1. 选择需要放松的肌群\n2. 缓慢进入拉伸位置\n3. 感到轻微拉伸感即可，不要疼痛\n4. 保持姿势，不要弹震\n5. 每个部位保持20-30秒\n\n【常见拉伸】\n• 大腿前侧：站立拉脚踝\n• 大腿后侧：坐姿前屈\n• 背部：猫牛式\n• 肩部：交叉手臂拉伸\n\n【呼吸节奏】\n深呼吸，每次呼气时尝试再放松一点',
    video: '',
  },
};

// ===== APPLICATION STATE =====
let appData = null;
let selectedDay = null;
let editingIndex = null;

// ===== DATA PERSISTENCE =====
function createDefaultData() {
  const data = {
    weeks: {},
    checkins: {},
    createdAt: new Date().toISOString(),
  };
  // Pre-populate current week with sensible defaults
  const wk = getCurrentWeekKey();
  data.weeks[wk] = {};
  DAY_KEYS.forEach((day, i) => {
    if (i < 5) {
      data.weeks[wk][day] = [
        { name: '深蹲',     ...DEFAULT_EXERCISES['深蹲'] },
        { name: '臀桥',     ...DEFAULT_EXERCISES['臀桥'] },
        { name: '平板支撑', ...DEFAULT_EXERCISES['平板支撑'] },
      ];
    } else {
      data.weeks[wk][day] = [
        { name: '拉伸放松', ...DEFAULT_EXERCISES['拉伸放松'] },
      ];
    }
  });
  return data;
}

function loadData() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed.weeks && parsed.checkins) return parsed;
    }
  } catch (e) {
    console.warn('Failed to parse stored data, creating fresh data.', e);
  }
  return createDefaultData();
}

function persistData() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(appData));
  } catch (e) {
    console.error('Failed to save data to localStorage:', e);
  }
}

// ===== DATE HELPERS =====
function getCurrentWeekKey() {
  const now = new Date();
  const startOfYear = new Date(now.getFullYear(), 0, 1);
  const weekNum = Math.ceil(
    ((now - startOfYear) / 86400000 + startOfYear.getDay() + 1) / 7
  );
  return `${now.getFullYear()}-W${weekNum}`;
}

function getTodayKey() {
  const now = new Date();
  return formatDateKey(now);
}

function formatDateKey(date) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

/** Get the actual date key for a given day index (0=Monday) within the current week */
function getDateKeyForDayIndex(dayIndex) {
  const now = new Date();
  const currentDay = now.getDay(); // 0=Sun, 1=Mon, ...
  const mondayOffset = currentDay === 0 ? -6 : 1 - currentDay;
  const monday = new Date(now);
  monday.setDate(now.getDate() + mondayOffset);
  const target = new Date(monday);
  target.setDate(monday.getDate() + dayIndex);
  return formatDateKey(target);
}

function getDateKeyForSelected() {
  return getDateKeyForDayIndex(DAY_KEYS.indexOf(selectedDay));
}

function getTodayDayIndex() {
  const dow = new Date().getDay();
  return dow === 0 ? 6 : dow - 1;
}

/** Get the workouts for the current week, initializing if needed */
function getWeekExercises() {
  const wk = getCurrentWeekKey();
  if (!appData.weeks[wk]) {
    appData.weeks[wk] = {};
  }
  return appData.weeks[wk];
}

// ===== UTILITY =====
function escapeHtml(str) {
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}

function parseVideoEmbed(url) {
  if (!url || !url.trim()) return '';

  const u = url.trim();

  // Already an iframe
  if (/<iframe/i.test(u)) return u;

  // YouTube watch / embed / short
  let m = u.match(
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/|youtube\.com\/shorts\/)([a-zA-Z0-9_-]{11})/
  );
  if (m) {
    return `<iframe src="https://www.youtube.com/embed/${m[1]}"
      title="YouTube video" allowfullscreen
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
      loading="lazy"></iframe>`;
  }

  // Bilibili BV号
  m = u.match(/bilibili\.com\/video\/(BV[a-zA-Z0-9]+)/);
  if (m) {
    return `<iframe src="https://player.bilibili.com/player.html?bvid=${m[1]}&page=1&high_quality=1"
      title="Bilibili video" allowfullscreen loading="lazy"></iframe>`;
  }

  // Bilibili av号
  m = u.match(/bilibili\.com\/video\/av(\d+)/);
  if (m) {
    return `<iframe src="https://player.bilibili.com/player.html?aid=${m[1]}&page=1&high_quality=1"
      title="Bilibili video" allowfullscreen loading="lazy"></iframe>`;
  }

  // Generic URL — show as link
  return `<div style="text-align:center;padding:16px;color:var(--text-muted);">
    🔗 <a href="${escapeHtml(u)}" target="_blank" rel="noopener"
      style="color:var(--primary);font-weight:600;">点击打开教学视频</a>
  </div>`;
}

// ===== RENDER: WEEK GRID =====
function renderWeekGrid() {
  const grid = document.getElementById('weekGrid');
  const todayIdx = getTodayDayIndex();
  const weekData = getWeekExercises();

  grid.innerHTML = DAY_KEYS
    .map((key, i) => {
      const exercises = weekData[key] || [];
      const count = exercises.length;
      const dateKey = getDateKeyForDayIndex(i);
      const checked = !!appData.checkins[dateKey];

      let cls = 'day-chip';
      if (key === selectedDay) cls += ' active';
      if (i === todayIdx) cls += ' today';
      if (checked) cls += ' checked';

      return `
        <div class="${cls}" onclick="selectDay('${key}')" title="${DAY_NAMES[i]} — ${count}个动作${checked ? ' (已打卡)' : ''}">
          <span class="day-name">${DAY_NAMES[i]}</span>
          <span class="day-num">${count || '—'}</span>
          <span style="font-size:0.62rem;color:var(--text-muted);">${count ? count + '个动作' : '休息日'}</span>
        </div>`;
    })
    .join('');
}

// ===== RENDER: DAY PANEL =====
function renderDayPanel() {
  const weekData = getWeekExercises();
  const exercises = weekData[selectedDay] || [];
  const dayName = DAY_NAMES[DAY_KEYS.indexOf(selectedDay)];
  const dateKey = getDateKeyForSelected();
  const checked = !!appData.checkins[dateKey];

  // Header
  document.getElementById('dayPanelTitle').textContent = `${dayName} · 训练计划`;

  const btn = document.getElementById('btnCheckin');
  if (checked) {
    btn.textContent = '✅ 已打卡';
    btn.className = 'btn btn-sm btn-checked';
  } else {
    btn.textContent = '✅ 打卡';
    btn.className = 'btn btn-success btn-sm';
  }

  // Exercise list
  const list = document.getElementById('exerciseList');
  if (exercises.length === 0) {
    list.innerHTML = `
      <div class="empty-state">
        <span class="emoji">🏖️</span>
        <p>今天是休息日~</p>
        <p style="font-size:0.8rem;color:var(--text-muted);">点击上方「+ 添加动作」安排训练</p>
      </div>`;
    return;
  }

  list.innerHTML = exercises
    .map((ex, idx) => {
      const cfg = TYPE_CONFIG[ex.type] || TYPE_CONFIG.strength;
      const videoHtml = ex.video
        ? `<div class="detail-block">
            <div class="detail-label">🎬 教学视频</div>
            <div class="video-wrapper">${parseVideoEmbed(ex.video)}</div>
          </div>`
        : `<div class="detail-block">
            <div class="detail-label">🎬 教学视频</div>
            <div class="video-wrapper">
              <div class="video-placeholder">
                <span class="play-icon">📹</span>
                <span>暂无视频，可点击下方编辑添加</span>
              </div>
            </div>
          </div>`;

      return `
        <div class="exercise-card" id="ex-card-${idx}">
          <div class="exercise-card-header" onclick="toggleExercise(${idx})">
            <div class="exercise-icon" style="background:${cfg.color};">${cfg.icon}</div>
            <div class="exercise-info">
              <div class="name">${escapeHtml(ex.name)}</div>
              <div class="meta">${ex.sets}组 × ${escapeHtml(ex.reps)}</div>
            </div>
            <span class="exercise-arrow">▼</span>
          </div>
          <div class="exercise-card-body">
            <div class="detail-block">
              <div class="detail-label">📐 训练量</div>
              <div class="sets-reps">
                <span class="sr-chip">${ex.sets} 组</span>
                <span class="sr-chip">${escapeHtml(ex.reps)}</span>
                <span class="sr-chip">${cfg.icon} ${cfg.label}</span>
              </div>
            </div>
            <div class="detail-block">
              <div class="detail-label">📖 动作详解</div>
              <div class="detail-text">${(ex.desc || '暂无详细讲解').replace(/\n/g, '<br>')}</div>
            </div>
            ${videoHtml}
            <div style="display:flex;gap:8px;margin-top:10px;">
              <button class="btn btn-outline btn-sm" onclick="event.stopPropagation();openEditModal(${idx})">✏️ 编辑</button>
              <button class="btn btn-danger btn-sm" onclick="event.stopPropagation();deleteExercise(${idx})">🗑️ 删除</button>
            </div>
          </div>
        </div>`;
    })
    .join('');
}

// ===== RENDER: STATS =====
function renderStats() {
  // Weekly completion
  let weekChecked = 0;
  for (let i = 0; i < 7; i++) {
    if (appData.checkins[getDateKeyForDayIndex(i)]) weekChecked++;
  }

  // Total checkins
  const total = Object.keys(appData.checkins).length;

  // Streak
  let streak = 0;
  const now = new Date();
  for (let i = 0; i < 365; i++) {
    const d = new Date(now);
    d.setDate(d.getDate() - i);
    if (appData.checkins[formatDateKey(d)]) streak++;
    else break;
  }

  document.getElementById('stat-streak').textContent = streak;
  document.getElementById('stat-week').textContent = `${weekChecked}/7`;
  document.getElementById('stat-total').textContent = total;
}

// ===== RENDER: PROGRESS TAB =====
function renderProgress() {
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth() + 1;
  const daysInMonth = new Date(year, month, 0).getDate();

  let checkedThisMonth = 0;
  const historyItems = [];

  const allDates = Object.keys(appData.checkins).sort().reverse();

  for (const dk of allDates) {
    const [y, m] = dk.split('-').map(Number);
    if (y === year && m === month) checkedThisMonth++;
    if (historyItems.length < 40) {
      historyItems.push(dk);
    }
  }

  // Month progress bar
  const rate = Math.round((checkedThisMonth / daysInMonth) * 100);
  document.getElementById('monthRate').textContent = rate + '%';
  document.getElementById('monthProgress').style.width = rate + '%';
  document.getElementById('monthDetail').textContent =
    `已完成 ${checkedThisMonth} 天 / 共 ${daysInMonth} 天`;

  // History list
  const histList = document.getElementById('historyList');
  if (historyItems.length === 0) {
    histList.innerHTML = `
      <div class="empty-state">
        <span class="emoji">🏃‍♀️</span>
        <p>还没有打卡记录</p>
        <p style="font-size:0.8rem;color:var(--text-muted);">开始你的第一次训练吧！</p>
      </div>`;
    return;
  }

  const dayNames = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'];
  histList.innerHTML = historyItems
    .map((dk) => {
      const [y, m, d] = dk.split('-').map(Number);
      const date = new Date(y, m - 1, d);
      const dn = dayNames[date.getDay()];
      return `
        <div class="history-item">
          <div class="history-date">${m}/${d}<br><small>${dn}</small></div>
          <div class="history-exercises">✨ 完成当日训练计划</div>
          <span class="history-badge">✅ 已打卡</span>
        </div>`;
    })
    .join('');
}

// ===== RENDER: HEADER =====
function renderHeader() {
  const now = new Date();
  const startOfYear = new Date(now.getFullYear(), 0, 1);
  const weekNum = Math.ceil(
    ((now - startOfYear) / 86400000 + startOfYear.getDay() + 1) / 7
  );
  document.getElementById('headerDate').textContent =
    `${now.getFullYear()}年${now.getMonth() + 1}月 · 第${weekNum}周`;
}

// ===== RENDER: ALL =====
function renderAll() {
  renderHeader();
  renderWeekGrid();
  renderDayPanel();
  renderStats();
}

// ===== INTERACTIONS =====
function switchTab(tab) {
  document.querySelectorAll('.tab').forEach((t) => t.classList.remove('active'));
  const targetTab = Array.from(document.querySelectorAll('.tab')).find((t) =>
    t.textContent.includes(tab === 'plan' ? '训练计划' : '打卡记录')
  );
  if (targetTab) targetTab.classList.add('active');

  document.getElementById('tab-plan').style.display = tab === 'plan' ? 'block' : 'none';
  document.getElementById('tab-progress').style.display =
    tab === 'progress' ? 'block' : 'none';

  if (tab === 'progress') {
    renderProgress();
  }
}

function selectDay(dayKey) {
  if (selectedDay === dayKey) return;
  selectedDay = dayKey;
  renderAll();
}

function toggleExercise(idx) {
  const card = document.getElementById('ex-card-' + idx);
  if (!card) return;

  // Collapse all other cards
  document.querySelectorAll('.exercise-card.expanded').forEach((c) => {
    if (c !== card) c.classList.remove('expanded');
  });

  card.classList.toggle('expanded');
}

// ===== MODAL =====
function openAddModal() {
  editingIndex = null;
  document.getElementById('modalTitle').textContent = '添加运动动作';
  resetModalForm();
  document.getElementById('modalOverlay').style.display = 'flex';
  setTimeout(() => document.getElementById('exName').focus(), 100);
}

function openEditModal(idx) {
  const exercises = getWeekExercises()[selectedDay] || [];
  const ex = exercises[idx];
  if (!ex) return;

  editingIndex = idx;
  document.getElementById('modalTitle').textContent = '编辑运动动作';
  document.getElementById('exName').value = ex.name || '';
  document.getElementById('exType').value = ex.type || 'strength';
  document.getElementById('exSets').value = ex.sets || 3;
  document.getElementById('exReps').value = ex.reps || '';
  document.getElementById('exDesc').value = ex.desc || '';
  document.getElementById('exVideo').value = ex.video || '';
  document.getElementById('modalOverlay').style.display = 'flex';
}

function resetModalForm() {
  document.getElementById('exName').value = '';
  document.getElementById('exType').value = 'strength';
  document.getElementById('exSets').value = 3;
  document.getElementById('exReps').value = '12次';
  document.getElementById('exDesc').value = '';
  document.getElementById('exVideo').value = '';
}

function closeModal(e) {
  // Called from overlay click or cancel button
  if (e && e.target !== document.getElementById('modalOverlay')) return;
  document.getElementById('modalOverlay').style.display = 'none';
  editingIndex = null;
}

function saveExercise() {
  const name = document.getElementById('exName').value.trim();
  if (!name) {
    document.getElementById('exName').focus();
    document.getElementById('exName').style.borderColor = '#e85d75';
    setTimeout(() => {
      document.getElementById('exName').style.borderColor = '';
    }, 1500);
    return;
  }

  const exercise = {
    name: name,
    type: document.getElementById('exType').value,
    sets: Math.max(1, parseInt(document.getElementById('exSets').value) || 3),
    reps: document.getElementById('exReps').value.trim() || '12次',
    desc: document.getElementById('exDesc').value.trim(),
    video: document.getElementById('exVideo').value.trim(),
  };

  const weekData = getWeekExercises();
  if (!weekData[selectedDay]) weekData[selectedDay] = [];

  if (editingIndex !== null) {
    weekData[selectedDay][editingIndex] = exercise;
  } else {
    weekData[selectedDay].push(exercise);
  }

  persistData();
  closeModal();
  renderAll();
}

function deleteExercise(idx) {
  if (!confirm('确定要删除这个动作吗？此操作不可恢复。')) return;

  const weekData = getWeekExercises();
  if (!weekData[selectedDay]) return;

  weekData[selectedDay].splice(idx, 1);
  persistData();
  renderAll();
}

// ===== CHECK-IN =====
function checkinDay() {
  const dateKey = getDateKeyForSelected();
  const exercises = getWeekExercises()[selectedDay] || [];

  if (exercises.length === 0) {
    alert('今天没有训练计划，休息也是训练的一部分哦~ 🏖️');
    return;
  }

  if (appData.checkins[dateKey]) {
    if (confirm('今天已经打卡过了，要取消打卡吗？')) {
      delete appData.checkins[dateKey];
      persistData();
      renderAll();
    }
    return;
  }

  const dayName = DAY_NAMES[DAY_KEYS.indexOf(selectedDay)];
  if (
    confirm(
      `🏆 确认完成「${dayName}」的训练？\n\n📋 ${exercises.length} 个动作等着你\n💪 加油！坚持就是胜利！`
    )
  ) {
    appData.checkins[dateKey] = true;
    persistData();
    renderAll();
  }
}

// ===== RESET =====
function resetWeek() {
  if (!confirm('确定要重置本周所有训练计划吗？\n\n⚠️ 打卡记录不会清除，但训练安排会恢复为默认。')) return;

  const wk = getCurrentWeekKey();
  appData.weeks[wk] = {};
  DAY_KEYS.forEach((day, i) => {
    if (i < 5) {
      appData.weeks[wk][day] = [
        { name: '深蹲', ...DEFAULT_EXERCISES['深蹲'] },
        { name: '臀桥', ...DEFAULT_EXERCISES['臀桥'] },
        { name: '平板支撑', ...DEFAULT_EXERCISES['平板支撑'] },
      ];
    } else {
      appData.weeks[wk][day] = [
        { name: '拉伸放松', ...DEFAULT_EXERCISES['拉伸放松'] },
      ];
    }
  });
  persistData();
  renderAll();
}

// ===== KEYBOARD SHORTCUTS =====
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    const overlay = document.getElementById('modalOverlay');
    if (overlay.style.display === 'flex') {
      overlay.style.display = 'none';
      editingIndex = null;
    }
  }
});

// ===== SERVICE WORKER REGISTRATION (PWA-like offline support) =====
// For full PWA, a service worker and manifest.json would be needed.
// This is a simple cache-awareness placeholder.

// ===== BOOTSTRAP =====
(function init() {
  appData = loadData();
  selectedDay = DAY_KEYS[getTodayDayIndex()];
  renderAll();
  console.log('💪 小可爱的运动计划 已就绪！');
})();
