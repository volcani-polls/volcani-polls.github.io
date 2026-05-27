import { db } from "./firebase-init.js";
import { get, ref } from "https://www.gstatic.com/firebasejs/10.12.5/firebase-database.js";
import { $, calculateResults, escapeHtml, getQueryParam, orderedEntries, requireAdmin, wireLogoutButtons } from "./utils.js";
import { t } from "./i18n.js";

await requireAdmin();
wireLogoutButtons();

const lectureId = getQueryParam("id");
const titleEl = $("#lectureTitle");
const metaEl = $("#lectureMeta");
const resultsBox = $("#resultsBox");

function fmt(num) {
  return num === null || num === undefined ? t("no_data") : Number(num).toFixed(2);
}

async function loadResults() {
  if (!lectureId) {
    resultsBox.innerHTML = `<div class="message error">${t("missing_poll_id")}</div>`;
    return;
  }

  resultsBox.innerHTML = `
    <div class="spinner-container">
      <div class="spinner"></div>
      <p class="spinner-text">${t("loading")}</p>
    </div>
  `;

  const [lectureSnap, votesSnap] = await Promise.all([
    get(ref(db, `lectures/${lectureId}`)),
    get(ref(db, `votes/${lectureId}`)).catch(() => null)
  ]);

  if (!lectureSnap.exists()) {
    resultsBox.innerHTML = `<div class="message error">${t("poll_not_found")}</div>`;
    return;
  }

  const lecture = lectureSnap.val();
  const votes = votesSnap?.val() || {};
  const stats = calculateResults(lecture, votes);

  titleEl.textContent = lecture.title;
  metaEl.textContent = `${t("lecturer")} ${lecture.author} | ${t("voters_count")}: ${stats.votersCount}`;

  const rows = orderedEntries(stats.questionStats).map(([qid, stat], idx) => `
    <tr>
      <td>${idx + 1}</td>
      <td>${escapeHtml(stat.text)}</td>
      <td>${stat.count}</td>
      <td>${fmt(stat.average)}</td>
    </tr>
  `).join("");

  resultsBox.innerHTML = `
    <div class="result-summary">
      <div class="summary-card"><span>${t("voters_count")}</span><strong>${stats.votersCount}</strong></div>
      <div class="summary-card"><span>${t("total_answers")}</span><strong>${stats.totalAnswers}</strong></div>
      <div class="summary-card"><span>${t("final_average")}</span><strong>${fmt(stats.finalAverage)}</strong></div>
    </div>
    <div class="table-wrap">
      <table class="results-table">
        <thead>
          <tr><th>#</th><th>${t("question_column")}</th><th>${t("voters_column")}</th><th>${t("average_column")}</th></tr>
        </thead>
        <tbody>${rows || `<tr><td colspan="4">${t("no_data_to_display")}</td></tr>`}</tbody>
      </table>
    </div>
  `;
}

loadResults().catch((err) => {
  console.error(err);
  resultsBox.innerHTML = `<div class="message error">${t("lectures_load_error")}</div>`;
});
