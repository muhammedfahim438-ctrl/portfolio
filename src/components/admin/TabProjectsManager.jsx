"use client";

import { useState, useEffect, useCallback } from "react";
import toast from "react-hot-toast";
import { getProjects, addProject, updateProject, deleteProject } from "@/lib/firestore";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";

const emptyProject = {
  title: "",
  description: "",
  image_url: "",
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
      title: project.title,
      description: project.description,
      image_url: project.image_url,
      live_url: project.live_url,
      github_url: project.github_url,
      featured: project.featured,
      tags: project.tags,
    });
    setTagsInput(project.tags.join(", "));
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
                    <div className="flex flex-wrap gap-1.5">
                      {project.tags.map((tag) => (
                        <span
                          key={tag}
                          className="inline-block rounded-full bg-themeAccent/15 px-2.5 py-0.5 text-xs text-themeAccent"
                        >
                          {tag}
                        </span>
                      ))}
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
        <div className="space-y-5">
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
              Description
            </label>
            <textarea
              id="proj-desc"
              rows={3}
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              className="w-full rounded-lg bg-themeInput px-4 py-2.5 text-themeText border border-themeBorder outline-none focus:ring-2 focus:ring-themeAccent/40 resize-y"
            />
          </div>

          <div className="space-y-1.5">
            <label htmlFor="proj-image" className="block text-sm font-medium text-themeText/70">
              Image URL
            </label>
            <input
              id="proj-image"
              type="text"
              value={form.image_url}
              onChange={(e) => setForm({ ...form, image_url: e.target.value })}
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
              htmlFor="proj-featured"
              className="text-sm font-medium text-themeText/70 cursor-pointer"
              onClick={() => setForm({ ...form, featured: !form.featured })}
            >
              Featured
            </label>
            <input
              id="proj-featured"
              type="checkbox"
              checked={form.featured}
              onChange={() => setForm({ ...form, featured: !form.featured })}
              className="sr-only"
            />
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
