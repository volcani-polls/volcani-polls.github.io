import { $, isAdminUser, requireLogin, wireLogoutButtons } from "./utils.js";
import { t } from "./i18n.js";

const user = await requireLogin();
wireLogoutButtons();

const welcomeTitle = $("#welcomeTitle");
const roleBadge = $("#roleBadge");
const welcomeSubtitle = $("#welcomeSubtitle");
const actions = $("#welcomeActions");

const icons = {
  vote: `
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="m9 12 2 2 4-4"></path>
      <path d="M5 3h14"></path>
      <path d="M5 8h14"></path>
      <path d="M5 13h4"></path>
      <path d="M5 18h14"></path>
    </svg>
  `,
  admin: `
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <rect x="3" y="3" width="7" height="9" rx="1"></rect>
      <rect x="14" y="3" width="7" height="5" rx="1"></rect>
      <rect x="14" y="12" width="7" height="9" rx="1"></rect>
      <rect x="3" y="16" width="7" height="5" rx="1"></rect>
    </svg>
  `
};

function actionButton({ href, icon, title, subtitle, primary = false }) {
  return `
    <a class="welcome-action ${primary ? "primary" : ""}" href="${href}">
      <span class="welcome-action-icon">${icons[icon]}</span>
      <span class="welcome-action-text">
        <strong>${title}</strong>
        <small>${subtitle}</small>
      </span>
    </a>
  `;
}

if (welcomeTitle) {
  const emailPrefix = user?.email ? user.email.split("@")[0] : "";
  welcomeTitle.textContent = `${t("hello")} ${emailPrefix}`;
}

const admin = await isAdminUser(user).catch(() => false);

if (admin && roleBadge) {
  roleBadge.hidden = false;
}
if (welcomeSubtitle) {
  welcomeSubtitle.hidden = !admin;
}

if (actions) {
  if (admin) {
    actions.classList.remove("single");
    actions.innerHTML = [
      actionButton({
        href: "admin.html",
        icon: "admin",
        title: t("nav_admin"),
        subtitle: t("admin_panel_sub"),
        primary: true
      }),
      actionButton({
        href: "voter.html",
        icon: "vote",
        title: t("nav_voter"),
        subtitle: t("view_and_vote_as_regular")
      })
    ].join("");
  } else {
    actions.classList.add("single");
    actions.innerHTML = actionButton({
      href: "voter.html",
      icon: "vote",
      title: t("to_voting_page"),
      subtitle: t("view_and_vote"),
      primary: true
    });
  }
}
