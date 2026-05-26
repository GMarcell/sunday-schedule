"use client";

import { Download, Megaphone, Save } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { formatDate } from "@/lib/dates";
import { Instance, Member } from "@/types";

export function RosterManager() {
  const [weekStart, setWeekStart] = useState(
    new Date().toISOString().slice(0, 10),
  );

  const [weekEnd, setWeekEnd] = useState(new Date().toISOString().slice(0, 10));
  const [month, setMonth] = useState(new Date().toISOString().slice(0, 7));

  const [instances, setInstances] = useState<Instance[]>([]);
  const [members, setMembers] = useState<Member[]>([]);

  const load = useCallback(() => {
    Promise.all([
      fetch(`/api/schedules/roster?start=${weekStart}&end=${weekEnd}`).then(
        (r) => r.json(),
      ),
      fetch("/api/members/active").then((r) => r.json()),
    ]).then(([rosterData, memberData]) => {
      setInstances(rosterData);
      setMembers(memberData);
    });
  }, [weekStart, weekEnd]);

  async function saveAssignment(id: string, memberId: string) {
    await fetch(`/api/assignments/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        memberId: memberId || null,
      }),
    });

    load();
  }

  async function publish(id: string) {
    await fetch(`/api/schedules/publish/${id}`, {
      method: "POST",
    });

    load();
  }

  const groupedMembers = members.reduce<
    Record<string, { id: string; name: string }[]>
  >((acc, member) => {
    member.roles.forEach((memberRole) => {
      const roleName = memberRole.role.name;

      if (!acc[roleName]) {
        acc[roleName] = [];
      }

      acc[roleName].push({
        id: member.id,
        name: member.name,
      });
    });

    return acc;
  }, {});

  console.log(groupedMembers.PPT);

  useEffect(() => void load(), [load]);

  return (
    <div className="space-y-6">
      {/* Toolbar */}
      <div className="flex flex-wrap items-end gap-4 rounded-3xl border border-white/10 bg-white/10 backdrop-blur-xl p-5 shadow-xl">
        <label>
          <span className="text-xs uppercase tracking-[0.14em] text-slate-300">
            Week start
          </span>

          <input
            type="date"
            value={weekStart}
            onChange={(e) => setWeekStart(e.target.value)}
            className="mt-2 block rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-400/30"
          />
        </label>

        <label>
          <span className="text-xs uppercase tracking-[0.14em] text-slate-300">
            Week end
          </span>

          <input
            type="date"
            value={weekEnd}
            onChange={(e) => setWeekEnd(e.target.value)}
            className="mt-2 block rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-400/30"
          />
        </label>

        <label>
          <span className="text-xs uppercase tracking-[0.14em] text-slate-300">
            Export month
          </span>

          <input
            type="month"
            value={month}
            onChange={(e) => setMonth(e.target.value)}
            className="mt-2 block rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-400/30"
          />
        </label>

        <div className="flex flex-wrap gap-2">
          {["csv", "xlsx", "pdf"].map((format) => (
            <a
              key={format}
              href={`/api/export/monthly?month=${month}&format=${format}`}
              className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm uppercase text-slate-300 transition hover:bg-white/10 hover:text-white"
            >
              <Download size={15} />
              {format}
            </a>
          ))}
        </div>
      </div>

      {/* Instances */}
      <div className="grid gap-5">
        {instances.map((instance) => (
          <article
            key={instance.id}
            className="rounded-3xl border border-white/10 bg-white/10 backdrop-blur-xl p-6 shadow-xl transition hover:border-blue-400/20"
          >
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <p className="text-xs uppercase tracking-[0.14em] text-blue-300">
                  {formatDate(new Date(instance.date))}
                </p>

                <h2 className="mt-2 text-2xl font-bold text-white">
                  {instance.service.name}
                </h2>

                <p className="text-sm text-slate-400">
                  {instance.service.time}
                </p>
              </div>

              <button
                onClick={() => publish(instance.id)}
                className={`inline-flex items-center gap-2 rounded-xl px-4 py-3 text-sm font-medium transition ${
                  instance.published
                    ? "bg-emerald-500/15 text-emerald-300 hover:bg-emerald-500/25"
                    : "bg-blue-600 text-white hover:bg-blue-500 hover:shadow-blue-500/30"
                }`}
              >
                <Megaphone size={16} />

                {instance.published ? "Published" : "Publish"}
              </button>
            </div>

            {/* Assignments */}
            <div className="mt-6 grid gap-4 md:grid-cols-2">
              {instance.assignments.map((assignment) => (
                <label
                  key={assignment.id}
                  className="rounded-2xl border border-white/10 bg-white/5 p-4 transition hover:bg-white/[0.07]"
                >
                  <span className="text-xs uppercase tracking-[0.14em] text-slate-400">
                    {assignment.role.name}
                  </span>

                  <div className="mt-3 flex gap-2">
                    <select
                      defaultValue={assignment.member?.id ?? ""}
                      onChange={(e) =>
                        saveAssignment(assignment.id, e.target.value)
                      }
                      className="min-w-0 flex-1 rounded-xl border border-white/10 bg-slate-900/60 px-4 py-3 text-white outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-400/30"
                    >
                      <option value="">Unfilled</option>

                      {groupedMembers[assignment.role.name].map((member) => (
                        <option key={member.id} value={member.id}>
                          {member.name}
                        </option>
                      ))}
                    </select>

                    <span
                      className="rounded-xl border border-white/10 bg-blue-500/15 p-3 text-blue-200"
                      title="Auto-saves on change"
                    >
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
