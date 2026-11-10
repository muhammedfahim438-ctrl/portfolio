import { getStorage } from "firebase/storage";
import { app } from "./firebase";

// Firebase Storage handle. Imported only by admin / upload code — never by
// the landing page.
export const storage = getStorage(app);
