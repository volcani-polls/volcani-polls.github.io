import { db } from "./firebase-init.js";
import { get, ref } from "https://www.gstatic.com/firebasejs/10.12.5/firebase-database.js";
import { $, escapeHtml, isAdminUser, orderedEntries, requireLogin, wireLogoutButtons } from "./utils.js";
import { t } from "./i18n.js";

const user = await requireLogin();
wireLogoutButtons();

const list = $("#lecturesList");
const adminLink = $("#adminLink");
const userEmail = $("#userEmail");

if (userEmail) {
  const emailPrefix = user?.email ? user.email.split("@")[0] : "";
  userEmail.textContent = emailPrefix;
}

if (await isAdminUser(user).catch(() => false)) {
  adminLink.hidden = false;
}

async function renderLectures() {
  list.innerHTML = `
    <div class="spinner-container">
      <div class="spinner"></div>
      <p class="spinner-text">${t("loading_lectures")}</p>
    </div>
  `;
  const lecturesSnap = await get(ref(db, "lectures"));
  const lectures = lecturesSnap.val() || {};

  const rows = [];
  for (const [lectureId, lecture] of orderedEntries(lectures)) {
    const voteSnap = await get(ref(db, `votes/${lectureId}/${user.uid}`)).catch(() => null);
    const hasVoted = voteSnap?.exists() === true;
    const isOpen = lecture.isOpen === true;
    const canView = isOpen || hasVoted; // Can view if open OR if already voted
    const href = canView ? `survey.html?id=${encodeURIComponent(lectureId)}` : "#";
    
    let statusBadge = "";
    if (hasVoted) {
      statusBadge = `<span class="badge open"><i class="fa-solid fa-circle-check"></i> ${t("voted_status_check")}</span>`;
    } else if (isOpen) {
      statusBadge = `<span class="badge open"><i class="fa-solid fa-lock-open"></i> ${t("open")}</span>`;
    } else {
      statusBadge = `<span class="badge closed"><i class="fa-solid fa-lock"></i> ${t("closed")}</span>`;
    }

    rows.push(`
      <a class="lecture-row ${!isOpen ? "closed" : ""} ${hasVoted ? "voted" : ""}" href="${href}" ${!canView ? 'style="cursor: not-allowed; pointer-events: none;"' : ''}>
        <div class="lecture-main">
          <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 8px;">
            <strong style="font-size: 18px;">${escapeHtml(lecture.title)}</strong>
            ${statusBadge}
          </div>
          <div><i class="fa-solid fa-user-tie"></i> <strong>${t("lecture_author_label")}:</strong> ${escapeHtml(lecture.author)}</div>
          ${!isOpen && !hasVoted ? `<small class="muted"><i class="fa-solid fa-info-circle"></i> ${t("survey_closed_status")}</small>` : ""}
          ${hasVoted ? `<small class="success-text"><i class="fa-solid fa-eye"></i> ${t("view_your_vote")}</small>` : ""}
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
}

renderLectures().catch((err) => {
  console.error(err);
  list.innerHTML = `<div class="message error">${t("lectures_load_error")}</div>`;
});
