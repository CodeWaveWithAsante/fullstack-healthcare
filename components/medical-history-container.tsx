import db from "@/lib/db";
import { MedicalHistory } from "./medical-history";

interface DataProps {
  id?: number | string;
  patientId: string;
}

export const MedicalHistoryContainer = async ({ id, patientId }: DataProps) => {
  const data = await db.medicalRecords.findMany({
    where: {
      patient_id: patientId,
    },
    include: {
      diagnosis: {
        include: {
          doctor: true,
        },
      },
      lab_test: true,
    },
    orderBy: {
      created_at: "desc",
    },
  });

  return (
    <>
      <MedicalHistory data={data} isShowProfile={false} />
    </>
  );
};
