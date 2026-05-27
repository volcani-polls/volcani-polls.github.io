const translations = {
  he: {
    app_title: "Volcani Polls",
    nav_home: "דף הבית",
    nav_logout: "יציאה",
    nav_admin: "ממשק ניהול",
    nav_admin_users: "ניהול מנהלים",
    nav_voter: "עמוד הצבעות",
    nav_results: "תוצאות",
    loading: "טוען...",
    login: "התחברות",
    register: "הרשמה",
    email: "כתובת מייל",
    password: "סיסמה",
    confirm_password: "אימות סיסמה",
    already_have_user: "כבר יש לך משתמש? ",
    dont_have_user: "אין לך משתמש? ",
    password_label_rules: "סיסמה (לפחות 6 תווים)",
    allowed_emails_note: "הגישה מותרת רק למיילים שמסתיימים ב־@volcani.agri.gov.il",
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
    save_lecture: "שמור הרצאה",
    back_to_admin: "חזרה לממשק ניהול",
    back_to_voter: "חזרה לעמוד הצבעות",
    welcome_back: "ברוך הבא",
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
    voter_subtitle_prefix: "מחובר כעת בתור",
    voter_subtitle_suffix: ", לחצו על אחת מההרצאות כדי להצביע.",
    connected_as_admin: "מחובר כעת בתור מנהל:",
    empty_state: "אין כרגע הרצאות להצגה.",
    voted_status_check: "כבר הצבעת בסקר זה",
    survey_closed_status: "הסקר עדיין סגור להצבעה",
    survey_voted_success: "כבר הצבעת בסקר זה. תודה!",
    no_questions_in_survey: "בסקר זה עדיין אין שאלות.",
    rating_low: "👎 1 = הכי נמוך",
    rating_high: "5 = הכי גבוה 👍",
    send_vote: "שלח הצבעה",
    sending: "שולח...",
    vote_saved_success: "ההצבעה נשמרה בהצלחה. תודה!",
    vote_save_failed: "לא ניתן לשמור את ההצבעה. ייתכן שכבר הצבעת או שהסקר נסגר.",
    answer_all_questions_error: "יש לענות על כל השאלות לפני שליחה.",
    fill_all_fields_error: "יש למלא שם הרצאה ושם מרצה.",
    add_at_least_one_question: "יש להוסיף לפחות שאלה אחת.",
    question_text_placeholder: "טקסט שאלה",
    lecturer: "מרצה:",
    voters_count: "מספר מצביעים",
    total_answers: "מספר תשובות",
    final_average: "ממוצע סופי",
    no_data: "אין נתונים",
    no_data_to_display: "אין נתונים להצגה.",
    question_column: "שאלה",
    voters_column: "מספר מדרגים",
    average_column: "ממוצע",
    owner_prefix: "Owner של המערכת:",
    admins_panel_info_title: "אודות מנהלים",
    admins_panel_info_desc_1: "הגדרת רשימת המנהלים מתבצעת על ידי ה-Owner ב-Firebase Realtime Database תחת config/adminEmailsCsv או ישירות ב-Rules.",
    admins_panel_info_desc_2: "שינויים ייכנסו לתוקף מיד ללא צורך בפריסה מחדש של האתר.",
    admins_list_title: "מנהלים מורשים",
    domain_error_msg: "הגישה מותרת רק עם כתובת מייל של מכון וולקני.",
    login_domain_constraint: "ניתן להתחבר רק עם כתובת מייל שמסתיימת ב־@volcani.agri.gov.il",
    login_failed_msg: "התחברות נכשלה. בדוק מייל וסיסמה ונסה שוב.",
    register_domain_constraint: "ניתן להירשם רק עם כתובת מייל שמסתיימת ב־@volcani.agri.gov.il",
    password_length_error: "הסיסמה חייבת להכיל לפחות 6 תווים.",
    passwords_dont_match: "הסיסמאות אינן זהות.",
    register_failed: "הרשמה נכשלה. נסה שוב.",
    email_in_use_error: "כתובת המייל כבר רשומה. עבור למסך התחברות.",
    weak_password_error: "הסיסמה חלשה מדי.",
    lectures_load_error: "שגיאה בטעינת ההרצאות.",
    owner_rules_label: "Owner / Rules",
    csv_label: "config/adminEmailsCsv",
    
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
    app_title: "Volcani Polls",
    nav_home: "Home",
    nav_logout: "Logout",
    nav_admin: "Admin Panel",
    nav_admin_users: "Manage Admins",
    nav_voter: "Voting Page",
    nav_results: "Results",
    loading: "Loading...",
    login: "Login",
    register: "Register",
    email: "Email Address",
    password: "Password",
    confirm_password: "Confirm Password",
    already_have_user: "Already have an account? ",
    dont_have_user: "Don't have an account? ",
    password_label_rules: "Password (at least 6 characters)",
    allowed_emails_note: "Access allowed only for emails ending with @volcani.agri.gov.il",
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
    save_lecture: "Save Lecture",
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
    voter_subtitle_prefix: "Connected as",
    voter_subtitle_suffix: ", click on a lecture to vote.",
    connected_as_admin: "Connected as admin:",
    empty_state: "There are no lectures to display.",
    voted_status_check: "Already voted in this poll",
    survey_closed_status: "The poll is still closed for voting",
    survey_voted_success: "You have already voted in this poll. Thank you!",
    no_questions_in_survey: "This poll does not have questions yet.",
    rating_low: "👎 1 = Lowest",
    rating_high: "5 = Highest 👍",
    send_vote: "Submit Vote",
    sending: "Sending...",
    vote_saved_success: "Vote submitted successfully. Thank you!",
    vote_save_failed: "Cannot save vote. You might have already voted or the poll was closed.",
    answer_all_questions_error: "Please answer all questions before submitting.",
    fill_all_fields_error: "Please fill in the lecture title and lecturer name.",
    add_at_least_one_question: "Please add at least one question.",
    question_text_placeholder: "Question text",
    lecturer: "Lecturer:",
    voters_count: "Voters Count",
    total_answers: "Total Answers",
    final_average: "Final Average",
    no_data: "No data",
    no_data_to_display: "No data to display.",
    question_column: "Question",
    voters_column: "Raters Count",
    average_column: "Average",
    owner_prefix: "System Owner:",
    admins_panel_info_title: "About Admins",
    admins_panel_info_desc_1: "Defining the admin list is done by the Owner in the Firebase Realtime Database under config/adminEmailsCsv or directly in the Rules.",
    admins_panel_info_desc_2: "Changes take effect immediately without needing to redeploy the site.",
    admins_list_title: "Authorized Admins",
    domain_error_msg: "Access is allowed only with a Volcani Institute email address.",
    login_domain_constraint: "You can only log in with an email address ending with @volcani.agri.gov.il",
    login_failed_msg: "Login failed. Check email and password and try again.",
    register_domain_constraint: "You can only register with an email address ending with @volcani.agri.gov.il",
    password_length_error: "The password must contain at least 6 characters.",
    passwords_dont_match: "The passwords do not match.",
    register_failed: "Registration failed. Try again.",
    email_in_use_error: "Email address is already registered. Go to login screen.",
    weak_password_error: "The password is too weak.",
    lectures_load_error: "Error loading lectures.",
    owner_rules_label: "Owner / Rules",
    csv_label: "config/adminEmailsCsv",
    
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

// Add the page load transition and inject the language toggle button
document.addEventListener("DOMContentLoaded", () => {
  // Apply page transitions
  const mainContainers = document.querySelectorAll("main, .auth-card, section.welcome-panel");
  mainContainers.forEach(container => {
    container.classList.add("page-transition");
  });

  translateDOM();
  injectLangToggle();
});

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
      setLang(nextLang);
      location.reload();
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
      setLang(nextLang);
      location.reload();
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
      setLang(nextLang);
      location.reload();
    });
    
    document.body.appendChild(btn);
  }
}
