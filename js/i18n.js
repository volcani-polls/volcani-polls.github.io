const translations = {
  he: {
    app_title: "מערכת הסקרים - כנס הסטודנטים השישי",
    app_subtitle: "פותח על ידי המכון להנדסת מערכות חקלאיות וביולוגיות",
    nav_home: "דף הבית",
    nav_logout: "יציאה",
    nav_admin: "ממשק ניהול",
    nav_admin_users: "ניהול מנהלים",
    nav_voter: "עמוד הצבעות",
    nav_results: "תוצאות",
    loading: "טוען...",
    login: "התחברות",
    login_page: "עמוד התחברות",
    register: "הרשמה",
    register_page: "עמוד הרשמה",
    email: "כתובת מייל",
    password: "סיסמה",
    confirm_password: "אימות סיסמה",
    already_have_user: "כבר יש לך משתמש? ",
    dont_have_user: "אין לך משתמש? ",
    password_label_rules: "סיסמה (לפחות 6 תווים)",
    allowed_emails_note: "במקרה של תקלות ניתן לפנות ל yehudah@volcani.agri.gov.il",
    support_contact: "במקרה של תקלות ניתן לפנות ל yehudah@volcani.agri.gov.il",
    vote_slogan: "מי שמצביע - משפיע!",
    page_loading: "מועבר לעמוד...",
    register_only_volcani: "ניתן להירשם רק עם כתובת מייל של מכון וולקני",
    submit: "שליחה",
    save: "שמירה",
    delete: "הסר",
    edit: "עריכה",
    add_lecture: "הוספת הרצאה",
    edit_lecture: "עריכת הרצאה",
    lecture_title_label: "נושא ההרצאה",
    lecture_author_label: "שם המרצה",
    lecture_order_label: "סדר הצגה",
    open_for_voting: "פתח להצבעה",
    survey_questions: "שאלות הסקר",
    add_question: "הוספת שאלה",
    save_lecture: "יצירת הרצאה",
    back_to_admin: "חזרה לממשק ניהול",
    back_to_voter: "חזרה לעמוד הצבעות",
    welcome_back: "ברוכ/ה הבא/ה",
    hello: "שלום",
    you_are_admin: "את/ה מנהל/ת",
    choose_path: "בחר את המסלול שתרצה/י להמשיך אליו.",
    to_voting_page: "לעמוד הצבעות",
    view_and_vote: "צפייה בהרצאות והצבעה בסקרים פתוחים",
    view_and_vote_as_regular: "צפייה והצבעה כמו משתמש רגיל",
    admin_panel_sub: "ניהול הרצאות, פתיחה וסגירה של סקרים",
    last_updated: "עודכן:",
    open: "פתוח להצבעה",
    closed: "סגור",
    close_poll: "סגור סקר",
    open_poll: "פתח סקר",
    no_lectures_admin: "אין הרצאות. לחץ על “הוסף הרצאה”.",
    loading_lectures: "טוען הרצאות...",
    error_loading_lectures: "שגיאה בטעינת ההרצאות.",
    poll_saved: "ההרצאה נשמרה בהצלחה.",
    poll_save_failed: "שמירה נכשלה. בדוק הרשאות ושדות.",
    poll_not_found: "ההרצאה לא נמצאה.",
    missing_poll_id: "חסר מזהה הרצאה.",
    action_failed: "הפעולה נכשלה.",
    poll_opened_msg: "הסקר נפתח להצבעה.",
    poll_closed_msg: "הסקר נסגר להצבעה.",
    poll_opened_toast_title: "סקר נפתח! 🎉",
    poll_opened_toast_msg: "הסקר פתוח כעת להצבעה",
    poll_closed_toast_title: "סקר נסגר",
    poll_closed_toast_msg: "הסקר נסגר להצבעה",
    new_vote_toast_title: "הצבעה חדשה! 🗳️",
    new_vote_toast_msg: "מישהו הצביע בסקר",
    voter_subtitle_prefix: "מחובר כעת בתור",
    voter_subtitle_suffix: ", לחצו על אחת מההרצאות כדי להצביע או לראות את התשובות שלכם.",
    connected_as_admin: "מחובר כעת בתור מנהל:",
    empty_state: "אין כרגע הרצאות להצגה.",
    voted_status_check: "כבר הצבעת בסקר זה",
    view_your_vote: "לחץ לצפייה בתשובות שלך",
    survey_closed_status: "הסקר עדיין סגור להצבעה",
    poll_closed_realtime: "הסקר נסגר להצבעה בזמן אמת",
    survey_voted_success: "כבר הצבעת בסקר זה. תודה!",
    viewing_your_answers: "צפייה בתשובות שלך:",
    no_questions_in_survey: "בסקר זה עדיין אין שאלות.",
    rating_low: "👎 1 = הכי נמוך",
    rating_high: "5 = הכי גבוה 👍",
    rating_scale_low: "הכי נמוך",
    rating_scale_high: "הכי גבוה",
    send_vote: "שלח הצבעה",
    sending: "שולח...",
    vote_saved_success: "ההצבעה נשמרה בהצלחה. תודה!",
    vote_save_failed: "לא ניתן לשמור את ההצבעה. ייתכן שכבר הצבעת או שהסקר נסגר.",
    answer_all_questions_error: "יש לענות על כל השאלות לפני שליחה.",
    fill_all_fields_error: "יש למלא שם הרצאה ושם מרצה.",
    add_at_least_one_question: "יש להוסיף לפחות שאלה אחת.",
    question_text_placeholder: "להזין כאן את שאלה",
    lecturer: "מרצה:",
    voters_count: "מספר מצביעים",
    total_answers: "מספר תשובות",
    final_average: "ממוצע סופי",
    no_data: "אין נתונים",
    no_data_to_display: "אין נתונים להצגה.",
    question_column: "שאלה",
    voters_column: "מספר מדרגים",
    average_column: "ממוצע",
    rating_distribution: "התפלגות דירוגים",
    average_by_question: "ממוצע לפי שאלה",
    detailed_results: "תוצאות מפורטות",
    compare_lectures: "השוואת הרצאות",
    compare_lectures_desc: "דירוג כל ההרצאות לפי ממוצע הציונים",
    view_details: "צפה בפרטים",
    total_lectures: "סה\"כ הרצאות",
    total_voters: "סה\"כ מצביעים",
    highest_rating: "דירוג הגבוה ביותר",
    owner_prefix: "Owner של המערכת:",
    admins_panel_info_title: "הגדרות מנהלים",
    admins_panel_info_desc_1: "מנהלים מוגדרים על ידי מפתח המערכת yehudah@volcani.agri.gov.il",
    admins_list_title: "מנהלים מורשים",
    domain_error_msg: "הגישה מותרת רק עם כתובת מייל של מכון וולקני.",
    login_domain_constraint: "ניתן להתחבר רק עם כתובת מייל שמסתיימת ב־@volcani.agri.gov.il",
    login_failed_msg: "התחברות נכשלה. בדוק מייל וסיסמה ונסה שוב.",
    network_error_msg: "שגיאת תקשורת. ודא שיש חיבור אינטרנט פעיל (סינוני אינטרנט מסוימים עלולים לחסום את החיבור) ונסה שוב.",
    too_many_requests_msg: "הגישה נחסמה זמנית עקב ריבוי ניסיונות כושלים. נסה שוב מאוחר יותר.",
    register_domain_constraint: "ניתן להירשם רק עם כתובת מייל שמסתיימת ב־@volcani.agri.gov.il",
    password_length_error: "הסיסמה חייבת להכיל לפחות 6 תווים.",
    passwords_dont_match: "הסיסמאות אינן זהות.",
    register_failed: "הרשמה נכשלה. נסה שוב.",
    email_in_use_error: "כתובת המייל כבר רשומה. עבור למסך התחברות.",
    weak_password_error: "הסיסמה חלשה מדי.",
    lectures_load_error: "שגיאה בטעינת ההרצאות.",
    owner_rules_label: "ADMIN",
    csv_label: "ADMIN",
    
    // Landing page translations
    landing_brand: "המכון להנדסה חקלאית וביולוגית",
    landing_cta: "מעבר למערכת הסקרים ←",
    landing_cta_sub: "כניסה לאזור המשתמשים ומערכת ההצבעה",
    landing_demo_btn: "כניסה למערכת",
    landing_title_1: "כנס הסטודנטים השישי",
    landing_title_2: "של המכון להנדסת מערכות חקלאיות וביולוגיות",
    landing_footer_1: "כנס הסטודנטים השישי להנדסה חקלאית וביולוגית",
    landing_footer_2: "© 2026 כל הזכויות שמורות למכון וולקני והמכון להנדסה חקלאית",
    landing_footer_3: "מכינים את הקרקע לחקלאות העתיד",
    landing_footer_4: "הדמיה לפגישת תכנון",
    
    // Landing modal
    modal_title: "הדמיית סקר אינטראקטיבי",
    modal_q: "מהו התחום הטכנולוגי שישפיע באופן הדרמטי ביותר על עתיד החקלאות בעשור הקרוב?",
    modal_opt_1: "רובוטים אוטונומיים ורחפני שדה",
    modal_opt_2: "בינה מלאכותית (AI) לחיזוי מחלות ומזיקים",
    modal_opt_3: "חממות הידרופוניות וגידולים ורטיקליים מבוקרי אקלים",
    modal_opt_4: "סנסורים חכמים ומערכות השקיה מדויקות",
    modal_voted_success: "ההצבעה נקלטה בהצלחה! התפלגות קולות הקהל בזמן אמת:",
    modal_reset: "הצבעה מחדש לצורך הדגמה",
    modal_footer_note: "הסימולטור מציג את תצוגת הלוח המתוכננת להקרנה באולם הדיונים.",
    modal_close: "סגור הדמיה",
    modal_res_1: "רובוטים ורחפני שדה",
    modal_res_2: "בינה מלאכותית (AI)",
    modal_res_3: "גידולים ורטיקליים מבוקרי אקלים",
    modal_res_4: "סנסורים חכמים והשקיה מדויקת",
    edit_lecture_desc: "כאן תוכל להוסיף או לערוך את פרטי ההרצאה, את סדר ההצגה שלה, ואת השאלות שיופיעו בסקר עבור המצביעים."
  },
  en: {
    app_title: "Polls System - 6th Student Conference",
    app_subtitle: "Developed by the Institute of Agricultural & Biological Systems Engineering",
    nav_home: "Home",
    nav_logout: "Logout",
    nav_admin: "Admin Panel",
    nav_admin_users: "Manage Admins",
    nav_voter: "Voting Page",
    nav_results: "Results",
    loading: "Loading...",
    login: "Login",
    login_page: "Login Page",
    register: "Register",
    register_page: "Registration Page",
    email: "Email Address",
    password: "Password",
    confirm_password: "Confirm Password",
    already_have_user: "Already have an account? ",
    dont_have_user: "Don't have an account? ",
    password_label_rules: "Password (at least 6 characters)",
    allowed_emails_note: "Access allowed only for emails ending with @volcani.agri.gov.il",
    support_contact: "In case of issues, please contact yehudah@volcani.agri.gov.il",
    vote_slogan: "Those who vote - make an impact!",
    page_loading: "Navigating to page...",
    register_only_volcani: "Registration is only available with a Volcani Institute email address",
    submit: "Submit",
    save: "Save",
    delete: "Remove",
    edit: "Edit",
    add_lecture: "Add Lecture",
    edit_lecture: "Edit Lecture",
    lecture_title_label: "Lecture Title",
    lecture_author_label: "Lecturer Name",
    lecture_order_label: "Display Order",
    open_for_voting: "Open for Voting",
    survey_questions: "Poll Questions",
    add_question: "Add Question",
    save_lecture: "Create Lecture",
    back_to_admin: "Back to Admin",
    back_to_voter: "Back to Voting Page",
    welcome_back: "Welcome",
    hello: "Hello",
    you_are_admin: "You are an admin",
    choose_path: "Select the path you wish to continue to.",
    to_voting_page: "To Voting Page",
    view_and_vote: "View lectures and vote in open polls",
    view_and_vote_as_regular: "View and vote like a regular user",
    admin_panel_sub: "Manage lectures, open and close polls",
    last_updated: "Updated:",
    open: "Open for Voting",
    closed: "Closed",
    close_poll: "Close Poll",
    open_poll: "Open Poll",
    no_lectures_admin: "No lectures. Click \"Add Lecture\".",
    loading_lectures: "Loading lectures...",
    error_loading_lectures: "Error loading lectures.",
    poll_saved: "Lecture saved successfully.",
    poll_save_failed: "Save failed. Check permissions and fields.",
    poll_not_found: "Lecture not found.",
    missing_poll_id: "Missing lecture ID.",
    action_failed: "Action failed.",
    poll_opened_msg: "The poll has been opened for voting.",
    poll_closed_msg: "The poll has been closed for voting.",
    poll_opened_toast_title: "Poll Opened! 🎉",
    poll_opened_toast_msg: "The poll is now open for voting",
    poll_closed_toast_title: "Poll Closed",
    poll_closed_toast_msg: "The poll has been closed for voting",
    new_vote_toast_title: "New Vote! 🗳️",
    new_vote_toast_msg: "Someone voted in the poll",
    voter_subtitle_prefix: "Connected as",
    voter_subtitle_suffix: ", click on a lecture to vote or view your answers.",
    connected_as_admin: "Connected as admin:",
    empty_state: "There are no lectures to display.",
    voted_status_check: "Already voted in this poll",
    view_your_vote: "Click to view your answers",
    survey_closed_status: "The poll is still closed for voting",
    poll_closed_realtime: "The poll has been closed for voting in real-time",
    survey_voted_success: "You have already voted in this poll. Thank you!",
    viewing_your_answers: "Viewing your answers:",
    no_questions_in_survey: "This poll does not have questions yet.",
    rating_low: "👎 1 = Lowest",
    rating_high: "5 = Highest 👍",
    rating_scale_low: "Lowest",
    rating_scale_high: "Highest",
    send_vote: "Submit Vote",
    sending: "Sending...",
    vote_saved_success: "Vote submitted successfully. Thank you!",
    vote_save_failed: "Cannot save vote. You might have already voted or the poll was closed.",
    answer_all_questions_error: "Please answer all questions before submitting.",
    fill_all_fields_error: "Please fill in the lecture title and lecturer name.",
    add_at_least_one_question: "Please add at least one question.",
    question_text_placeholder: "Enter question",
    lecturer: "Lecturer:",
    voters_count: "Voters Count",
    total_answers: "Total Answers",
    final_average: "Final Average",
    no_data: "No data",
    no_data_to_display: "No data to display.",
    question_column: "Question",
    voters_column: "Raters Count",
    average_column: "Average",
    rating_distribution: "Rating Distribution",
    average_by_question: "Average by Question",
    detailed_results: "Detailed Results",
    compare_lectures: "Compare Lectures",
    compare_lectures_desc: "Ranking of all lectures by average score",
    view_details: "View Details",
    total_lectures: "Total Lectures",
    total_voters: "Total Voters",
    highest_rating: "Highest Rating",
    owner_prefix: "System Owner:",
    admins_panel_info_title: "Admin Settings",
    admins_panel_info_desc_1: "Admins are defined by the system developer yehudah@volcani.agri.gov.il",
    admins_list_title: "Authorized Admins",
    domain_error_msg: "Access is allowed only with a Volcani Institute email address.",
    login_domain_constraint: "You can only log in with an email address ending with @volcani.agri.gov.il",
    login_failed_msg: "Login failed. Check email and password and try again.",
    network_error_msg: "Network error. Please check your internet connection (some internet filters might block this connection) and try again.",
    too_many_requests_msg: "Access temporarily blocked due to too many failed attempts. Please try again later.",
    register_domain_constraint: "You can only register with an email address ending with @volcani.agri.gov.il",
    password_length_error: "The password must contain at least 6 characters.",
    passwords_dont_match: "The passwords do not match.",
    register_failed: "Registration failed. Try again.",
    email_in_use_error: "Email address is already registered. Go to login screen.",
    weak_password_error: "The password is too weak.",
    lectures_load_error: "Error loading lectures.",
    owner_rules_label: "ADMIN",
    csv_label: "ADMIN",
    
    // Landing page translations
    landing_brand: "Institute of Ag. & Bio. Engineering",
    landing_cta: "Go to Voting System &rarr;",
    landing_cta_sub: "Login to the user area and voting system",
    landing_demo_btn: "Login to System",
    landing_title_1: "The 6th Student Conference",
    landing_title_2: "of the Institute of Agricultural & Biological Engineering",
    landing_footer_1: "The 6th Student Conference on Agricultural and Biological Engineering",
    landing_footer_2: "© 2026 All rights reserved to Volcani Institute & the Institute of Agricultural Engineering",
    landing_footer_3: "Preparing the ground for the agriculture of the future",
    landing_footer_4: "Simulation for planning meeting",
    
    // Landing modal
    modal_title: "Interactive Poll Simulation",
    modal_q: "What technology will have the most dramatic impact on the future of agriculture in the next decade?",
    modal_opt_1: "Autonomous robots and field drones",
    modal_opt_2: "Artificial intelligence (AI) to predict diseases and pests",
    modal_opt_3: "Hydroponic greenhouses and climate-controlled vertical crops",
    modal_opt_4: "Smart sensors and precision irrigation systems",
    modal_voted_success: "Vote registered successfully! Real-time distribution of audience votes:",
    modal_reset: "Re-vote for demonstration purposes",
    modal_footer_note: "The simulator displays the board view planned for projection in the discussion hall.",
    modal_close: "Close Simulation",
    modal_res_1: "Robots and field drones",
    modal_res_2: "Artificial Intelligence (AI)",
    modal_res_3: "Climate-controlled vertical crops",
    modal_res_4: "Smart sensors and precision irrigation",
    edit_lecture_desc: "Here you can add or edit the details of the lecture, its display order, and the questions that will appear in the poll for the voters."
  }
};

