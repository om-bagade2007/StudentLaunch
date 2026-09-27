export default function OpportunityModal({ opportunity, onClose }) {
  if (!opportunity) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4" onClick={onClose}>
      <div
        className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-xl bg-white p-6 shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-teal-700">
              {opportunity.type || opportunity.category}
            </p>
            <h2 className="mt-1 text-xl font-semibold text-slate-900">{opportunity.title}</h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-md px-2 py-1 text-sm text-slate-500 hover:bg-slate-100"
          >
            Close
          </button>
        </div>
        <p className="mt-2 text-sm text-slate-500">Deadline {opportunity.deadline || "—"}</p>
        <p className="mt-4 text-sm leading-6 text-slate-700">{opportunity.description}</p>
        <div className="mt-4 flex flex-wrap gap-1.5">
          {(opportunity.skills || []).map((skill) => (
            <span key={skill} className="rounded bg-slate-100 px-2 py-0.5 text-xs text-slate-600">
              {skill}
            </span>
          ))}
        </div>
        {opportunity.link && (
          <a
            href={opportunity.link}
            target="_blank"
            rel="noreferrer"
            className="mt-6 inline-flex rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
          >
            Open application
          </a>
        )}
      </div>
    </div>
  );
}
