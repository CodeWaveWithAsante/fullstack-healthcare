"use client";

import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Button } from "../ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";

interface DataProps {
  average: string;
  data: {
    label: string;
    value1: number;
    value2: number;
  }[];
}

export function HeartRateChart({ data, average }: DataProps) {
  const lastData = data[data?.length - 1];

  return (
    <Card className="col-span-2 rounded-xl shadow-none">
      <CardHeader>
        <CardTitle>Heart Rate (Pulse)</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex justify-between items-center mb-4">
          <div>
            <p className="text-lg xl:text-xl font-semibold">
              {lastData?.value1 || 0}-{lastData?.value2 || 0}
            </p>
            <p className="text-sm text-gray-500">Recent Reading</p>
          </div>
          <div>
            <p className="text-lg xl:text-xl font-semibold">{average}</p>
            <p className="text-sm text-gray-500">Average Rate</p>
          </div>
          <Button size="sm" variant="outline">
            See Insights
          </Button>
        </div>

        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={data}>
            <CartesianGrid
              strokeDasharray="3 3"
              vertical={false}
              stroke="#ddd"
            />
            <XAxis
              dataKey="label"
              axisLine={false}
              tick={{ fill: "#9ca3af" }}
              tickLine={false}
            />
            <YAxis
              axisLine={false}
              tick={{ fill: "#9ca3af" }}
              tickLine={false}
            />
            <Tooltip
              contentStyle={{ borderRadius: "10px", borderColor: "#fff" }}
            />
            <Line
              type="monotone"
              dataKey="value1"
              stroke="#8884d8"
              activeDot={{ r: 8 }}
            />
            <Line type="monotone" dataKey="value2" stroke="#82ca9d" />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
