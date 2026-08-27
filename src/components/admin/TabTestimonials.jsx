"use client";

import { useState, useEffect, useCallback } from "react";
import toast from "react-hot-toast";
import { FaStar } from "react-icons/fa";
import {
  getTestimonials,
  addTestimonial,
  updateTestimonial,
  deleteTestimonial,
} from "@/lib/firestore";
import { uploadFile } from "@/lib/storage";
import { Button } from "@/components/ui/Button";

const emptyForm = {
  quote: "",
  author: "",
  role: "",
  rating: 5,
  avatar_url: "",
};

export function TabTestimonials() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState(emptyForm);
  const [adding, setAdding] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [savingEdit, setSavingEdit] = useState(false);
  const [uploadFor, setUploadFor] = useState(null);

  const load = useCallback(async () => {
    try {
      const data = await getTestimonials();
      setItems(data);
    } catch {
      toast.error("Failed to load testimonials");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  function resetForm() {
    setForm(emptyForm);
    setEditingId(null);
  }

  async function handleAdd() {
    if (!form.quote.trim() || !form.author.trim()) {
      toast.error("Quote and author are required");
      return;
    }
    setAdding(true);
    try {
      await addTestimonial({
        quote: form.quote.trim(),
        author: form.author.trim(),
        role: form.role.trim(),
        rating: Number(form.rating),
        avatar_url: form.avatar_url,
      });
      toast.success("Testimonial added");
      resetForm();
      await load();
    } catch {
      toast.error("Failed to add testimonial");
    } finally {
      setAdding(false);
    }
  }

  function startEdit(item) {
    setEditingId(item.id);
    setForm({
      quote: item.quote ?? "",
      author: item.author ?? "",
      role: item.role ?? "",
      rating: item.rating ?? 5,
      avatar_url: item.avatar_url ?? "",
    });
  }

  async function handleSaveEdit() {
    if (!form.quote.trim() || !form.author.trim()) {
      toast.error("Quote and author are required");
      return;
    }
    setSavingEdit(true);
    try {
      await updateTestimonial(editingId, {
        quote: form.quote.trim(),
        author: form.author.trim(),
        role: form.role.trim(),
        rating: Number(form.rating),
        avatar_url: form.avatar_url,
      });
      toast.success("Testimonial updated");
      resetForm();
      await load();
    } catch {
      toast.error("Failed to update testimonial");
    } finally {
      setSavingEdit(false);
    }
  }

  async function handleDelete(id) {
    if (!confirm("Delete this testimonial?")) return;
    try {
      await deleteTestimonial(id);
      setItems((prev) => prev.filter((t) => t.id !== id));
      toast.success("Testimonial deleted");
    } catch {
      toast.error("Failed to delete testimonial");
    }
  }

  async function handleAvatarUpload(id, file) {
    if (!file) return;
    setUploadFor(id);
    try {
      const url = await uploadFile(file, `testimonials/${id}/${file.name}`);
      await updateTestimonial(id, { avatar_url: url });
      setItems((prev) =>
        prev.map((t) => (t.id === id ? { ...t, avatar_url: url } : t))
      );
      toast.success("Avatar uploaded");
    } catch {
      toast.error("Failed to upload avatar");
    } finally {
      setUploadFor(null);
    }
  }

  const editing = editingId !== null;

  return (
    <div className="space-y-8">
      <section className="glass space-y-5">
        <h2 className="text-xl font-semibold text-themeText">
          {editing ? "Edit Testimonial" : "Add Testimonial"}
        </h2>

        <div className="space-y-1.5">
          <label htmlFor="t-quote" className="block text-sm font-medium text-themeText/70">
            Quote
          </label>
          <textarea
            id="t-quote"
            rows={4}
            value={form.quote}
            onChange={(e) => setForm({ ...form, quote: e.target.value })}
            className="w-full rounded-lg bg-themeInput px-4 py-2.5 text-themeText border border-themeBorder outline-none focus:ring-2 focus:ring-themeAccent/40 resize-y"
            placeholder="What did they say about you?"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label htmlFor="t-author" className="block text-sm font-medium text-themeText/70">
              Author
            </label>
            <input
              id="t-author"
              type="text"
              value={form.author}
              onChange={(e) => setForm({ ...form, author: e.target.value })}
              className="w-full rounded-lg bg-themeInput px-4 py-2.5 text-themeText border border-themeBorder outline-none focus:ring-2 focus:ring-themeAccent/40"
              placeholder="TechFifo Team"
            />
          </div>

          <div className="space-y-1.5">
            <label htmlFor="t-role" className="block text-sm font-medium text-themeText/70">
              Role / Company
            </label>
            <input
              id="t-role"
              type="text"
              value={form.role}
              onChange={(e) => setForm({ ...form, role: e.target.value })}
              className="w-full rounded-lg bg-themeInput px-4 py-2.5 text-themeText border border-themeBorder outline-none focus:ring-2 focus:ring-themeAccent/40"
              placeholder="Engineering Team"
            />
          </div>
        </div>

        <div className="space-y-1.5">
          <label className="block text-sm font-medium text-themeText/70">
            Rating
          </label>
          <div className="flex items-center gap-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => setForm({ ...form, rating: star })}
                aria-label={`${star} star${star > 1 ? "s" : ""}`}
                className="text-2xl transition-colors"
              >
                <FaStar
                  className={
                    star <= Number(form.rating)
                      ? "text-themeSecondary"
                      : "text-themeBorder hover:text-themeText-secondary/40"
                  }
                />
              </button>
            ))}
            <span className="ml-2 font-mono text-xs text-themeText-secondary">
              {form.rating} / 5
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3 pt-1">
          <Button onClick={editing ? handleSaveEdit : handleAdd} disabled={adding || savingEdit}>
            {adding || savingEdit ? "Saving…" : editing ? "Save Changes" : "Add Testimonial"}
          </Button>
          {editing && (
            <button
              onClick={resetForm}
              className="px-4 py-2 rounded-lg border border-themeBorder text-themeText-secondary text-sm font-medium hover:text-themeText transition-colors"
            >
              Cancel
            </button>
          )}
        </div>
      </section>

      <section className="glass space-y-4">
        <h2 className="text-xl font-semibold text-themeText">
          Existing Testimonials ({items.length})
        </h2>

        {loading ? (
          <p className="text-themeText/40">Loading testimonials…</p>
        ) : items.length === 0 ? (
          <p className="text-themeText/40">No testimonials yet.</p>
        ) : (
          <div className="divide-y divide-themeBorder/50">
            {items.map((item, i) => (
              <div key={item.id} className="py-4 flex items-start gap-4">
                <div className="w-12 h-12 rounded-full shrink-0 overflow-hidden border border-themeBorder bg-themeBg-secondary">
                  {item.avatar_url ? (
                    <img src={item.avatar_url} alt="" className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center font-display font-bold text-themeAccent">
                      {getInitials(item.author)}
                    </div>
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className="font-display font-semibold text-themeText text-sm">
                      {item.author}
                    </p>
                    {item.role && (
                      <p className="text-xs text-themeText/50">{item.role}</p>
                    )}
                    {Number(item.rating) > 0 && (
                      <span className="flex items-center gap-0.5 text-themeSecondary">
                        {[1, 2, 3, 4, 5].map((s) => (
                          <FaStar
                            key={s}
                            className={
                              s <= Math.round(Number(item.rating))
                                ? "w-3 h-3"
                                : "w-3 h-3 text-themeBorder"
                            }
                          />
                        ))}
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-themeText-secondary mt-1 line-clamp-3">
                    &ldquo;{item.quote}&rdquo;
                  </p>
                </div>

                <div className="flex flex-col items-end gap-2 shrink-0">
                  <label className="cursor-pointer px-2 py-1 text-xs rounded bg-themeBg-secondary border border-themeBorder text-themeText/60 hover:text-themeAccent hover:border-themeAccent transition-colors">
                    {uploadFor === item.id ? "Uploading…" : "Avatar"}
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => handleAvatarUpload(item.id, e.target.files?.[0])}
                    />
                  </label>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => startEdit(item)}
                      className="text-xs text-themeText/60 hover:text-themeAccent transition-colors"
                      title="Edit testimonial"
                    >
                      ✎ Edit
                    </button>
                    <button
                      onClick={() => handleDelete(item.id)}
                      className="text-xs text-red-400 hover:text-red-300 transition-colors"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

function getInitials(name = "") {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0])
    .join("")
    .toUpperCase();
}