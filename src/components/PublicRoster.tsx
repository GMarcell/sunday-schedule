"use client";

import { useEffect, useState } from "react";
import { formatDate } from "@/lib/dates";

type Instance = {
  id: string;
  date: string;
  service: { name: string; time: string };
  assignments: { role: { name: string }; member: { name: string } | null }[];
};

function sundayIso() {
  const now = new Date();
  const date = new Date(now);
  date.setDate(now.getDate() + ((7 - now.getDay()) % 7));
  return date.toISOString().slice(0, 10);
}

export function PublicRoster() {
  const [date, setDate] = useState(sundayIso());
  const [items, setItems] = useState<Instance[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/assignments/public?date=${date}`)
      .then((response) => response.json())
      .then(setItems)
      .finally(() => setLoading(false));
  }, [date]);

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-blue-950 text-white">
      {/* Hero */}
      <section className="px-4 py-12 sm:px-8">
        <div className="mx-auto max-w-5xl">
          <p className="text-xs uppercase tracking-[0.18em] text-blue-300">
            Published roster
          </p>

          <h1 className="mt-3 text-5xl font-bold">Sunday Service Schedule</h1>

          <p className="mt-3 max-w-2xl text-slate-300">
            View published assignments and service schedules.
          </p>

          {/* Date picker */}
          <div className="mt-8 w-full max-w-xs rounded-3xl border border-white/10 bg-white/10 backdrop-blur-xl p-5 shadow-xl">
            <label
              htmlFor="date"
              className="block text-xs uppercase tracking-[0.14em] text-slate-300 mb-2"
            >
              Service date
            </label>

            <input
              id="date"
              type="date"
              value={date}
              onChange={(event) => {
                setLoading(true);
                setDate(event.target.value);
              }}
              className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-400/30"
            />
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="mx-auto max-w-5xl px-4 pb-10 sm:px-8">
        {loading ? (
          <div className="rounded-3xl border border-white/10 bg-white/10 backdrop-blur-xl p-6 shadow-xl">
            <p className="text-sm text-slate-300">Loading roster...</p>
          </div>
        ) : null}

        {!loading && items.length === 0 ? (
          <div className="rounded-3xl border border-white/10 bg-white/10 backdrop-blur-xl p-8 shadow-xl">
            <h2 className="text-2xl font-bold text-white">
              No published roster yet
            </h2>

            <p className="mt-2 text-sm text-slate-300">
              Ask an admin to generate and publish this service date.
            </p>
          </div>
        ) : null}

        <div className="mt-4 grid gap-5 md:grid-cols-2">
          {items.map((item) => (
            <article
              key={item.id}
              className="rounded-3xl border border-white/10 bg-white/10 backdrop-blur-xl p-6 shadow-xl transition hover:border-blue-400/30 hover:-translate-y-1"
            >
              <p className="text-xs uppercase tracking-[0.14em] text-blue-300">
                {formatDate(new Date(item.date))}
              </p>

              <h2 className="mt-2 text-2xl font-bold text-white">
                {item.service.name}
              </h2>

              <p className="text-sm text-slate-400">{item.service.time}</p>

              <dl className="mt-5 divide-y divide-white/10">
                {item.assignments.map((assignment) => (
                  <div
                    key={assignment.role.name}
                    className="flex items-center justify-between py-3"
                  >
                    <dt className="text-sm text-slate-400">
                      {assignment.role.name}
                    </dt>

                    <dd className="font-medium text-white">
                      {assignment.member?.name ?? (
                        <span className="text-amber-300">Unfilled</span>
                      )}
                    </dd>
                  </div>
                ))}
              </dl>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