export function getLang() {
  return localStorage.getItem("lang") || "he";
}

export function setLang(lang) {
  if (lang === "he" || lang === "en") {
    localStorage.setItem("lang", lang);
    document.documentElement.lang = lang;
    document.documentElement.dir = lang === "he" ? "rtl" : "ltr";
  }
}

export function t(key, variables = {}) {
  const lang = getLang();
  let text = translations[lang]?.[key] || translations["he"]?.[key] || key;
  Object.entries(variables).forEach(([name, val]) => {
    text = text.replace(new RegExp(`\\{${name}\\}`, "g"), val);
  });
  return text;
}

export function translateDOM() {
  const lang = getLang();
  document.documentElement.lang = lang;
  document.documentElement.dir = lang === "he" ? "rtl" : "ltr";

  // Translate all elements with [data-i18n]
  document.querySelectorAll("[data-i18n]").forEach((el) => {
    const key = el.getAttribute("data-i18n");
    if (key) {
      // If it contains children (like icons), keep them and replace text nodes or update textContent
      const icon = el.querySelector("i, svg");
      if (icon) {
        // Keep the icon and translate text next to it
        const textNode = Array.from(el.childNodes).find(n => n.nodeType === Node.TEXT_NODE);
        if (textNode) {
          textNode.textContent = " " + t(key);
        } else {
          el.appendChild(document.createTextNode(" " + t(key)));
        }
      } else {
        el.innerHTML = t(key);
      }
    }
  });

  // Translate all inputs with [data-i18n-placeholder]
  document.querySelectorAll("[data-i18n-placeholder]").forEach((el) => {
    const key = el.getAttribute("data-i18n-placeholder");
    if (key) {
      el.placeholder = t(key);
    }
  });
}

