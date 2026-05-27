import { auth, db } from "./firebase-init.js";
import { signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.12.5/firebase-auth.js";
import { ref, update } from "https://www.gstatic.com/firebasejs/10.12.5/firebase-database.js";
import { $, getQueryParam, isAllowedEmail, normalizeEmail, setLoading, showMessage, updateLastLogin, waitForUser } from "./utils.js";
import { t } from "./i18n.js";

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
  showMessage(message, t("domain_error_msg"), "error");
}

form?.addEventListener("submit", async (event) => {
  event.preventDefault();
  showMessage(message, "");

  const email = normalizeEmail($("#email").value);
  const password = $("#password").value;

  if (!isAllowedEmail(email)) {
    showMessage(message, t("login_domain_constraint"), "error");
    return;
  }

  try {
    setLoading(submitBtn, true);
    const credential = await signInWithEmailAndPassword(auth, email, password);
    
    // Non-blocking database update to prevent DB rule issues from blocking successful logins
    try {
      await update(ref(db, `users/${credential.user.uid}`), {
        email,
        lastLoginAt: Date.now()
      });
    } catch (dbErr) {
      console.warn("Non-blocking DB metadata update failed:", dbErr);
    }
    
    window.location.href = "home.html";
  } catch (err) {
    console.error(err);
    let errorMsg = t("login_failed_msg");
    if (err.code === "auth/network-request-failed") {
      errorMsg = t("network_error_msg");
    } else if (err.code === "auth/too-many-requests") {
      errorMsg = t("too_many_requests_msg");
    }
    showMessage(message, errorMsg, "error");
  } finally {
    setLoading(submitBtn, false);
  }
});

// Password Show/Hide Toggle
const passwordToggleBtn = $("#togglePassword");
if (passwordToggleBtn) {
  passwordToggleBtn.addEventListener("click", () => {
    const passwordInput = $("#password");
    const eyeIcon = passwordToggleBtn.querySelector("i");
    if (passwordInput && eyeIcon) {
      if (passwordInput.type === "password") {
        passwordInput.type = "text";
        eyeIcon.className = "fa-regular fa-eye-slash";
      } else {
        passwordInput.type = "password";
        eyeIcon.className = "fa-regular fa-eye";
      }
    }
  });
}

redirectIfAlreadyLoggedIn();
