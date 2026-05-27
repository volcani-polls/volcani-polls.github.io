import { db } from "./firebase-init.js";
import { get, ref } from "https://www.gstatic.com/firebasejs/10.12.5/firebase-database.js";
import { $, escapeHtml, isAdminUser, orderedEntries, requireLogin, wireLogoutButtons } from "./utils.js";

const user = await requireLogin();
wireLogoutButtons();

const list = $("#lecturesList");
const adminLink = $("#adminLink");
const userEmail = $("#userEmail");

if (userEmail) userEmail.textContent = user?.email || "";

if (await isAdminUser(user).catch(() => false)) {
  adminLink.hidden = false;
}

async function renderLectures() {
  list.innerHTML = `<div class="loading-box">טוען הרצאות...</div>`;
  const lecturesSnap = await get(ref(db, "lectures"));
  const lectures = lecturesSnap.val() || {};

  const rows = [];
  for (const [lectureId, lecture] of orderedEntries(lectures)) {
    const voteSnap = await get(ref(db, `votes/${lectureId}/${user.uid}`)).catch(() => null);
    const hasVoted = voteSnap?.exists() === true;
    const isOpen = lecture.isOpen === true;
    const disabled = !isOpen || hasVoted;
    const href = isOpen && !hasVoted ? `survey.html?id=${encodeURIComponent(lectureId)}` : "#";

    rows.push(`
      <a class="lecture-row ${!isOpen ? "closed" : ""} ${hasVoted ? "voted" : ""}" href="${href}" ${disabled ? "aria-disabled=\"true\"" : ""}>
        <div class="lecture-main">
          <div><strong>Title:</strong> ${escapeHtml(lecture.title)}</div>
          <div><strong>Author:</strong> ${escapeHtml(lecture.author)}</div>
          ${!isOpen ? `<small class="muted">הסקר עדיין סגור להצבעה</small>` : ""}
          ${hasVoted ? `<small class="success-text">כבר הצבעת בסקר זה</small>` : ""}
        </div>
        <div class="vote-status" title="סטטוס הצבעה">${hasVoted ? "✓" : ""}</div>
      </a>
    `);
  }

  if (!rows.length) {
    list.innerHTML = `<div class="empty-state">אין כרגע הרצאות להצגה.</div>`;
    return;
  }

  list.innerHTML = rows.join("");

  document.querySelectorAll(".lecture-row[aria-disabled='true']").forEach((row) => {
    row.addEventListener("click", (e) => e.preventDefault());
  });
}

renderLectures().catch((err) => {
  console.error(err);
  list.innerHTML = `<div class="message error">שגיאה בטעינת ההרצאות.</div>`;
});
