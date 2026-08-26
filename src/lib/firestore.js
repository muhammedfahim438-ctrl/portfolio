import {
  doc, getDoc, setDoc, updateDoc, deleteDoc,
  collection, getDocs, addDoc, query, orderBy, onSnapshot,
  where, serverTimestamp, Timestamp
} from "firebase/firestore";
import { db } from "./firebase";

// Site Config
export async function getHeroData() {
  const snap = await getDoc(doc(db, "site_config", "hero_data"));
  return snap.exists() ? snap.data() : null;
}

export async function updateHeroData(data) {
  await updateDoc(doc(db, "site_config", "hero_data"), data);
}

// Projects
export async function getProjects() {
  const snap = await getDocs(collection(db, "projects"));
  return snap.docs.map(d => ({ id: d.id, ...d.data() }));
}

export async function getFeaturedProjects() {
  const q = query(collection(db, "projects"), where("featured", "==", true));
  const snap = await getDocs(q);
  return snap.docs.map(d => ({ id: d.id, ...d.data() }));
}

export async function addProject(data) {
  return addDoc(collection(db, "projects"), data);
}

export async function updateProject(id, data) {
  return updateDoc(doc(db, "projects", id), data);
}

export async function deleteProject(id) {
  return deleteDoc(doc(db, "projects", id));
}

// Skills
export async function getSkills() {
  const snap = await getDocs(collection(db, "skills"));
  return snap.docs.map(d => ({ id: d.id, ...d.data() }));
}

export async function addSkill(data) {
  return addDoc(collection(db, "skills"), data);
}

export async function updateSkill(id, data) {
  return updateDoc(doc(db, "skills", id), data);
}

export async function deleteSkill(id) {
  return deleteDoc(doc(db, "skills", id));
}

// Certifications
export async function getCertifications() {
  const snap = await getDocs(collection(db, "certifications"));
  return snap.docs.map(d => ({ id: d.id, ...d.data() }));
}

export async function addCertification(data) {
  return addDoc(collection(db, "certifications"), data);
}

export async function updateCertification(id, data) {
  return updateDoc(doc(db, "certifications", id), data);
}

export async function deleteCertification(id) {
  return deleteDoc(doc(db, "certifications", id));
}

// Workflow Steps
export async function getWorkflowSteps() {
  const snap = await getDocs(collection(db, "workflow_steps"));
  return snap.docs.map(d => ({ id: d.id, ...d.data() }));
}

export async function addWorkflowStep(data) {
  return addDoc(collection(db, "workflow_steps"), data);
}

export async function updateWorkflowStep(id, data) {
  return updateDoc(doc(db, "workflow_steps", id), data);
}

export async function deleteWorkflowStep(id) {
  return deleteDoc(doc(db, "workflow_steps", id));
}

// Profile
export async function getSocialData() {
  const snap = await getDoc(doc(db, "profile", "social_data"));
  return snap.exists() ? snap.data() : null;
}

export async function updateSocialData(data) {
  await setDoc(doc(db, "profile", "social_data"), data, { merge: true });
}

// Messages
export async function sendMessage(data) {
  return addDoc(collection(db, "messages"), {
    ...data,
    created_at: serverTimestamp(),
  });
}

export function subscribeToMessages(callback) {
  const q = query(collection(db, "messages"), orderBy("created_at", "desc"));
  return onSnapshot(q, (snap) => {
    callback(snap.docs.map(d => ({
      id: d.id,
      ...d.data(),
      created_at: d.data().created_at?.toDate(),
    })));
  });
}

export async function deleteMessage(id) {
  return deleteDoc(doc(db, "messages", id));
}
