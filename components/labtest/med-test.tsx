import db from "@/lib/db";
import { getAppointmentWithMedicalRecordById } from "@/utils/services/appointment";
import { auth } from "@clerk/nextjs/server";
import { format } from "date-fns";
import { Card } from "../ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import { LabRequestForm } from "./lab-request-form";

export const MedLabTest = async ({
  id,
  appId,
}: {
  id: string;
  appId: number;
}) => {
  const { userId } = await auth();
  const data = await db.labTest.findMany({
    where: { patient_id: id },
    include: {
      services: { select: { name: true, id: true } },
      patient: { select: { first_name: true, last_name: true } },
    },
    orderBy: { created_at: "asc" },
  });

  const { data: appointment } = await getAppointmentWithMedicalRecordById(
    appId
  );

  const availableTest = await db.services.findMany({
    where: { department: "LABORATORY" },
    select: { id: true, name: true },
  });

  if (!data) return null;

  return (
    <div>
      <Card>
        <div className="p-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold mb-4">Lab Test</h2>
            {appointment?.medical && appointment?.doctor_id === userId && (
              <LabRequestForm
                patient={appointment?.patient!}
                medicalRecords={appointment?.medical!}
                availableTest={availableTest!}
              />
            )}
          </div>
          <Table>
            <TableHeader>
              <TableRow className="lg:uppercase">
                <TableHead>No.</TableHead>
                <TableHead>Patient Name</TableHead>
                <TableHead>Test</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data?.map((test) => (
                <TableRow key={test.id} className="hover:bg-muted/50">
                  <TableCell># {test.id}</TableCell>
                  <TableCell>
                    {test?.patient?.first_name + " " + test?.patient?.last_name}
                  </TableCell>
                  <TableCell>{test?.services?.name}</TableCell>
                  <TableCell>
                    {test?.status === "COMPLETED"
                      ? format(test?.test_date!, "yyyy-MM-dd")
                      : format(test?.created_at, "yyyy-MM-dd")}
                  </TableCell>
                  <TableCell>
                    <span
                      className={`px-2 py-1 rounded-full text-sm ${
                        test.status === "COMPLETED"
                          ? "bg-green-100 text-green-800"
                          : test.status === "PENDING"
                          ? "bg-yellow-100 text-yellow-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {test.status}
                    </span>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </Card>
    </div>
  );
};
