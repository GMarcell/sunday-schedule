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
    <main className="min-h-screen">
      <section className="bg-ink px-4 py-10 text-paper sm:px-8">
        <div className="mx-auto max-w-5xl">
          <p className="font-mono text-xs uppercase tracking-[0.18em] text-rust">Published roster</p>
          <h1 className="mt-3 font-serif text-5xl">Sunday Service Schedule</h1>
          <div className="mt-6 flex max-w-xs flex-col gap-2">
            <label className="font-mono text-xs uppercase tracking-[0.14em] text-white/60" htmlFor="date">
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
              className="focus-ring rounded-md border border-white/20 bg-white/10 px-3 py-2 text-paper"
            />
          </div>
        </div>
      </section>
      <section className="mx-auto max-w-5xl px-4 py-8 sm:px-8">
        {loading ? <p className="text-sm text-neutral-500">Loading roster...</p> : null}
        {!loading && items.length === 0 ? (
          <div className="border border-line bg-white p-8">
            <h2 className="font-serif text-2xl">No published roster yet</h2>
            <p className="mt-2 text-sm text-neutral-600">Ask an admin to generate and publish this service date.</p>
          </div>
        ) : null}
        <div className="grid gap-4 md:grid-cols-2">
          {items.map((item) => (
            <article key={item.id} className="rounded-md border border-line bg-white p-5 shadow-sm">
              <p className="font-mono text-xs uppercase tracking-[0.14em] text-blue">{formatDate(new Date(item.date))}</p>
              <h2 className="mt-2 font-serif text-2xl">{item.service.name}</h2>
              <p className="font-mono text-sm text-neutral-500">{item.service.time}</p>
              <dl className="mt-5 divide-y divide-line">
                {item.assignments.map((assignment) => (
                  <div key={assignment.role.name} className="flex items-center justify-between py-3">
                    <dt className="font-mono text-sm text-neutral-500">{assignment.role.name}</dt>
                    <dd className="font-medium">{assignment.member?.name ?? "Unfilled"}</dd>
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
