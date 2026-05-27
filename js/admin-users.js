import { db } from "./firebase-init.js";
import { get, ref } from "https://www.gstatic.com/firebasejs/10.12.5/firebase-database.js";
import { $, BOOTSTRAP_OWNER_EMAIL, escapeHtml, getOwnerEmail, normalizeEmail, requireAdmin, wireLogoutButtons } from "./utils.js";

await requireAdmin();
wireLogoutButtons();

const adminsList = $("#adminsList");
const ownerEmailBox = $("#ownerEmailBox");

function parseAdminEmails(value) {
  const seen = new Set();
  return String(value || "")
    .split(",")
    .map((item) => normalizeEmail(item))
    .filter((email) => {
      if (!email || seen.has(email)) return false;
      seen.add(email);
      return true;
    });
}

function renderAdmins(ownerEmail, adminEmails) {
  const emails = [ownerEmail, ...adminEmails].filter(Boolean);
  if (!emails.includes(BOOTSTRAP_OWNER_EMAIL)) {
    emails.unshift(BOOTSTRAP_OWNER_EMAIL);
  }

  const uniqueEmails = [...new Set(emails)];
  adminsList.innerHTML = uniqueEmails.map((email) => `
    <div class="admin-user-row">
      <div>
        <strong>${escapeHtml(email)}</strong>
        <div class="muted">${email === ownerEmail || email === BOOTSTRAP_OWNER_EMAIL ? "Owner / Rules" : "config/adminEmailsCsv"}</div>
      </div>
    </div>
  `).join("");
}

async function loadAdmins() {
  const ownerEmail = await getOwnerEmail().catch(() => "");
  ownerEmailBox.textContent = ownerEmail || "לא הוגדר";

  const snap = await get(ref(db, "config/adminEmailsCsv")).catch(() => null);
  const adminEmails = parseAdminEmails(snap?.val?.() || "");
  renderAdmins(ownerEmail, adminEmails);
}

loadAdmins().catch((err) => {
  console.error(err);
  adminsList.innerHTML = `<div class="message error">שגיאה בטעינת מנהלים.</div>`;
});
