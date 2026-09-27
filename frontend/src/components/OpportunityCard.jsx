const TYPE_STYLES = {
  internship: "bg-blue-50 text-blue-700",
  hackathon: "bg-teal-50 text-teal-700",
  scholarship: "bg-indigo-50 text-indigo-700",
  course: "bg-cyan-50 text-cyan-700",
  competition: "bg-sky-50 text-sky-700",
};

export default function OpportunityCard({
  opportunity,
  bookmarked,
  onToggleBookmark,
  onOpen,
  bookmarking,
}) {
  const type = String(opportunity.type || opportunity.category || "").toLowerCase();

  return (
    <article className="flex h-full flex-col rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="mb-3 flex items-start justify-between gap-3">
        <span
          className={`rounded-full px-2.5 py-0.5 text-xs font-semibold capitalize ${
            TYPE_STYLES[type] || "bg-slate-100 text-slate-700"
          }`}
        >
          {opportunity.type || opportunity.category}
        </span>
        {onToggleBookmark && (
          <button
            type="button"
            disabled={bookmarking}
            onClick={() => onToggleBookmark(opportunity)}
            className={`rounded-md border px-2 py-1 text-xs font-medium ${
              bookmarked
                ? "border-teal-600 bg-teal-50 text-teal-700"
                : "border-slate-300 text-slate-600 hover:bg-slate-50"
            }`}
          >
            {bookmarked ? "Saved" : "Bookmark"}
          </button>
        )}
      </div>
      <h3 className="text-base font-semibold text-slate-900">{opportunity.title}</h3>
      <p className="mt-2 line-clamp-3 flex-1 text-sm text-slate-600">
        {opportunity.description}
      </p>
      <div className="mt-3 flex flex-wrap gap-1.5">
        {(opportunity.skills || []).slice(0, 4).map((skill) => (
          <span key={skill} className="rounded bg-slate-100 px-2 py-0.5 text-xs text-slate-600">
            {skill}
          </span>
        ))}
      </div>
      <div className="mt-4 flex items-center justify-between text-sm">
        <span className="text-slate-500">Deadline {opportunity.deadline || "—"}</span>
        <button
          type="button"
          onClick={() => onOpen(opportunity)}
          className="font-medium text-blue-700 hover:text-blue-800"
        >
          View details
        </button>
      </div>
      {typeof opportunity.score === "number" && (
        <p className="mt-2 text-xs text-teal-700">Match score {opportunity.score}</p>
      )}
    </article>
  );
}
