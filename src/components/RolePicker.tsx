import { Role } from "@/types";

export function RolePicker({
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
            className={`cursor-pointer rounded-xl border px-3 py-2 text-sm transition ${
              checked
                ? "border-blue-400/40 bg-blue-500/20 text-blue-100"
                : "border-white/10 bg-white/5 text-slate-300 hover:bg-white/10"
            }`}
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
