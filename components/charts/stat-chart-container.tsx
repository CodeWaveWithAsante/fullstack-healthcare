import db from "@/lib/db";
import { clerkClient } from "@clerk/nextjs/server";
import React from "react";
import { StaffStats } from "./staff-stats";

const colors = ["#24414d", "#e76e50", "#2a9d90", "#f4a462", "#e8c468"];

export const StaffChartContainer = async () => {
  const [data, patient, staff] = await Promise.all([
    db.user.groupBy({
      by: ["role"],
      where: { role: { not: "PATIENT" } },
      _count: { role: true },
    }),
    db.patient.count(),
    db.user.count({ where: { role: { not: "PATIENT" } } }),
  ]);

  if (!data) return null;

  const result = data?.map((st, index) => ({
    label: st.role,
    count: st._count.role,
    fill: colors[index],
  }));

  return <StaffStats data={result} patient={patient} staff={staff} />;
};
