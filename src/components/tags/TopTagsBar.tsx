import React from "react";
import { navigate } from "astro:transitions/client";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";

export interface TopTagsBarProps {
  data: { tag: string; tagName: string; count: number }[];
  topN?: number;
}

const TopTagsBar: React.FC<TopTagsBarProps> = ({ data, topN = 10 }) => {
  const top = data.slice(0, topN).map(d => ({ ...d, name: d.tagName }));
  const barHeight = 34; // px per bar including gaps
  const chartHeight = Math.max(160, Math.min(520, top.length * barHeight));
  const colors = [
    "#3b82f6", // blue-500
    "#10b981", // emerald-500
    "#f59e0b", // amber-500
    "#ef4444", // red-500
    "#8b5cf6", // violet-500
    "#06b6d4", // cyan-500
    "#22c55e",
    "#eab308",
    "#ec4899",
    "#14b8a6",
  ];

  return (
    <div
      className="w-full"
      style={{ height: chartHeight }}
      aria-label="Top tags bar chart"
    >
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={top}
          layout="vertical"
          margin={{ left: 16, right: 24, top: 8, bottom: 8 }}
        >
          <XAxis type="number" hide axisLine={false} tickLine={false} />
          <YAxis
            type="category"
            dataKey="name"
            width={120}
            axisLine={false}
            tickLine={false}
          />
          <Tooltip
            cursor={{ fill: "rgba(0,0,0,0.04)" }}
            formatter={(
              value: any,
              _name: string | number | undefined,
              item: any
            ) => {
              return [`${value} 篇`, item?.payload?.name];
            }}
            labelFormatter={() => ""}
          />
          <Bar
            dataKey="count"
            radius={[4, 4, 4, 4]}
            onClick={(e: any) => {
              if (e?.tag) navigate(`/tags/${e.tag}`);
            }}
          >
            {top.map((entry, index) => (
              <Cell
                key={`cell-${entry.tag}`}
                fill={colors[index % colors.length]}
                cursor="pointer"
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default TopTagsBar;
