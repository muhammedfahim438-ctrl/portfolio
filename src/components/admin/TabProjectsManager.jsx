"use client";

import { useState, useEffect, useCallback } from "react";
import toast from "react-hot-toast";
import { getProjects, addProject, updateProject, deleteProject } from "@/lib/firestore";

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
  const [panelOpen, setPanelOpen] = useState(false);
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
    (async () => {
      await load();
    })();
  }, [load]);

  function openAdd() {
    setEditingId(null);
    setForm(emptyProject);
    setTagsInput("");
    setPanelOpen(true);
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
    setPanelOpen(true);
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
      setPanelOpen(false);
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
      <div className="flex items-center justify-center py-24 text-themeText/50">
        Loading projects…
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-display font-bold text-themeText uppercase tracking-tight dg-f-display">
            Projects
          </h2>
          <p className="text-xs text-themeTextSecondary/60 mt-1 uppercase tracking-[0.1em] dg-ui-mono">
            Manage project case studies
          </p>
        </div>
        <button
          onClick={openAdd}
          className="flex items-center gap-2 px-6 py-3 border-4 border-themeAccent bg-themeAccent text-themeText font-display font-semibold uppercase tracking-tight hover:bg-themeWarn hover:text-themeBg shadow-[2px_2px_0_0_#080808] hover:shadow-[4px_4px_0_0_#080808] transition-all duration-150 active:shadow-[1px_1px_0_0_#080808] active:translate-[2px_2px] dg-f-mono dg-r-0"
        >
          Add New Project
        </button>
      </div>

      {projects.length === 0 ? (
        <div className="p-16 text-center border-4 border-themeAccent bg-themeSurface/30 shadow-[4px_4px_0_0_#080808] dg-r-0 dg-chunky">
          <div className="w-12 h-12 border-4 border-themeAccent bg-themeAccent/20 flex items-center justify-center text-themeAccent mx-auto mb-3 shadow-[2px_2px_0_0_#080808]">
            <span className="text-2xl">📁</span>
          </div>
          <p className="text-themeTextSecondary text-sm uppercase tracking-[0.1em] dg-ui-mono">
            No projects yet
          </p>
          <p className="text-[10px] text-themeTextSecondary/50 mt-1 uppercase tracking-wider dg-ui-mono">
            Click "Add New Project" to get started
          </p>
        </div>
      ) : (
        <div className="overflow-hidden border-4 border-themeAccent bg-themeSurface/30 shadow-[4px_4px_0_0_#080808] dg-r-0 dg-chunky">
          <table className="w-full text-left text-sm">
            <thead className="border-b-4 border-themeAccent text-themeTextSecondary/60">
              <tr>
                <th className="px-5 py-4 font-mono text-[10px] uppercase tracking-wider">Title</th>
                <th className="px-5 py-4 font-mono text-[10px] uppercase tracking-wider">Category</th>
                <th className="px-5 py-4 font-mono text-[10px] uppercase tracking-wider">Tags</th>
                <th className="px-5 py-4 font-mono text-[10px] uppercase tracking-wider text-right">Featured</th>
                <th className="px-5 py-4 font-mono text-[10px] uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-themeAccent/30">
              {projects.map((project) => (
                <tr
                  key={project.id}
                  className="hover:bg-themeBg/40 transition-all duration-150"
                >
                  <td className="px-5 py-4 text-themeText font-medium">{project.title}</td>
                  <td className="px-5 py-4">
                    <span className="text-[10px] px-2.5 py-1 border-2 border-themeAccent bg-themeAccent/20 text-themeAccent font-bold uppercase tracking-tighter">
                      {project.category || "—"}
                    </span>
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex flex-wrap gap-1.5">
                      {(project.tags ?? []).slice(0, 3).map((tag) => (
                        <span
                          key={tag}
                          className="inline-block border-2 border-themeAccent px-2 py-0.5 text-[10px] text-themeAccent uppercase tracking-[0.1em] shadow-[1px_1px_0_0_#080808] dg-r-0"
                        >
                          {tag}
                        </span>
                      ))}
                      {(project.tags ?? []).length > 3 && (
                        <span className="text-xs text-themeTextSecondary/50">
                          +{(project.tags ?? []).length - 3}
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-5 py-4">
                    <button
                      onClick={() => handleFeaturedToggle(project)}
                      className={`h-5 w-9 border-4 border-themeAccent transition-colors relative ${
                        project.featured ? "bg-themeAccent" : "bg-themeBorder"
                      }`}
                    >
                      <span
                        className={`absolute top-1 left-1 h-3 w-3 bg-themeBg transition-transform ${
                          project.featured ? "translate-x-4" : ""
                        }`}
                      />
                    </button>
                  </td>
                  <td className="px-5 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => openEdit(project)}
                        className="px-3.5 py-1.5 text-xs font-medium text-themeAccent hover:bg-themeAccent/10 shadow-[1px_1px_0_0_#080808] hover:shadow-[2px_2px_0_0_#080808] transition-all duration-150 active:shadow-[0px_0px_0_0_#080808] active:translate-[1px_1px] dg-f-mono dg-r-0"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(project.id)}
                        disabled={deletingId === project.id}
                        className="px-3.5 py-1.5 text-xs font-medium text-red-400 hover:bg-red-400/10 shadow-[1px_1px_0_0_#080808] transition-all duration-150 disabled:opacity-50 dg-f-mono dg-r-0"
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

      {panelOpen && (
        <div className="fixed inset-0 z-50 bg-[#080808]/90 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="border-4 border-themeAccent bg-themeBg shadow-[8px_8px_0_0_#080808] w-full max-w-2xl p-6 max-h-[90vh] overflow-y-auto dg-r-0 dg-chunky relative">
            <button
              onClick={() => setPanelOpen(false)}
              className="absolute top-4 right-4 border-2 border-themeAccent bg-transparent text-themeAccent hover:bg-themeAccent hover:text-themeText shadow-[1px_1px_0_0_#080808] hover:shadow-[2px_2px_0_0_#080808] transition-all duration-150 active:shadow-[0px_0px_0_0_#080808] dg-f-mono dg-r-0"
              aria-label="Close panel"
            >
              ✕
            </button>

            <div className="space-y-5">
              <h3 className="text-lg font-display font-bold text-themeText uppercase tracking-tight dg-f-display">
                {editingId ? "Edit Project" : "New Project"}
              </h3>

              <div className="space-y-1.5">
                <label htmlFor="proj-title" className="block text-[10px] font-mono uppercase tracking-wider text-themeTextSecondary dg-ui-mono">
                  Title
                </label>
                <input
                  id="proj-title"
                  type="text"
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  className="w-full rounded-none border-4 border-themeAccent bg-themeInput px-4 py-3 text-themeText focus:outline-none focus:border-themeAccent shadow-[2px_2px_0_0_#080808] focus:shadow-[4px_4px_0_0_#080808] transition-all duration-150 dg-r-0"
                />
              </div>

              <div className="space-y-1.5">
                <label htmlFor="proj-desc" className="block text-[10px] font-mono uppercase tracking-wider text-themeTextSecondary dg-ui-mono">
                  Short Description (for cards)
                </label>
                <textarea
                  id="proj-desc"
                  rows={2}
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  className="w-full rounded-none border-4 border-themeAccent bg-themeInput px-4 py-3 text-themeText focus:outline-none focus:border-themeAccent shadow-[2px_2px_0_0_#080808] focus:shadow-[4px_4px_0_0_#080808] transition-all duration-150 resize-y dg-r-0"
                />
              </div>

              <div className="space-y-1.5">
                <label htmlFor="proj-long-desc" className="block text-[10px] font-mono uppercase tracking-wider text-themeTextSecondary dg-ui-mono">
                  Detailed Description
                </label>
                <textarea
                  id="proj-long-desc"
                  rows={5}
                  value={form.long_description}
                  onChange={(e) => setForm({ ...form, long_description: e.target.value })}
                  placeholder="Explain what you built, the architecture, challenges solved, and impact..."
                  className="w-full rounded-none border-4 border-themeAccent bg-themeInput px-4 py-3 text-themeText focus:outline-none focus:border-themeAccent shadow-[2px_2px_0_0_#080808] focus:shadow-[4px_4px_0_0_#080808] transition-all duration-150 resize-y dg-r-0"
                />
              </div>

              <div className="space-y-1.5">
                <label className="block text-[10px] font-mono uppercase tracking-wider text-themeTextSecondary dg-ui-mono">
                  Category
                </label>
                <select
                  value={form.category}
                  onChange={(e) => setForm({ ...form, category: e.target.value })}
                  className="w-full rounded-none border-4 border-themeAccent bg-themeInput px-4 py-3 text-themeText focus:outline-none focus:border-themeAccent shadow-[2px_2px_0_0_#080808] focus:shadow-[4px_4px_0_0_#080808] transition-all duration-150 dg-r-0"
                >
                  {CATEGORIES.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="block text-[10px] font-mono uppercase tracking-wider text-themeTextSecondary dg-ui-mono">
                  Main Thumbnail Image
                </label>
                <div className="flex items-center gap-3">
                  {form.image_url ? (
                    <img src={form.image_url} alt="" className="w-16 h-16 border-4 border-themeAccent object-cover shadow-[2px_2px_0_0_#080808]" />
                  ) : (
                    <div className="w-16 h-16 border-4 border-dashed border-themeAccent flex items-center justify-center text-[10px] text-themeTextSecondary/50 uppercase tracking-wider">
                      none
                    </div>
                  )}
                  <input
                    type="text"
                    value={form.image_url}
                    onChange={(e) => setForm({ ...form, image_url: e.target.value })}
                    placeholder="/projects/xyz.png or https://…"
                    className="w-full rounded-none border-4 border-themeAccent bg-themeInput px-4 py-3 text-themeText focus:outline-none focus:border-themeAccent shadow-[2px_2px_0_0_#080808] focus:shadow-[4px_4px_0_0_#080808] transition-all duration-150 dg-r-0"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="block text-[10px] font-mono uppercase tracking-wider text-themeTextSecondary dg-ui-mono">
                  Gallery Images
                </label>
                <div className="flex flex-wrap gap-2 mb-2">
                  {form.images.map((url, i) => (
                    <div key={i} className="relative group">
                      <img src={url} alt="" className="w-16 h-16 border-4 border-themeAccent object-cover shadow-[2px_2px_0_0_#080808]" />
                      <button
                        onClick={() => removeGalleryImage(i)}
                        className="absolute -top-1 -right-1 w-6 h-6 bg-themeAccent text-themeText text-[10px] flex items-center justify-center shadow-[1px_1px_0_0_#080808] dg-r-0"
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
                    placeholder="Paste image URL and press Enter"
                    className="flex-1 rounded-none border-4 border-themeAccent bg-themeInput px-4 py-3 text-themeText focus:outline-none focus:border-themeAccent shadow-[2px_2px_0_0_#080808] focus:shadow-[4px_4px_0_0_#080808] transition-all duration-150 dg-r-0"
                  />
                  <button
                    onClick={addGalleryUrl}
                    className="px-4 py-3 border-4 border-themeAccent bg-themeBgSecondary text-themeTextSecondary text-xs font-medium uppercase tracking-tighter shadow-[2px_2px_0_0_#080808] hover:bg-themeAccent hover:text-themeBg transition-all duration-150 shrink-0 dg-f-mono dg-r-0"
                  >
                    Add URL
                  </button>
                </div>
              </div>

              <div className="space-y-1.5">
                <label htmlFor="proj-video" className="block text-[10px] font-mono uppercase tracking-wider text-themeTextSecondary dg-ui-mono">
                  Video URL (YouTube/Vimeo embed)
                </label>
                <input
                  id="proj-video"
                  type="text"
                  value={form.video_url}
                  onChange={(e) => setForm({ ...form, video_url: e.target.value })}
                  placeholder="https://www.youtube.com/embed/..."
                  className="w-full rounded-none border-4 border-themeAccent bg-themeInput px-4 py-3 text-themeText focus:outline-none focus:border-themeAccent shadow-[2px_2px_0_0_#080808] focus:shadow-[4px_4px_0_0_#080808] transition-all duration-150 dg-r-0"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label htmlFor="proj-live" className="block text-[10px] font-mono uppercase tracking-wider text-themeTextSecondary dg-ui-mono">
                    Live URL
                  </label>
                  <input
                    id="proj-live"
                    type="text"
                    value={form.live_url}
                    onChange={(e) => setForm({ ...form, live_url: e.target.value })}
                    className="w-full rounded-none border-4 border-themeAccent bg-themeInput px-4 py-3 text-themeText focus:outline-none focus:border-themeAccent shadow-[2px_2px_0_0_#080808] focus:shadow-[4px_4px_0_0_#080808] transition-all duration-150 dg-r-0"
                  />
                </div>
                <div className="space-y-1.5">
                  <label htmlFor="proj-gh" className="block text-[10px] font-mono uppercase tracking-wider text-themeTextSecondary dg-ui-mono">
                    GitHub URL
                  </label>
                  <input
                    id="proj-gh"
                    type="text"
                    value={form.github_url}
                    onChange={(e) => setForm({ ...form, github_url: e.target.value })}
                    className="w-full rounded-none border-4 border-themeAccent bg-themeInput px-4 py-3 text-themeText focus:outline-none focus:border-themeAccent shadow-[2px_2px_0_0_#080808] focus:shadow-[4px_4px_0_0_#080808] transition-all duration-150 dg-r-0"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label htmlFor="proj-tags" className="block text-[10px] font-mono uppercase tracking-wider text-themeTextSecondary dg-ui-mono">
                  Tags (comma-separated)
                </label>
                <input
                  id="proj-tags"
                  type="text"
                  value={tagsInput}
                  onChange={(e) => setTagsInput(e.target.value)}
                  placeholder="react, typescript, tailwindcss"
                  className="w-full rounded-none border-4 border-themeAccent bg-themeInput px-4 py-3 text-themeText focus:outline-none focus:border-themeAccent shadow-[2px_2px_0_0_#080808] focus:shadow-[4px_4px_0_0_#080808] transition-all duration-150 dg-r-0"
                />
              </div>

              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setForm({ ...form, featured: !form.featured })}
                  className={`relative h-6 w-11 border-4 border-themeAccent transition-colors ${
                    form.featured ? "bg-themeAccent" : "bg-themeBorder"
                  }`}
                >
                  <span
                    className={`absolute top-1 left-1 h-4 w-4 bg-themeBg transition-transform ${
                      form.featured ? "translate-x-5" : ""
                    }`}
                  />
                </button>
                <label
                  className="text-xs font-mono text-themeTextSecondary uppercase tracking-[0.1em] cursor-pointer dg-ui-mono"
                  onClick={() => setForm({ ...form, featured: !form.featured })}
                >
                  Featured
                </label>
              </div>

              <div className="flex justify-end gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setPanelOpen(false)}
                  className="px-5 py-2.5 border-4 border-themeAccent text-themeTextSecondary text-xs font-medium uppercase tracking-wider hover:bg-themeAccent hover:text-themeText shadow-[2px_2px_0_0_#080808] hover:shadow-[4px_4px_0_0_#080808] transition-all duration-150 active:shadow-[1px_1px_0_0_#080808] active:translate-[1px_1px] dg-f-mono dg-r-0"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  disabled={saving}
                  className="px-5 py-2.5 border-4 border-themeAccent bg-themeAccent text-themeText font-display font-semibold uppercase tracking-tight hover:bg-themeWarn hover:text-themeBg shadow-[2px_2px_0_0_#080808] hover:shadow-[4px_4px_0_0_#080808] transition-all duration-150 active:shadow-[1px_1px_0_0_#080808] active:translate-[2px_2px] disabled:opacity-50 disabled:cursor-not-allowed dg-f-mono dg-r-0"
                >
                  {saving ? "Saving…" : editingId ? "Update" : "Create"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
