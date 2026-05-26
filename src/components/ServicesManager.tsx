"use client";

import { FormEvent, useEffect, useState } from "react";
import { Plus, Trash } from "lucide-react";
import { format } from "date-fns";
import { RolePicker } from "./RolePicker";
import ServiceModal from "./ServiceModal";
import { Role, Service } from "@/types/types";

export function ServicesManager() {
  const [roles, setRoles] = useState<Role[]>([]);
  const [services, setServices] = useState<Service[]>([]);

  const [form, setForm] = useState({
    name: "",
    time: "09:00",
    date: new Date().toISOString().slice(0, 10),
    roleIds: [] as string[],
  });

  const [selectedService, setSelectedService] = useState<Service | null>(null);

  const load = () =>
    Promise.all([
      fetch("/api/roles").then((r) => r.json()),
      fetch("/api/services").then((r) => r.json()),
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
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        ...payload,
        active: true,
      }),
    });

    setForm({
      name: "",
      time: "09:00",
      date: new Date().toISOString().slice(0, 10),
      roleIds: [],
    });

    load();
  }

  async function toggle(service: Service) {
    await fetch(`/api/services/${service.id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: service.name,
        datetime: service.datetime,
        active: !service.active,
        roleIds: service.roles.map((r) => r.role.id),
      }),
    });

    load();
  }

  async function deleteService(id: string) {
    await fetch(`/api/services/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    });

    load();
  }

  return (
    <div className="space-y-6">
      {/* Create */}
      <form
        onSubmit={create}
        className="grid gap-4 rounded-3xl border border-white/10 bg-white/10 backdrop-blur-xl p-6 shadow-xl lg:grid-cols-[1fr_120px_160px_2fr_auto]"
      >
        <input
          value={form.name}
          onChange={(e) =>
            setForm({
              ...form,
              name: e.target.value,
            })
          }
          placeholder="Service name"
          required
          className="rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white placeholder:text-slate-500 outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-400/30"
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
          className="rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-400/30"
        />

        <input
          type="date"
          value={form.date}
          onChange={(e) =>
            setForm({
              ...form,
              date: e.target.value,
            })
          }
          className="rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-400/30"
        />

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
          type="submit"
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-3 text-sm font-medium text-white shadow-lg transition hover:bg-blue-500 hover:shadow-blue-500/30 active:scale-[0.98]"
        >
          <Plus size={16} />
          Add
        </button>
      </form>

      {/* Services */}
      <div className="grid gap-5 md:grid-cols-2">
        {services.map((service) => (
          <article
            key={service.id}
            onClick={() => setSelectedService(service)}
            className="cursor-pointer rounded-3xl border border-white/10 bg-white/10 backdrop-blur-xl p-6 shadow-xl transition hover:border-blue-400/30 hover:-translate-y-1"
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 className="text-2xl font-bold text-white">
                  {service.name}
                </h2>

                <p className="mt-1 text-sm text-slate-400">
                  {format(new Date(service.datetime), "dd MMM yyyy HH:mm")}
                </p>
              </div>

              <button
                onClick={() => toggle(service)}
                className={`rounded-xl px-4 py-2 text-sm font-medium transition ${
                  service.active
                    ? "bg-emerald-500/15 text-emerald-300 hover:bg-emerald-500/25"
                    : "bg-white/5 text-slate-400 hover:bg-white/10"
                }`}
              >
                {service.active ? "Active" : "Inactive"}
              </button>
            </div>

            <div className="mt-5 flex flex-wrap gap-2">
              {service.roles.map(({ role }) => (
                <span
                  key={role.id}
                  className="rounded-xl border border-blue-400/20 bg-blue-500/15 px-3 py-2 text-sm text-blue-100"
                >
                  {role.name}
                </span>
              ))}
            </div>
          </article>
        ))}
      </div>
      {selectedService && (
        <ServiceModal
          service={selectedService}
          roles={roles}
          onClose={() => setSelectedService(null)}
          onSaved={() => {
            setSelectedService(null);
            load();
          }}
        />
      )}
    </div>
  );
}
