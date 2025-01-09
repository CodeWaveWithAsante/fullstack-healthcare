import db from "@/lib/db";
import { calculateBMI, formatDateTime } from "@/utils";
import { checkRole } from "@/utils/roles";
import { MedicalRecords, VitalSigns } from "@prisma/client";
import { AddVitalSigns } from "./dialogs/add-vital-signs";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { SelectSeparator } from "./ui/select";
import { Button } from "./ui/button";
import { cn } from "@/lib/utils";
import ActionDialog from "./dialogs/action-dialog";

const ItemCard = ({
  label,
  value,
}: {
  label: string;
  value: string | number;
}) => {
  return (
    <div className="w-full">
      <p className="text-lg xl:text-xl font-medium">{value}</p>
      <p className="text-sm text-gray-500">{label}</p>
    </div>
  );
};

interface DataProps {
  id: string | number;
  patientId: string;
  medicalId?: string;
  doctor_id: string | number;
  appointment_id?: string | number;
}

interface MedicalProps extends MedicalRecords {
  vital_signs: VitalSigns[];
}
export const VitalSignsCard = async ({
  id,
  patientId,
  doctor_id,
}: DataProps) => {
  const data: MedicalProps | null = await db.medicalRecords.findFirst({
    where: {
      appointment_id: Number(id),
    },
    include: {
      vital_signs: {
        orderBy: { created_at: "desc" },
      },
    },
    orderBy: { created_at: "desc" },
  });

  const vitals = data?.vital_signs ? data?.vital_signs : null;

  return (
    <section id="vital-signs">
      <Card className="rounded-xl shadow-none">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-lg text-gray-600">Vital Signs</CardTitle>
          {!(await checkRole("PATIENT")) && (
            <AddVitalSigns
              key={new Date().getTime()}
              patientId={patientId}
              doctor_id={doctor_id}
              appointment_id={id}
              medicalId={data ? data?.id.toString() : ""}
            />
          )}
        </CardHeader>
        <CardContent className="space-y-8">
          {vitals?.map((el, id) => {
            const { bmi, status, colorCode } = calculateBMI(
              el?.weight || 0,
              el?.height || 0
            );

            return (
              <div key={el.id} className="space-y-4">
                <div
                  className={cn(
                    "flex",
                    id === 0 ? "justify-between" : "justify-end"
                  )}
                >
                  {id === 0 && (
                    <p className="bg-blue-100 text-blue-500 font-semibold rounded-full px-3 py-2">
                      Recent
                    </p>
                  )}

                  <ActionDialog
                    deleteType="vital_signs"
                    showText={true}
                    type="delete"
                    id={String(el?.id)}
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <ItemCard
                    label="Body Temperature"
                    value={`${el?.body_temperature || "0"} °C`}
                  />
                  <ItemCard
                    label="Blood Pressure"
                    value={`${el?.systolic}/${el?.diastolic} mmHg`}
                  />
                  <ItemCard label="Heart Rate" value={`${el?.heartRate} BPM`} />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <ItemCard label="Weight" value={`${el?.weight} Kg`} />
                  <ItemCard label="Height" value={`${el?.height} Cm`} />
                  <div className="w-full">
                    <div className="flex gap-x-2 items-center">
                      <p className="text-lg xl:text-xl font-semibold">{bmi}</p>
                      <span
                        className="text-sm font-medium"
                        style={{ color: colorCode }}
                      >
                        ({status})
                      </span>
                    </div>
                    <p className="text-sm text-gray-500">BMI</p>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <ItemCard
                    label="Respiratory Rate"
                    value={`${el?.respiratory_rate || "N/A"}`}
                  />
                  <ItemCard
                    label="Oxygen Saturation"
                    value={`${el?.oxygen_saturation || "N/A"}`}
                  />
                  <ItemCard
                    label="Reading Date & Time"
                    value={formatDateTime(el?.created_at?.toString()!)}
                  />
                </div>
                <SelectSeparator className="mt-4 bg-gray-200" />
              </div>
            );
          })}
        </CardContent>
      </Card>
    </section>
  );
};
