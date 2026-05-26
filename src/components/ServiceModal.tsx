import { useState } from "react";
import { RolePicker } from "./RolePicker";
import { Role, Service } from "@/types/types";

export default function ServiceModal({
  service,
  roles,
  onClose,
  onSaved,
}: {
  service: Service;
  roles: Role[];
  onClose: () => void;
  onSaved: () => void;
}) {
  const date = new Date(service.datetime);

  const [form, setForm] = useState({
    name: service.name,
    date: date.toISOString().slice(0, 10),
    time: date.toTimeString().slice(0, 5),
    active: service.active,
    roleIds: service.roles.map((r) => r.role.id),
  });

  async function save() {
    await fetch(`/api/services/${service.id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: form.name,
        datetime: new Date(`${form.date}T${form.time}`),
        active: form.active,
        roleIds: form.roleIds,
      }),
    });

    onSaved();
  }

  async function remove() {
    if (!confirm("Delete service?")) return;

    await fetch(`/api/services/${service.id}`, {
      method: "DELETE",
    });

    onSaved();
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
      <div className="w-full max-w-2xl rounded-3xl border border-white/10 bg-slate-900 p-6 shadow-2xl">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-white">Edit Service</h2>

          <button onClick={onClose} className="text-slate-400 hover:text-white">
            ✕
          </button>
        </div>

        <div className="mt-6 space-y-4">
          <input
            value={form.name}
            onChange={(e) =>
              setForm({
                ...form,
                name: e.target.value,
              })
            }
            className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white"
          />

          <div className="grid gap-4 sm:grid-cols-2">
            <input
              type="date"
              value={form.date}
              onChange={(e) =>
                setForm({
                  ...form,
                  date: e.target.value,
                })
              }
              className="rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white"
            />

            <input
              type="time"
              value={form.time}
              onChange={(e) =>
                setForm({
                  ...form,
                  time: e.target.value,
                })
              }
              className="rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white"
            />
          </div>

          <RolePicker
            roles={roles}
            value={form.roleIds}
            onChange={(roleIds) =>
              setForm({
                ...form,
                roleIds,
              })
            }
          />

          <button
            onClick={() =>
              setForm({
                ...form,
                active: !form.active,
              })
            }
            className={`rounded-xl px-4 py-3 text-sm ${
              form.active
                ? "bg-emerald-500/20 text-emerald-300"
                : "bg-white/5 text-slate-400"
            }`}
          >
            {form.active ? "Active" : "Inactive"}
          </button>
        </div>

        <div className="mt-6 flex justify-between gap-3">
          <button
            onClick={remove}
            className="rounded-xl bg-red-500/20 px-4 py-3 text-red-300 transition hover:bg-red-500/30"
          >
            Delete
          </button>

          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="rounded-xl border border-white/10 px-4 py-3 text-slate-300"
            >
              Cancel
            </button>

            <button
              onClick={save}
              className="rounded-xl bg-blue-600 px-5 py-3 text-white transition hover:bg-blue-500"
            >
              Save
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
