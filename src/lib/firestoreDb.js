import { getFirestore } from "firebase/firestore";
import { app } from "./firebase";

// Eager Firestore handle. Imported only by admin / seed code — never by the
// landing page, which lazy-loads firestore via src/lib/firestore.js.
export const db = getFirestore(app);
