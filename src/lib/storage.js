"use client";

import { ref, uploadBytesResumable, getDownloadURL, deleteObject } from "firebase/storage";
import { storage } from "./firebase";

export function uploadFile(file, folder = "uploads", onProgress) {
  const ext = (file.name.match(/\.\w+$/) || [""])[0].toLowerCase();
  const name = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}${ext}`;
  const path = `${folder}/${name}`;
  const task = uploadBytesResumable(ref(storage, path), file);

  task.on(
    "state_changed",
    (snap) => {
      if (onProgress) {
        onProgress(Math.round((snap.bytesTransferred / snap.totalBytes) * 100));
      }
    },
    () => {}
  );

  return task.then(async (snap) => {
    const url = await getDownloadURL(snap.ref);
    return { url, path };
  });
}

export async function deleteFile(path) {
  if (!path) return;
  try {
    await deleteObject(ref(storage, path));
  } catch {
    // ignore — file may not exist
  }
}
