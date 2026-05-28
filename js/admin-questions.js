import { db } from "./firebase-init.js";
import { get, ref, set, update } from "https://www.gstatic.com/firebasejs/10.12.5/firebase-database.js";
import { $, escapeHtml, orderedEntries, requireAdmin, setLoading, showMessage, wireLogoutButtons } from "./utils.js";
import { t } from "./i18n.js";

await requireAdmin();
wireLogoutButtons();

const form = $("#questionsForm");
const message = $("#message");
const questionsBox = $("#questionsBox");
const addQuestionBtn = $("#addQuestionBtn");
const saveBtn = $("#saveBtn");

function addQuestionRow(text = "", order = null) {
  const index = questionsBox.children.length + 1;
  const row = document.createElement("div");
  row.className = "question-edit-row";
  row.innerHTML = `
    <input class="question-text" type="text" placeholder="${t("question_text_placeholder")} ${index}..." value="${escapeHtml(text)}" required>
    <button class="btn danger small" type="button">${t("delete")}</button>
  `;
  row.querySelector("button").addEventListener("click", () => row.remove());
  questionsBox.appendChild(row);
}

async function loadGlobalQuestions() {
  try {
    const snap = await get(ref(db, "config/globalQuestions"));
    const globalQuestions = snap.val() || {};
    
    const entries = orderedEntries(globalQuestions);
    
    if (entries.length === 0) {
      // Default questions if none exist
      addQuestionRow("", 1);
      addQuestionRow("", 2);
      addQuestionRow("", 3);
    } else {
      entries.forEach(([, q]) => addQuestionRow(q.text, q.order));
    }
  } catch (err) {
    console.error(err);
    showMessage(message, t("lectures_load_error"), "error");
  }
}

addQuestionBtn.addEventListener("click", () => addQuestionRow());

form.addEventListener("submit", async (event) => {
  event.preventDefault();
  showMessage(message, "");

  const questionRows = Array.from(document.querySelectorAll(".question-edit-row"));
  const questions = {};
  
  questionRows.forEach((row, idx) => {
    const text = row.querySelector(".question-text").value.trim();
    const qOrder = idx + 1;
    if (text) {
      const key = `q_${String(idx + 1).padStart(3, "0")}`;
      questions[key] = { text, order: qOrder };
    }
  });

  if (!Object.keys(questions).length) {
    showMessage(message, t("add_at_least_one_question"), "error");
    return;
  }

  try {
    setLoading(saveBtn, true, t("sending"));
    
    // Save global questions
    await set(ref(db, "config/globalQuestions"), questions);
    
    // Update all existing lectures with new questions
    const lecturesSnap = await get(ref(db, "lectures"));
    const lectures = lecturesSnap.val() || {};
    
    const updates = {};
    Object.keys(lectures).forEach((lectureId) => {
      updates[`lectures/${lectureId}/questions`] = questions;
      updates[`lectures/${lectureId}/updatedAt`] = Date.now();
    });
    
    if (Object.keys(updates).length > 0) {
      await update(ref(db), updates);
    }
    
    showMessage(message, t("questions_saved_success"), "success");
  } catch (err) {
    console.error(err);
    showMessage(message, t("action_failed"), "error");
  } finally {
    setLoading(saveBtn, false);
  }
});

loadGlobalQuestions();
