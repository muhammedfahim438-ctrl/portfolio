let _fs = null;
let _db = null;

// Lazy-loads the Firestore SDK only when a section actually needs it.
// Every landing section calls its Firestore helper from a useEffect (after
// first paint), so the 713 KB firebase bundle leaves the critical path.
async function ready() {
  if (!_fs) {
    const [fs, dbMod] = await Promise.all([
      import("firebase/firestore"),
      import("./firestoreDb"),
    ]);
    _fs = fs;
    _db = dbMod.db;
  }
  return { ..._fs, db: _db };
}

// Builds a deterministic doc id from email + UTC day so firestore.rules can
// enforce one message per email per day without a hash (rules can't hash;
// they can only lowerAscii()/replace()/concatenate). Both sides use UTC to
// avoid client/server date mismatches.
function messageDocId(senderEmail) {
  const today = new Date();
  const id = `${senderEmail.trim().toLowerCase()}-${today.getUTCFullYear()}-${today.getUTCMonth() + 1}-${today.getUTCDate()}`;
  return id;
}

export async function getHeroData() {
  const { doc, getDoc, db } = await ready();
  const snap = await getDoc(doc(db, "site_config", "hero_data"));
  return snap.exists() ? snap.data() : null;
}

export async function updateHeroData(data) {
  const { doc, updateDoc, db } = await ready();
  await updateDoc(doc(db, "site_config", "hero_data"), data);
}

export async function getConfig(key, fallback = null) {
  const { doc, getDoc, db } = await ready();
  const snap = await getDoc(doc(db, "site_config", key));
  return snap.exists() ? snap.data() : fallback;
}

export async function setConfig(key, data) {
  const { doc, setDoc, db } = await ready();
  await setDoc(doc(db, "site_config", key), data || {}, { merge: true });
}

export async function getProfile(key) {
  const { doc, getDoc, db } = await ready();
  const snap = await getDoc(doc(db, "profile", key));
  return snap.exists() ? snap.data() : null;
}

export async function setProfileConfig(key, data) {
  const { doc, setDoc, db } = await ready();
  await setDoc(doc(db, "profile", key), data || {}, { merge: true });
}

export async function getCollection(name) {
  const { collection, getDocs, db } = await ready();
  const snap = await getDocs(collection(db, name));
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
}

export async function addItem(name, data) {
  const { collection, addDoc, db } = await ready();
  return addDoc(collection(db, name), data);
}

export async function updateItem(name, id, data) {
  const { doc, updateDoc, db } = await ready();
  await updateDoc(doc(db, name, id), data);
}

export async function deleteItem(name, id) {
  const { doc, deleteDoc, db } = await ready();
  await deleteDoc(doc(db, name, id));
}

const COLLECTIONS = {
  projects: "projects",
  skills: "skills",
  certifications: "certifications",
  recognition: "recognition",
  testimonials: "testimonials",
  trusted_by: "trusted_by",
};

export async function getCollectionDocs(name) {
  const { collection, getDocs, db } = await ready();
  const snap = await getDocs(collection(db, COLLECTIONS[name] ?? name));
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
}

export async function dedupeCollection(name) {
  const { doc, deleteDoc, db } = await ready();
  const docs = await getCollectionDocs(name);
  const seen = new Set();
  let removed = 0;
  for (const item of docs) {
    const key = String(item.title ?? item.author ?? item.name ?? "").trim().toLowerCase();
    if (!key) continue;
    if (seen.has(key)) {
      await deleteDoc(doc(db, COLLECTIONS[name] ?? name, item.id));
      removed += 1;
    } else {
      seen.add(key);
    }
  }
  return { collection: name, checked: docs.length, removed };
}

// Projects
export async function getProjects() {
  const { collection, getDocs, db } = await ready();
  const snap = await getDocs(collection(db, "projects"));
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
}

export async function getFeaturedProjects() {
  const { collection, getDocs, query, where, db } = await ready();
  const q = query(collection(db, "projects"), where("featured", "==", true));
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
}

export async function addProject(data) {
  const { collection, addDoc, db } = await ready();
  return addDoc(collection(db, "projects"), data);
}

export async function updateProject(id, data) {
  const { doc, updateDoc, db } = await ready();
  await updateDoc(doc(db, "projects", id), data);
}

export async function deleteProject(id) {
  const { doc, deleteDoc, db } = await ready();
  await deleteDoc(doc(db, "projects", id));
}

