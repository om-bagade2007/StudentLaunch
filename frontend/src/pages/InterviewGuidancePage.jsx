import Navbar from "../components/Navbar";
import ResourceLibrary from "../components/ResourceLibrary";
import { INTERVIEW_CHECKLIST, INTERVIEW_GUIDES, INTERVIEW_TOPICS } from "../data/resources";

export default function InterviewGuidancePage() {
  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      <main className="mx-auto max-w-6xl px-4 py-8">
        <h1 className="text-2xl font-semibold text-slate-900">Interview Guidance</h1>
        <p className="mt-1 text-sm text-slate-500">
          Prepare for coding, system design, and behavioral interviews with proven guides.
        </p>

        <section
          aria-labelledby="checklist-heading"
          className="mt-6 rounded-xl border border-teal-200 bg-teal-50 p-5"
        >
          <h2 id="checklist-heading" className="text-base font-semibold text-teal-900">
            Before every interview
          </h2>
          <ol className="mt-3 list-decimal space-y-1.5 pl-5 text-sm text-teal-900">
            {INTERVIEW_CHECKLIST.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ol>
        </section>

        <ResourceLibrary resources={INTERVIEW_GUIDES} topics={INTERVIEW_TOPICS} />
      </main>
    </div>
  );
}
