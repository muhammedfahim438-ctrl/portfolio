"use client";

import { useState, useEffect, useCallback } from "react";
import toast from "react-hot-toast";
import { getProjects, addProject, updateProject, deleteProject } from "@/lib/firestore";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";

const CATEGORIES = ["Backend", "Frontend", "Mobile", "Data", "AI/ML", "Tools"];

const emptyProject = {
  title: "",
  description: "",
  long_description: "",
  image_url: "",
  images: [],
  video_url: "",
  category: "Backend",
  live_url: "",
  github_url: "",
  featured: false,
  tags: [],
};

export function TabProjectsManager() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(emptyProject);
  const [tagsInput, setTagsInput] = useState("");
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const [galleryInput, setGalleryInput] = useState("");

  const load = useCallback(async () => {
    try {
      const data = await getProjects();
      setProjects(data);
    } catch {
      toast.error("Failed to load projects");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  function openAdd() {
    setEditingId(null);
    setForm(emptyProject);
    setTagsInput("");
    setModalOpen(true);
  }

  function openEdit(project) {
    setEditingId(project.id ?? null);
    setForm({
      title: project.title ?? "",
      description: project.description ?? "",
      long_description: project.long_description ?? "",
      image_url: project.image_url ?? "",
      images: project.images ?? [],
      video_url: project.video_url ?? "",
      category: project.category ?? "Backend",
      live_url: project.live_url ?? "",
      github_url: project.github_url ?? "",
      featured: project.featured ?? false,
      tags: project.tags ?? [],
    });
    setTagsInput((project.tags ?? []).join(", "));
    setModalOpen(true);
  }

  async function handleSave() {
    setSaving(true);
    const tags = tagsInput
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);
    const payload = { ...form, tags };

    try {
      if (editingId) {
        await updateProject(editingId, payload);
        toast.success("Project updated");
      } else {
        await addProject(payload);
        toast.success("Project added");
      }
      setModalOpen(false);
      await load();
    } catch {
      toast.error("Failed to save project");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id) {
    if (!confirm("Delete this project? This action cannot be undone.")) return;
    setDeletingId(id);
    try {
      await deleteProject(id);
      toast.success("Project deleted");
      setProjects((prev) => prev.filter((p) => p.id !== id));
    } catch {
      toast.error("Failed to delete project");
    } finally {
      setDeletingId(null);
    }
  }

  async function handleFeaturedToggle(project) {
    const updated = { featured: !project.featured };
    try {
      await updateProject(project.id, updated);
      setProjects((prev) =>
        prev.map((p) => (p.id === project.id ? { ...p, ...updated } : p))
      );
      toast.success(updated.featured ? "Marked as featured" : "Removed from featured");
    } catch {
      toast.error("Failed to update featured status");
    }
  }

  function removeGalleryImage(index) {
    setForm((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }));
  }

  function addGalleryUrl() {
    const url = galleryInput.trim();
    if (!url) return;
    setForm((prev) => ({ ...prev, images: [...prev.images, url] }));
    setGalleryInput("");
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20 text-themeText/50">
        Loading projects…
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-themeText">Projects</h2>
        <Button onClick={openAdd}>Add New Project</Button>
      </div>

      {projects.length === 0 ? (
        <div className="glass py-16 text-center text-themeText/40">
          No projects yet. Click &ldquo;Add New Project&rdquo; to get started.
        </div>
      ) : (
        <div className="glass overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-themeBorder text-themeText/60">
              <tr>
                <th className="px-4 py-3 font-medium">Title</th>
                <th className="px-4 py-3 font-medium">Category</th>
                <th className="px-4 py-3 font-medium">Tags</th>
                <th className="px-4 py-3 font-medium">Featured</th>
                <th className="px-4 py-3 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-themeBorder/50">
              {projects.map((project) => (
                <tr key={project.id} className="hover:bg-themeBg/50 transition-colors">
                  <td className="px-4 py-3 text-themeText font-medium">{project.title}</td>
                  <td className="px-4 py-3">
                    <span className="text-xs px-2 py-1 rounded-full bg-themeAccent/15 text-themeAccent">
                      {project.category || "—"}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex flex-wrap gap-1.5">
                      {(project.tags ?? []).slice(0, 3).map((tag) => (
                        <span
                          key={tag}
                          className="inline-block rounded-full bg-themeAccent/15 px-2.5 py-0.5 text-xs text-themeAccent"
                        >
                          {tag}
                        </span>
                      ))}
                      {(project.tags ?? []).length > 3 && (
                        <span className="text-xs text-themeText/40">+{(project.tags ?? []).length - 3}</span>
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <button
                      onClick={() => handleFeaturedToggle(project)}
                      className={`h-5 w-9 rounded-full transition-colors relative ${
                        project.featured ? "bg-themeAccent" : "bg-themeBorder"
                      }`}
                    >
                      <span
                        className={`absolute top-0.5 left-0.5 h-4 w-4 rounded-full bg-white transition-transform ${
                          project.featured ? "translate-x-4" : ""
                        }`}
                      />
                    </button>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => openEdit(project)}
                        className="rounded-md px-3 py-1.5 text-xs font-medium text-themeAccent hover:bg-themeAccent/10 transition-colors"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(project.id)}
                        disabled={deletingId === project.id}
                        className="rounded-md px-3 py-1.5 text-xs font-medium text-red-400 hover:bg-red-400/10 transition-colors disabled:opacity-50"
                      >
                        {deletingId === project.id ? "…" : "Delete"}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)}>
        <div className="space-y-5 max-h-[80vh] overflow-y-auto pr-2">
          <h3 className="text-lg font-semibold text-themeText">
            {editingId ? "Edit Project" : "New Project"}
          </h3>

          <div className="space-y-1.5">
            <label htmlFor="proj-title" className="block text-sm font-medium text-themeText/70">
              Title
            </label>
            <input
              id="proj-title"
              type="text"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              className="w-full rounded-lg bg-themeInput px-4 py-2.5 text-themeText border border-themeBorder outline-none focus:ring-2 focus:ring-themeAccent/40"
            />
          </div>

          <div className="space-y-1.5">
            <label htmlFor="proj-desc" className="block text-sm font-medium text-themeText/70">
              Short Description (for cards)
            </label>
            <textarea
              id="proj-desc"
              rows={2}
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              className="w-full rounded-lg bg-themeInput px-4 py-2.5 text-themeText border border-themeBorder outline-none focus:ring-2 focus:ring-themeAccent/40 resize-y"
            />
          </div>

          <div className="space-y-1.5">
            <label htmlFor="proj-long-desc" className="block text-sm font-medium text-themeText/70">
              Detailed Description (for project detail view)
            </label>
            <textarea
              id="proj-long-desc"
              rows={5}
              value={form.long_description}
              onChange={(e) => setForm({ ...form, long_description: e.target.value })}
              placeholder="Explain what you built, the architecture, challenges solved, and impact..."
              className="w-full rounded-lg bg-themeInput px-4 py-2.5 text-themeText border border-themeBorder outline-none focus:ring-2 focus:ring-themeAccent/40 resize-y"
            />
          </div>

          <div className="space-y-1.5">
            <label className="block text-sm font-medium text-themeText/70">
              Category
            </label>
            <select
              value={form.category}
              onChange={(e) => setForm({ ...form, category: e.target.value })}
              className="w-full rounded-lg bg-themeInput px-4 py-2.5 text-themeText border border-themeBorder outline-none focus:ring-2 focus:ring-themeAccent/40"
            >
              {CATEGORIES.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="block text-sm font-medium text-themeText/70">
              Main Thumbnail Image
            </label>
            <div className="flex items-center gap-3">
              {form.image_url ? (
                <img src={form.image_url} alt="" className="w-16 h-16 rounded-lg object-cover border border-themeBorder" />
              ) : (
                <div className="w-16 h-16 rounded-lg border border-dashed border-themeBorder flex items-center justify-center text-xs text-themeText/40">
                  none
                </div>
              )}
              <input
                type="text"
                value={form.image_url}
                onChange={(e) => setForm({ ...form, image_url: e.target.value })}
                placeholder="/projects/xyz.png or https://…"
                className="w-full rounded-lg bg-themeInput px-4 py-2.5 text-themeText border border-themeBorder outline-none focus:ring-2 focus:ring-themeAccent/40"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="block text-sm font-medium text-themeText/70">
              Gallery Images (3+ images for project detail)
            </label>
            <div className="flex flex-wrap gap-2 mb-2">
              {form.images.map((url, i) => (
                <div key={i} className="relative group">
                  <img src={url} alt="" className="w-20 h-20 rounded-lg object-cover border border-themeBorder" />
                  <button
                    onClick={() => removeGalleryImage(i)}
                    className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-red-500 text-white text-xs flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={galleryInput}
                onChange={(e) => setGalleryInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") addGalleryUrl();
                }}
                placeholder="Paste image URL and press Enter / Add"
                className="w-full rounded-lg bg-themeInput px-4 py-2.5 text-themeText border border-themeBorder outline-none focus:ring-2 focus:ring-themeAccent/40"
              />
              <button
                onClick={addGalleryUrl}
                className="px-4 py-2.5 rounded-lg bg-themeBg-secondary border border-themeBorder text-themeText-secondary text-sm font-medium hover:border-themeAccent hover:text-themeAccent transition-colors shrink-0"
              >
                Add URL
              </button>
            </div>
          </div>

          <div className="space-y-1.5">
            <label htmlFor="proj-video" className="block text-sm font-medium text-themeText/70">
              Video URL (YouTube/Vimeo embed)
            </label>
            <input
              id="proj-video"
              type="text"
              value={form.video_url}
              onChange={(e) => setForm({ ...form, video_url: e.target.value })}
              placeholder="https://www.youtube.com/embed/..."
              className="w-full rounded-lg bg-themeInput px-4 py-2.5 text-themeText border border-themeBorder outline-none focus:ring-2 focus:ring-themeAccent/40"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label htmlFor="proj-live" className="block text-sm font-medium text-themeText/70">
                Live URL
              </label>
              <input
                id="proj-live"
                type="text"
                value={form.live_url}
                onChange={(e) => setForm({ ...form, live_url: e.target.value })}
                className="w-full rounded-lg bg-themeInput px-4 py-2.5 text-themeText border border-themeBorder outline-none focus:ring-2 focus:ring-themeAccent/40"
              />
            </div>
            <div className="space-y-1.5">
              <label htmlFor="proj-gh" className="block text-sm font-medium text-themeText/70">
                GitHub URL
              </label>
              <input
                id="proj-gh"
                type="text"
                value={form.github_url}
                onChange={(e) => setForm({ ...form, github_url: e.target.value })}
                className="w-full rounded-lg bg-themeInput px-4 py-2.5 text-themeText border border-themeBorder outline-none focus:ring-2 focus:ring-themeAccent/40"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label htmlFor="proj-tags" className="block text-sm font-medium text-themeText/70">
              Tags (comma-separated)
            </label>
            <input
              id="proj-tags"
              type="text"
              value={tagsInput}
              onChange={(e) => setTagsInput(e.target.value)}
              placeholder="react, typescript, tailwindcss"
              className="w-full rounded-lg bg-themeInput px-4 py-2.5 text-themeText border border-themeBorder outline-none focus:ring-2 focus:ring-themeAccent/40"
            />
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setForm({ ...form, featured: !form.featured })}
              className={`relative h-6 w-11 rounded-full transition-colors ${
                form.featured ? "bg-themeAccent" : "bg-themeBorder"
              }`}
            >
              <span
                className={`absolute top-1 left-1 h-4 w-4 rounded-full bg-white transition-transform ${
                  form.featured ? "translate-x-5" : ""
                }`}
              />
            </button>
            <label
              className="text-sm font-medium text-themeText/70 cursor-pointer"
              onClick={() => setForm({ ...form, featured: !form.featured })}
            >
              Featured
            </label>
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <Button variant="ghost" onClick={() => setModalOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSave} disabled={saving}>
              {saving ? "Saving…" : editingId ? "Update" : "Create"}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
