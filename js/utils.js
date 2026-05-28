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

function getToastContainer() {
  if (!toastContainer) {
    toastContainer = document.createElement("div");
    toastContainer.className = "toast-container";
    document.body.appendChild(toastContainer);
  }
  return toastContainer;
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

// Play notification sound
function playNotificationSound(type) {
  try {
    const ctx = getAudioContext();
    if (!ctx) return;
    
    const oscillator = ctx.createOscillator();
    const gainNode = ctx.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(ctx.destination);
    
    oscillator.type = 'sine'; // Smooth sine wave
    
    const now = ctx.currentTime;
    
    // Different sounds for different types
    if (type === "success") {
      // Happy ascending tone for poll opened (3 notes going up)
      oscillator.frequency.setValueAtTime(523.25, now); // C5
      oscillator.frequency.setValueAtTime(659.25, now + 0.08); // E5
      oscillator.frequency.setValueAtTime(783.99, now + 0.16); // G5
      
      gainNode.gain.setValueAtTime(0.4, now);
      gainNode.gain.setValueAtTime(0.4, now + 0.08);
      gainNode.gain.setValueAtTime(0.4, now + 0.16);
      gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.4);
      
      oscillator.start(now);
      oscillator.stop(now + 0.4);
    } else if (type === "danger" || type === "error") {
      // Alert descending tone for poll closed (2 notes going down)
      oscillator.frequency.setValueAtTime(659.25, now); // E5
      oscillator.frequency.setValueAtTime(523.25, now + 0.12); // C5
      
      gainNode.gain.setValueAtTime(0.4, now);
      gainNode.gain.setValueAtTime(0.4, now + 0.12);
      gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.35);
      
      oscillator.start(now);
      oscillator.stop(now + 0.35);
    } else {
      // Simple beep for other notifications
      oscillator.frequency.setValueAtTime(523.25, now); // C5
      gainNode.gain.setValueAtTime(0.3, now);
      gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.25);
      oscillator.start(now);
      oscillator.stop(now + 0.25);
    }
  } catch (err) {
    console.warn("Could not play notification sound:", err);
  }
}

export function showToast(options) {
  const {
    title = "",
    message = "",
    type = "info", // success, info, warning, error, danger
    duration = 4000,
    icon = null,
    playSound = true
  } = options;

  const container = getToastContainer();
  
  // Play sound if enabled
  if (playSound) {
    playNotificationSound(type);
  }
  
  // Create toast element
  const toast = document.createElement("div");
  toast.className = `toast ${type}`;
  
  // Determine icon
  let iconHtml = "";
  if (icon) {
    iconHtml = icon;
  } else {
    switch (type) {
      case "success":
        iconHtml = '<i class="fa-solid fa-circle-check"></i>';
        break;
      case "info":
        iconHtml = '<i class="fa-solid fa-circle-info"></i>';
        break;
      case "warning":
        iconHtml = '<i class="fa-solid fa-triangle-exclamation"></i>';
        break;
      case "error":
      case "danger":
        iconHtml = '<i class="fa-solid fa-circle-xmark"></i>';
        break;
      default:
        iconHtml = '<i class="fa-solid fa-bell"></i>';
    }
  }
  
  toast.innerHTML = `
    <div class="toast-icon">${iconHtml}</div>
    <div class="toast-content">
      ${title ? `<p class="toast-title">${escapeHtml(title)}</p>` : ""}
      ${message ? `<p class="toast-message">${escapeHtml(message)}</p>` : ""}
    </div>
    <button class="toast-close" aria-label="Close">
      <i class="fa-solid fa-xmark"></i>
    </button>
  `;
  
  container.appendChild(toast);
  
  // Close button handler
  const closeBtn = toast.querySelector(".toast-close");
  closeBtn.addEventListener("click", () => {
    removeToast(toast);
  });
  
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
  }, 400);
}
