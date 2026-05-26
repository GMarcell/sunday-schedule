"use client";

import { FormEvent, useEffect, useState } from "react";
import { Plus, Save } from "lucide-react";
import { Member, Role } from "@/types/types";

export function MembersManager() {
  const [roles, setRoles] = useState<Role[]>([]);
  const [members, setMembers] = useState<Member[]>([]);
  const [name, setName] = useState("");
  const [roleIds, setRoleIds] = useState<string[]>([]);

  const load = () =>
    Promise.all([
      fetch("/api/roles").then((r) => r.json()),
      fetch("/api/members").then((r) => r.json()),
    ]).then(([roleData, memberData]) => {
      setRoles(roleData);
      setMembers(memberData);
    });

  useEffect(() => void load(), []);

  async function create(event: FormEvent) {
    event.preventDefault();

    await fetch("/api/members", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name,
        active: true,
        roleIds,
      }),
    });

    setName("");
    setRoleIds([]);
    load();
  }

  async function update(member: Member, next?: Partial<Member>) {
    const merged = { ...member, ...next };

    await fetch(`/api/members/${member.id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: merged.name,
        active: merged.active,
        roleIds: merged.roles.map((r) => r.role.id),
      }),
    });

    load();
  }

  return (
    <div className="space-y-6">
      {/* Create */}
      <form
        onSubmit={create}
        className="grid gap-4 rounded-3xl border border-white/10 bg-white/10 backdrop-blur-xl p-6 shadow-xl md:grid-cols-[1fr_2fr_auto]"
      >
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Member name"
          required
          className="rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white placeholder:text-slate-500 outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-400/30"
        />

        <RolePicker roles={roles} value={roleIds} onChange={setRoleIds} />

        <button
          type="submit"
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-3 text-sm font-medium text-white shadow-lg transition hover:bg-blue-500 hover:shadow-blue-500/30 active:scale-[0.98]"
        >
          <Plus size={16} />
          Add
        </button>
      </form>

      {/* Members */}
      <div className="grid gap-4">
        {members.map((member) => (
          <div
            key={member.id}
            className="grid gap-4 rounded-3xl border border-white/10 bg-white/10 backdrop-blur-xl p-5 shadow-xl transition hover:border-blue-400/20 md:grid-cols-[1fr_2fr_auto]"
          >
            <input
              value={member.name}
              onChange={(event) =>
                setMembers((items) =>
                  items.map((item) =>
                    item.id === member.id
                      ? {
                          ...item,
                          name: event.target.value,
                        }
                      : item,
                  ),
                )
              }
              className="rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-400/30"
            />

            <RolePicker
              roles={roles}
              value={member.roles.map((r) => r.role.id)}
              onChange={(ids) =>
                setMembers((items) =>
                  items.map((item) =>
                    item.id === member.id
                      ? {
                          ...item,
                          roles: ids.map((id) => ({
                            role: roles.find((role) => role.id === id)!,
                          })),
                        }
                      : item,
                  ),
                )
              }
            />

            <div className="flex gap-2">
              <button
                type="button"
                onClick={() =>
                  update(member, {
                    active: !member.active,
                  })
                }
                className={`rounded-xl px-4 py-3 text-sm font-medium transition ${
                  member.active
                    ? "bg-emerald-500/15 text-emerald-300 hover:bg-emerald-500/25"
                    : "bg-white/5 text-slate-400 hover:bg-white/10"
                }`}
              >
                {member.active ? "Active" : "Inactive"}
              </button>

              <button
                title="Save member"
                type="button"
                onClick={() => update(member)}
                className="rounded-xl bg-blue-600 p-3 text-white shadow-lg transition hover:bg-blue-500 hover:shadow-blue-500/30 active:scale-[0.98]"
              >
                <Save size={16} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function RolePicker({
  roles,
  value,
  onChange,
}: {
  roles: Role[];
  value: string[];
  onChange: (ids: string[]) => void;
}) {
  return (
    <div className="flex flex-wrap gap-2">
      {roles.map((role) => {
        const checked = value.includes(role.id);

        return (
          <label
            key={role.id}
            className={`cursor-pointer rounded-xl border px-3 py-2 text-sm transition ${
              checked
                ? "border-blue-400/40 bg-blue-500/20 text-blue-100"
                : "border-white/10 bg-white/5 text-slate-300 hover:bg-white/10"
            }`}
          >
            <input
              type="checkbox"
              className="sr-only"
              checked={checked}
              onChange={() =>
                onChange(
                  checked
                    ? value.filter((id) => id !== role.id)
                    : [...value, role.id],
                )
              }
            />
            {role.name}
          </label>
        );
      })}
    </div>
  );
}
