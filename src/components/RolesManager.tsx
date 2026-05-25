"use client";

import { Plus, Trash2 } from "lucide-react";
import { FormEvent, useEffect, useState } from "react";

type Role = { id: string; name: string };

export function RolesManager() {
  const [roles, setRoles] = useState<Role[]>([]);
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");

  const load = () => fetch("/api/roles").then((response) => response.json()).then(setRoles);
  useEffect(() => void load(), []);

  async function submit(event: FormEvent) {
    event.preventDefault();
    const response = await fetch("/api/roles", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name })
    });
    setMessage(response.ok ? "Role saved." : "Could not save role.");
    setName("");
    load();
  }

  async function remove(id: string) {
    const response = await fetch(`/api/roles/${id}`, { method: "DELETE" });
    const body = await response.json();
    setMessage(body.warning ?? "Role removed.");
    load();
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[320px_1fr]">
      <form onSubmit={submit} className="rounded-md border border-line bg-white p-5">
        <label className="font-mono text-xs uppercase tracking-[0.14em] text-neutral-500" htmlFor="role">
          Role name
        </label>
        <input id="role" value={name} onChange={(event) => setName(event.target.value)} className="mt-2 w-full rounded-md border border-line px-3 py-2" required />
        <button className="focus-ring mt-4 inline-flex items-center gap-2 rounded-md bg-ink px-4 py-2 text-sm text-paper" type="submit">
          <Plus size={16} /> Add role
        </button>
        {message ? <p className="mt-3 text-sm text-neutral-600">{message}</p> : null}
      </form>
      <div className="rounded-md border border-line bg-white">
        {roles.map((role) => (
          <div key={role.id} className="flex items-center justify-between border-b border-line px-5 py-4 last:border-0">
            <span className="font-medium">{role.name}</span>
            <button title="Delete role" onClick={() => remove(role.id)} className="focus-ring rounded-md p-2 text-neutral-500 hover:bg-red-50 hover:text-red-700">
              <Trash2 size={16} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
