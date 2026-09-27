import Navbar from "../components/Navbar";
import ResourceLibrary from "../components/ResourceLibrary";
import { TUTORIALS, TUTORIAL_TOPICS } from "../data/resources";

export default function TutorialsPage() {
  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      <main className="mx-auto max-w-6xl px-4 py-8">
        <h1 className="text-2xl font-semibold text-slate-900">Tutorials</h1>
        <p className="mt-1 text-sm text-slate-500">
          Free, high-quality tutorials to build the skills employers look for.
        </p>
        <ResourceLibrary resources={TUTORIALS} topics={TUTORIAL_TOPICS} />
      </main>
    </div>
  );
}
