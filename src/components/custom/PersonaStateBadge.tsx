import { Badge } from "@/components/ui/badge";

const personaStates: Record<number, { label: string; color: string }> = {
  0: { label: "Offline", color: "#898989" },
  1: { label: "Online", color: "#57cbde" },
  2: { label: "Busy", color: "#e4202a" },
  3: { label: "Away", color: "#57cbde" },
  4: { label: "Snooze", color: "#57cbde" },
  5: { label: "Looking to Trade", color: "#57cbde" },
  6: { label: "Looking to Play", color: "#57cbde" },
};

export default function PersonaStateBadge({
  personastate,
}: {
  personastate: number;
}) {
  const state = personaStates[personastate] ?? {
    label: "Unknown",
    color: "#898989",
  };

  return (
    <Badge style={{ backgroundColor: state.color, color: "#000" }}>
      {state.label}
    </Badge>
  );
}
