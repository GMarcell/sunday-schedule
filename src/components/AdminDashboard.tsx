"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";

type Role = { id: string; name: string };
type Member = { id: string; active: boolean };
type Service = { id: string; active: boolean };
type Instance = {
  id: string;
  assignments: { member: { name: string } | null }[];
};

export function AdminDashboard() {
  const [roles, setRoles] = useState<Role[]>([]);
  const [members, setMembers] = useState<Member[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [roster, setRoster] = useState<Instance[]>([]);

  useEffect(() => {
    Promise.all([
      fetch("/api/roles").then((response) => response.json()),
      fetch("/api/members").then((response) => response.json()),
      fetch("/api/services").then((response) => response.json()),
      fetch(
        `/api/schedules/roster?start=${new Date().toISOString().slice(0, 10)}&end=${new Date().toISOString().slice(0, 10)}`,
      ).then((response) => response.json()),
    ]).then(([roleData, memberData, serviceData, rosterData]) => {
      setRoles(roleData);
      setMembers(memberData);
      setServices(serviceData);
      setRoster(rosterData);
    });
  }, []);

  const unfilled = useMemo(
    () =>
      roster
        .flatMap((instance) => instance.assignments)
        .filter((assignment) => !assignment.member).length,
    [roster],
  );

  const stats = [
    { label: "Roles", value: roles.length },
    {
      label: "Active members",
      value: members.filter((member) => member.active).length,
    },
    {
      label: "Active services",
      value: services.filter((service) => service.active).length,
    },
    { label: "Unfilled slots", value: unfilled },
  ];

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="rounded-2xl border border-white/10 bg-white/10 backdrop-blur-xl p-5 shadow-xl"
          >
            <p className="text-xs uppercase tracking-[0.18em] text-slate-400">
              {stat.label}
            </p>

            <p className="mt-3 text-4xl font-bold text-white">{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Actions */}
      <div className="grid gap-4 md:grid-cols-2">
        <Link
          href="/admin/schedule"
          className="group rounded-3xl border border-white/10 bg-white/10 backdrop-blur-xl p-6 shadow-xl transition hover:border-blue-400/40 hover:bg-white/15 hover:-translate-y-1"
        >
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-500/20 text-2xl">
              📅
            </div>

            <h2 className="text-2xl font-bold text-white">
              Generate schedules
            </h2>
          </div>

          <p className="mt-4 text-sm leading-6 text-slate-300">
            Create service instances and auto-fill assignments by fair rotation.
          </p>

          <div className="mt-5 text-sm text-blue-300 group-hover:text-blue-200">
            Open →
          </div>
        </Link>

        <Link
          href="/admin/roster"
          className="group rounded-3xl border border-white/10 bg-white/10 backdrop-blur-xl p-6 shadow-xl transition hover:border-blue-400/40 hover:bg-white/15 hover:-translate-y-1"
        >
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-500/20 text-2xl">
              👥
            </div>

            <h2 className="text-2xl font-bold text-white">Review roster</h2>
          </div>

          <p className="mt-4 text-sm leading-6 text-slate-300">
            Publish services, override assignees, and export monthly data.
          </p>

          <div className="mt-5 text-sm text-blue-300 group-hover:text-blue-200">
            Open →
          </div>
        </Link>
      </div>
    </div>
  );
}