// Add the page load transition, inject the language toggle, and setup the hamburger menu
document.addEventListener("DOMContentLoaded", () => {
  // Apply page transitions
  const mainContainers = document.querySelectorAll("main, .auth-card, section.welcome-panel");
  mainContainers.forEach(container => {
    container.classList.add("page-transition");
  });

  translateDOM();
  injectLangToggle();
  setupHamburgerMenu();
  setupPageTransitions();
  setupGlobalPollStatusListener();
  
  document.body.classList.add("loaded");
});

function setupHamburgerMenu() {
  const topbar = document.querySelector(".topbar");
  const nav = document.querySelector(".topbar nav");
  
  if (topbar && nav) {
    if (document.getElementById("hamburgerBtn")) return;
    
    const hamburger = document.createElement("button");
    hamburger.type = "button";
    hamburger.className = "hamburger-btn";
    hamburger.id = "hamburgerBtn";
    hamburger.setAttribute("aria-label", "Toggle navigation menu");
    hamburger.innerHTML = '<i class="fa-solid fa-bars"></i>';
    
    topbar.insertBefore(hamburger, nav);
    
    hamburger.addEventListener("click", (e) => {
      e.stopPropagation();
      const isOpen = nav.classList.toggle("open");
      hamburger.innerHTML = isOpen 
        ? '<i class="fa-solid fa-xmark"></i>' 
        : '<i class="fa-solid fa-bars"></i>';
    });
    
    document.addEventListener("click", (e) => {
      if (!nav.contains(e.target) && !hamburger.contains(e.target)) {
        if (nav.classList.contains("open")) {
          nav.classList.remove("open");
          hamburger.innerHTML = '<i class="fa-solid fa-bars"></i>';
        }
      }
    });
  }
}

