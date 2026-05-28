import { auth, db } from "./firebase-init.js";
import { onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.12.5/firebase-auth.js";
import { get, ref, update } from "https://www.gstatic.com/firebasejs/10.12.5/firebase-database.js";
import { t } from "./i18n.js";

export const ALLOWED_DOMAIN = "@volcani.agri.gov.il";
export const BOOTSTRAP_OWNER_EMAIL = "yehudah@volcani.agri.gov.il";

export function normalizeEmail(email) {
  return String(email || "").trim().toLowerCase();
}

export function isAllowedEmail(email) {
  return normalizeEmail(email).endsWith(ALLOWED_DOMAIN);
}

export function escapeHtml(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

export function $(selector) {
  return document.querySelector(selector);
}

export function getQueryParam(name) {
  return new URLSearchParams(window.location.search).get(name);
}

export function showMessage(elementOrSelector, message, type = "info") {
  const el = typeof elementOrSelector === "string" ? $(elementOrSelector) : elementOrSelector;
  if (!el) return;
  el.textContent = message || "";
  el.className = `message ${type}`;
  el.hidden = !message;
}

export function setLoading(button, isLoading, loadingText = "") {
  if (!button) return;
  const textToUse = loadingText || t("loading");
  if (isLoading) {
    button.dataset.originalText = button.textContent;
    button.textContent = textToUse;
    button.disabled = true;
  } else {
    button.textContent = button.dataset.originalText || button.textContent;
    button.disabled = false;
  }
}

export function waitForUser() {
  return new Promise((resolve) => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      unsubscribe();
      resolve(user);
    });
  });
}

export async function requireLogin() {
  const user = await waitForUser();
  if (!user) {
    window.location.href = "login.html";
    return null;
  }
  const email = normalizeEmail(user.email);
  if (!isAllowedEmail(email)) {
    await signOut(auth);
    window.location.href = "login.html?error=domain";
    return null;
  }
  return user;
}

export async function updateLastLogin(user) {
  if (!user) return;
  await update(ref(db, `users/${user.uid}`), {
    email: normalizeEmail(user.email),
    lastLoginAt: Date.now()
  });
}

export async function getOwnerEmail() {
  const snap = await get(ref(db, "config/ownerEmail"));
  return normalizeEmail(snap.val()) || BOOTSTRAP_OWNER_EMAIL;
}

export async function isAdminUser(user) {
  if (!user || !isAllowedEmail(user.email)) return false;
  const email = normalizeEmail(user.email);
  if (email === BOOTSTRAP_OWNER_EMAIL) return true;

  const ownerEmail = await getOwnerEmail().catch(() => "");
  if (ownerEmail && email === ownerEmail) return true;

  const adminCsvSnap = await get(ref(db, "config/adminEmailsCsv")).catch(() => null);
  const adminCsv = normalizeEmail(adminCsvSnap?.val?.() || "");
  if (adminCsv) {
    const adminEmails = adminCsv
      .split(",")
      .map((v) => normalizeEmail(v))
      .filter(Boolean);
    if (adminEmails.includes(email)) return true;
  }
  return false;
}

export async function requireAdmin() {
  const user = await requireLogin();
  if (!user) return null;
  const ok = await isAdminUser(user);
  if (!ok) {
    window.location.href = "voter.html";
    return null;
  }
  return user;
}

export async function logout() {
  await signOut(auth);
  window.location.href = "login.html";
}

export function wireLogoutButtons() {
  document.querySelectorAll("[data-logout]").forEach((btn) => {
    btn.addEventListener("click", async () => {
      await logout();
    });
  });
}

export function formatDate(timestamp) {
  if (!timestamp) return "";
  const lang = localStorage.getItem("lang") || "he";
  const locale = lang === "he" ? "he-IL" : "en-US";
  return new Intl.DateTimeFormat(locale, {
    dateStyle: "short",
    timeStyle: "short"
  }).format(new Date(timestamp));
}

export function orderedEntries(obj) {
  return Object.entries(obj || {}).sort(([, a], [, b]) => {
    const ao = Number(a?.order ?? 999999);
    const bo = Number(b?.order ?? 999999);
    if (ao !== bo) return ao - bo;
    return String(a?.title || a?.text || "").localeCompare(String(b?.title || b?.text || ""), "he");
  });
}

