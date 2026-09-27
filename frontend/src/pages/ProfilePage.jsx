import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import TagInput from "../components/TagInput";
import { api } from "../api";

const CATEGORIES = ["internship", "hackathon", "scholarship", "course", "competition"];

export default function ProfilePage() {
  const navigate = useNavigate();
  const [education, setEducation] = useState("");
  const [skills, setSkills] = useState([]);
  const [interests, setInterests] = useState([]);
  const [preferredCategories, setPreferredCategories] = useState([]);
  const [error, setError] = useState("");
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    let cancelled = false;
    api
      .getProfile()
      .then((profile) => {
        if (cancelled) return;
        setEducation(profile.education || "");
        setSkills(profile.skills || []);
        setInterests(profile.interests || []);
        setPreferredCategories(profile.preferredCategories || []);
      })
      .catch((err) => {
        if (err.status !== 404) setError(err.message);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  function toggleCategory(cat) {
    setPreferredCategories((prev) =>
      prev.includes(cat) ? prev.filter((c) => c !== cat) : [...prev, cat]
    );
  }

  async function onSubmit(e) {
    e.preventDefault();
    setError("");
    setStatus("");
    setSaving(true);
    try {
      await api.saveProfile({
        education,
        skills,
        interests,
        preferredCategories,
      });
      setStatus("Profile saved.");
      navigate("/dashboard");
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      <main className="mx-auto max-w-2xl px-4 py-10">
        <h1 className="text-2xl font-semibold text-slate-900">Your profile</h1>
        <p className="mt-1 text-sm text-slate-500">
          We use this to rank internships, hackathons, scholarships, courses, and competitions.
        </p>
        {loading ? (
          <p className="mt-8 text-slate-500">Loading profile...</p>
        ) : (
          <form onSubmit={onSubmit} className="mt-8 space-y-5 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <label className="block text-sm font-medium text-slate-700">
              Education
              <input
                value={education}
                onChange={(e) => setEducation(e.target.value)}
                placeholder="B.S. Computer Science, 2027"
                className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-100"
              />
            </label>
            <TagInput
              label="Skills"
              values={skills}
              onChange={setSkills}
              placeholder="Type a skill and press Enter"
            />
            <TagInput
              label="Interests"
              values={interests}
              onChange={setInterests}
              placeholder="Type an interest and press Enter"
            />
            <fieldset>
              <legend className="mb-2 text-sm font-medium text-slate-700">Preferred categories</legend>
              <div className="flex flex-wrap gap-2">
                {CATEGORIES.map((cat) => (
                  <label
                    key={cat}
                    className={`cursor-pointer rounded-full border px-3 py-1 text-sm capitalize ${
                      preferredCategories.includes(cat)
                        ? "border-teal-600 bg-teal-50 text-teal-800"
                        : "border-slate-300 text-slate-600"
                    }`}
                  >
                    <input
                      type="checkbox"
                      className="sr-only"
                      checked={preferredCategories.includes(cat)}
                      onChange={() => toggleCategory(cat)}
                    />
                    {cat}
                  </label>
                ))}
              </div>
            </fieldset>
            {error && <p className="text-sm text-red-600">{error}</p>}
            {status && <p className="text-sm text-teal-700">{status}</p>}
            <button
              type="submit"
              disabled={saving}
              className="rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-60"
            >
              {saving ? "Saving..." : "Save and continue"}
            </button>
          </form>
        )}
      </main>
    </div>
  );
}
