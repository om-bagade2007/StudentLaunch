import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import OpportunityCard from "../components/OpportunityCard";
import OpportunityModal from "../components/OpportunityModal";
import { api } from "../api";
import { useAuth } from "../context/AuthContext";

export default function CoursesPage() {
  const { user, loading: authLoading } = useAuth();
  const [courses, setCourses] = useState([]);
  const [bookmarks, setBookmarks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selected, setSelected] = useState(null);
  const [bookmarkingId, setBookmarkingId] = useState(null);
  const [reloadKey, setReloadKey] = useState(0);

  const bookmarkedIds = new Set(bookmarks.map((b) => b.opportunityId));

  useEffect(() => {
    if (authLoading) return;
    let cancelled = false;
    async function load() {
      setLoading(true);
      setError("");
      try {
        const [items, saved] = await Promise.all([
          api.getOpportunities({ category: "course" }),
          user ? api.getBookmarks() : Promise.resolve([]),
        ]);
        if (!cancelled) {
          setCourses(items);
          setBookmarks(saved);
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
  }, [user, authLoading, reloadKey]);

  async function toggleBookmark(course) {
    setBookmarkingId(course.id);
    try {
      if (bookmarkedIds.has(course.id)) {
        await api.removeBookmark(course.id);
      } else {
        await api.addBookmark(course.id);
      }
      setBookmarks(await api.getBookmarks());
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
        <h1 className="text-2xl font-semibold text-slate-900">Courses</h1>
        <p className="mt-1 text-sm text-slate-500">
          Online courses and certifications to level up your skills.
        </p>

        {error && (
          <div
            role="alert"
            className="mt-4 flex flex-wrap items-center justify-between gap-3 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700"
          >
            <span>{error}</span>
            <button
              type="button"
              onClick={() => setReloadKey((k) => k + 1)}
              className="font-semibold underline"
            >
              Try again
            </button>
          </div>
        )}

        {loading ? (
          <p className="mt-8 text-slate-500">Loading courses...</p>
        ) : courses.length === 0 ? (
          !error && (
            <p className="mt-8 rounded-xl border border-dashed border-slate-300 bg-white p-8 text-center text-slate-500">
              No courses available yet.
            </p>
          )
        ) : (
          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {courses.map((course) => (
              <OpportunityCard
                key={course.id}
                opportunity={course}
                bookmarked={bookmarkedIds.has(course.id)}
                bookmarking={bookmarkingId === course.id}
                onToggleBookmark={user ? toggleBookmark : undefined}
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
