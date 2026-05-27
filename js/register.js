import { auth, db } from "./firebase-init.js";
import { createUserWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.12.5/firebase-auth.js";
import { ref, set } from "https://www.gstatic.com/firebasejs/10.12.5/firebase-database.js";
import { $, isAllowedEmail, normalizeEmail, setLoading, showMessage } from "./utils.js";

const form = $("#registerForm");
const message = $("#message");
const submitBtn = $("#registerBtn");

form?.addEventListener("submit", async (event) => {
  event.preventDefault();
  showMessage(message, "");

  const email = normalizeEmail($("#email").value);
  const password = $("#password").value;
  const password2 = $("#password2").value;

  if (!isAllowedEmail(email)) {
    showMessage(message, "ניתן להירשם רק עם כתובת מייל שמסתיימת ב־@volcani.agri.gov.il", "error");
    return;
  }
  if (password.length < 6) {
    showMessage(message, "הסיסמה חייבת להכיל לפחות 6 תווים.", "error");
    return;
  }
  if (password !== password2) {
    showMessage(message, "הסיסמאות אינן זהות.", "error");
    return;
  }

  try {
    setLoading(submitBtn, true, "נרשם...");
    const credential = await createUserWithEmailAndPassword(auth, email, password);
    await set(ref(db, `users/${credential.user.uid}`), {
      email,
      createdAt: Date.now(),
      lastLoginAt: Date.now()
    });
    window.location.href = "home.html";
  } catch (err) {
    console.error(err);
    let msg = "הרשמה נכשלה. נסה שוב.";
    if (err.code === "auth/email-already-in-use") msg = "כתובת המייל כבר רשומה. עבור למסך התחברות.";
    if (err.code === "auth/weak-password") msg = "הסיסמה חלשה מדי.";
    showMessage(message, msg, "error");
  } finally {
    setLoading(submitBtn, false);
  }
});
