import { db } from "./firebase-init.js";
import { get, ref } from "https://www.gstatic.com/firebasejs/10.12.5/firebase-database.js";
import { $, calculateResults, escapeHtml, getQueryParam, orderedEntries, requireAdmin, wireLogoutButtons } from "./utils.js";

await requireAdmin();
wireLogoutButtons();

const lectureId = getQueryParam("id");
const titleEl = $("#lectureTitle");
const metaEl = $("#lectureMeta");
const resultsBox = $("#resultsBox");

function fmt(num) {
  return num === null || num === undefined ? "אין נתונים" : Number(num).toFixed(2);
}

async function loadResults() {
  if (!lectureId) {
    resultsBox.innerHTML = `<div class="message error">חסר מזהה הרצאה.</div>`;
    return;
  }

  const [lectureSnap, votesSnap] = await Promise.all([
    get(ref(db, `lectures/${lectureId}`)),
    get(ref(db, `votes/${lectureId}`)).catch(() => null)
  ]);

  if (!lectureSnap.exists()) {
    resultsBox.innerHTML = `<div class="message error">ההרצאה לא נמצאה.</div>`;
    return;
  }

  const lecture = lectureSnap.val();
  const votes = votesSnap?.val() || {};
  const stats = calculateResults(lecture, votes);

  titleEl.textContent = lecture.title;
  metaEl.textContent = `מרצה: ${lecture.author} | מספר מצביעים: ${stats.votersCount}`;

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
      <div class="summary-card"><span>מספר מצביעים</span><strong>${stats.votersCount}</strong></div>
      <div class="summary-card"><span>מספר תשובות</span><strong>${stats.totalAnswers}</strong></div>
      <div class="summary-card"><span>ממוצע סופי</span><strong>${fmt(stats.finalAverage)}</strong></div>
    </div>
    <div class="table-wrap">
      <table class="results-table">
        <thead>
          <tr><th>#</th><th>שאלה</th><th>מספר מדרגים</th><th>ממוצע</th></tr>
        </thead>
        <tbody>${rows || `<tr><td colspan="4">אין נתונים להצגה.</td></tr>`}</tbody>
      </table>
    </div>
  `;
}

loadResults().catch((err) => {
  console.error(err);
  resultsBox.innerHTML = `<div class="message error">שגיאה בטעינת התוצאות.</div>`;
});
