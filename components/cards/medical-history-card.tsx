import {
  Diagnosis,
  Drug,
  MedicalRecords,
  PrescribedDrug,
  Prescription,
} from "@prisma/client";
import { Card, CardContent } from "../ui/card";
import { SelectSeparator } from "../ui/select";
import ActionDialog from "../dialogs/action-dialog";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface Doctor {
  id: string | number;
  name: string;
  specialization: string;
}
interface DrusProps extends PrescribedDrug {
  drug: {
    name: string;
    id: true;
  };
}
interface PrescriptionsProps extends Prescription {
  drugs: DrusProps[];
}
interface ExtendedDiagnosis extends Diagnosis {
  doctor: Doctor;
  prescriptions: PrescriptionsProps[];
}

interface MedicalPros {
  el: ExtendedDiagnosis;
  index: number;
}

export function getStatusVariant(status: string): string {
  const statusVariants: Record<string, string> = {
    pending: "bg-yellow-600",
    cancelled: "bg-red-600",
    completed: "bg-emerald-600",
  };

  return statusVariants[status] || "bg-gray-600";
}
function getStatusVariantNote(status: string): string {
  const statusVariants: Record<string, string> = {
    pending: "Prescribed drugs has not been dispense yet.",
    cancelled: "This prescribed drug has been cancelled.",
    completed: "The prescribed drug has been dispensed successfully",
  };

  return statusVariants[status] || "No status information";
}
export const MedicalHistoryCard = ({ index, el }: MedicalPros) => {
  return (
    <Card key={index} className="rounded-xl shadow-none">
      <CardContent className="space-y-8 pt-4">
        <div className="space-y-6">
          <div className="flex gap-x-6 justify-between">
            <div>
              <span className="text-sm text-gray-500">Appointment ID</span>

              <p className="text-3xl font-semibold"># {el?.id}</p>
            </div>
            {index === 0 && (
              <div className="px-4 h-6 text-center bg-blue-100 rounded-full font-semibold text-blue-600">
                <span> Recent</span>
              </div>
            )}
            <div>
              <span className="text-sm text-gray-500">Date</span>
              <p className="text-lg font-medium">
                {new Date(el.created_at).toLocaleDateString()}
              </p>
            </div>
          </div>
          <SelectSeparator />
          <div>
            <span className="text-sm text-gray-500">Diagnosis</span>
            <p className="text-lg font-medium">{el?.diagnosis}</p>
          </div>
          <SelectSeparator />
          <div>
            <span className="text-sm text-gray-500">Symptoms</span>
            <p className="text-lg font-medium">{el?.symptoms}</p>
          </div>

          <SelectSeparator />
          <div>
            <span className="text-sm text-gray-500">Additional Note</span>
            <p className="text-lg font-medium">{el?.notes}</p>
          </div>

          <div>
            <p className="text-sm text-gray-500">
              Prescriptions
              <span
                className={cn(
                  getStatusVariant(el?.prescriptions[0]?.status.toLowerCase()),
                  "text-white text-xs px-2 py-0.5 rounded-full capitalize ml-2"
                )}
              >
                {el?.prescriptions[0]?.status}
              </span>
            </p>

            <div className="flex flex-wrap gap-2">
              {el?.prescriptions[0]?.drugs?.map((drug) => (
                <li key={drug.id}>
                  {drug.drug.name} - {drug?.quantity} units
                </li>
              ))}
            </div>
            <span className={cn("text-xs text-gray-600 italic")}>
              {getStatusVariantNote(el?.prescriptions[0]?.status.toLowerCase())}
            </span>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <span className="text-sm text-gray-500">Doctor</span>
              <p className="text-lg font-medium">{el?.doctor?.name}</p>
              <span className="text-sm text-blue-500 capitalize">
                {el?.doctor?.specialization}
              </span>
            </div>

            <div className="flex items-center gap-4">
              {/* <Link
                href={`/diagnosis/${el.medical_id}`}
                className="text-sm text-blue-600 mr-4"
              >
                Add Prescriptions
              </Link> */}

              <ActionDialog
                deleteType="diagnosis"
                showText={true}
                type="delete"
                id={String(el?.id)}
              />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
