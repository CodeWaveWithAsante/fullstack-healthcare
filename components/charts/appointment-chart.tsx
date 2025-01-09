"use client";

import { useTheme } from "@/hooks/theme-provider";
import { AppointmentsChartProps } from "@/types/appointments";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

interface DataProps {
  data: AppointmentsChartProps;
}
export const AppointmentChart = ({ data }: DataProps) => {
  const { theme } = useTheme();

  return (
    <div className="bg-background rounded-lg p-4 h-full">
      <div className="flex justify-between items-center">
        <h1 className="text-lg font-semibold">Appointments</h1>
      </div>
      <ResponsiveContainer width="100%" height="90%">
        <BarChart width={500} height={300} data={data} barSize={25}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#ddd" />
          <XAxis
            dataKey="name"
            axisLine={false}
            tick={{ fill: "#9ca3af" }}
            tickLine={false}
          />
          <YAxis axisLine={false} tick={{ fill: "#9ca3af" }} tickLine={false} />
          <Tooltip
            contentStyle={{ borderRadius: "10px", borderColor: "#fff" }}
          />
          <Legend
            align="left"
            verticalAlign="top"
            wrapperStyle={{
              paddingTop: "20px",
              paddingBottom: "40px",
              textTransform: "capitalize",
            }}
          />
          <Bar
            dataKey="appointment"
            fill={theme !== "light" ? "#e76e50" : "#000000"}
            legendType="circle"
            radius={[10, 10, 0, 0]}
          />
          <Bar
            dataKey="completed"
            fill={theme !== "light" ? "#2a9d90" : "#2563eb"}
            legendType="circle"
            radius={[10, 10, 0, 0]}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};
