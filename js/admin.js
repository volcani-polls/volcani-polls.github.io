import { db } from "./firebase-init.js";
import { get, ref, update } from "https://www.gstatic.com/firebasejs/10.12.5/firebase-database.js";
import { $, escapeHtml, formatDate, orderedEntries, requireAdmin, showMessage, wireLogoutButtons } from "./utils.js";

const user = await requireAdmin();
wireLogoutButtons();

const adminEmail = $("#adminEmail");
const list = $("#adminLecturesList");
const message = $("#message");
if (adminEmail) adminEmail.textContent = user?.email || "";

async function loadLectures() {
  list.innerHTML = `<div class="loading-box">טוען הרצאות...</div>`;
  const snap = await get(ref(db, "lectures"));
  const lectures = snap.val() || {};

  const html = orderedEntries(lectures).map(([id, lecture]) => `
    <div class="admin-row">
      <div class="admin-row-main">
        <h3>${escapeHtml(lecture.title)}</h3>
        <p><strong>Author:</strong> ${escapeHtml(lecture.author)}</p>
        <p class="muted">עודכן: ${formatDate(lecture.updatedAt)}</p>
        <span class="badge ${lecture.isOpen ? "open" : "closed"}">${lecture.isOpen ? "פתוח להצבעה" : "סגור"}</span>
      </div>
      <div class="admin-actions">
        <button class="btn small ${lecture.isOpen ? "secondary" : "primary"}" data-toggle="${escapeHtml(id)}" data-open="${lecture.isOpen ? "0" : "1"}">${lecture.isOpen ? "סגור סקר" : "פתח סקר"}</button>
        <a class="btn small" href="admin-edit-lecture.html?id=${encodeURIComponent(id)}">עריכה</a>
        <a class="btn small" href="admin-results.html?id=${encodeURIComponent(id)}">תוצאות</a>
      </div>
    </div>
  `).join("");

  list.innerHTML = html || `<div class="empty-state">אין הרצאות. לחץ על “הוסף הרצאה”.</div>`;

  document.querySelectorAll("[data-toggle]").forEach((btn) => {
    btn.addEventListener("click", async () => {
      const id = btn.dataset.toggle;
      const isOpen = btn.dataset.open === "1";
      try {
        await update(ref(db, `lectures/${id}`), { isOpen, updatedAt: Date.now() });
        showMessage(message, isOpen ? "הסקר נפתח להצבעה." : "הסקר נסגר להצבעה.", "success");
        await loadLectures();
      } catch (err) {
        console.error(err);
        showMessage(message, "הפעולה נכשלה.", "error");
      }
    });
  });
}

loadLectures().catch((err) => {
  console.error(err);
  list.innerHTML = `<div class="message error">שגיאה בטעינת ההרצאות.</div>`;
});
