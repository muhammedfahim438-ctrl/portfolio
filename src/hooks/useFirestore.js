"use client";

import { useState, useEffect, useCallback } from "react";
import {
  collection,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
} from "firebase/firestore";
import { db } from "@/lib/firebase";

export function useFirestore(collectionName) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const refresh = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const snapshot = await getDocs(collection(db, collectionName));
      const items = snapshot.docs.map((d) => ({
        id: d.id,
        ...d.data(),
      }));
      setData(items);
    } catch (err) {
      setError(err.message ?? "Failed to fetch documents");
    } finally {
      setLoading(false);
    }
  }, [collectionName]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const addDocument = useCallback(
    async (document) => {
      try {
        const docRef = await addDoc(collection(db, collectionName), document);
        await refresh();
        return docRef.id;
      } catch (err) {
        setError(err.message ?? "Failed to add document");
        return null;
      }
    },
    [collectionName, refresh]
  );

  const updateDocument = useCallback(
    async (id, updates) => {
      try {
        await updateDoc(doc(db, collectionName, id), updates);
        await refresh();
      } catch (err) {
        setError(err.message ?? "Failed to update document");
      }
    },
    [collectionName, refresh]
  );

  const deleteDocument = useCallback(
    async (id) => {
      try {
        await deleteDoc(doc(db, collectionName, id));
        await refresh();
      } catch (err) {
        setError(err.message ?? "Failed to delete document");
      }
    },
    [collectionName, refresh]
  );

  return { data, loading, error, addDocument, updateDocument, deleteDocument, refresh };
}
