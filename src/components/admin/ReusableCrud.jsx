"use client";

import { useState, useEffect, useCallback } from "react";
import toast from "react-hot-toast";
import { getCollection, addItem, updateItem, deleteItem } from "@/lib/firestore";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";

export function ReusableCrud({ collection, schema, title, buildTitle, emptyItem }) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(emptyItem ?? {});
  const [saving, setSaving] = useState(false);
  const [tagBuffers, setTagBuffers] = useState({});
  const [deletingId, setDeletingId] = useState(null);

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

  function openEdit(item) {
    setEditingId(item.id ?? null);
    const next = {};
    const buffers = {};
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

  function updateField(key, value) {
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
        payload[f.key] = String(form[f.key] ?? "")
          .split("\n")
          .map((s) => s.trim())
          .filter(Boolean);
      }
      if (f.type === "number") payload[f.key] = Number(payload[f.key]) || 0;
      if (f.type === "bool") payload[f.key] = !!payload[f.key];
    });
    try {
      if (editingId) {
        await updateItem(collection, editingId, payload);
        toast.success("Updated");
      } else {
        await addItem(collection, payload);
        toast.success("Added");
      }
      setModalOpen(false);
      await load();
    } catch {
      toast.error("Save failed");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id) {
    if (!confirm("Delete this item? This cannot be undone.")) return;
    setDeletingId(id);
    try {
      await deleteItem(collection, id);
      toast.success("Deleted");
      setItems((prev) => prev.filter((it) => it.id !== id));
    } catch {
      toast.error("Delete failed");
    } finally {
      setDeletingId(null);
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-themeText">{title}</h3>
        <Button onClick={openAdd} size="sm">Add New</Button>
      </div>

      {loading ? (
        <div className="glass py-10 text-center text-themeText/40">Loading…</div>
      ) : items.length === 0 ? (
        <div className="glass py-10 text-center text-themeText/40">
          Nothing here yet. Click &ldquo;Add New&rdquo;.
        </div>
      ) : (
        <ul className="space-y-2">
          {items.map((item) => (
            <li
              key={item.id}
              className="glass flex items-center justify-between gap-3 rounded-xl px-4 py-3"
            >
              <div className="min-w-0">
                <p className="truncate text-sm font-medium text-themeText">
                  {buildTitle ? buildTitle(item) : (item.title || item.name || item.id)}
                </p>
                {(item.desc || item.description) && (
                  <p className="truncate text-xs text-themeText-secondary">{item.desc || item.description}</p>
                )}
              </div>
              <div className="flex shrink-0 items-center gap-2">
                <button
                  onClick={() => openEdit(item)}
                  className="rounded-md px-3 py-1.5 text-xs font-medium text-themeAccent hover:bg-themeAccent/10 transition-colors"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(item.id)}
                  disabled={deletingId === item.id}
                  className="rounded-md px-3 py-1.5 text-xs font-medium text-red-400 hover:bg-red-400/10 transition-colors disabled:opacity-50"
                >
                  {deletingId === item.id ? "…" : "Delete"}
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}

      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)}>
        <div className="space-y-4 max-h-[80vh] overflow-y-auto pr-2">
          <h4 className="text-lg font-semibold text-themeText">
            {editingId ? `Edit ${title}` : `New ${title}`}
          </h4>

          {(schema ?? []).map((f) => (
            <FieldEditor
              key={f.key}
              field={f}
              value={f.type === "tags" ? (tagBuffers[f.key] ?? "") : (form[f.key] ?? "")}
              onChange={(v) => (f.type === "tags" ? setTagBuffers((p) => ({ ...p, [f.key]: v })) : updateField(f.key, v))}
            />
          ))}

          <div className="flex justify-end gap-3 pt-2">
            <Button variant="ghost" onClick={() => setModalOpen(false)}>Cancel</Button>
            <Button onClick={handleSave} disabled={saving}>
              {saving ? "Saving…" : editingId ? "Update" : "Create"}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}

function FieldEditor({ field, value, onChange }) {
  const label = (
    <label className="block text-sm font-medium text-themeText/70">{field.label}</label>
  );
  const inputClass =
    "w-full rounded-lg bg-themeInput px-4 py-2.5 text-themeText border border-themeBorder outline-none focus:ring-2 focus:ring-themeAccent/40";

  if (field.type === "textarea" || field.type === "lines") {
    return (
      <div className="space-y-1.5">
        {label}
        <textarea rows={field.rows ?? 3} value={value} onChange={(e) => onChange(e.target.value)} className={`${inputClass} resize-y`} placeholder={field.placeholder} />
      </div>
    );
  }

  if (field.type === "select") {
    return (
      <div className="space-y-1.5">
        {label}
        <select value={value} onChange={(e) => onChange(e.target.value)} className={inputClass}>
          {(field.options ?? []).map((o) => (
            <option key={o} value={o}>{o}</option>
          ))}
        </select>
      </div>
    );
  }

  if (field.type === "bool") {
    return (
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={() => onChange(!value)}
          className={`relative h-6 w-11 rounded-full transition-colors ${value ? "bg-themeAccent" : "bg-themeBorder"}`}
        >
          <span className={`absolute top-1 left-1 h-4 w-4 rounded-full bg-white transition-transform ${value ? "translate-x-5" : ""}`} />
        </button>
        {label}
      </div>
    );
  }

  return (
    <div className="space-y-1.5">
      {label}
      <input
        type={field.type === "number" ? "number" : "text"}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={field.placeholder}
        className={inputClass}
      />
    </div>
  );
}
