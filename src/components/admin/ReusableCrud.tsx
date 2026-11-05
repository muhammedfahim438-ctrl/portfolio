"use client";

import { useState, useEffect, useCallback } from "react";
import toast from "react-hot-toast";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";

export interface SchemaField {
  key: string;
  label: string;
  type: "text" | "textarea" | "tags" | "lines" | "select" | "bool" | "number";
  options?: string[];
  rows?: number;
  placeholder?: string;
}

export interface ReusableCrudProps {
  collection: string;
  schema: SchemaField[];
  title: string;
  emptyItem?: Record<string, unknown>;
  buildTitle?: (item: Record<string, unknown>) => string;
}

export function ReusableCrud({ collection, schema, title, emptyItem, buildTitle }: ReusableCrudProps) {
  const [items, setItems] = useState<Record<string, unknown>[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<Record<string, unknown>>({});
  const [saving, setSaving] = useState(false);
  const [tagBuffers, setTagBuffers] = useState<Record<string, string>>({});
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const load = useCallback(async () => {
    try {
      setItems(await getCollection(collection));
    } catch {
      toast.error(`Failed to load ${title.toLowerCase()}`);
    } finally {
      setLoading(false);
    }
  }, [collection, title]);

  useEffect(() => {
    load();
  }, [load]);

  function openAdd() {
    setEditingId(null);
    setForm(emptyItem ?? {});
    setTagBuffers({});
    setModalOpen(true);
  }

  function openEdit(item: Record<string, unknown>) {
    setEditingId(item.id ?? null);
    const next: Record<string, unknown> = {};
    const buffers: Record<string, string> = {};
    (schema ?? []).forEach((f) => {
      const val = item[f.key] ?? f.default ?? "";
      next[f.key] = f.type === "lines" && Array.isArray(val) ? val.join("\n") : val;
      if (f.type === "tags") {
        buffers[f.key] = Array.isArray(val) ? val.join(", ") : "";
      }
    });
    setForm(next);
    setTagBuffers(buffers);
    setModalOpen(true);
  }

  function updateField(key: string, value: unknown) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  async function handleSave() {
    setSaving(true);
    const payload = { ...form };
    (schema ?? []).forEach((f) => {
      if (f.type === "tags") {
        payload[f.key] = String(tagBuffers[f.key] ?? "")
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean);
      }
      if (f.type === "lines") {
        payload[f.key] = String(tagBuffers[f.key] ?? "")
          .split("\n")
          .map((s) => s.trim())
          .filter(Boolean);
      }
    });

    try {
      if (editingId) {
        await updateItem(collection, editingId, payload as any);
        toast.success("Updated successfully");
      } else {
        await addItem(collection, payload as any);
        toast.success("Added successfully");
      }
      setModalOpen(false);
      setEditingId(null);
      setForm(emptyItem ?? {});
      setTagBuffers({});
      await load();
    } catch {
      toast.error("Failed to save");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Delete this item?")) return;
    setDeletingId(id);
    try {
      await deleteItem(collection, id);
      toast.success("Deleted successfully");
      await load();
    } catch {
      toast.error("Failed to delete");
    } finally {
      setDeletingId(null);
    }
  }

  return null; // placeholder - actual rendering in admin page
}

async function getCollection(name: string) {
  const { db } = await import("@/lib/firebase");
  const { collection, getDocs } = await import("@/lib/firestore");
  const snap = await getDocs(collection(db!, name));
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
}

async function addItem(name: string, data: Record<string, unknown>) {
  const { doc, addDoc } = await import("@/lib/firestore");
  const { db } = await import("@/lib/firebase");
  await addDoc(doc(db!, name), data);
}

async function updateItem(name: string, id: string, data: Record<string, unknown>) {
  const { doc, updateDoc } = await import("@/lib/firestore");
  const { db } = await import("@/lib/firebase");
  await updateDoc(doc(db!, name, id), data);
}

async function deleteItem(name: string, id: string) {
  const { doc, deleteDoc } = await import("@/lib/firestore");
  const { db } = await import("@/lib/firebase");
  await deleteDoc(doc(db!, name, id));
}