export function calculateResults(lecture, votes) {
  const questions = lecture?.questions || {};
  const questionStats = {};
  let totalSum = 0;
  let totalCount = 0;
  let votersCount = 0;

  Object.keys(questions).forEach((qid) => {
    questionStats[qid] = {
      text: questions[qid].text,
      order: questions[qid].order ?? 999999,
      sum: 0,
      count: 0,
      average: null,
      distribution: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 }
    };
  });

  Object.values(votes || {}).forEach((vote) => {
    if (!vote?.answers) return;
    votersCount++;
    Object.entries(vote.answers).forEach(([qid, value]) => {
      const score = Number(value);
      if (!questionStats[qid] || Number.isNaN(score)) return;
      questionStats[qid].sum += score;
      questionStats[qid].count += 1;
      questionStats[qid].distribution[score] = (questionStats[qid].distribution[score] || 0) + 1;
      totalSum += score;
      totalCount += 1;
    });
  });

  Object.values(questionStats).forEach((stat) => {
    stat.average = stat.count ? stat.sum / stat.count : null;
  });

  return {
    votersCount,
    totalAnswers: totalCount,
    finalAverage: totalCount ? totalSum / totalCount : null,
    questionStats
  };
}

export function ratingLabel(value) {
  if (value === 1) return t("rating_low");
  if (value === 5) return t("rating_high");
  return String(value);
}

// Toast notification system
let toastContainer = null;
let audioContext = null;
let audioUnlocked = false;

// Unlock audio on first user interaction (required for mobile browsers)
function unlockAudio() {
  if (audioUnlocked) return;
  
  // Create/resume AudioContext
  const ctx = getAudioContext();
  if (ctx && ctx.state === 'suspended') {
    ctx.resume().catch(() => {});
  }
  
  // Play a silent buffer to fully unlock audio on iOS Safari
  if (ctx) {
    try {
      const silentBuffer = ctx.createBuffer(1, 1, 22050);
      const source = ctx.createBufferSource();
      source.buffer = silentBuffer;
      source.connect(ctx.destination);
      source.start(0);
    } catch (e) {
      // Ignore errors from silent playback
    }
  }
  
  // Also warm up an HTML5 Audio element (fallback path)
  try {
    const silentAudio = new Audio("data:audio/wav;base64,UklGRiQAAABXQVZFZm10IBAAAAABAAEARKwAAIhYAQACABAAZGF0YQAAAAA=");
    silentAudio.volume = 0;
    silentAudio.play().then(() => silentAudio.pause()).catch(() => {});
  } catch (e) {
    // Ignore
  }
  
  audioUnlocked = true;
  console.log("Audio unlocked via user gesture");
  
  // Remove listeners after unlock
  ['touchstart', 'touchend', 'click', 'keydown'].forEach(evt => {
    document.removeEventListener(evt, unlockAudio, { capture: true });
  });
}

// Register unlock listeners as early as possible
['touchstart', 'touchend', 'click', 'keydown'].forEach(evt => {
  document.addEventListener(evt, unlockAudio, { capture: true, once: false, passive: true });
});

function getToastContainer() {
  if (!toastContainer) {
    toastContainer = document.createElement("div");
    toastContainer.className = "toast-container";
    document.body.appendChild(toastContainer);
  }
  return toastContainer;
}

function updateToastContainerClass() {
  if (!toastContainer) return;
  const hasToasts = toastContainer.querySelectorAll('.toast:not(.hide)').length > 0;
  if (hasToasts) {
    toastContainer.classList.add('has-toast');
  } else {
    toastContainer.classList.remove('has-toast');
  }
}

// Get or create audio context (reuse for better performance)
function getAudioContext() {
  if (!audioContext) {
    try {
      audioContext = new (window.AudioContext || window.webkitAudioContext)();
    } catch (err) {
      console.warn("Could not create AudioContext:", err);
      return null;
    }
  }
  
  // Resume context if suspended (browser autoplay policy)
  if (audioContext.state === 'suspended') {
    audioContext.resume().catch(err => console.warn("Could not resume AudioContext:", err));
  }
  
  return audioContext;
}

