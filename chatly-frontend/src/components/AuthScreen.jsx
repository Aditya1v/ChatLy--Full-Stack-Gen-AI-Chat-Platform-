import { useState } from "react";
import { motion } from "framer-motion";
import { useAuth } from "../context/useAuth";

const MotionDiv = motion.div;

const AuthScreen = () => {
  const { login, register, authError } = useAuth();
  const [mode, setMode] = useState("login");
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e) =>
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    if (mode === "login") {
      await login({ email: form.email, password: form.password });
    } else {
      await register(form);
    }
    setSubmitting(false);
  };

  return (
    <div className="flex h-dvh items-center justify-center bg-[var(--bg)] px-4 text-[var(--text-main)]">
      <MotionDiv
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
        className="panel w-full max-w-sm rounded-2xl p-7"
      >
        <div className="mb-6 flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[var(--ink)] text-[var(--ink-contrast)]">
            <img src="/favicon.svg" alt="" className="h-5 w-5 object-contain" />
          </div>
          <div>
            <p className="font-display flex items-center text-[16px] font-semibold">
              ChatLy<span className="caret ml-0.5" aria-hidden="true" />
            </p>
            <p className="text-[12px] text-[var(--text-muted)]">
              {mode === "login" ? "Welcome back" : "Create your account"}
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-2.5">
          {mode === "register" && (
            <input
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="Full name"
              required
              className="rounded-xl border border-[var(--border)] bg-[var(--surface)] px-3.5 py-2.5 text-[13.5px] outline-none transition focus:border-[var(--accent)]"
            />
          )}
          <input
            name="email"
            type="email"
            value={form.email}
            onChange={handleChange}
            placeholder="Email"
            required
            className="rounded-xl border border-[var(--border)] bg-[var(--surface)] px-3.5 py-2.5 text-[13.5px] outline-none transition focus:border-[var(--accent)]"
          />
          <input
            name="password"
            type="password"
            value={form.password}
            onChange={handleChange}
            placeholder="Password (min 8 characters)"
            required
            minLength={8}
            className="rounded-xl border border-[var(--border)] bg-[var(--surface)] px-3.5 py-2.5 text-[13.5px] outline-none transition focus:border-[var(--accent)]"
          />

          {authError && (
            <p className="text-[13px] text-red-500" role="alert">
              {authError}
            </p>
          )}

          <button
            type="submit"
            disabled={submitting}
            className="mt-1 rounded-xl bg-[var(--ink)] px-4 py-2.5 text-[13.5px] font-medium text-[var(--ink-contrast)] transition disabled:opacity-60"
          >
            {submitting ? "Please wait…" : mode === "login" ? "Log in" : "Create account"}
          </button>
        </form>

        <button
          type="button"
          onClick={() => setMode(mode === "login" ? "register" : "login")}
          className="mt-4 w-full text-center text-[12.5px] text-[var(--text-muted)] underline-offset-2 hover:underline"
        >
          {mode === "login" ? "Need an account? Register" : "Already have an account? Log in"}
        </button>
      </MotionDiv>
    </div>
  );
};

export default AuthScreen;
