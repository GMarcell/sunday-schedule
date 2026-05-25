"use client";

import { signIn } from "next-auth/react";
import { FormEvent, useState } from "react";

export default function LoginForm() {
  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  async function login(event: FormEvent) {
    event.preventDefault();
    const result = await signIn("credentials", {
      email: form.email,
      password: form.password,
      redirect: false,
    });

    if (result?.ok) {
      window.location.href = "/admin";
    }
  }
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-blue-950 flex items-center justify-center p-6">
      <div className="w-full max-w-md rounded-3xl border border-white/10 bg-white/10 backdrop-blur-xl shadow-2xl p-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 mx-auto rounded-2xl bg-blue-500/20 flex items-center justify-center text-3xl mb-4">
            ⛪
          </div>

          <h1 className="text-3xl font-bold text-white">Welcome Back</h1>

          <p className="text-slate-300 mt-2">
            Login to manage Sunday Service Schedule
          </p>
        </div>

        {/* Form */}
        <form className="space-y-5" onSubmit={login}>
          <div>
            <label className="block text-sm text-slate-200 mb-2">Email</label>

            <input
              type="email"
              placeholder="you@example.com"
              className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white placeholder:text-slate-400 outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-400/30 transition"
              value={form.email}
              onChange={(e) =>
                setForm((prev) => ({
                  ...prev,
                  email: e.target.value,
                }))
              }
            />
          </div>

          <div>
            <label className="block text-sm text-slate-200 mb-2">
              Password
            </label>

            <input
              type="password"
              placeholder="••••••••"
              className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white placeholder:text-slate-400 outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-400/30 transition"
              value={form.password}
              onChange={(e) =>
                setForm((prev) => ({
                  ...prev,
                  password: e.target.value,
                }))
              }
            />
          </div>

          <button
            type="submit"
            className="w-full rounded-xl bg-blue-600 hover:bg-blue-500 text-white py-3 font-semibold transition duration-200 shadow-lg hover:shadow-blue-500/30 active:scale-[0.98]"
          >
            Login
          </button>
        </form>

        {/* Footer */}
        <p className="text-center text-sm text-slate-400 mt-6">
          Sunday Schedule Admin Panel
        </p>
      </div>
    </div>
  );
}
