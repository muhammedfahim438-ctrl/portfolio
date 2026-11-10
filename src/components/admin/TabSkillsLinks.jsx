"use client";

import { useState, useEffect, useCallback } from "react";
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
    <div className="space-y-8">
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
    (async () => {
      await load();
    })();
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
    <section className="space-y-6 rounded-none p-6 border border-themeBorder bg-themeSurface/20">
      <h2 className="text-lg font-display font-bold text-themeText uppercase tracking-[0.05em] mb-4">
        Skills
      </h2>

      {loading ? (
        <p className="text-themeText/40">Loading skills…</p>
      ) : skills.length === 0 ? (
        <p className="text-themeText/40">No skills yet.</p>
      ) : (
        <div className="space-y-5">
          {CATEGORIES.map((cat) => {
            const items = grouped[cat];
            if (!items?.length) return null;
            return (
              <div key={cat}>
                <h3 className="mb-3 text-[10px] font-mono uppercase tracking-wider text-themeText-secondary">
                  {cat}
                </h3>
                <div className="flex flex-wrap gap-2">
                  {items.map((skill) => (
                    <div
                      key={skill.id}
                      className="flex items-center gap-2 rounded-none border border-themeBorder bg-themeInput px-3 py-1.5 text-sm text-themeText"
                    >
                      {editingId === skill.id ? (
                        <>
                          <input
                            type="text"
                            value={editName}
                            onChange={(e) => setEditName(e.target.value)}
                            className="w-28 rounded-none border border-themeBorder bg-themeBg px-2 py-1 text-themeText text-[10px] focus:outline-none focus:border-themeAccent"
                            autoFocus
                          />
                          <select
                            value={editCategory}
                            onChange={(e) => setEditCategory(e.target.value)}
                            className="rounded-none border border-themeBorder bg-themeBg px-2 py-1 text-themeText text-[10px] focus:outline-none focus:border-themeAccent"
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
                          <span className="text-themeAccent font-mono text-[10px] w-6">{editLevel}</span>
                          <button
                            onClick={() => handleSaveEdit(skill.id)}
                            disabled={savingEdit}
                            className="text-themeAccent hover:text-themeAccent-hover text-[10px] font-medium"
                          >
                            {savingEdit ? "…" : "✓"}
                          </button>
                          <button
                            onClick={cancelEdit}
                            className="text-themeText-secondary hover:text-themeText text-[10px]"
                          >
                            ✕
                          </button>
                        </>
                      ) : (
                        <>
                          <span>{skill.name}</span>
                          <span className="text-themeAccent font-mono text-[10px]">{skill.level}</span>
                          <button
                            onClick={() => startEdit(skill)}
                            className="ml-1 text-themeText-secondary hover:text-themeAccent text-[10px]"
                            title="Edit skill"
                          >
                            ✎
                          </button>
                          <button
                            onClick={() => handleDelete(skill.id)}
                            className="text-red-400 hover:text-red-300 text-[10px]"
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

      <div className="grid grid-cols-[1fr_1fr_auto] gap-3 items-end border-t border-themeBorder pt-5">
        <div className="space-y-1.5">
          <label htmlFor="skill-name" className="block text-[10px] font-mono uppercase tracking-wider text-themeText-secondary">
            Skill Name
          </label>
          <input
            id="skill-name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full rounded-none border-2 border-themeBorder bg-themeInput px-4 py-3 text-themeText focus:outline-none focus:border-themeAccent transition-all duration-200"
          />
        </div>

        <div className="space-y-1.5">
          <label htmlFor="skill-cat" className="block text-[10px] font-mono uppercase tracking-wider text-themeText-secondary">
            Category
          </label>
          <select
            id="skill-cat"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full rounded-none border-2 border-themeBorder bg-themeInput px-4 py-3 text-themeText focus:outline-none focus:border-themeAccent transition-all duration-200"
          >
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>

        <div className="space-y-1.5">
          <label htmlFor="skill-level" className="block text-[10px] font-mono uppercase tracking-wider text-themeText-secondary">
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

        <button
          onClick={handleAdd}
          disabled={adding}
          className="flex items-center justify-center gap-2 px-6 py-3 rounded-none border-2 border-themeAccent bg-themeAccent text-themeText font-display font-semibold hover:bg-themeAccent-hover hover:text-themeText transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {adding ? "…" : "Add"}
        </button>
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
  const [badgeDrafts, setBadgeDrafts] = useState({});

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
    (async () => {
      await load();
    })();
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

  async function handleBadgeSave(certId) {
    const url = (badgeDrafts[certId] ?? "").trim();
    try {
      await updateCertification(certId, { badge_image_url: url });
      setCerts((prev) =>
        prev.map((c) => (c.id === certId ? { ...c, badge_image_url: url } : c))
      );
      setBadgeDrafts((prev) => ({ ...prev, [certId]: url }));
      toast.success(url ? "Badge URL saved" : "Badge cleared");
    } catch {
      toast.error("Failed to save badge URL");
    }
  }

  return (
    <section className="space-y-6 rounded-none p-6 border border-themeBorder bg-themeSurface/20">
      <h2 className="text-lg font-display font-bold text-themeText uppercase tracking-[0.05em] mb-4">
        Certifications
      </h2>

      {loading ? (
        <p className="text-themeText/40">Loading certifications…</p>
      ) : certs.length === 0 ? (
        <p className="text-themeText/40">No certifications yet.</p>
      ) : (
        <div className="divide-y divide-themeBorder/50">
          {certs.map((cert) => (
            <div key={cert.id} className="py-4 flex items-center justify-between gap-4">
              <div className="flex items-center gap-3 flex-1 min-w-0">
                <div className="w-10 h-10 rounded-none bg-themeBgSecondary border border-themeBorder flex items-center justify-center shrink-0 overflow-hidden">
                  {cert.badge_image_url ? (
                    <img src={cert.badge_image_url} alt="" className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-themeAccent text-lg">📜</span>
                  )}
                </div>
                <div className="min-w-0">
                  <p className="text-themeText font-medium truncate">{cert.title}</p>
                  <p className="text-sm text-themeText-secondary/60">
                    {cert.issuer} {cert.issue_date ? `· ${cert.issue_date}` : ""}
                  </p>
                </div>
              </div>
              <div className="flex flex-col gap-2 shrink-0">
                <div className="flex items-center gap-2">
                  <input
                    value={badgeDrafts[cert.id] ?? cert.badge_image_url ?? ""}
                    onChange={(e) =>
                      setBadgeDrafts((prev) => ({ ...prev, [cert.id]: e.target.value }))
                    }
                    onKeyDown={(e) => {
                      if (e.key === "Enter") handleBadgeSave(cert.id);
                    }}
                    placeholder="Badge image URL"
                    className="w-44 rounded-none border-2 border-themeBorder bg-themeInput px-2 py-1.5 text-xs text-themeText focus:outline-none focus:border-themeAccent"
                  />
                  <button
                    onClick={() => handleBadgeSave(cert.id)}
                    className="text-xs text-themeAccent hover:text-themeAccent-hover font-medium"
                  >
                    Save
                  </button>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleDelete(cert.id)}
                    className="text-xs text-red-400 hover:text-red-300"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="grid grid-cols-2 gap-3 border-t border-themeBorder pt-5">
        <div className="space-y-1.5">
          <label htmlFor="cert-title" className="block text-[10px] font-mono uppercase tracking-wider text-themeText-secondary">
            Title
          </label>
          <input
            id="cert-title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full rounded-none border-2 border-themeBorder bg-themeInput px-4 py-3 text-themeText focus:outline-none focus:border-themeAccent transition-all duration-200"
          />
        </div>
        <div className="space-y-1.5">
          <label htmlFor="cert-issuer" className="block text-[10px] font-mono uppercase tracking-wider text-themeText-secondary">
            Issuer
          </label>
          <input
            id="cert-issuer"
            type="text"
            value={issuer}
            onChange={(e) => setIssuer(e.target.value)}
            className="w-full rounded-none border-2 border-themeBorder bg-themeInput px-4 py-3 text-themeText focus:outline-none focus:border-themeAccent transition-all duration-200"
          />
        </div>
        <div className="space-y-1.5">
          <label htmlFor="cert-year" className="block text-[10px] font-mono uppercase tracking-wider text-themeText-secondary">
            Year
          </label>
          <input
            id="cert-year"
            type="text"
            value={year}
            onChange={(e) => setYear(e.target.value)}
            placeholder="2026"
            className="w-full rounded-none border-2 border-themeBorder bg-themeInput px-4 py-3 text-themeText focus:outline-none focus:border-themeAccent transition-all duration-200"
          />
        </div>
        <div className="space-y-1.5">
          <label htmlFor="cert-url" className="block text-[10px] font-mono uppercase tracking-wider text-themeText-secondary">
            Credential URL
          </label>
          <input
            id="cert-url"
            type="text"
            value={credentialUrl}
            onChange={(e) => setCredentialUrl(e.target.value)}
            className="w-full rounded-none border-2 border-themeBorder bg-themeInput px-4 py-3 text-themeText focus:outline-none focus:border-themeAccent transition-all duration-200"
          />
        </div>
        <div className="col-span-2">
          <button
            onClick={handleAdd}
            disabled={adding}
            className="flex items-center justify-center gap-2 px-6 py-3 rounded-none border-2 border-themeAccent bg-themeAccent text-themeText font-display font-semibold hover:bg-themeAccent-hover hover:text-themeText transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {adding ? "Adding…" : "Add Certification"}
          </button>
        </div>
      </div>
    </section>
  );
}

function SocialLinksManager() {
  const [form, setForm] = useState(emptySocial);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

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

  if (loading) {
    return (
      <section className="rounded-none py-10 text-center text-themeText/40 border border-themeBorder bg-themeSurface/20">
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
    <section className="space-y-6 rounded-none p-6 border border-themeBorder bg-themeSurface/20">
      <h2 className="text-lg font-display font-bold text-themeText uppercase tracking-[0.05em] mb-4">
        Social Links
      </h2>

      <div className="space-y-4">
        {fields.map((f) => (
          <div key={f.key} className="space-y-1.5">
            <label htmlFor={`social-${f.key}`} className="block text-[10px] font-mono uppercase tracking-wider text-themeText-secondary">
              {f.label}
            </label>
            <input
              id={`social-${f.key}`}
              type="text"
              value={form[f.key]}
              onChange={(e) => setForm({ ...form, [f.key]: e.target.value })}
              placeholder={f.placeholder}
              className="w-full rounded-none border-2 border-themeBorder bg-themeInput px-4 py-3 text-themeText focus:outline-none focus:border-themeAccent transition-all duration-200"
            />
          </div>
        ))}
      </div>

      <div className="border-t border-themeBorder pt-5 space-y-3">
        <h3 className="text-sm font-mono text-themeText-secondary uppercase tracking-wider">
          Resume PDF
        </h3>
        <p className="text-xs text-themeText-secondary/50">
          The site uses the local file{" "}
          <code className="text-themeAccent">public/resume.pdf</code> by default. Leave
          the field empty to use it, or enter an override URL/path.
        </p>
        <div className="space-y-1.5">
          <label htmlFor="social-resume" className="block text-[10px] font-mono uppercase tracking-wider text-themeText-secondary">
            Resume URL (override)
          </label>
          <input
            id="social-resume"
            type="text"
            value={form.resume_pdf_url}
            onChange={(e) => setForm({ ...form, resume_pdf_url: e.target.value })}
            placeholder="/resume.pdf"
            className="w-full rounded-none border-2 border-themeBorder bg-themeInput px-4 py-3 text-themeText focus:outline-none focus:border-themeAccent transition-all duration-200"
          />
        </div>
        <a
          href={form.resume_pdf_url || "/resume.pdf"}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block text-sm text-themeAccent hover:underline font-mono"
        >
          Preview resume
        </a>
      </div>

      <button
        onClick={handleSave}
        disabled={saving}
        className="flex items-center justify-center gap-2 px-6 py-3 rounded-none border-2 border-themeAccent bg-themeAccent text-themeText font-display font-semibold hover:bg-themeAccent-hover hover:text-themeText transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {saving ? "Saving…" : "Save Social Links"}
      </button>
    </section>
  );
}
