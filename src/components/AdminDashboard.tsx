"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";

type Role = { id: string; name: string };
type Member = { id: string; active: boolean };
type Service = { id: string; active: boolean };
type Instance = { id: string; assignments: { member: { name: string } | null }[] };

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
      fetch(`/api/schedules/roster?week=${new Date().toISOString().slice(0, 10)}`).then((response) => response.json())
    ]).then(([roleData, memberData, serviceData, rosterData]) => {
      setRoles(roleData);
      setMembers(memberData);
      setServices(serviceData);
      setRoster(rosterData);
    });
  }, []);

  const unfilled = useMemo(
    () => roster.flatMap((instance) => instance.assignments).filter((assignment) => !assignment.member).length,
    [roster]
  );

  const stats = [
    { label: "Roles", value: roles.length },
    { label: "Active members", value: members.filter((member) => member.active).length },
    { label: "Active services", value: services.filter((service) => service.active).length },
    { label: "Unfilled slots", value: unfilled }
  ];

  return (
    <div className="space-y-6">
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <div key={stat.label} className="rounded-md border border-line bg-white p-5">
            <p className="font-mono text-xs uppercase tracking-[0.14em] text-neutral-500">{stat.label}</p>
            <p className="mt-3 font-serif text-4xl">{stat.value}</p>
          </div>
        ))}
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        <Link className="rounded-md border border-line bg-white p-5 hover:border-rust" href="/admin/schedule">
          <h2 className="font-serif text-2xl">Generate schedules</h2>
          <p className="mt-2 text-sm text-neutral-600">Create service instances and auto-fill assignments by fair rotation.</p>
        </Link>
        <Link className="rounded-md border border-line bg-white p-5 hover:border-rust" href="/admin/roster">
          <h2 className="font-serif text-2xl">Review roster</h2>
          <p className="mt-2 text-sm text-neutral-600">Publish services, override assignees, and export monthly data.</p>
        </Link>
      </div>
    </div>
  );
}
