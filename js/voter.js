import { db } from "./firebase-init.js";
import { get, ref } from "https://www.gstatic.com/firebasejs/10.12.5/firebase-database.js";
import { $, escapeHtml, isAdminUser, orderedEntries, requireLogin, wireLogoutButtons } from "./utils.js";
import { t } from "./i18n.js";

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
  list.innerHTML = `<div class="loading-box">${t("loading_lectures")}</div>`;
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
          <div><strong>${t("lecture_title_label")}:</strong> ${escapeHtml(lecture.title)}</div>
          <div><strong>${t("lecture_author_label")}:</strong> ${escapeHtml(lecture.author)}</div>
          ${!isOpen ? `<small class="muted">${t("survey_closed_status")}</small>` : ""}
          ${hasVoted ? `<small class="success-text">${t("voted_status_check")}</small>` : ""}
        </div>
        <div class="vote-status" title="סטטוס הצבעה">${hasVoted ? "✓" : ""}</div>
      </a>
    `);
  }

  if (!rows.length) {
    list.innerHTML = `<div class="empty-state">${t("empty_state")}</div>`;
    return;
  }

  list.innerHTML = rows.join("");

  document.querySelectorAll(".lecture-row[aria-disabled='true']").forEach((row) => {
    row.addEventListener("click", (e) => e.preventDefault());
  });
}

renderLectures().catch((err) => {
  console.error(err);
  list.innerHTML = `<div class="message error">${t("lectures_load_error")}</div>`;
});
