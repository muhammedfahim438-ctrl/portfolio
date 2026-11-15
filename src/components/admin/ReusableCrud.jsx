"use client";

import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import {
  getCollection,
  addItem,
  updateItem,
  deleteItem,
} from "@/lib/firestore";

export function ReusableCrud({ collection, schema, title, emptyItem }) {
  const [items, setItems] = useState([]);
  const [form, setForm] = useState(emptyItem);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState(null);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const data = await getCollection(collection);
        if (!cancelled) setItems(data);
      } catch {
        if (!cancelled) setItems([]);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [collection, title]);

  async function reload() {
    try {
      const data = await getCollection(collection);
      setItems(data);
    } catch {
      toast.error(`Failed to load ${title}`);
    }
  }

  async function handleSave() {
    setSaving(true);
    try {
      if (editingId) {
        await updateItem(collection, editingId, form);
        toast.success(`${title} updated`);
      } else {
        await addItem(collection, form);
        toast.success(`${title} added`);
      }
      setEditingId(null);
      setForm({ ...emptyItem });
      await reload();
    } catch {
      toast.error(`Failed to save ${title}`);
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id) {
    if (!confirm(`Delete this ${title}?`)) return;
    setDeletingId(id);
    try {
      await deleteItem(collection, id);
      setItems((prev) => prev.filter((i) => i.id !== id));
      toast.success(`${title} deleted`);
    } catch {
      toast.error(`Failed to delete ${title}`);
    } finally {
      setDeletingId(null);
    }
  }

  function startEdit(item) {
    setEditingId(item.id);
    setForm({ ...item });
  }

  function cancelEdit() {
    setEditingId(null);
    setForm({ ...emptyItem });
  }

  const getFieldValue = (key) => {
    const val = form[key];
    if (Array.isArray(val)) return val.join(", ");
    return val ?? "";
  };

  const setFieldValue = (key, value) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  return (
    <section className="space-y-6 rounded-none p-6 border-4 border-themeAccent bg-themeSurface/30 shadow-[4px_4px_0_0_var(--dg-bg-deep)] dg-r-0 dg-chunky">
      <h2 className="text-lg font-display font-bold text-themeText uppercase tracking-[0.05em] mb-4 dg-f-display">
        {title}
      </h2>

      {loading && <p className="text-themeText/40">Loading {title}…</p>}
      {!loading && items.length === 0 && <p className="text-themeText/40">No {title} yet.</p>}
      {!loading && items.length > 0 && (
        <div className="space-y-6">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm border-collapse">
              <thead className="border-b-4 border-themeAccent text-themeTextSecondary/60">
                <tr>
                  {schema.map((f) => (
                    <th key={f.key} className="px-4 py-3 font-mono text-[10px] uppercase tracking-wider text-left">
                      {f.label}
                    </th>
                  ))}
                  <th className="px-4 py-3 font-mono text-[10px] uppercase tracking-wider text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-themeAccent/30">
                {items.map((item) => (
                  <tr key={item.id} className="hover:bg-themeBg/40 transition-all duration-150">
                    {schema.map((f) => (
                      <td key={f.key} className="px-4 py-3 text-themeText font-medium">
                        {f.type === "tags" && Array.isArray(item[f.key]) ? (
                          <span className="text-[10px] text-themeAccent dg-ui-mono">
                            {item[f.key].join(", ")}
                          </span>
                        ) : (
                          item[f.key] ?? "-"
                        )}
                      </td>
                    ))}
                    <td className="px-4 py-3 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => startEdit(item)}
                          className="px-3 py-1 text-xs font-medium text-themeAccent hover:bg-themeAccent/10 shadow-[1px_1px_0_0_var(--dg-bg-deep)] hover:shadow-[2px_2px_0_0_var(--dg-bg-deep)] transition-all duration-150 active:shadow-[0px_0px_0_0_var(--dg-bg-deep)] active:translate-[1px_1px] dg-f-mono dg-r-0"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(item.id)}
                          disabled={deletingId === item.id}
                          className="px-3 py-1 text-xs font-medium text-themeAccent hover:bg-themeAccent/10 shadow-[1px_1px_0_0_var(--dg-bg-deep)] transition-all duration-150 disabled:opacity-50 dg-f-mono dg-r-0"
                        >
                          {deletingId === item.id ? "…" : "Delete"}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mt-8 space-y-4">
            <h3 className="text-sm font-display font-bold text-themeText uppercase mb-3 dg-f-display">
              {editingId ? "Edit" : "Add New"} {title}
            </h3>

            <form onSubmit={(e) => { e.preventDefault(); handleSave(); }} className="space-y-4">
              {schema.map((field) => (
                <div key={field.key} className="space-y-1.5">
                  <label
                    htmlFor={`crud-${field.key}`}
                    className="block text-[10px] font-mono uppercase tracking-wider text-themeTextSecondary dg-ui-mono"
                  >
                    {field.label}
                  </label>
                  {field.type === "textarea" ? (
                    <textarea
                      id={`crud-${field.key}`}
                      value={getFieldValue(field.key)}
                      onChange={(e) => setFieldValue(field.key, e.target.value)}
                      rows={field.rows || 3}
                      className="w-full rounded-none border-4 border-themeAccent bg-themeInput px-4 py-3 text-themeText focus:outline-none focus:border-themeAccent shadow-[2px_2px_0_0_var(--dg-bg-deep)] focus:shadow-[4px_4px_0_0_var(--dg-bg-deep)] transition-all duration-150 resize-y dg-r-0"
                    />
                  ) : field.type === "select" ? (
                    <select
                      id={`crud-${field.key}`}
                      value={getFieldValue(field.key)}
                      onChange={(e) => setFieldValue(field.key, e.target.value)}
                      className="w-full rounded-none border-4 border-themeAccent bg-themeInput px-4 py-3 text-themeText focus:outline-none focus:border-themeAccent shadow-[2px_2px_0_0_var(--dg-bg-deep)] focus:shadow-[4px_4px_0_0_var(--dg-bg-deep)] transition-all duration-150 dg-r-0"
                    >
                      {field.options.map((opt) => (
                        <option key={opt} value={opt}>{opt}</option>
                      ))}
                    </select>
                  ) : field.type === "bool" ? (
                    <div className="flex items-center gap-2">
                      <input
                        id={`crud-${field.key}`}
                        type="checkbox"
                        checked={getFieldValue(field.key) === "true" || getFieldValue(field.key) === true}
                        onChange={(e) => setFieldValue(field.key, e.target.checked)}
                        className="w-4 h-4 border-4 border-themeAccent text-themeAccent bg-themeInput shadow-[1px_1px_0_0_var(--dg-bg-deep)] dg-r-0"
                      />
                      <span className="text-xs font-mono uppercase tracking-wider text-themeTextSecondary dg-ui-mono">
                        {field.label}
                      </span>
                    </div>
                  ) : field.type === "tags" ? (
                    <input
                      id={`crud-${field.key}`}
                      type="text"
                      value={getFieldValue(field.key)}
                      onChange={(e) => setFieldValue(field.key, e.target.value.split(",").map((t) => t.trim()).filter(Boolean))}
                      placeholder={field.placeholder || "tag1, tag2, tag3"}
                      className="w-full rounded-none border-4 border-themeAccent bg-themeInput px-4 py-3 text-themeText focus:outline-none focus:border-themeAccent shadow-[2px_2px_0_0_var(--dg-bg-deep)] focus:shadow-[4px_4px_0_0_var(--dg-bg-deep)] transition-all duration-150 dg-r-0"
                    />
                  ) : field.type === "lines" ? (
                    <textarea
                      id={`crud-${field.key}`}
                      value={getFieldValue(field.key)}
                      onChange={(e) => setFieldValue(field.key, e.target.value.split("\n"))}
                      rows={field.rows || 4}
                      className="w-full rounded-none border-4 border-themeAccent bg-themeInput px-4 py-3 text-themeText focus:outline-none focus:border-themeAccent shadow-[2px_2px_0_0_var(--dg-bg-deep)] focus:shadow-[4px_4px_0_0_var(--dg-bg-deep)] transition-all duration-150 resize-y dg-r-0"
                    />
                  ) : (
                    <input
                      id={`crud-${field.key}`}
                      type="text"
                      value={getFieldValue(field.key)}
                      onChange={(e) => setFieldValue(field.key, e.target.value)}
                      placeholder={field.placeholder || ""}
                      className="w-full rounded-none border-4 border-themeAccent bg-themeInput px-4 py-3 text-themeText focus:outline-none focus:border-themeAccent shadow-[2px_2px_0_0_var(--dg-bg-deep)] focus:shadow-[4px_4px_0_0_var(--dg-bg-deep)] transition-all duration-150 dg-r-0"
                    />
                  )}
                </div>
              ))}

              <div className="flex justify-end gap-3 pt-4">
                <button
                  type="button"
                  onClick={cancelEdit}
                  className="px-5 py-2.5 border-4 border-themeAccent text-themeTextSecondary text-xs font-medium uppercase tracking-wider hover:bg-themeAccent hover:text-themeText shadow-[2px_2px_0_0_var(--dg-bg-deep)] hover:shadow-[4px_4px_0_0_var(--dg-bg-deep)] transition-all duration-150 active:shadow-[1px_1px_0_0_var(--dg-bg-deep)] active:translate-[1px_1px] dg-f-mono dg-r-0"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-5 py-2.5 border-4 border-themeAccent bg-themeAccent text-themeText font-display font-semibold uppercase tracking-tight hover:bg-themeWarn hover:text-themeText shadow-[2px_2px_0_0_var(--dg-bg-deep)] hover:shadow-[4px_4px_0_0_var(--dg-bg-deep)] transition-all duration-150 active:shadow-[1px_1px_0_0_var(--dg-bg-deep)] active:translate-[2px_2px] disabled:opacity-50 disabled:cursor-not-allowed dg-f-mono dg-r-0"
                >
                  {saving ? "Saving…" : editingId ? "Update" : "Create"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </section>
  );
}