// Generate a WAV data URI for a simple tone sequence (fallback for when AudioContext fails)
function generateToneDataURI(frequencies, durations, volume = 0.4) {
  const sampleRate = 22050;
  let totalSamples = 0;
  for (const d of durations) totalSamples += Math.floor(sampleRate * d);
  
  const buffer = new ArrayBuffer(44 + totalSamples * 2);
  const view = new DataView(buffer);
  
  // WAV header
  const writeStr = (offset, str) => { for (let i = 0; i < str.length; i++) view.setUint8(offset + i, str.charCodeAt(i)); };
  writeStr(0, 'RIFF');
  view.setUint32(4, 36 + totalSamples * 2, true);
  writeStr(8, 'WAVE');
  writeStr(12, 'fmt ');
  view.setUint32(16, 16, true);
  view.setUint16(20, 1, true); // PCM
  view.setUint16(22, 1, true); // mono
  view.setUint32(24, sampleRate, true);
  view.setUint32(28, sampleRate * 2, true);
  view.setUint16(32, 2, true);
  view.setUint16(34, 16, true);
  writeStr(36, 'data');
  view.setUint32(40, totalSamples * 2, true);
  
  let offset = 44;
  for (let n = 0; n < frequencies.length; n++) {
    const freq = frequencies[n];
    const dur = durations[n];
    const samples = Math.floor(sampleRate * dur);
    for (let i = 0; i < samples; i++) {
      const t = i / sampleRate;
      const fadeOut = Math.max(0, 1 - (i / samples) * 1.5); // fade out envelope
      const sample = Math.sin(2 * Math.PI * freq * t) * volume * fadeOut;
      const intSample = Math.max(-32768, Math.min(32767, Math.floor(sample * 32767)));
      view.setInt16(offset, intSample, true);
      offset += 2;
    }
  }
  
  const bytes = new Uint8Array(buffer);
  let binary = '';
  for (let i = 0; i < bytes.length; i++) binary += String.fromCharCode(bytes[i]);
  return 'data:audio/wav;base64,' + btoa(binary);
}

// Cache generated audio data URIs
const audioCache = {};

function getAudioForType(type) {
  if (audioCache[type]) return audioCache[type];
  
  let frequencies, durations;
  if (type === "success") {
    frequencies = [523.25, 659.25, 783.99]; // C5, E5, G5 ascending
    durations = [0.08, 0.08, 0.24];
  } else if (type === "danger" || type === "error") {
    frequencies = [659.25, 523.25]; // E5, C5 descending
    durations = [0.12, 0.23];
  } else {
    frequencies = [523.25]; // C5 simple beep
    durations = [0.25];
  }
  
  audioCache[type] = generateToneDataURI(frequencies, durations);
  return audioCache[type];
}

// Play notification sound with multiple fallback strategies
function playNotificationSound(type) {
  let played = false;
  
  // Strategy 1: AudioContext oscillator (best quality)
  try {
    const ctx = getAudioContext();
    if (ctx && ctx.state === 'running') {
      const oscillator = ctx.createOscillator();
      const gainNode = ctx.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(ctx.destination);
      
      oscillator.type = 'sine';
      
      const now = ctx.currentTime;
      
      if (type === "success") {
        oscillator.frequency.setValueAtTime(523.25, now);
        oscillator.frequency.setValueAtTime(659.25, now + 0.08);
        oscillator.frequency.setValueAtTime(783.99, now + 0.16);
        
        gainNode.gain.setValueAtTime(0.4, now);
        gainNode.gain.setValueAtTime(0.4, now + 0.08);
        gainNode.gain.setValueAtTime(0.4, now + 0.16);
        gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.4);
        
        oscillator.start(now);
        oscillator.stop(now + 0.4);
      } else if (type === "danger" || type === "error") {
        oscillator.frequency.setValueAtTime(659.25, now);
        oscillator.frequency.setValueAtTime(523.25, now + 0.12);
        
        gainNode.gain.setValueAtTime(0.4, now);
        gainNode.gain.setValueAtTime(0.4, now + 0.12);
        gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.35);
        
        oscillator.start(now);
        oscillator.stop(now + 0.35);
      } else {
        oscillator.frequency.setValueAtTime(523.25, now);
        gainNode.gain.setValueAtTime(0.3, now);
        gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.25);
        oscillator.start(now);
        oscillator.stop(now + 0.25);
      }
      played = true;
    }
  } catch (err) {
    console.warn("AudioContext oscillator failed:", err);
  }
  
  // Strategy 2: HTML5 Audio element with generated WAV (fallback)
  if (!played) {
    try {
      const dataURI = getAudioForType(type);
      const audio = new Audio(dataURI);
      audio.volume = 0.5;
      audio.play().catch(err => {
        console.warn("HTML5 Audio fallback failed:", err);
      });
    } catch (err) {
      console.warn("Could not create fallback audio:", err);
    }
  }
  
  // Strategy 3: Vibration API for mobile (always try as additional feedback)
  try {
    if (navigator.vibrate) {
      if (type === "success") {
        navigator.vibrate([100, 50, 100, 50, 150]); // Ascending pattern
      } else if (type === "danger" || type === "error") {
        navigator.vibrate([200, 100, 300]); // Descending/urgent pattern
      } else {
        navigator.vibrate(150); // Simple buzz
      }
    }
  } catch (err) {
    // Vibration API not available, ignore
  }
}

