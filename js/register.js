import { auth, db } from "./firebase-init.js";
import { createUserWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.12.5/firebase-auth.js";
import { ref, set } from "https://www.gstatic.com/firebasejs/10.12.5/firebase-database.js";
import { $, isAllowedEmail, normalizeEmail, setLoading, showMessage } from "./utils.js";
import { t } from "./i18n.js";

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
    showMessage(message, t("register_domain_constraint"), "error");
    return;
  }
  if (password.length < 6) {
    showMessage(message, t("password_length_error"), "error");
    return;
  }
  if (password !== password2) {
    showMessage(message, t("passwords_dont_match"), "error");
    return;
  }

  try {
    setLoading(submitBtn, true);
    const credential = await createUserWithEmailAndPassword(auth, email, password);
    await set(ref(db, `users/${credential.user.uid}`), {
      email,
      createdAt: Date.now(),
      lastLoginAt: Date.now()
    });
    window.location.href = "home.html";
  } catch (err) {
    console.error(err);
    let msg = t("register_failed");
    if (err.code === "auth/email-already-in-use") msg = t("email_in_use_error");
    if (err.code === "auth/weak-password") msg = t("weak_password_error");
    showMessage(message, msg, "error");
  } finally {
    setLoading(submitBtn, false);
  }
});
