import { auth, db } from "./firebase-init.js";
import { signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.12.5/firebase-auth.js";
import { ref, update } from "https://www.gstatic.com/firebasejs/10.12.5/firebase-database.js";
import { $, getQueryParam, isAllowedEmail, normalizeEmail, setLoading, showMessage, updateLastLogin, waitForUser } from "./utils.js";

const form = $("#loginForm");
const message = $("#message");
const submitBtn = $("#loginBtn");

async function redirectIfAlreadyLoggedIn() {
  const user = await waitForUser();
  if (!user) return;
  if (!isAllowedEmail(user.email)) return;
  await updateLastLogin(user).catch(() => {});
  window.location.href = "home.html";
}

const error = getQueryParam("error");
if (error === "domain") {
  showMessage(message, "הגישה מותרת רק עם כתובת מייל של מכון וולקני.", "error");
}

form?.addEventListener("submit", async (event) => {
  event.preventDefault();
  showMessage(message, "");

  const email = normalizeEmail($("#email").value);
  const password = $("#password").value;

  if (!isAllowedEmail(email)) {
    showMessage(message, "ניתן להתחבר רק עם כתובת מייל שמסתיימת ב־@volcani.agri.gov.il", "error");
    return;
  }

  try {
    setLoading(submitBtn, true, "מתחבר...");
    const credential = await signInWithEmailAndPassword(auth, email, password);
    await update(ref(db, `users/${credential.user.uid}`), {
      email,
      lastLoginAt: Date.now()
    });
    window.location.href = "home.html";
  } catch (err) {
    console.error(err);
    showMessage(message, "התחברות נכשלה. בדוק מייל וסיסמה ונסה שוב.", "error");
  } finally {
    setLoading(submitBtn, false);
  }
});

redirectIfAlreadyLoggedIn();
