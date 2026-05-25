"use client";

import { CalendarPlus } from "lucide-react";
import { FormEvent, useState } from "react";

function nextSunday() {
  const date = new Date();
  date.setDate(date.getDate() + ((7 - date.getDay()) % 7));
  return date.toISOString().slice(0, 10);
}

export function ScheduleGenerator() {
  const [start, setStart] = useState(nextSunday());
  const [end, setEnd] = useState(nextSunday());
  const [message, setMessage] = useState("");

  async function submit(event: FormEvent) {
    event.preventDefault();
    setMessage("Generating...");
    const response = await fetch("/api/schedules/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ start, end })
    });
    const body = await response.json();
    setMessage(response.ok ? `Generated ${body.generated} service instance(s).` : body.error ?? "Generation failed.");
  }

  return (
    <form onSubmit={submit} className="max-w-xl rounded-md border border-line bg-white p-5">
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block">
          <span className="font-mono text-xs uppercase tracking-[0.14em] text-neutral-500">Start date</span>
          <input type="date" value={start} onChange={(event) => setStart(event.target.value)} className="mt-2 w-full rounded-md border border-line px-3 py-2" />
        </label>
        <label className="block">
          <span className="font-mono text-xs uppercase tracking-[0.14em] text-neutral-500">End date</span>
          <input type="date" value={end} onChange={(event) => setEnd(event.target.value)} className="mt-2 w-full rounded-md border border-line px-3 py-2" />
        </label>
      </div>
      <button className="focus-ring mt-5 inline-flex items-center gap-2 rounded-md bg-ink px-4 py-2 text-sm text-paper" type="submit">
        <CalendarPlus size={16} /> Generate schedule
      </button>
      {message ? <p className="mt-4 text-sm text-neutral-600">{message}</p> : null}
    </form>
  );
}
