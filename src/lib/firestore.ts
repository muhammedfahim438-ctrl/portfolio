import {
  doc, getDoc, setDoc, updateDoc, deleteDoc,
  collection, getDocs, addDoc, query, orderBy, onSnapshot,
  where, serverTimestamp, Timestamp
} from "firebase/firestore";
import { db } from "./firebase";
import type { HeroData, Project, Skill, Certification, WorkflowStep, SocialData, Message } from "@/types";

// Site Config
export async function getHeroData(): Promise<HeroData | null> {
  const snap = await getDoc(doc(db, "site_config", "hero_data"));
  return snap.exists() ? (snap.data() as HeroData) : null;
}

export async function updateHeroData(data: Partial<HeroData>) {
  await updateDoc(doc(db, "site_config", "hero_data"), data);
}

// Projects
export async function getProjects(): Promise<Project[]> {
  const snap = await getDocs(collection(db, "projects"));
  return snap.docs.map(d => ({ id: d.id, ...d.data() } as Project));
}

export async function getFeaturedProjects(): Promise<Project[]> {
  const q = query(collection(db, "projects"), where("featured", "==", true));
  const snap = await getDocs(q);
  return snap.docs.map(d => ({ id: d.id, ...d.data() } as Project));
}

export async function addProject(data: Omit<Project, "id">) {
  return addDoc(collection(db, "projects"), data);
}

export async function updateProject(id: string, data: Partial<Project>) {
  return updateDoc(doc(db, "projects", id), data);
}

export async function deleteProject(id: string) {
  return deleteDoc(doc(db, "projects", id));
}

// Skills
export async function getSkills(): Promise<Skill[]> {
  const snap = await getDocs(collection(db, "skills"));
  return snap.docs.map(d => ({ id: d.id, ...d.data() } as Skill));
}

export async function addSkill(data: Omit<Skill, "id">) {
  return addDoc(collection(db, "skills"), data);
}

export async function updateSkill(id: string, data: Partial<Skill>) {
  return updateDoc(doc(db, "skills", id), data);
}

export async function deleteSkill(id: string) {
  return deleteDoc(doc(db, "skills", id));
}

// Certifications
export async function getCertifications(): Promise<Certification[]> {
  const snap = await getDocs(collection(db, "certifications"));
  return snap.docs.map(d => ({ id: d.id, ...d.data() } as Certification));
}

export async function addCertification(data: Omit<Certification, "id">) {
  return addDoc(collection(db, "certifications"), data);
}

export async function updateCertification(id: string, data: Partial<Certification>) {
  return updateDoc(doc(db, "certifications", id), data);
}

export async function deleteCertification(id: string) {
  return deleteDoc(doc(db, "certifications", id));
}

// Workflow Steps
export async function getWorkflowSteps(): Promise<WorkflowStep[]> {
  const snap = await getDocs(collection(db, "workflow_steps"));
  return snap.docs.map(d => ({ id: d.id, ...d.data() } as WorkflowStep));
}

export async function addWorkflowStep(data: Omit<WorkflowStep, "id">) {
  return addDoc(collection(db, "workflow_steps"), data);
}

export async function updateWorkflowStep(id: string, data: Partial<WorkflowStep>) {
  return updateDoc(doc(db, "workflow_steps", id), data);
}

export async function deleteWorkflowStep(id: string) {
  return deleteDoc(doc(db, "workflow_steps", id));
}

// Profile
export async function getSocialData(): Promise<SocialData | null> {
  const snap = await getDoc(doc(db, "profile", "social_data"));
  return snap.exists() ? (snap.data() as SocialData) : null;
}

export async function updateSocialData(data: Partial<SocialData>) {
  await setDoc(doc(db, "profile", "social_data"), data, { merge: true });
}

// Messages
export async function sendMessage(data: Omit<Message, "id" | "created_at">) {
  return addDoc(collection(db, "messages"), {
    ...data,
    created_at: serverTimestamp(),
  });
}

export function subscribeToMessages(callback: (messages: Message[]) => void) {
  const q = query(collection(db, "messages"), orderBy("created_at", "desc"));
  return onSnapshot(q, (snap) => {
    callback(snap.docs.map(d => ({
      id: d.id,
      ...d.data(),
      created_at: d.data().created_at?.toDate(),
    } as Message)));
  });
}

export async function deleteMessage(id: string) {
  return deleteDoc(doc(db, "messages", id));
}
