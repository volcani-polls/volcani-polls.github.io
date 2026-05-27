// Shared guard entry-point for pages that only need login protection.
import { requireLogin, wireLogoutButtons } from "./utils.js";

await requireLogin();
wireLogoutButtons();
