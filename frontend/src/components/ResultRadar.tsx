import {
  PolarAngleAxis,
  PolarGrid,
  PolarRadiusAxis,
  Radar,
  RadarChart,
  ResponsiveContainer,
} from "recharts";
import type { Pillar, PillarId } from "../types/quiz";

type ResultRadarProps = {
  pillars: Pillar[];
  pillarScores: Record<PillarId, number>;
};

export function ResultRadar({ pillars, pillarScores }: ResultRadarProps) {
  const data = pillars.map((p) => ({ label: p.label, score: pillarScores[p.id] }));

  return (
    <div className="h-[320px] w-full sm:h-[380px]">
      <ResponsiveContainer width="100%" height="100%">
        <RadarChart data={data} outerRadius="72%">
          <PolarGrid stroke="var(--border)" />
          <PolarAngleAxis
            dataKey="label"
            tick={{ fill: "var(--text-muted)", fontSize: 11, fontWeight: 700 }}
          />
          <PolarRadiusAxis domain={[0, 100]} tick={false} axisLine={false} />
          <Radar
            dataKey="score"
            stroke="var(--brand-accent)"
            fill="var(--brand-accent)"
            fillOpacity={0.25}
          />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
}