// Skills
export async function getSkills() {
  const { collection, getDocs, db } = await ready();
  const snap = await getDocs(collection(db, "skills"));
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
}

export async function addSkill(data) {
  const { collection, addDoc, db } = await ready();
  return addDoc(collection(db, "skills"), data);
}

export async function updateSkill(id, data) {
  const { doc, updateDoc, db } = await ready();
  await updateDoc(doc(db, "skills", id), data);
}

export async function deleteSkill(id) {
  const { doc, deleteDoc, db } = await ready();
  await deleteDoc(doc(db, "skills", id));
}

// Certifications
export async function getCertifications() {
  const { collection, getDocs, db } = await ready();
  const snap = await getDocs(collection(db, "certifications"));
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
}

export async function addCertification(data) {
  const { collection, addDoc, db } = await ready();
  return addDoc(collection(db, "certifications"), data);
}

export async function updateCertification(id, data) {
  const { doc, updateDoc, db } = await ready();
  await updateDoc(doc(db, "certifications", id), data);
}

export async function deleteCertification(id) {
  const { doc, deleteDoc, db } = await ready();
  await deleteDoc(doc(db, "certifications", id));
}

// Recognition
export async function getRecognition() {
  const { collection, getDocs, db } = await ready();
  const snap = await getDocs(collection(db, "recognition"));
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
}

export async function addRecognition(data) {
  const { collection, addDoc, db } = await ready();
  return addDoc(collection(db, "recognition"), data);
}

export async function updateRecognition(id, data) {
  const { doc, updateDoc, db } = await ready();
  await updateDoc(doc(db, "recognition", id), data);
}

export async function deleteRecognition(id) {
  const { doc, deleteDoc, db } = await ready();
  await deleteDoc(doc(db, "recognition", id));
}

// Testimonials
export async function getTestimonials() {
  const { collection, getDocs, db } = await ready();
  const snap = await getDocs(collection(db, "testimonials"));
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
}

export async function addTestimonial(data) {
  const { collection, addDoc, db } = await ready();
  return addDoc(collection(db, "testimonials"), data);
}

export async function updateTestimonial(id, data) {
  const { doc, updateDoc, db } = await ready();
  await updateDoc(doc(db, "testimonials", id), data);
}

export async function deleteTestimonial(id) {
  const { doc, deleteDoc, db } = await ready();
  await deleteDoc(doc(db, "testimonials", id));
}

// Trusted By
export async function getTrustedBy() {
  const { collection, getDocs, db } = await ready();
  const snap = await getDocs(collection(db, "trusted_by"));
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
}

export async function addTrustedBy(data) {
  const { collection, addDoc, db } = await ready();
  return addDoc(collection(db, "trusted_by"), data);
}

export async function updateTrustedBy(id, data) {
  const { doc, updateDoc, db } = await ready();
  await updateDoc(doc(db, "trusted_by", id), data);
}

export async function deleteTrustedBy(id) {
  const { doc, deleteDoc, db } = await ready();
  await deleteDoc(doc(db, "trusted_by", id));
}

// Profile
export async function getSocialData() {
  const { doc, getDoc, db } = await ready();
  const snap = await getDoc(doc(db, "profile", "social_data"));
  return snap.exists() ? snap.data() : null;
}

export async function updateSocialData(data) {
  const { doc, setDoc, db } = await ready();
  await setDoc(doc(db, "profile", "social_data"), data, { merge: true });
}

// Messages — deterministic doc id for per-email-per-day rate limiting.
export async function sendMessage(data) {
  const { doc, setDoc, serverTimestamp, db } = await ready();
  const id = messageDocId(data.sender_email);
  await setDoc(doc(db, "messages", id), {
    ...data,
    sender_email: data.sender_email.trim(),
    created_at: serverTimestamp(),
  });
  return { id };
}

export function subscribeToMessages(callback) {
  let unsub = null;
  let cancelled = false;
  (async () => {
    const { collection, query, orderBy, onSnapshot, db } = await ready();
    if (cancelled) return;
    const q = query(collection(db, "messages"), orderBy("created_at", "desc"));
    unsub = onSnapshot(q, (snap) => {
      callback(snap.docs.map((d) => ({
        id: d.id,
        ...d.data(),
        created_at: d.data().created_at?.toDate(),
      })));
    });
  })();
  return () => {
    cancelled = true;
    if (unsub) unsub();
  };
}

export async function deleteMessage(id) {
  const { doc, deleteDoc, db } = await ready();
  await deleteDoc(doc(db, "messages", id));
}
