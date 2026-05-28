import { db } from "./firebase-init.js";
import { get, ref, set, onValue } from "https://www.gstatic.com/firebasejs/10.12.5/firebase-database.js";
import { $, escapeHtml, getQueryParam, orderedEntries, ratingLabel, requireLogin, setLoading, showMessage, wireLogoutButtons, showToast } from "./utils.js";
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
  form.innerHTML = `
    <div class="spinner-container">
      <div class="spinner"></div>
      <p class="spinner-text">${t("loading")}</p>
    </div>
  `;
  
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
  const isOpen = lecture.isOpen === true;
  const hasVoted = voteSnap?.exists();
  
  titleEl.textContent = lecture.title || t("nav_voter");
  
  function updateStatusBadge(isCurrentlyOpen) {
    let statusBadgeHtml = "";
    if (hasVoted) {
      statusBadgeHtml = `<span class="badge open" style="margin-inline-start: 12px;"><i class="fa-solid fa-circle-check"></i> ${t("voted_status_check")}</span>`;
    } else if (isCurrentlyOpen) {
      statusBadgeHtml = `<span class="badge open" style="margin-inline-start: 12px;"><i class="fa-solid fa-lock-open"></i> ${t("open")}</span>`;
    } else {
      statusBadgeHtml = `<span class="badge closed" style="margin-inline-start: 12px;"><i class="fa-solid fa-lock"></i> ${t("closed")}</span>`;
    }
    metaEl.innerHTML = `<i class="fa-solid fa-user-tie"></i> ${t("lecturer")} ${lecture.author || ""} ${statusBadgeHtml}`;
  }
  
  updateStatusBadge(isOpen);
  
  // Set up real-time listener for status changes
  let hasShownClosedToast = false;
  onValue(ref(db, `lectures/${lectureId}/isOpen`), (snapshot) => {
    const currentlyOpen = snapshot.val() === true;
    updateStatusBadge(currentlyOpen);
    
    // If poll was closed while user is viewing it (and hasn't voted yet)
    if (!hasVoted && !currentlyOpen && !form.hidden && !hasShownClosedToast) {
      hasShownClosedToast = true;
      showMessage(message, t("poll_closed_realtime"), "info");
      form.hidden = true;
      
      // Show toast notification
      showToast({
        title: t("poll_closed_toast_title"),
        message: lecture.title,
        type: "danger",
        icon: '<i class="fa-solid fa-lock"></i>',
        duration: 6000,
        playSound: true
      });
      
      // Add a button to go back to voter page
      const backButton = document.createElement("a");
      backButton.href = "voter.html";
      backButton.className = "btn primary full";
      backButton.innerHTML = `<i class="fa-solid fa-arrow-right"></i> ${t("back_to_voter")}`;
      backButton.style.marginTop = "20px";
      message.parentElement.appendChild(backButton);
    }
  });

  // Check if user already voted
  if (voteSnap?.exists()) {
    const existingVote = voteSnap.val();
    showMessage(message, `${t("survey_voted_success")} ${t("viewing_your_answers")}`, "success");
    
    // Show the questions with the user's answers (read-only)
    const questions = orderedEntries(lecture.questions || {});
    form.innerHTML = questions.map(([qid, q], index) => {
      const userAnswer = existingVote.answers?.[qid];
      return `
        <div class="question-card" data-question-id="${escapeHtml(qid)}">
          <p class="question-text"><span class="question-num">${index + 1}</span><span class="question-content">${escapeHtml(q.text)}</span></p>
          <div class="rating-scale-labels">
            <span>👎 ${t("rating_scale_low")}</span>
            <span>${t("rating_scale_high")} 👍</span>
          </div>
          <div class="rating-grid" role="radiogroup" aria-label="${escapeHtml(q.text)}">
            ${[1, 2, 3, 4, 5].map((value) => `
              <label class="rating-option">
                <input type="radio" name="q_${escapeHtml(qid)}" value="${value}" ${userAnswer === value ? 'checked' : ''} disabled>
                <span>${value}</span>
              </label>
            `).join("")}
          </div>
        </div>
      `;
    }).join("") + `
      <a href="voter.html" class="btn primary full">${t("back_to_voter")}</a>
    `;
    return;
  }

  // Check if poll is open
  if (lecture.isOpen !== true) {
    showMessage(message, t("survey_closed_status"), "info");
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
    setTimeout(() => window.location.href = "voter.html", 300);
  } catch (err) {
    console.error(err);
    showMessage(message, t("vote_save_failed"), "error");
  } finally {
    const btn = $("#submitVoteBtn");
    setLoading(btn, false);
  }
}
