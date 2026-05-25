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
  const [loading, setLoading] = useState(false);

  async function submit(event: FormEvent) {
    event.preventDefault();

    setLoading(true);
    setMessage("Generating...");

    try {
      const response = await fetch("/api/schedules/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          start,
          end,
        }),
      });

      const body = await response.json();

      setMessage(
        response.ok
          ? `Generated ${body.generated} service instance(s).`
          : (body.error ?? "Generation failed."),
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <form
      onSubmit={submit}
      className="max-w-2xl rounded-3xl border border-white/10 bg-white/10 backdrop-blur-xl p-6 shadow-xl"
    >
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block">
          <span className="text-xs uppercase tracking-[0.14em] text-slate-300">
            Start date
          </span>

          <input
            type="date"
            value={start}
            onChange={(event) => setStart(event.target.value)}
            className="mt-2 w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-400/30"
          />
        </label>

        <label className="block">
          <span className="text-xs uppercase tracking-[0.14em] text-slate-300">
            End date
          </span>

          <input
            type="date"
            value={end}
            onChange={(event) => setEnd(event.target.value)}
            className="mt-2 w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-400/30"
          />
        </label>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="mt-6 inline-flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-sm font-medium text-white shadow-lg transition hover:bg-blue-500 hover:shadow-blue-500/30 disabled:cursor-not-allowed disabled:opacity-60 active:scale-[0.98]"
      >
        <CalendarPlus size={16} />
        {loading ? "Generating..." : "Generate schedule"}
      </button>

      {message ? (
        <div className="mt-5 rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
          <p className="text-sm text-slate-300">{message}</p>
        </div>
      ) : null}
    </form>
  );
}
