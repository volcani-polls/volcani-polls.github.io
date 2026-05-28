import { db } from "./firebase-init.js";
import { get, push, ref, set, update } from "https://www.gstatic.com/firebasejs/10.12.5/firebase-database.js";
import { $, escapeHtml, getQueryParam, orderedEntries, requireAdmin, setLoading, showMessage, wireLogoutButtons } from "./utils.js";
import { t } from "./i18n.js";

await requireAdmin();
wireLogoutButtons();

const lectureId = getQueryParam("id");
const isNew = getQueryParam("new") === "1" || !lectureId;
const pageTitle = $("#pageTitle");
const form = $("#lectureForm");
const message = $("#message");
const questionsBox = $("#questionsBox");
const addQuestionBtn = $("#addQuestionBtn");
const saveBtn = $("#saveLectureBtn");
const isOpenCheckbox = $("#isOpen");
const statusIndicator = $("#pollStatusIndicator");

let currentLectureId = lectureId;

pageTitle.textContent = isNew ? t("add_lecture") : t("edit_lecture");

// Update status indicator when checkbox changes
isOpenCheckbox.addEventListener("change", updateStatusIndicator);

function updateStatusIndicator() {
  const isOpen = isOpenCheckbox.checked;
  const badge = statusIndicator.querySelector(".status-badge");
  
  if (isOpen) {
    badge.className = "status-badge open";
    badge.innerHTML = `<i class="fa-solid fa-circle-check"></i> ${t("open")}`;
  } else {
    badge.className = "status-badge closed";
    badge.innerHTML = `<i class="fa-solid fa-circle-xmark"></i> ${t("closed")}`;
  }
}

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

async function loadLecture() {
  if (isNew) {
    $("#isOpen").checked = false;
    updateStatusIndicator();
    addQuestionRow("", 1);
    addQuestionRow("", 2);
    addQuestionRow("", 3);
    return;
  }

  const snap = await get(ref(db, `lectures/${lectureId}`));
  if (!snap.exists()) {
    showMessage(message, t("poll_not_found"), "error");
    form.hidden = true;
    return;
  }
  const lecture = snap.val();
  $("#title").value = lecture.title || "";
  $("#author").value = lecture.author || "";
  $("#order").value = lecture.order ?? 1;
  $("#isOpen").checked = lecture.isOpen === true;
  updateStatusIndicator();

  orderedEntries(lecture.questions || {}).forEach(([, q]) => addQuestionRow(q.text, q.order));
  if (!questionsBox.children.length) addQuestionRow("", 1);
}

addQuestionBtn.addEventListener("click", () => addQuestionRow());

form.addEventListener("submit", async (event) => {
  event.preventDefault();
  showMessage(message, "");

  const title = $("#title").value.trim();
  const author = $("#author").value.trim();
  const order = Number($("#order").value || 1);
  const isOpen = $("#isOpen").checked;

  const questionRows = Array.from(document.querySelectorAll(".question-edit-row"));
  const questions = {};
  questionRows.forEach((row, idx) => {
    const text = row.querySelector(".question-text").value.trim();
    const qOrder = idx + 1; // Order is based on position in the list
    if (text) {
      const key = `q_${String(idx + 1).padStart(3, "0")}`;
      questions[key] = { text, order: qOrder };
    }
  });

  if (!title || !author) {
    showMessage(message, t("fill_all_fields_error"), "error");
    return;
  }
  if (!Object.keys(questions).length) {
    showMessage(message, t("add_at_least_one_question"), "error");
    return;
  }

  try {
    setLoading(saveBtn, true, t("sending"));
    const now = Date.now();
    if (isNew) {
      const newRef = push(ref(db, "lectures"));
      currentLectureId = newRef.key;
      await set(newRef, {
        title,
        author,
        isOpen,
        order,
        questions,
        createdAt: now,
        updatedAt: now
      });
    } else {
      await update(ref(db, `lectures/${lectureId}`), {
        title,
        author,
        isOpen,
        order,
        questions,
        updatedAt: now
      });
    }
    showMessage(message, t("poll_saved"), "success");
    setTimeout(() => window.location.href = "admin.html", 300);
  } catch (err) {
    console.error(err);
    showMessage(message, t("poll_save_failed"), "error");
  } finally {
    setLoading(saveBtn, false);
  }
});

loadLecture().catch((err) => {
  console.error(err);
  showMessage(message, t("lectures_load_error"), "error");
});