function setupPageTransitions() {
  document.addEventListener("click", (e) => {
    const link = e.target.closest("a[href]");
    if (!link) return;
    const href = link.getAttribute("href");
    if (!href || href.startsWith("http") || href.startsWith("#") || href.startsWith("javascript")) return;
    if (e.ctrlKey || e.metaKey || e.shiftKey || e.altKey) return;
    if (link.target === "_blank") return;
    e.preventDefault();
    
    // Show loading overlay immediately
    showLoadingOverlay();
    
    const transitionEls = document.querySelectorAll(".page-transition");
    if (transitionEls.length) {
      transitionEls.forEach(el => {
        el.classList.remove("page-transition");
        el.classList.add("page-exit");
      });
      setTimeout(() => { window.location.href = href; }, 80);
    } else {
      window.location.href = href;
    }
  });
}

function showLoadingOverlay() {
  // Create overlay if it doesn't exist
  let overlay = document.getElementById("page-loading-overlay");
  if (!overlay) {
    overlay = document.createElement("div");
    overlay.id = "page-loading-overlay";
    overlay.className = "page-transition-overlay active";
    overlay.innerHTML = `
      <p class="spinner-text page-transition-text" data-i18n="page_loading">${t("page_loading")}</p>
    `;
    document.body.appendChild(overlay);
  }
  // Force reflow and show
  overlay.offsetHeight;
  overlay.classList.add("show");
}

