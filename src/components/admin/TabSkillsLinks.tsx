"use client";

import { useState, useEffect, useCallback } from "react";
import toast from "react-hot-toast";
import {
  getSkills,
  addSkill,
  deleteSkill,
  getCertifications,
  addCertification,
  deleteCertification,
  getSocialData,
  updateSocialData,
} from "@/lib/firestore";
import { Button } from "@/components/ui/Button";
import type { Skill, Certification, SocialData } from "@/types";

const CATEGORIES = [
  "Programming",
  "Backend",
  "Frontend",
  "Database",
  "AI / ML",
  "Data Analysis",
  "Tools & DevOps",
] as const;

const emptySocial: SocialData = {
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
  const [skills, setSkills] = useState<Skill[]>([]);
  const [loading, setLoading] = useState(true);
  const [name, setName] = useState("");
  const [category, setCategory] = useState<string>(CATEGORIES[0]);
  const [level, setLevel] = useState(50);
  const [adding, setAdding] = useState(false);

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

  async function handleDelete(id: string) {
    if (!confirm("Delete this skill?")) return;
    try {
      await deleteSkill(id);
      setSkills((prev) => prev.filter((s) => s.id !== id));
      toast.success("Skill deleted");
    } catch {
      toast.error("Failed to delete skill");
    }
  }

  const grouped = skills.reduce<Record<string, Skill[]>>((acc, skill) => {
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
                      <span>{skill.name}</span>
                      <span className="text-themeAccent font-mono text-xs">{skill.level}</span>
                      <button
                        onClick={() => handleDelete(skill.id!)}
                        className="ml-1 text-red-400 hover:text-red-300 text-xs"
                      >
                        ✕
                      </button>
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
  const [certs, setCerts] = useState<Certification[]>([]);
  const [loading, setLoading] = useState(true);
  const [title, setTitle] = useState("");
  const [issuer, setIssuer] = useState("");
  const [year, setYear] = useState("");
  const [credentialUrl, setCredentialUrl] = useState("");
  const [adding, setAdding] = useState(false);

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

  async function handleDelete(id: string) {
    if (!confirm("Delete this certification?")) return;
    try {
      await deleteCertification(id);
      setCerts((prev) => prev.filter((c) => c.id !== id));
      toast.success("Certification deleted");
    } catch {
      toast.error("Failed to delete certification");
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
            <div key={cert.id} className="flex items-center justify-between py-3">
              <div>
                <p className="text-themeText font-medium">{cert.title}</p>
                <p className="text-sm text-themeText/50">
                  {cert.issuer} {cert.issue_date ? `· ${cert.issue_date}` : ""}
                </p>
              </div>
              <button
                onClick={() => handleDelete(cert.id!)}
                className="text-red-400 hover:text-red-300 text-sm px-2 py-1"
              >
                Delete
              </button>
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
            placeholder="2024"
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
  const [form, setForm] = useState<SocialData>(emptySocial);
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
      <section className="glass py-10 text-center text-themeText/40">
        Loading social data…
      </section>
    );
  }

  const fields: { key: keyof SocialData; label: string; placeholder: string }[] = [
    { key: "github", label: "GitHub URL", placeholder: "https://github.com/..." },
    { key: "linkedin", label: "LinkedIn URL", placeholder: "https://linkedin.com/in/..." },
    { key: "email", label: "Email", placeholder: "you@example.com" },
    { key: "phone", label: "Phone", placeholder: "+1 234 567 890" },
    { key: "location", label: "Location", placeholder: "San Francisco, CA" },
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

      <Button onClick={handleSave} disabled={saving}>
        {saving ? "Saving…" : "Save Social Links"}
      </Button>
    </section>
  );
}
