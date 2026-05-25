"use client";

import { Plus, Trash2 } from "lucide-react";
import { FormEvent, useEffect, useState } from "react";

type Role = { id: string; name: string };

export function RolesManager() {
  const [roles, setRoles] = useState<Role[]>([]);
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");

  const load = () =>
    fetch("/api/roles")
      .then((response) => response.json())
      .then(setRoles);

  useEffect(() => void load(), []);

  async function submit(event: FormEvent) {
    event.preventDefault();

    const response = await fetch("/api/roles", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name }),
    });

    setMessage(response.ok ? "Role saved." : "Could not save role.");
    setName("");
    load();
  }

  async function remove(id: string) {
    const response = await fetch(`/api/roles/${id}`, {
      method: "DELETE",
    });

    const body = await response.json();
    setMessage(body.warning ?? "Role removed.");
    load();
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[340px_1fr]">
      {/* Form */}
      <form
        onSubmit={submit}
        className="rounded-3xl border border-white/10 bg-white/10 backdrop-blur-xl p-6 shadow-xl"
      >
        <label
          htmlFor="role"
          className="block text-xs uppercase tracking-[0.14em] text-slate-300"
        >
          Role name
        </label>

        <input
          id="role"
          value={name}
          onChange={(event) => setName(event.target.value)}
          required
          placeholder="e.g. Worship Leader"
          className="mt-3 w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white placeholder:text-slate-500 outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-400/30"
        />

        <button
          type="submit"
          className="mt-5 inline-flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-3 text-sm font-medium text-white shadow-lg transition hover:bg-blue-500 hover:shadow-blue-500/30 active:scale-[0.98]"
        >
          <Plus size={16} />
          Add role
        </button>

        {message ? (
          <p className="mt-4 text-sm text-slate-300">{message}</p>
        ) : null}
      </form>

      {/* List */}
      <div className="rounded-3xl border border-white/10 bg-white/10 backdrop-blur-xl shadow-xl overflow-hidden">
        {roles.length === 0 ? (
          <div className="p-6 text-sm text-slate-400">No roles added yet.</div>
        ) : (
          roles.map((role) => (
            <div
              key={role.id}
              className="flex items-center justify-between border-b border-white/10 px-5 py-4 last:border-0 transition hover:bg-white/5"
            >
              <span className="font-medium text-white">{role.name}</span>

              <button
                title="Delete role"
                onClick={() => remove(role.id)}
                className="rounded-xl p-2 text-slate-400 transition hover:bg-red-500/10 hover:text-red-300"
              >
                <Trash2 size={16} />
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
