import { AdminFrame } from "@/components/AdminFrame";
import { ScheduleGenerator } from "@/components/ScheduleGenerator";

export default function SchedulePage() {
  return (
    <AdminFrame title="Generate Schedule">
      <ScheduleGenerator />
    </AdminFrame>
  );
}
