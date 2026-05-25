"use client";

import { Download, Megaphone, Save } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { formatDate } from "@/lib/dates";

type Member = { id: string; name: string; active: boolean };
type Instance = {
  id: string;
  date: string;
  published: boolean;
  service: { name: string; time: string };
  assignments: { id: string; role: { name: string }; member: Member | null }[];
};

export function RosterManager() {
  const [week, setWeek] = useState(new Date().toISOString().slice(0, 10));
  const [month, setMonth] = useState(new Date().toISOString().slice(0, 7));
  const [instances, setInstances] = useState<Instance[]>([]);
  const [members, setMembers] = useState<Member[]>([]);

  const load = useCallback(() => {
    Promise.all([
      fetch(`/api/schedules/roster?week=${week}`).then((response) => response.json()),
      fetch("/api/members").then((response) => response.json())
    ]).then(([rosterData, memberData]) => {
      setInstances(rosterData);
      setMembers(memberData);
    });
  }, [week]);

  useEffect(() => void load(), [load]);

  async function saveAssignment(id: string, memberId: string) {
    await fetch(`/api/assignments/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ memberId: memberId || null })
    });
    load();
  }

  async function publish(id: string) {
    await fetch(`/api/schedules/publish/${id}`, { method: "POST" });
    load();
  }

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-end gap-3 rounded-md border border-line bg-white p-4">
        <label>
          <span className="font-mono text-xs uppercase tracking-[0.14em] text-neutral-500">Week starts</span>
          <input type="date" value={week} onChange={(event) => setWeek(event.target.value)} className="mt-2 block rounded-md border border-line px-3 py-2" />
        </label>
        <label>
          <span className="font-mono text-xs uppercase tracking-[0.14em] text-neutral-500">Export month</span>
          <input type="month" value={month} onChange={(event) => setMonth(event.target.value)} className="mt-2 block rounded-md border border-line px-3 py-2" />
        </label>
        {["csv", "xlsx", "pdf"].map((format) => (
          <a key={format} href={`/api/export/monthly?month=${month}&format=${format}`} className="focus-ring inline-flex items-center gap-2 rounded-md border border-line px-3 py-2 text-sm uppercase">
            <Download size={15} /> {format}
          </a>
        ))}
      </div>
      <div className="grid gap-4">
        {instances.map((instance) => (
          <article key={instance.id} className="rounded-md border border-line bg-white p-5">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <p className="font-mono text-xs uppercase tracking-[0.14em] text-blue">{formatDate(new Date(instance.date))}</p>
                <h2 className="mt-1 font-serif text-2xl">{instance.service.name}</h2>
                <p className="font-mono text-sm text-neutral-500">{instance.service.time}</p>
              </div>
              <button onClick={() => publish(instance.id)} className="focus-ring inline-flex items-center gap-2 rounded-md bg-rust px-3 py-2 text-sm text-white">
                <Megaphone size={16} /> {instance.published ? "Published" : "Publish"}
              </button>
            </div>
            <div className="mt-5 grid gap-3 md:grid-cols-2">
              {instance.assignments.map((assignment) => (
                <label key={assignment.id} className="rounded-md border border-line p-3">
                  <span className="font-mono text-xs uppercase tracking-[0.14em] text-neutral-500">{assignment.role.name}</span>
                  <div className="mt-2 flex gap-2">
                    <select
                      defaultValue={assignment.member?.id ?? ""}
                      onChange={(event) => saveAssignment(assignment.id, event.target.value)}
                      className="min-w-0 flex-1 rounded-md border border-line px-3 py-2"
                    >
                      <option value="">Unfilled</option>
                      {members.map((member) => (
                        <option key={member.id} value={member.id}>
                          {member.name}{member.active ? "" : " (inactive)"}
                        </option>
                      ))}
                    </select>
                    <span className="rounded-md bg-ink p-2 text-paper" title="Auto-saves on change">
                      <Save size={16} />
                    </span>
                  </div>
                </label>
              ))}
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
