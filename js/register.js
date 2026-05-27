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
    else if (err.code === "auth/weak-password") msg = t("weak_password_error");
    else if (err.code === "auth/network-request-failed") msg = t("network_error_msg");
    else if (err.code === "auth/too-many-requests") msg = t("too_many_requests_msg");
    showMessage(message, msg, "error");
  } finally {
    setLoading(submitBtn, false);
  }
});

// Wire up password show/hide toggles
function wirePasswordToggle(toggleId, inputId) {
  const toggleBtn = $(toggleId);
  const input = $(inputId);
  if (toggleBtn && input) {
    toggleBtn.addEventListener("click", () => {
      const icon = toggleBtn.querySelector("i");
      if (icon) {
        if (input.type === "password") {
          input.type = "text";
          icon.className = "fa-regular fa-eye-slash";
        } else {
          input.type = "password";
          icon.className = "fa-regular fa-eye";
        }
      }
    });
  }
}

wirePasswordToggle("#togglePassword", "#password");
wirePasswordToggle("#togglePassword2", "#password2");
