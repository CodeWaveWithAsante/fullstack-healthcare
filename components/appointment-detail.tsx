import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { SmallCard } from "./cards/small-card";
import { formatDate } from "@/utils";

interface DataProps {
  id: number | string;
  patient_id: string;
  appointment_date: Date;
  time: string;
  note?: string;
}
export const AppointmentDetail = ({
  id,
  patient_id,
  appointment_date,
  time,
  note,
}: DataProps) => {
  return (
    <Card className="rounded-xl shadow-none">
      <CardHeader>
        <CardTitle className="text-lg text-gray-600">
          Appointment Information
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-5">
        <div className="flex ">
          <SmallCard label="Appointment #" value={`# ${id}`} />
          <SmallCard label="Date" value={formatDate(appointment_date)} />
          <SmallCard label="Time" value={time} />
        </div>
        <div>
          <span className="text-sm text-gray-500">Additional Note</span>
          <p className="text-sm text-gray-500">{note || "N/A"}</p>
        </div>
      </CardContent>
    </Card>
  );
};
