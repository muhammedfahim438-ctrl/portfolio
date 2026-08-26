"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import toast from "react-hot-toast";
import {
  getSkills,
  addSkill,
  updateSkill,
  deleteSkill,
  getCertifications,
  addCertification,
  deleteCertification,
  updateCertification,
  getSocialData,
  updateSocialData,
} from "@/lib/firestore";
import { uploadFile } from "@/lib/storage";
import { Button } from "@/components/ui/Button";

const CATEGORIES = [
  "Programming",
  "Backend",
  "Frontend",
  "Database",
  "AI / ML",
  "Data Analysis",
  "Tools & DevOps",
];

const emptySocial = {
  github: "",
  linkedin: "",
  kaggle: "",
  leetcode: "",
  email: "",
  phone: "",
  location: "",
  resume_pdf_url: "",
};

export function TabSkillsLinks() {
  return (
    <div className="space-y-10">
      <SkillsManager />
      <CertificationsManager />
      <SocialLinksManager />
    </div>
  );
}

function SkillsManager() {
  const [skills, setSkills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [name, setName] = useState("");
  const [category, setCategory] = useState(CATEGORIES[0]);
  const [level, setLevel] = useState(50);
  const [adding, setAdding] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [editName, setEditName] = useState("");
  const [editCategory, setEditCategory] = useState("");
  const [editLevel, setEditLevel] = useState(50);
  const [savingEdit, setSavingEdit] = useState(false);

  const load = useCallback(async () => {
    try {
      const data = await getSkills();
      setSkills(data);
    } catch {
      toast.error("Failed to load skills");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  async function handleAdd() {
    if (!name.trim()) {
      toast.error("Skill name is required");
      return;
    }
    setAdding(true);
    try {
      await addSkill({ name: name.trim(), category, level, icon_url: "" });
      toast.success("Skill added");
      setName("");
      setLevel(50);
      await load();
    } catch {
      toast.error("Failed to add skill");
    } finally {
      setAdding(false);
    }
  }

  function startEdit(skill) {
    setEditingId(skill.id);
    setEditName(skill.name);
    setEditCategory(skill.category);
    setEditLevel(skill.level);
  }

  function cancelEdit() {
    setEditingId(null);
    setEditName("");
    setEditCategory("");
    setEditLevel(50);
  }

  async function handleSaveEdit(id) {
    if (!editName.trim()) {
      toast.error("Skill name is required");
      return;
    }
    setSavingEdit(true);
    try {
      await updateSkill(id, {
        name: editName.trim(),
        category: editCategory,
        level: editLevel,
      });
      toast.success("Skill updated");
      setEditingId(null);
      await load();
    } catch {
      toast.error("Failed to update skill");
    } finally {
      setSavingEdit(false);
    }
  }

  async function handleDelete(id) {
    if (!confirm("Delete this skill?")) return;
    try {
      await deleteSkill(id);
      setSkills((prev) => prev.filter((s) => s.id !== id));
      toast.success("Skill deleted");
    } catch {
      toast.error("Failed to delete skill");
    }
  }

  const grouped = skills.reduce((acc, skill) => {
    (acc[skill.category] ??= []).push(skill);
    return acc;
  }, {});

  return (
    <section className="glass space-y-5">
      <h2 className="text-xl font-semibold text-themeText">Skills</h2>

      {loading ? (
        <p className="text-themeText/40">Loading skills…</p>
      ) : skills.length === 0 ? (
        <p className="text-themeText/40">No skills yet.</p>
      ) : (
        <div className="space-y-4">
          {CATEGORIES.map((cat) => {
            const items = grouped[cat];
            if (!items?.length) return null;
            return (
              <div key={cat}>
                <h3 className="mb-2 text-sm font-medium text-themeText/60">{cat}</h3>
                <div className="flex flex-wrap gap-2">
                  {items.map((skill) => (
                    <div
                      key={skill.id}
                      className="flex items-center gap-2 rounded-lg bg-themeInput px-3 py-1.5 text-sm text-themeText border border-themeBorder"
                    >
                      {editingId === skill.id ? (
                        <>
                          <input
                            type="text"
                            value={editName}
                            onChange={(e) => setEditName(e.target.value)}
                            className="w-28 rounded bg-themeBg px-2 py-1 text-themeText border border-themeBorder outline-none text-xs"
                            autoFocus
                          />
                          <select
                            value={editCategory}
                            onChange={(e) => setEditCategory(e.target.value)}
                            className="rounded bg-themeBg px-2 py-1 text-themeText border border-themeBorder outline-none text-xs"
                          >
                            {CATEGORIES.map((c) => (
                              <option key={c} value={c}>{c}</option>
                            ))}
                          </select>
                          <input
                            type="range"
                            min={0}
                            max={100}
                            value={editLevel}
                            onChange={(e) => setEditLevel(Number(e.target.value))}
                            className="w-16 accent-themeAccent"
                          />
                          <span className="text-themeAccent font-mono text-xs w-6">{editLevel}</span>
                          <button
                            onClick={() => handleSaveEdit(skill.id)}
                            disabled={savingEdit}
                            className="text-green-400 hover:text-green-300 text-xs font-medium"
                          >
                            {savingEdit ? "…" : "✓"}
                          </button>
                          <button
                            onClick={cancelEdit}
                            className="text-themeText-secondary hover:text-themeText text-xs"
                          >
                            ✕
                          </button>
                        </>
                      ) : (
                        <>
                          <span>{skill.name}</span>
                          <span className="text-themeAccent font-mono text-xs">{skill.level}</span>
                          <button
                            onClick={() => startEdit(skill)}
                            className="ml-1 text-themeText-secondary hover:text-themeAccent text-xs"
                            title="Edit skill"
                          >
                            ✎
                          </button>
                          <button
                            onClick={() => handleDelete(skill.id)}
                            className="text-red-400 hover:text-red-300 text-xs"
                          >
                            ✕
                          </button>
                        </>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}

      <div className="grid grid-cols-[1fr_1fr_auto] gap-3 items-end border-t border-themeBorder pt-4">
        <div className="space-y-1.5">
          <label htmlFor="skill-name" className="block text-sm font-medium text-themeText/70">
            Skill Name
          </label>
          <input
            id="skill-name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full rounded-lg bg-themeInput px-4 py-2.5 text-themeText border border-themeBorder outline-none focus:ring-2 focus:ring-themeAccent/40"
          />
        </div>

        <div className="space-y-1.5">
          <label htmlFor="skill-cat" className="block text-sm font-medium text-themeText/70">
            Category
          </label>
          <select
            id="skill-cat"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full rounded-lg bg-themeInput px-4 py-2.5 text-themeText border border-themeBorder outline-none focus:ring-2 focus:ring-themeAccent/40"
          >
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>

        <div className="space-y-1.5">
          <label htmlFor="skill-level" className="block text-sm font-medium text-themeText/70">
            Level: {level}
          </label>
          <input
            id="skill-level"
            type="range"
            min={0}
            max={100}
            value={level}
            onChange={(e) => setLevel(Number(e.target.value))}
            className="w-full accent-themeAccent"
          />
        </div>

        <Button onClick={handleAdd} disabled={adding}>
          {adding ? "…" : "Add"}
        </Button>
      </div>
    </section>
  );
}

function CertificationsManager() {
  const [certs, setCerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [title, setTitle] = useState("");
  const [issuer, setIssuer] = useState("");
  const [year, setYear] = useState("");
  const [credentialUrl, setCredentialUrl] = useState("");
  const [adding, setAdding] = useState(false);
  const badgeInputRef = useRef(null);
  const [uploadingBadge, setUploadingBadge] = useState(null);

  const load = useCallback(async () => {
    try {
      const data = await getCertifications();
      setCerts(data);
    } catch {
      toast.error("Failed to load certifications");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  async function handleAdd() {
    if (!title.trim()) {
      toast.error("Title is required");
      return;
    }
    setAdding(true);
    try {
      await addCertification({
        title: title.trim(),
        issuer: issuer.trim(),
        issue_date: year.trim(),
        credential_url: credentialUrl.trim(),
        badge_image_url: "",
      });
      toast.success("Certification added");
      setTitle("");
      setIssuer("");
      setYear("");
      setCredentialUrl("");
      await load();
    } catch {
      toast.error("Failed to add certification");
    } finally {
      setAdding(false);
    }
  }

  async function handleDelete(id) {
    if (!confirm("Delete this certification?")) return;
    try {
      await deleteCertification(id);
      setCerts((prev) => prev.filter((c) => c.id !== id));
      toast.success("Certification deleted");
    } catch {
      toast.error("Failed to delete certification");
    }
  }

  async function handleBadgeUpload(certId, file) {
    if (!file) return;
    setUploadingBadge(certId);
    try {
      const url = await uploadFile(file, `certifications/${certId}/${file.name}`);
      await updateCertification(certId, { badge_image_url: url });
      setCerts((prev) =>
        prev.map((c) => (c.id === certId ? { ...c, badge_image_url: url } : c))
      );
      toast.success("Badge image uploaded");
    } catch {
      toast.error("Failed to upload badge image");
    } finally {
      setUploadingBadge(null);
    }
  }

  return (
    <section className="glass space-y-5">
      <h2 className="text-xl font-semibold text-themeText">Certifications</h2>

      {loading ? (
        <p className="text-themeText/40">Loading certifications…</p>
      ) : certs.length === 0 ? (
        <p className="text-themeText/40">No certifications yet.</p>
      ) : (
        <div className="divide-y divide-themeBorder/50">
          {certs.map((cert) => (
            <div key={cert.id} className="flex items-center justify-between py-3 gap-4">
              <div className="flex items-center gap-3 flex-1 min-w-0">
                <div className="w-10 h-10 rounded-lg bg-themeBg-secondary border border-themeBorder flex items-center justify-center shrink-0 overflow-hidden">
                  {cert.badge_image_url ? (
                    <img src={cert.badge_image_url} alt="" className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-themeAccent text-lg">📜</span>
                  )}
                </div>
                <div className="min-w-0">
                  <p className="text-themeText font-medium truncate">{cert.title}</p>
                  <p className="text-sm text-themeText/50">
                    {cert.issuer} {cert.issue_date ? `· ${cert.issue_date}` : ""}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <label className="cursor-pointer px-2 py-1 text-xs rounded bg-themeBg-secondary border border-themeBorder text-themeText/60 hover:text-themeAccent hover:border-themeAccent transition-colors">
                  {uploadingBadge === cert.id ? "Uploading…" : "Badge"}
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => handleBadgeUpload(cert.id, e.target.files?.[0])}
                  />
                </label>
                <button
                  onClick={() => handleDelete(cert.id)}
                  className="text-red-400 hover:text-red-300 text-sm px-2 py-1"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="grid grid-cols-2 gap-3 border-t border-themeBorder pt-4">
        <div className="space-y-1.5">
          <label htmlFor="cert-title" className="block text-sm font-medium text-themeText/70">
            Title
          </label>
          <input
            id="cert-title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full rounded-lg bg-themeInput px-4 py-2.5 text-themeText border border-themeBorder outline-none focus:ring-2 focus:ring-themeAccent/40"
          />
        </div>
        <div className="space-y-1.5">
          <label htmlFor="cert-issuer" className="block text-sm font-medium text-themeText/70">
            Issuer
          </label>
          <input
            id="cert-issuer"
            type="text"
            value={issuer}
            onChange={(e) => setIssuer(e.target.value)}
            className="w-full rounded-lg bg-themeInput px-4 py-2.5 text-themeText border border-themeBorder outline-none focus:ring-2 focus:ring-themeAccent/40"
          />
        </div>
        <div className="space-y-1.5">
          <label htmlFor="cert-year" className="block text-sm font-medium text-themeText/70">
            Year
          </label>
          <input
            id="cert-year"
            type="text"
            value={year}
            onChange={(e) => setYear(e.target.value)}
            placeholder="2026"
            className="w-full rounded-lg bg-themeInput px-4 py-2.5 text-themeText border border-themeBorder outline-none focus:ring-2 focus:ring-themeAccent/40"
          />
        </div>
        <div className="space-y-1.5">
          <label htmlFor="cert-url" className="block text-sm font-medium text-themeText/70">
            Credential URL
          </label>
          <input
            id="cert-url"
            type="text"
            value={credentialUrl}
            onChange={(e) => setCredentialUrl(e.target.value)}
            className="w-full rounded-lg bg-themeInput px-4 py-2.5 text-themeText border border-themeBorder outline-none focus:ring-2 focus:ring-themeAccent/40"
          />
        </div>
        <div className="col-span-2">
          <Button onClick={handleAdd} disabled={adding}>
            {adding ? "Adding…" : "Add Certification"}
          </Button>
        </div>
      </div>
    </section>
  );
}

function SocialLinksManager() {
  const [form, setForm] = useState(emptySocial);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadingResume, setUploadingResume] = useState(false);
  const resumeInputRef = useRef(null);

  useEffect(() => {
    async function load() {
      try {
        const data = await getSocialData();
        if (data) {
          setForm({
            github: data.github ?? "",
            linkedin: data.linkedin ?? "",
            kaggle: data.kaggle ?? "",
            leetcode: data.leetcode ?? "",
            email: data.email ?? "",
            phone: data.phone ?? "",
            location: data.location ?? "",
            resume_pdf_url: data.resume_pdf_url ?? "",
          });
        }
      } catch {
        toast.error("Failed to load social data");
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  async function handleSave() {
    setSaving(true);
    try {
      await updateSocialData(form);
      toast.success("Social links updated");
    } catch {
      toast.error("Failed to save social data");
    } finally {
      setSaving(false);
    }
  }

  async function handleResumeUpload(file) {
    if (!file) return;
    setUploadingResume(true);
    try {
      const url = await uploadFile(file, `resume/${file.name}`);
      setForm((prev) => ({ ...prev, resume_pdf_url: url }));
      await updateSocialData({ resume_pdf_url: url });
      toast.success("Resume uploaded");
    } catch {
      toast.error("Failed to upload resume");
    } finally {
      setUploadingResume(false);
    }
  }

  if (loading) {
    return (
      <section className="glass py-10 text-center text-themeText/40">
        Loading social data…
      </section>
    );
  }

  const fields = [
    { key: "github", label: "GitHub URL", placeholder: "https://github.com/..." },
    { key: "linkedin", label: "LinkedIn URL", placeholder: "https://linkedin.com/in/..." },
    { key: "email", label: "Email", placeholder: "you@example.com" },
    { key: "phone", label: "Phone", placeholder: "+91 9061635562" },
    { key: "location", label: "Location", placeholder: "Palakkad, Kerala" },
  ];

  return (
    <section className="glass space-y-5">
      <h2 className="text-xl font-semibold text-themeText">Social Links</h2>

      <div className="space-y-4">
        {fields.map((f) => (
          <div key={f.key} className="space-y-1.5">
            <label htmlFor={`social-${f.key}`} className="block text-sm font-medium text-themeText/70">
              {f.label}
            </label>
            <input
              id={`social-${f.key}`}
              type="text"
              value={form[f.key]}
              onChange={(e) => setForm({ ...form, [f.key]: e.target.value })}
              placeholder={f.placeholder}
              className="w-full rounded-lg bg-themeInput px-4 py-2.5 text-themeText border border-themeBorder outline-none focus:ring-2 focus:ring-themeAccent/40"
            />
          </div>
        ))}
      </div>

      <div className="border-t border-themeBorder pt-4 space-y-3">
        <h3 className="text-sm font-medium text-themeText/70">Resume PDF</h3>
        <div className="flex items-center gap-3">
          {form.resume_pdf_url ? (
            <a
              href={form.resume_pdf_url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-themeAccent hover:underline truncate max-w-xs"
            >
              Current resume ✓
            </a>
          ) : (
            <span className="text-sm text-themeText/40">No resume uploaded</span>
          )}
          <label className="cursor-pointer px-4 py-2 rounded-lg bg-themeBg-secondary border border-themeBorder text-themeText-secondary text-sm font-medium hover:border-themeAccent hover:text-themeAccent transition-colors">
            {uploadingResume ? "Uploading…" : "Upload PDF"}
            <input
              ref={resumeInputRef}
              type="file"
              accept=".pdf"
              className="hidden"
              onChange={(e) => handleResumeUpload(e.target.files?.[0])}
            />
          </label>
        </div>
      </div>

      <Button onClick={handleSave} disabled={saving}>
        {saving ? "Saving…" : "Save Social Links"}
      </Button>
    </section>
  );
}
