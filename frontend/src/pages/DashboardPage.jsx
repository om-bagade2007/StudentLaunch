import { useCallback, useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import OpportunityCard from "../components/OpportunityCard";
import OpportunityModal from "../components/OpportunityModal";
import { api } from "../api";

const TABS = [
  { id: "recommended", label: "Recommended" },
  { id: "all", label: "All Opportunities" },
  { id: "bookmarks", label: "My Bookmarks" },
];

const CATEGORIES = ["", "internship", "hackathon", "scholarship", "course", "competition"];

export default function DashboardPage() {
  const [tab, setTab] = useState("recommended");
  const [items, setItems] = useState([]);
  const [bookmarks, setBookmarks] = useState([]);
  const [category, setCategory] = useState("");
  const [skill, setSkill] = useState("");
  const [skillInput, setSkillInput] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selected, setSelected] = useState(null);
  const [bookmarkingId, setBookmarkingId] = useState(null);

  const bookmarkedIds = new Set(bookmarks.map((b) => b.opportunityId));

  const loadBookmarks = useCallback(async () => {
    const data = await api.getBookmarks();
    setBookmarks(data);
    return data;
  }, []);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      setLoading(true);
      setError("");
      try {
        const saved = await loadBookmarks();
        if (cancelled) return;
        if (tab === "recommended") {
          try {
            const recs = await api.getRecommendations();
            if (!cancelled) setItems(recs);
          } catch (err) {
            if (err.status === 404) {
              if (!cancelled) setItems([]);
              setError("Add a profile to see recommendations.");
            } else {
              throw err;
            }
          }
        } else if (tab === "all") {
          const opps = await api.getOpportunities({
            category: category || undefined,
            skill: skill || undefined,
          });
          if (!cancelled) setItems(opps);
        } else {
          if (!cancelled) {
            setItems(saved.map((b) => b.opportunity).filter(Boolean));
          }
        }
      } catch (err) {
        if (!cancelled) setError(err.message);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    load();
    return () => {
      cancelled = true;
    };
  }, [tab, category, skill, loadBookmarks]);

  async function toggleBookmark(opportunity) {
    setBookmarkingId(opportunity.id);
    try {
      if (bookmarkedIds.has(opportunity.id)) {
        await api.removeBookmark(opportunity.id);
      } else {
        await api.addBookmark(opportunity.id);
      }
      const saved = await loadBookmarks();
      if (tab === "bookmarks") {
        setItems(saved.map((b) => b.opportunity).filter(Boolean));
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setBookmarkingId(null);
    }
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      <main className="mx-auto max-w-6xl px-4 py-8">
        <h1 className="text-2xl font-semibold text-slate-900">Dashboard</h1>
        <p className="mt-1 text-sm text-slate-500">
          Discover internships, hackathons, scholarships, courses, and competitions.
        </p>

        <div className="mt-6 flex gap-2 border-b border-slate-200">
          {TABS.map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() => setTab(t.id)}
              className={`-mb-px border-b-2 px-3 py-2 text-sm font-medium ${
                tab === t.id
                  ? "border-teal-600 text-teal-700"
                  : "border-transparent text-slate-500 hover:text-slate-800"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        {tab === "all" && (
          <div className="mt-4 flex flex-wrap gap-3">
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm"
            >
              {CATEGORIES.map((c) => (
                <option key={c || "all"} value={c}>
                  {c ? c : "All categories"}
                </option>
              ))}
            </select>
            <form
              className="flex gap-2"
              onSubmit={(e) => {
                e.preventDefault();
                setSkill(skillInput.trim());
              }}
            >
              <input
                value={skillInput}
                onChange={(e) => setSkillInput(e.target.value)}
                placeholder="Filter by skill"
                className="rounded-lg border border-slate-300 px-3 py-2 text-sm"
              />
              <button type="submit" className="rounded-lg bg-slate-800 px-3 py-2 text-sm text-white">
                Apply
              </button>
              {(skill || category) && (
                <button
                  type="button"
                  onClick={() => {
                    setSkill("");
                    setSkillInput("");
                    setCategory("");
                  }}
                  className="rounded-lg px-3 py-2 text-sm text-slate-600"
                >
                  Clear
                </button>
              )}
            </form>
          </div>
        )}

        {error && <p className="mt-4 text-sm text-red-600">{error}</p>}
        {loading ? (
          <p className="mt-8 text-slate-500">Loading...</p>
        ) : items.length === 0 ? (
          <p className="mt-8 rounded-xl border border-dashed border-slate-300 bg-white p-8 text-center text-slate-500">
            Nothing here yet.
          </p>
        ) : (
          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {items.map((opp) => (
              <OpportunityCard
                key={opp.id}
                opportunity={opp}
                bookmarked={bookmarkedIds.has(opp.id)}
                bookmarking={bookmarkingId === opp.id}
                onToggleBookmark={toggleBookmark}
                onOpen={setSelected}
              />
            ))}
          </div>
        )}
      </main>
      <OpportunityModal opportunity={selected} onClose={() => setSelected(null)} />
    </div>
  );
}