function injectLangToggle() {
  const lang = getLang();
  const nextLang = lang === "he" ? "en" : "he";
  const btnText = lang === "he" ? "English" : "עברית";
  
  // Find where to append
  const topNav = document.querySelector(".topbar nav");
  const landingNav = document.querySelector("header nav");
  
  if (topNav) {
    // Check if it already exists
    if (document.querySelector(".lang-toggle-btn")) return;
    
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "btn small secondary lang-toggle-btn";
    btn.innerHTML = `<i class="fa-solid fa-globe"></i> ${btnText}`;
    btn.style.marginInlineStart = "8px";
    btn.addEventListener("click", () => {
      triggerLanguageSwitch(nextLang);
    });
    topNav.appendChild(btn);
  } else if (landingNav) {
    // For index.html
    if (document.querySelector(".lang-toggle-btn")) return;
    
    const container = document.createElement("div");
    container.className = "lang-toggle-container flex items-center";
    
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white font-bold text-xs md:text-sm border border-white/15 transition-all duration-300 flex items-center gap-2 lang-toggle-btn";
    btn.innerHTML = `<i class="fa-solid fa-globe"></i> <span>${btnText}</span>`;
    btn.addEventListener("click", () => {
      triggerLanguageSwitch(nextLang);
    });
    
    const lastElement = landingNav.lastElementChild;
    if (lastElement) {
      // Insert before the last button (e.g. before "הדגמת מערכת הסקרים")
      landingNav.insertBefore(container, lastElement);
      container.appendChild(btn);
      // Let's add standard spacing
      container.style.marginInlineEnd = "12px";
    }
  } else {
    // For login/register pages (no topbar)
    if (document.querySelector(".lang-toggle-btn-floating")) return;
    
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "btn secondary lang-toggle-btn-floating";
    btn.innerHTML = `<i class="fa-solid fa-globe"></i> ${btnText}`;
    
    // Style floating button
    btn.style.position = "fixed";
    btn.style.top = "20px";
    btn.style.right = lang === "he" ? "auto" : "20px";
    btn.style.left = lang === "he" ? "20px" : "auto";
    btn.style.zIndex = "100";
    
    btn.addEventListener("click", () => {
      triggerLanguageSwitch(nextLang);
    });
    
    document.body.appendChild(btn);
  }
}

