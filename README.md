# Volcani Polls

מערכת סקרי הרצאות סטטית עבור GitHub Pages, מבוססת Firebase Authentication ו־Firebase Realtime Database.

## מה יש בפרויקט

- הרשמה והתחברות עם Email/Password.
- הרשאה אוטומטית לכל משתמש עם מייל שמסתיים ב־`@volcani.agri.gov.il`.
- אין אימות מייל, כדי לא לעכב משתמשים וכדי להימנע מחסימות דואר.
- מנהל ראשי לפי `config/ownerEmail`.
- מנהלים מוגדרים ידנית ב־Realtime Database תחת `config/adminEmailsCsv` או ישירות ב־Rules.
- יצירת הרצאות/סקרים, שאלות ודירוג 1–5.
- סקר סגור מוצג באפור ולא ניתן להצבעה.
- הצבעה אחת בלבד לכל משתמש בכל סקר.
- תוצאות מנהל: ממוצע לפי שאלה וממוצע סופי להרצאה.

## פריסה ב־GitHub Pages

1. העלה את כל הקבצים לריפוזיטורי GitHub.
2. עבור ל־Settings → Pages.
3. בחר Branch: `main` ו־Folder: `/root`.
4. שמור ופתח את כתובת האתר ש־GitHub מספק.

## הגדרות Firebase נדרשות

### Authentication

ודא ש־Email/Password מופעל:

Firebase Console → Authentication → Sign-in method → Email/Password → Enabled

### Realtime Database Rules

העתק את התוכן של `database.rules.json` אל:

Firebase Console → Realtime Database → Rules

### הגדרת Owner ראשוני

ב־Realtime Database → Data הוסף ידנית:

```json
{
  "config": {
    "ownerEmail": "yehudah@volcani.agri.gov.il",
    "adminEmailsCsv": "yehudah@volcani.agri.gov.il,admin2@volcani.agri.gov.il,admin3@volcani.agri.gov.il"
  }
}
```

החלף את `your.name@volcani.agri.gov.il` במייל שלך.

> חשוב: ה־Owner צריך להירשם באתר עם אותו מייל בדיוק. מנהלים נוספים מוסיפים ידנית ב־Realtime Database תחת `config/adminEmailsCsv` או ישירות ב־Rules, לא מתוך הממשק.

## סדר עבודה מומלץ

1. פרוס את האתר.
2. התקן את ה־Realtime Database Rules.
3. הוסף `config/ownerEmail`.
4. הירשם באתר עם מייל ה־Owner.
5. היכנס ל־`admin.html`.
6. צור הרצאה חדשה.
7. פתח את הסקר להצבעה רק כשהכול מוכן.

## הערות אבטחה

- ה־Firebase Web API Key אינו סוד. האבטחה מתבצעת באמצעות Firebase Authentication ו־Realtime Database Rules.
- אי אפשר למנוע לחלוטין יצירת משתמש Authentication עם מייל זר רק דרך RTDB Rules, אבל משתמש כזה לא יוכל לקרוא/לכתוב ל־Realtime Database.
- ההגבלה האמיתית של הנתונים היא ב־`database.rules.json`.

## קבצים מרכזיים

- `index.html` — התחברות.
- `register.html` — הרשמה.
- `voter.html` — רשימת סקרים למצביעים.
- `survey.html` — הצבעה בסקר.
- `admin.html` — ניהול הרצאות.
- `admin-edit-lecture.html` — הוספה/עריכת הרצאה.
- `admin-results.html` — תוצאות.
- `admin-users.html` — תצוגת מנהלים קיימים בלבד.
- `database.rules.json` — חוקי אבטחה ל־Realtime Database.
