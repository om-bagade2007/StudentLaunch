import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      <main className="mx-auto max-w-4xl px-4 py-20 text-center">
        <p className="text-sm font-semibold uppercase tracking-wide text-teal-700">
          For students
        </p>
        <h1 className="mt-3 text-4xl font-bold text-slate-900">Find your next launch</h1>
        <p className="mx-auto mt-4 max-w-2xl text-slate-600">
          StudentLaunch matches internships, hackathons, scholarships, courses, and competitions
          to your skills and interests.
        </p>
        <div className="mt-8 flex justify-center gap-3">
          <Link
            to="/signup"
            className="rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-blue-700"
          >
            Get started
          </Link>
          <Link
            to="/login"
            className="rounded-lg border border-slate-300 bg-white px-5 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50"
          >
            Log in
          </Link>
        </div>
      </main>
    </div>
  );
}
