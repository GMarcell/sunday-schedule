"use client";

import { FormEvent, useEffect, useState } from "react";
import { Plus } from "lucide-react";

type Role = { id: string; name: string };
type Service = {
  id: string;
  name: string;
  date: string;
  time: string;
  active: boolean;
  roles: { role: Role }[];
};

export function ServicesManager() {
  const [roles, setRoles] = useState<Role[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [form, setForm] = useState({
    name: "",
    time: "09:00",
    date: new Date().toDateString(),
    roleIds: [] as string[],
  });

  const load = () =>
    Promise.all([
      fetch("/api/roles").then((response) => response.json()),
      fetch("/api/services").then((response) => response.json()),
    ]).then(([roleData, serviceData]) => {
      setRoles(roleData);
      setServices(serviceData);
    });

  useEffect(() => void load(), []);

  async function create(event: FormEvent) {
    event.preventDefault();
    const { date, time, ...rest } = form;
    const payload = {
      name: rest.name,
      roleIds: rest.roleIds,
      datetime: new Date(`${date}T${time}`),
    };
    await fetch("/api/services", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...payload, active: true }),
    });
    setForm({
      name: "",
      time: "09:00",
      date: new Date().toString(),
      roleIds: [],
    });
    load();
  }

  async function toggle(service: Service) {
    const dateTime = new Date(`${service.date}T${service.time}`);
    await fetch(`/api/services/${service.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: service.name,
        dateTime: dateTime,
        active: !service.active,
        dayOfWeek: 0,
        roleIds: service.roles.map((role) => role.role.id),
      }),
    });
    load();
  }

  return (
    <div className="space-y-6">
      <form
        onSubmit={create}
        className="grid gap-4 rounded-md border border-line bg-white p-5 lg:grid-cols-[1fr_120px_140px_2fr_auto]"
      >
        <input
          value={form.name}
          onChange={(event) => setForm({ ...form, name: event.target.value })}
          placeholder="Service name"
          className="rounded-md border border-line px-3 py-2"
          required
        />
        <input
          type="time"
          value={form.time}
          onChange={(event) => setForm({ ...form, time: event.target.value })}
          className="rounded-md border border-line px-3 py-2"
        />
        <input
          type="date"
          value={form.date.toString()}
          onChange={(event) =>
            setForm({ ...form, date: event.target.value.toString() })
          }
          className="rounded-md border border-line px-3 py-2"
        />
        <RolePicker
          roles={roles}
          value={form.roleIds}
          onChange={(roleIds) => setForm({ ...form, roleIds })}
        />
        <button
          className="focus-ring inline-flex items-center justify-center gap-2 rounded-md bg-ink px-4 py-2 text-sm text-paper"
          type="submit"
        >
          <Plus size={16} /> Add
        </button>
      </form>
      <div className="grid gap-4 md:grid-cols-2">
        {services.map((service) => (
          <article
            key={service.id}
            className="rounded-md border border-line bg-white p-5"
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 className="font-serif text-2xl">{service.name}</h2>
                <p className="font-mono text-sm text-neutral-500">
                  {service.date} · {service.time}
                </p>
              </div>
              <button
                onClick={() => toggle(service)}
                className={`rounded-md px-3 py-2 text-sm ${service.active ? "bg-emerald-50 text-emerald-700" : "bg-neutral-100 text-neutral-500"}`}
              >
                {service.active ? "Active" : "Inactive"}
              </button>
            </div>
            <div className="mt-4 flex flex-wrap gap-2">
              {service.roles.map(({ role }) => (
                <span
                  key={role.id}
                  className="rounded-md bg-ink px-3 py-1 text-sm text-paper"
                >
                  {role.name}
                </span>
              ))}
            </div>
          </article>
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
            className={`cursor-pointer rounded-md border px-3 py-2 text-sm ${checked ? "border-ink bg-ink text-paper" : "border-line bg-white"}`}
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