function triggerLanguageSwitch(nextLang) {
  setLang(nextLang);
  
  // Show loading overlay immediately
  showLoadingOverlay();
  
  const transitionEls = document.querySelectorAll(".page-transition, main, .auth-card, section.welcome-panel");
  if (transitionEls.length) {
    transitionEls.forEach(el => {
      el.classList.remove("page-transition");
      el.classList.add("page-exit");
    });
    setTimeout(() => { location.reload(); }, 80);
  } else {
    location.reload();
  }
}


// Global poll status listener - works on all pages
function setupGlobalPollStatusListener() {
  // Only run on pages that are not login/register/index
  const currentPage = window.location.pathname.split('/').pop();
  const excludedPages = ['login.html', 'register.html', 'index.html', ''];
  
  if (excludedPages.includes(currentPage)) {
    return;
  }
  
  // Dynamically import Firebase and utils only when needed
  import('./firebase-init.js').then(({ db }) => {
    import('https://www.gstatic.com/firebasejs/10.12.5/firebase-database.js').then(({ ref, onValue }) => {
      import('./utils.js').then(({ showToast }) => {
        
        let previousStates = {};
        
        // Listen to all lectures for status changes
        onValue(ref(db, 'lectures'), (snapshot) => {
          const lectures = snapshot.val() || {};
          
          Object.entries(lectures).forEach(([lectureId, lecture]) => {
            const previousState = previousStates[lectureId];
            
            // Only show toast if state actually changed (not on initial load)
            if (previousState !== undefined && previousState !== lecture.isOpen) {
              
              if (lecture.isOpen === true) {
                // Poll opened - GREEN with sound
                showToast({
                  title: t("poll_opened_toast_title"),
                  message: `${lecture.title}`,
                  type: "success",
                  icon: '<i class="fa-solid fa-lock-open"></i>',
                  duration: 5000,
                  playSound: true
                });
              } else {
                // Poll closed - RED with sound
                showToast({
                  title: t("poll_closed_toast_title"),
                  message: `${lecture.title}`,
                  type: "danger",
                  icon: '<i class="fa-solid fa-lock"></i>',
                  duration: 5000,
                  playSound: true
                });
              }
            }
            
            // Update state
            previousStates[lectureId] = lecture.isOpen;
          });
        });
        
      }).catch(err => console.warn('Could not load utils for global listener:', err));
    }).catch(err => console.warn('Could not load Firebase for global listener:', err));
  }).catch(err => console.warn('Could not load Firebase init for global listener:', err));
}