export function showToast(options) {
  console.log("showToast called:", options, {
    lang: document.documentElement.lang,
    dir: document.documentElement.dir
  });
  
  const {
    title = "",
    message = "",
    type = "info", // success, info, warning, error, danger
    duration = 4000,
    icon = null,
    playSound = true
  } = options;

  const container = getToastContainer();
  
  // Remove any existing toasts first (only show one at a time)
  const existingToasts = container.querySelectorAll('.toast');
  existingToasts.forEach(t => {
    if (t.parentElement) {
      t.parentElement.removeChild(t);
    }
  });
  
  // Play sound if enabled
  if (playSound) {
    playNotificationSound(type);
  }
  
  // Create toast element
  const toast = document.createElement("div");
  toast.className = `toast ${type}`;
  
  // Determine icon - always use lock icons for poll status
  let iconHtml = "";
  if (icon) {
    iconHtml = icon;
  } else {
    switch (type) {
      case "success":
        iconHtml = '<i class="fa-solid fa-lock-open"></i>'; // Open lock for opened poll
        break;
      case "warning":
      case "danger":
        iconHtml = '<i class="fa-solid fa-lock"></i>'; // Closed lock for closed poll
        break;
      case "info":
        iconHtml = '<i class="fa-solid fa-circle-info"></i>';
        break;
      case "error":
        iconHtml = '<i class="fa-solid fa-circle-xmark"></i>';
        break;
      default:
        iconHtml = '<i class="fa-solid fa-bell"></i>';
    }
  }
  
  toast.innerHTML = `
    <div class="toast-header">
      <div class="toast-icon">${iconHtml}</div>
    </div>
    <div class="toast-content">
      ${title ? `<p class="toast-title">${escapeHtml(title)}</p>` : ""}
      ${message ? `<p class="toast-message">${escapeHtml(message)}</p>` : ""}
    </div>
    <button class="toast-close" aria-label="Close">
      <i class="fa-solid fa-xmark"></i>
    </button>
  `;
  
  container.appendChild(toast);
  updateToastContainerClass();
  
  // Close button handler
  const closeBtn = toast.querySelector(".toast-close");
  closeBtn.addEventListener("click", () => {
    removeToast(toast);
  });
  
  // Click backdrop to close
  const handleBackdropClick = (e) => {
    if (e.target === container) {
      removeToast(toast);
    }
  };
  container.addEventListener("click", handleBackdropClick);
  
  // Show toast with animation
  requestAnimationFrame(() => {
    toast.classList.add("show");
  });
  
  // Auto-hide after duration
  if (duration > 0) {
    setTimeout(() => {
      removeToast(toast);
    }, duration);
  }
  
  return toast;
}

function removeToast(toast) {
  toast.classList.remove("show");
  toast.classList.add("hide");
  
  setTimeout(() => {
    if (toast.parentElement) {
      toast.parentElement.removeChild(toast);
    }
    updateToastContainerClass();
  }, 300);
}
