import { db } from "./firebase-init.js";
import { get, ref } from "https://www.gstatic.com/firebasejs/10.12.5/firebase-database.js";
import { $, calculateResults, escapeHtml, orderedEntries, requireAdmin, wireLogoutButtons } from "./utils.js";
import { t } from "./i18n.js";

await requireAdmin();
wireLogoutButtons();

const compareBox = $("#compareBox");

function fmt(num) {
  return num === null || num === undefined ? t("no_data") : Number(num).toFixed(2);
}

function triggerConfetti() {
  const duration = 3000;
  const animationEnd = Date.now() + duration;
  const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 10000 };

  function randomInRange(min, max) {
    return Math.random() * (max - min) + min;
  }

  const interval = setInterval(function() {
    const timeLeft = animationEnd - Date.now();

    if (timeLeft <= 0) {
      return clearInterval(interval);
    }

    const particleCount = 50 * (timeLeft / duration);
    
    confetti({
      ...defaults,
      particleCount,
      origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 }
    });
    confetti({
      ...defaults,
      particleCount,
      origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 }
    });
  }, 250);
}

async function loadComparison() {
  compareBox.innerHTML = `
    <div class="spinner-container">
      <div class="spinner"></div>
      <p class="spinner-text">${t("loading")}</p>
    </div>
  `;

  const lecturesSnap = await get(ref(db, "lectures"));
  const lectures = lecturesSnap.val() || {};

  if (!Object.keys(lectures).length) {
    compareBox.innerHTML = `<div class="empty-state">${t("no_lectures_admin")}</div>`;
    return;
  }

  // Calculate results for each lecture
  const lectureResults = [];
  
  for (const [lectureId, lecture] of Object.entries(lectures)) {
    const votesSnap = await get(ref(db, `votes/${lectureId}`)).catch(() => null);
    const votes = votesSnap?.val() || {};
    const stats = calculateResults(lecture, votes);
    
    lectureResults.push({
      id: lectureId,
      title: lecture.title,
      author: lecture.author,
      average: stats.finalAverage || 0,
      votersCount: stats.votersCount,
      totalAnswers: stats.totalAnswers
    });
  }

  // Sort by average (descending)
  lectureResults.sort((a, b) => b.average - a.average);

  // Create ranking cards
  const cards = lectureResults.map((lecture, index) => {
    const rank = index + 1;
    const isWinner = rank === 1 && lecture.average > 0;
    const medal = rank === 1 ? '🥇' : rank === 2 ? '🥈' : rank === 3 ? '🥉' : '';
    
    return `
      <div class="ranking-card ${isWinner ? 'winner' : ''} ${rank <= 3 ? 'top-three' : ''}" data-rank="${rank}">
        <div class="ranking-position">
          <div class="rank-number">${rank}</div>
          ${medal ? `<div class="medal">${medal}</div>` : ''}
        </div>
        <div class="ranking-content">
          <div class="ranking-header">
            <h3>${escapeHtml(lecture.title)}</h3>
            ${isWinner ? '<i class="fa-solid fa-trophy trophy-icon"></i>' : ''}
          </div>
          <p class="ranking-author"><i class="fa-solid fa-user-tie"></i> ${escapeHtml(lecture.author)}</p>
          <div class="ranking-stats">
            <div class="stat-item">
              <i class="fa-solid fa-star"></i>
              <strong>${fmt(lecture.average)}</strong>
              <span>${t("average_column")}</span>
            </div>
            <div class="stat-item">
              <i class="fa-solid fa-users"></i>
              <strong>${lecture.votersCount}</strong>
              <span>${t("voters_count")}</span>
            </div>
            <div class="stat-item">
              <i class="fa-solid fa-chart-simple"></i>
              <strong>${lecture.totalAnswers}</strong>
              <span>${t("total_answers")}</span>
            </div>
          </div>
        </div>
        <a href="admin-results.html?id=${encodeURIComponent(lecture.id)}" class="btn small" data-i18n="nav_results">
          <i class="fa-solid fa-chart-line"></i> ${t("view_details") || "צפה בפרטים"}
        </a>
      </div>
    `;
  }).join("");

  compareBox.innerHTML = `
    <div class="panel">
      <div class="comparison-summary">
        <div class="summary-card">
          <span><i class="fa-solid fa-presentation"></i> ${t("total_lectures") || "סה\"כ הרצאות"}</span>
          <strong>${lectureResults.length}</strong>
        </div>
        <div class="summary-card">
          <span><i class="fa-solid fa-users"></i> ${t("total_voters") || "סה\"כ מצביעים"}</span>
          <strong>${lectureResults.reduce((sum, l) => sum + l.votersCount, 0)}</strong>
        </div>
        <div class="summary-card">
          <span><i class="fa-solid fa-star"></i> ${t("highest_rating") || "דירוג הגבוה ביותר"}</span>
          <strong style="color: var(--primary);">${fmt(lectureResults[0]?.average || 0)}</strong>
        </div>
      </div>
    </div>
    
    <div class="ranking-list">
      ${cards}
    </div>
  `;

  // Trigger confetti for the winner
  if (lectureResults.length > 0 && lectureResults[0].average > 0) {
    setTimeout(() => {
      triggerConfetti();
    }, 500);
  }
}

loadComparison().catch((err) => {
  console.error(err);
  compareBox.innerHTML = `<div class="message error">${t("lectures_load_error")}</div>`;
});
