import { useState } from "react";
import { Link, Navigate, useLocation, useNavigate } from "react-router-dom";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase";
import { getAuthErrorMessage } from "../authErrors";
import { useAuth } from "../context/AuthContext";
import Navbar from "../components/Navbar";

export default function AuthPage({ mode }) {
  const isSignup = mode === "signup";
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const demoPassword = import.meta.env.VITE_DEMO_PASSWORD;

  if (!loading && user) {
    return <Navigate to={location.state?.from || "/dashboard"} replace />;
  }

  async function onSubmit(e) {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      if (isSignup) {
        await createUserWithEmailAndPassword(auth, email, password);
        navigate("/profile");
      } else {
        await signInWithEmailAndPassword(auth, email, password);
        navigate("/dashboard");
      }
    } catch (err) {
      setError(getAuthErrorMessage(err));
    } finally {
      setSubmitting(false);
    }
  }

  async function onDemoLogin() {
    setError("");
    if (!demoPassword) {
      setError("Demo login is not configured. Set VITE_DEMO_PASSWORD and rebuild the frontend.");
      return;
    }

    setSubmitting(true);
    try {
      await signInWithEmailAndPassword(auth, "demo@studentlaunch.app", demoPassword);
      navigate("/dashboard");
    } catch (err) {
      setError(getAuthErrorMessage(err));
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      <main className="mx-auto max-w-md px-4 py-16">
        <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
          <h1 className="text-2xl font-semibold text-slate-900">
            {isSignup ? "Create your account" : "Welcome back"}
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            {isSignup
              ? "Sign up to match internships, hackathons, and more."
              : "Log in to see opportunities matched to you."}
          </p>
          <form onSubmit={onSubmit} className="mt-6 space-y-4">
            <label className="block text-sm font-medium text-slate-700">
              Email
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-100"
              />
            </label>
            <label className="block text-sm font-medium text-slate-700">
              Password
              <input
                type="password"
                required
                minLength={6}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-100"
              />
            </label>
            {error && (
              <p
                role="alert"
                className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700"
              >
                {error}
                {error.includes("already exists") && (
                  <>
                    {" "}
                    <Link to="/login" className="font-semibold underline">
                      Go to login
                    </Link>
                  </>
                )}
              </p>
            )}
            <button
              type="submit"
              disabled={submitting}
              className="w-full rounded-lg bg-blue-600 py-2.5 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-60"
            >
              {submitting ? "Please wait..." : isSignup ? "Sign up" : "Log in"}
            </button>
          </form>
          {!isSignup && (
            <div className="mt-5 border-t border-slate-200 pt-5">
              <button
                type="button"
                onClick={onDemoLogin}
                disabled={submitting}
                className="w-full rounded-lg border border-teal-600 bg-white px-4 py-2.5 text-sm font-semibold text-teal-700 hover:bg-teal-50 disabled:opacity-60"
              >
                {submitting ? "Please wait..." : "Try Demo Account — No Signup Needed"}
              </button>
            </div>
          )}
          <p className="mt-4 text-center text-sm text-slate-500">
            {isSignup ? (
              <>
                Already have an account?{" "}
                <Link to="/login" className="font-medium text-teal-700">
                  Log in
                </Link>
              </>
            ) : (
              <>
                New here?{" "}
                <Link to="/signup" className="font-medium text-teal-700">
                  Sign up
                </Link>
              </>
            )}
          </p>
        </div>
      </main>
    </div>
  );
}
