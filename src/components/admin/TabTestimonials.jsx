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
  const [avatarDrafts, setAvatarDrafts] = useState({});

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
    (async () => {
      await load();
    })();
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

  async function handleAvatarSave(id) {
    const url = (avatarDrafts[id] ?? "").trim();
    try {
      await updateTestimonial(id, { avatar_url: url });
      setItems((prev) =>
        prev.map((t) => (t.id === id ? { ...t, avatar_url: url } : t))
      );
      setAvatarDrafts((prev) => ({ ...prev, [id]: url }));
      toast.success(url ? "Avatar URL saved" : "Avatar cleared");
    } catch {
      toast.error("Failed to save avatar URL");
    }
  }

  const editing = editingId !== null;

  return (
    <div className="space-y-8">
      <section className="space-y-6 rounded-none p-6 border border-themeBorder bg-themeSurface/20">
        <h2 className="text-lg font-display font-bold text-themeText uppercase tracking-[0.05em] mb-4">
          {editing ? "Edit Testimonial" : "Add Testimonial"}
        </h2>

        <div className="space-y-1.5">
          <label htmlFor="t-quote" className="block text-[10px] font-mono uppercase tracking-wider text-themeText-secondary">
            Quote
          </label>
          <textarea
            id="t-quote"
            rows={4}
            value={form.quote}
            onChange={(e) => setForm({ ...form, quote: e.target.value })}
            className="w-full rounded-none border-2 border-themeBorder bg-themeInput px-4 py-3 text-themeText focus:outline-none focus:border-themeAccent transition-all duration-200 resize-y"
            placeholder="What did they say about you?"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label htmlFor="t-author" className="block text-[10px] font-mono uppercase tracking-wider text-themeText-secondary">
              Author
            </label>
            <input
              id="t-author"
              type="text"
              value={form.author}
              onChange={(e) => setForm({ ...form, author: e.target.value })}
              className="w-full rounded-none border-2 border-themeBorder bg-themeInput px-4 py-3 text-themeText focus:outline-none focus:border-themeAccent transition-all duration-200"
              placeholder="TechFifo Team"
            />
          </div>

          <div className="space-y-1.5">
            <label htmlFor="t-role" className="block text-[10px] font-mono uppercase tracking-wider text-themeText-secondary">
              Role / Company
            </label>
            <input
              id="t-role"
              type="text"
              value={form.role}
              onChange={(e) => setForm({ ...form, role: e.target.value })}
              className="w-full rounded-none border-2 border-themeBorder bg-themeInput px-4 py-3 text-themeText focus:outline-none focus:border-themeAccent transition-all duration-200"
              placeholder="Engineering Team"
            />
          </div>
        </div>

        <div className="space-y-1.5">
          <label className="block text-[10px] font-mono uppercase tracking-wider text-themeText-secondary">
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
                      ? "text-themeAccent"
                      : "text-themeBorder hover:text-themeText-secondary/40"
                  }
                />
              </button>
            ))}
            <span className="ml-2 font-mono text-[10px] text-themeText-secondary">
              {form.rating} / 5
            </span>
          </div>
        </div>

        <div className="space-y-1.5">
          <label htmlFor="t-avatar" className="block text-[10px] font-mono uppercase tracking-wider text-themeText-secondary">
            Avatar Image URL
          </label>
          <input
            id="t-avatar"
            type="text"
            value={form.avatar_url}
            onChange={(e) => setForm({ ...form, avatar_url: e.target.value })}
            className="w-full rounded-none border-2 border-themeBorder bg-themeInput px-4 py-3 text-themeText focus:outline-none focus:border-themeAccent transition-all duration-200"
            placeholder="https://… or /assets/avatar.png"
          />
        </div>

        <div className="flex items-center gap-3 pt-3">
          <button
            onClick={editing ? handleSaveEdit : handleAdd}
            disabled={adding || savingEdit}
            className="flex items-center justify-center gap-2 px-6 py-3 rounded-none border-2 border-themeAccent bg-themeAccent text-themeText font-display font-semibold hover:bg-themeAccent-hover hover:text-themeText transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {adding || savingEdit ? "Saving…" : editing ? "Save Changes" : "Add Testimonial"}
          </button>
          {editing && (
            <button
              onClick={resetForm}
              className="px-5 py-2.5 rounded-none border-2 border-themeBorder text-themeText-secondary text-xs font-medium hover:border-themeAccent hover:text-themeAccent transition-all duration-200"
            >
              Cancel
            </button>
          )}
        </div>
      </section>

      <section className="space-y-4 rounded-none p-6 border border-themeBorder bg-themeSurface/20">
        <h2 className="text-lg font-display font-bold text-themeText uppercase tracking-[0.05em] mb-4">
          Existing Testimonials ({items.length})
        </h2>

        {loading ? (
          <p className="text-themeText/40">Loading testimonials…</p>
        ) : items.length === 0 ? (
          <p className="text-themeText/40">No testimonials yet.</p>
        ) : (
          <div className="divide-y divide-themeBorder/50">
            {items.map((item) => (
              <div key={item.id} className="py-4 flex items-start gap-4">
                <div className="w-10 h-10 rounded-none shrink-0 overflow-hidden border border-themeBorder bg-themeBgSecondary">
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
                      <p className="text-xs text-themeText-secondary/60">{item.role}</p>
                    )}
                    {Number(item.rating) > 0 && (
                      <span className="flex items-center gap-0.5 text-themeAccent">
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

                <div className="flex flex-col gap-2 shrink-0">
                  <div className="flex items-center gap-2">
                    <input
                      value={avatarDrafts[item.id] ?? item.avatar_url ?? ""}
                      onChange={(e) =>
                        setAvatarDrafts((prev) => ({ ...prev, [item.id]: e.target.value }))
                      }
                      onKeyDown={(e) => {
                        if (e.key === "Enter") handleAvatarSave(item.id);
                      }}
                      placeholder="Avatar image URL"
                      className="w-44 rounded-none border-2 border-themeBorder bg-themeInput px-2 py-1.5 text-[10px] text-themeText focus:outline-none focus:border-themeAccent"
                    />
                    <button
                      onClick={() => handleAvatarSave(item.id)}
                      className="text-[10px] text-themeAccent hover:text-themeAccent-hover font-medium"
                    >
                      Save
                    </button>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => startEdit(item)}
                      className="text-[10px] text-themeText-secondary/60 hover:text-themeAccent transition-colors"
                      title="Edit testimonial"
                    >
                      ✎ Edit
                    </button>
                    <button
                      onClick={() => handleDelete(item.id)}
                      className="text-[10px] text-red-400 hover:text-red-300 transition-colors"
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
