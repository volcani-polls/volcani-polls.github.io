import { db } from "./firebase-init.js";
import { get, ref, set } from "https://www.gstatic.com/firebasejs/10.12.5/firebase-database.js";
import { $, escapeHtml, getQueryParam, orderedEntries, ratingLabel, requireLogin, setLoading, showMessage, wireLogoutButtons } from "./utils.js";

const user = await requireLogin();
wireLogoutButtons();

const lectureId = getQueryParam("id");
const titleEl = $("#lectureTitle");
const metaEl = $("#lectureMeta");
const form = $("#surveyForm");
const message = $("#message");
const submitBtn = $("#submitVoteBtn");

if (!lectureId) {
  showMessage(message, "חסר מזהה סקר.", "error");
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
    showMessage(message, "הסקר לא נמצא.", "error");
    form.hidden = true;
    return;
  }

  const lecture = lectureSnap.val();
  titleEl.textContent = lecture.title || "סקר";
  metaEl.textContent = `מרצה: ${lecture.author || ""}`;

  if (lecture.isOpen !== true) {
    showMessage(message, "הסקר עדיין סגור להצבעה.", "info");
    form.hidden = true;
    return;
  }

  if (voteSnap?.exists()) {
    showMessage(message, "כבר הצבעת בסקר זה. תודה!", "success");
    form.hidden = true;
    return;
  }

  const questions = orderedEntries(lecture.questions || {});
  if (!questions.length) {
    showMessage(message, "בסקר זה עדיין אין שאלות.", "info");
    form.hidden = true;
    return;
  }

  form.innerHTML = questions.map(([qid, q], index) => `
    <fieldset class="question-card" data-question-id="${escapeHtml(qid)}">
      <legend>${index + 1}. ${escapeHtml(q.text)}</legend>
      <div class="rating-help"><span>👎 1 = הכי נמוך</span><span>5 = הכי גבוה 👍</span></div>
      <div class="rating-grid" role="radiogroup" aria-label="${escapeHtml(q.text)}">
        ${[1, 2, 3, 4, 5].map((value) => `
          <label class="rating-option">
            <input type="radio" name="q_${escapeHtml(qid)}" value="${value}" required>
            <span>${ratingLabel(value)}</span>
          </label>
        `).join("")}
      </div>
    </fieldset>
  `).join("") + `
    <button id="submitVoteBtn" class="btn primary full" type="submit">שלח הצבעה</button>
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
      showMessage(message, "יש לענות על כל השאלות לפני שליחה.", "error");
      return;
    }
    answers[qid] = Number(selected.value);
  }

  try {
    const btn = $("#submitVoteBtn");
    setLoading(btn, true, "שולח...");
    await set(ref(db, `votes/${lectureId}/${user.uid}`), {
      createdAt: Date.now(),
      answers
    });
    showMessage(message, "ההצבעה נשמרה בהצלחה. תודה!", "success");
    setTimeout(() => window.location.href = "voter.html", 900);
  } catch (err) {
    console.error(err);
    showMessage(message, "לא ניתן לשמור את ההצבעה. ייתכן שכבר הצבעת או שהסקר נסגר.", "error");
  } finally {
    const btn = $("#submitVoteBtn");
    setLoading(btn, false);
  }
}
