import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Navbar from "../components/Navbar";
import TagInput from "../components/TagInput";
import { api } from "../api";

const CATEGORIES = ["internship", "hackathon", "scholarship", "course", "competition"];

export default function ProfilePage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const displayNameParts = (user?.displayName || "").split(" ");
  const authFirstName = displayNameParts[0] || "";
  const authLastName = displayNameParts.slice(1).join(" ");
  const [firstName, setFirstName] = useState(location.state?.firstName || authFirstName);
  const [lastName, setLastName] = useState(
    location.state?.lastName || authLastName
  );
  const [mobile, setMobile] = useState(location.state?.mobile || "");
  const [education, setEducation] = useState("");
  const [skills, setSkills] = useState([]);
  const [interests, setInterests] = useState([]);
  const [preferredCategories, setPreferredCategories] = useState([]);
  const [error, setError] = useState("");
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [profileComplete, setProfileComplete] = useState(false);

  useEffect(() => {
    let cancelled = false;
    api
      .getProfile()
      .then((profile) => {
        if (cancelled) return;
        setFirstName(profile.firstName || location.state?.firstName || authFirstName);
        setLastName(
          profile.lastName || location.state?.lastName || authLastName
        );
        setMobile(profile.mobile || location.state?.mobile || "");
        setEducation(profile.education || "");
        setSkills(profile.skills || []);
        setInterests(profile.interests || []);
        setPreferredCategories(profile.preferredCategories || []);
        setProfileComplete(
          profile.profileComplete ?? Boolean(
            profile.education &&
              profile.skills?.length &&
              profile.interests?.length &&
              profile.preferredCategories?.length
          )
        );
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
  }, [location.state, authFirstName, authLastName]);

  function toggleCategory(cat) {
    setPreferredCategories((prev) =>
      prev.includes(cat) ? prev.filter((c) => c !== cat) : [...prev, cat]
    );
  }

  async function onSubmit(e) {
    e.preventDefault();
    setError("");
    setStatus("");
    if (!skills.length || !interests.length || !preferredCategories.length) {
      setError("Add at least one skill, one interest, and one preferred category to continue.");
      return;
    }
    setSaving(true);
    try {
      await api.saveProfile({
        firstName,
        lastName,
        mobile,
        education,
        skills,
        interests,
        preferredCategories,
        profileComplete: true,
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
        <h1 className="text-2xl font-semibold text-slate-900">
          {profileComplete ? "Your profile" : "Let’s personalize your opportunities"}
        </h1>
        <p className="mt-1 text-sm text-slate-500">
          {profileComplete
            ? "Update your details and preferences to keep your recommendations relevant."
            : "Complete your profile to see opportunities selected for your skills and interests."}
        </p>
        {loading ? (
          <p className="mt-8 text-slate-500">Loading profile...</p>
        ) : (
          <form onSubmit={onSubmit} className="mt-8 space-y-5 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="grid gap-5 sm:grid-cols-2">
              <label className="block text-sm font-medium text-slate-700">
                First name
                <input
                  required
                  autoComplete="given-name"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-100"
                />
              </label>
              <label className="block text-sm font-medium text-slate-700">
                Surname
                <input
                  required
                  autoComplete="family-name"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-100"
                />
              </label>
            </div>
            <label className="block text-sm font-medium text-slate-700">
              Mobile number
              <input
                type="tel"
                required
                autoComplete="tel"
                value={mobile}
                onChange={(e) => setMobile(e.target.value)}
                className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-100"
              />
            </label>
            <label className="block text-sm font-medium text-slate-700">
              Education
              <input
                required
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
