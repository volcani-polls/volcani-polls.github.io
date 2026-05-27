import { db } from "./firebase-init.js";
import { get, push, ref, set, update } from "https://www.gstatic.com/firebasejs/10.12.5/firebase-database.js";
import { $, escapeHtml, getQueryParam, orderedEntries, requireAdmin, setLoading, showMessage, wireLogoutButtons } from "./utils.js";

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

let currentLectureId = lectureId;

pageTitle.textContent = isNew ? "הוספת הרצאה" : "עריכת הרצאה";

function addQuestionRow(text = "", order = null) {
  const index = questionsBox.children.length + 1;
  const row = document.createElement("div");
  row.className = "question-edit-row";
  row.innerHTML = `
    <input class="question-text" type="text" placeholder="טקסט שאלה" value="${escapeHtml(text)}" required>
    <input class="question-order" type="number" min="1" value="${order ?? index}" title="סדר">
    <button class="btn danger small" type="button">הסר</button>
  `;
  row.querySelector("button").addEventListener("click", () => row.remove());
  questionsBox.appendChild(row);
}

async function loadLecture() {
  if (isNew) {
    $("#isOpen").checked = false;
    addQuestionRow("עד כמה ההרצאה הייתה ברורה?", 1);
    addQuestionRow("עד כמה הנושא היה רלוונטי עבורך?", 2);
    addQuestionRow("עד כמה המרצה העביר/ה את התוכן בצורה טובה?", 3);
    return;
  }

  const snap = await get(ref(db, `lectures/${lectureId}`));
  if (!snap.exists()) {
    showMessage(message, "ההרצאה לא נמצאה.", "error");
    form.hidden = true;
    return;
  }
  const lecture = snap.val();
  $("#title").value = lecture.title || "";
  $("#author").value = lecture.author || "";
  $("#order").value = lecture.order ?? 1;
  $("#isOpen").checked = lecture.isOpen === true;

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
    const qOrder = Number(row.querySelector(".question-order").value || idx + 1);
    if (text) {
      const key = `q_${String(idx + 1).padStart(3, "0")}`;
      questions[key] = { text, order: qOrder };
    }
  });

  if (!title || !author) {
    showMessage(message, "יש למלא שם הרצאה ושם מרצה.", "error");
    return;
  }
  if (!Object.keys(questions).length) {
    showMessage(message, "יש להוסיף לפחות שאלה אחת.", "error");
    return;
  }

  try {
    setLoading(saveBtn, true, "שומר...");
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
    showMessage(message, "ההרצאה נשמרה בהצלחה.", "success");
    setTimeout(() => window.location.href = "admin.html", 700);
  } catch (err) {
    console.error(err);
    showMessage(message, "שמירה נכשלה. בדוק הרשאות ושדות.", "error");
  } finally {
    setLoading(saveBtn, false);
  }
});

loadLecture().catch((err) => {
  console.error(err);
  showMessage(message, "שגיאה בטעינת ההרצאה.", "error");
});
