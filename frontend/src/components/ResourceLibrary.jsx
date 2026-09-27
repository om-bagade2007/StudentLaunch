import { useState } from "react";

const LEVEL_STYLES = {
  Beginner: "bg-teal-50 text-teal-700",
  Intermediate: "bg-blue-50 text-blue-700",
};

export default function ResourceLibrary({ resources, topics }) {
  const [topic, setTopic] = useState("All");
  const visible = topic === "All" ? resources : resources.filter((r) => r.topic === topic);

  return (
    <>
      <div className="mt-6 flex flex-wrap gap-2" role="group" aria-label="Filter by topic">
        {topics.map((t) => (
          <button
            key={t}
            type="button"
            aria-pressed={topic === t}
            onClick={() => setTopic(t)}
            className={`rounded-full border px-3 py-1.5 text-sm font-medium ${
              topic === t
                ? "border-teal-600 bg-teal-600 text-white"
                : "border-slate-300 bg-white text-slate-600 hover:bg-slate-100"
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {visible.map((resource) => (
          <article
            key={resource.link}
            className="flex h-full flex-col rounded-xl border border-slate-200 bg-white p-5 shadow-sm"
          >
            <div className="mb-3 flex items-center justify-between gap-3">
              <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                {resource.topic}
              </span>
              <span
                className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                  LEVEL_STYLES[resource.level] || "bg-slate-100 text-slate-700"
                }`}
              >
                {resource.level}
              </span>
            </div>
            <h3 className="text-base font-semibold text-slate-900">{resource.title}</h3>
            <p className="mt-1 text-xs text-slate-500">{resource.provider}</p>
            <p className="mt-2 flex-1 text-sm leading-relaxed text-slate-600">
              {resource.description}
            </p>
            <a
              href={resource.link}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-4 text-sm font-medium text-blue-700 hover:text-blue-800"
            >
              Open resource
              <span className="sr-only"> (opens in a new tab)</span>
            </a>
          </article>
        ))}
      </div>
    </>
  );
}
