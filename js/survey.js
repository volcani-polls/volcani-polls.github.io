import { db } from "./firebase-init.js";
import { get, ref, set } from "https://www.gstatic.com/firebasejs/10.12.5/firebase-database.js";
import { $, escapeHtml, getQueryParam, orderedEntries, ratingLabel, requireLogin, setLoading, showMessage, wireLogoutButtons } from "./utils.js";
import { t } from "./i18n.js";

const user = await requireLogin();
wireLogoutButtons();

const lectureId = getQueryParam("id");
const titleEl = $("#lectureTitle");
const metaEl = $("#lectureMeta");
const form = $("#surveyForm");
const message = $("#message");
const submitBtn = $("#submitVoteBtn");

if (!lectureId) {
  showMessage(message, t("missing_poll_id"), "error");
  form.hidden = true;
} else {
  await loadSurvey();
}

async function loadSurvey() {
  const [lectureSnap, voteSnap] = await Promise.all([
    get(ref(db, `lectures/${lectureId}`)),
    get(ref(db, `votes/${lectureId}/${user.uid}`)).catch(() => null)
  ]);

  if (!lectureSnap.exists()) {
    showMessage(message, t("poll_not_found"), "error");
    form.hidden = true;
    return;
  }

  const lecture = lectureSnap.val();
  titleEl.textContent = lecture.title || t("nav_voter");
  metaEl.textContent = `${t("lecturer")} ${lecture.author || ""}`;

  if (lecture.isOpen !== true) {
    showMessage(message, t("survey_closed_status"), "info");
    form.hidden = true;
    return;
  }

  if (voteSnap?.exists()) {
    showMessage(message, t("survey_voted_success"), "success");
    form.hidden = true;
    return;
  }

  const questions = orderedEntries(lecture.questions || {});
  if (!questions.length) {
    showMessage(message, t("no_questions_in_survey"), "info");
    form.hidden = true;
    return;
  }

  form.innerHTML = questions.map(([qid, q], index) => `
    <div class="question-card" data-question-id="${escapeHtml(qid)}">
      <p class="question-text"><span class="question-num">${index + 1}</span><span class="question-content">${escapeHtml(q.text)}</span></p>
      <div class="rating-scale-labels">
        <span>👎 ${t("rating_scale_low")}</span>
        <span>${t("rating_scale_high")} 👍</span>
      </div>
      <div class="rating-grid" role="radiogroup" aria-label="${escapeHtml(q.text)}">
        ${[1, 2, 3, 4, 5].map((value) => `
          <label class="rating-option">
            <input type="radio" name="q_${escapeHtml(qid)}" value="${value}" required>
            <span>${value}</span>
          </label>
        `).join("")}
      </div>
    </div>
  `).join("") + `
    <button id="submitVoteBtn" class="btn primary full" type="submit">${t("send_vote")}</button>
  `;

  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    await submitVote(questions);
  });
}

async function submitVote(questions) {
  const answers = {};
  for (const [qid] of questions) {
    const selected = document.querySelector(`input[name="q_${CSS.escape(qid)}"]:checked`);
    if (!selected) {
      showMessage(message, t("answer_all_questions_error"), "error");
      return;
    }
    answers[qid] = Number(selected.value);
  }

  try {
    const btn = $("#submitVoteBtn");
    setLoading(btn, true, t("sending"));
    await set(ref(db, `votes/${lectureId}/${user.uid}`), {
      createdAt: Date.now(),
      answers
    });
    showMessage(message, t("vote_saved_success"), "success");
    setTimeout(() => window.location.href = "voter.html", 900);
  } catch (err) {
    console.error(err);
    showMessage(message, t("vote_save_failed"), "error");
  } finally {
    const btn = $("#submitVoteBtn");
    setLoading(btn, false);
  }
}
