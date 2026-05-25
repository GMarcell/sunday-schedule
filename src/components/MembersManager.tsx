"use client";

import { FormEvent, useEffect, useState } from "react";
import { Plus, Save } from "lucide-react";

type Role = { id: string; name: string };
type Member = { id: string; name: string; active: boolean; roles: { role: Role }[] };

export function MembersManager() {
  const [roles, setRoles] = useState<Role[]>([]);
  const [members, setMembers] = useState<Member[]>([]);
  const [name, setName] = useState("");
  const [roleIds, setRoleIds] = useState<string[]>([]);

  const load = () =>
    Promise.all([fetch("/api/roles").then((response) => response.json()), fetch("/api/members").then((response) => response.json())]).then(([roleData, memberData]) => {
      setRoles(roleData);
      setMembers(memberData);
    });

  useEffect(() => void load(), []);

  async function create(event: FormEvent) {
    event.preventDefault();
    await fetch("/api/members", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, active: true, roleIds })
    });
    setName("");
    setRoleIds([]);
    load();
  }

  async function update(member: Member, next?: Partial<Member>) {
    const merged = { ...member, ...next };
    await fetch(`/api/members/${member.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: merged.name,
        active: merged.active,
        roleIds: merged.roles.map((role) => role.role.id)
      })
    });
    load();
  }

  return (
    <div className="space-y-6">
      <form onSubmit={create} className="grid gap-4 rounded-md border border-line bg-white p-5 md:grid-cols-[1fr_2fr_auto]">
        <input value={name} onChange={(event) => setName(event.target.value)} placeholder="Member name" className="rounded-md border border-line px-3 py-2" required />
        <RolePicker roles={roles} value={roleIds} onChange={setRoleIds} />
        <button className="focus-ring inline-flex items-center justify-center gap-2 rounded-md bg-ink px-4 py-2 text-sm text-paper" type="submit">
          <Plus size={16} /> Add
        </button>
      </form>
      <div className="grid gap-3">
        {members.map((member) => (
          <div key={member.id} className="grid gap-3 rounded-md border border-line bg-white p-4 md:grid-cols-[1fr_2fr_auto]">
            <input
              value={member.name}
              onChange={(event) => setMembers((items) => items.map((item) => (item.id === member.id ? { ...item, name: event.target.value } : item)))}
              className="rounded-md border border-line px-3 py-2"
            />
            <RolePicker
              roles={roles}
              value={member.roles.map((role) => role.role.id)}
              onChange={(ids) =>
                setMembers((items) =>
                  items.map((item) => (item.id === member.id ? { ...item, roles: ids.map((id) => ({ role: roles.find((role) => role.id === id)! })) } : item))
                )
              }
            />
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => update(member, { active: !member.active })}
                className={`focus-ring rounded-md px-3 py-2 text-sm ${member.active ? "bg-emerald-50 text-emerald-700" : "bg-neutral-100 text-neutral-500"}`}
              >
                {member.active ? "Active" : "Inactive"}
              </button>
              <button title="Save member" type="button" onClick={() => update(member)} className="focus-ring rounded-md bg-ink p-2 text-paper">
                <Save size={16} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function RolePicker({ roles, value, onChange }: { roles: Role[]; value: string[]; onChange: (ids: string[]) => void }) {
  return (
    <div className="flex flex-wrap gap-2">
      {roles.map((role) => {
        const checked = value.includes(role.id);
        return (
          <label key={role.id} className={`cursor-pointer rounded-md border px-3 py-2 text-sm ${checked ? "border-ink bg-ink text-paper" : "border-line bg-white"}`}>
            <input
              type="checkbox"
              className="sr-only"
              checked={checked}
              onChange={() => onChange(checked ? value.filter((id) => id !== role.id) : [...value, role.id])}
            />
            {role.name}
          </label>
        );
      })}
    </div>
  );
}
