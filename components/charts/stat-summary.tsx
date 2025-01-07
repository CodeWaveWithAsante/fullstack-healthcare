"use client";

import Link from "next/link";
import { Button } from "../ui/button";
import { ResponsiveContainer, RadialBarChart, RadialBar } from "recharts";
import { Users } from "lucide-react";
import { formatNumber } from "@/utils";

export const StatSummary = ({ data, total }: { data: any; total: number }) => {
  const dataInfo = [
    { name: "Total", count: total || 0, fill: "white" },
    {
      name: "Appointments",
      count: data?.PENDING + data?.SCHEDULED || 0,
      fill: "#000000",
    },
    { name: "Consultation", count: data?.COMPLETED || 0, fill: "#2563eb" },
  ];

  const appointment = dataInfo[1].count;
  const consultation = dataInfo[2].count;

  return (
    <div className="bg-white rounded-xl w-full h-full p-4">
      <div className="flex justify-between items-center">
        <h1 className="text-lg font-semibold">Summary</h1>

        <Button
          asChild
          size="sm"
          variant="outline"
          className="font-normal text-xs"
        >
          <Link href="/record/appointments">See details</Link>
        </Button>
      </div>

      <div className="relative w-full h-[75%]">
        <ResponsiveContainer>
          <RadialBarChart
            cx="50%"
            cy="50%"
            innerRadius="40%"
            outerRadius="100%"
            barSize={32}
            data={dataInfo}
          >
            <RadialBar background dataKey={"count"} />
          </RadialBarChart>
        </ResponsiveContainer>

        <Users
          size={30}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-gray-400"
        />
      </div>

      <div className="flex justify-center gap-16">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 bg-[#000000] rounded-xl" />
            <h1 className="font-bold">{formatNumber(appointment)}</h1>
          </div>
          <h2 className="text-xs text-gray-400">
            {dataInfo[1].name}(
            {((appointment / (appointment + consultation)) * 100).toFixed(0)})
          </h2>
        </div>

        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 bg-[#2563eb] rounded-xl" />
            <h1 className="font-bold">{formatNumber(consultation)}</h1>
          </div>

          <h2 className="text-xs text-gray-400">
            {dataInfo[2].name}(
            {((consultation / (appointment + consultation)) * 100).toFixed(0)})
          </h2>
        </div>
      </div>
    </div>
  );
};
