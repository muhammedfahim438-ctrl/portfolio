import { getAuth } from "firebase/auth";
import { app } from "./firebase";

// Firebase Auth handle. Imported only by admin / auth code — never by the
// landing page, which keeps the firebase/auth SDK off its critical path.
export const auth = getAuth(app);
