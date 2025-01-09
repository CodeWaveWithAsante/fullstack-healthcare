import { AppointmentDetail } from "@/components/appointment-detail";
import { AppointmentQuickLinks } from "@/components/appointment-quick-links";
import { BillsContainer } from "@/components/bill-container";
import { PatientDetailCard } from "@/components/cards/patient-detail-card";
import { BloodChartContainer } from "@/components/charts/blood-chart-container";
import { DiagnosisContainer } from "@/components/diagnosis-container";
import { MedLabTest } from "@/components/labtest/med-test";
import { MedicalHistoryContainer } from "@/components/medical-history-container";
import { Payments } from "@/components/payments";
import { VitalSignsCard } from "@/components/vitals-signs-card";
import { getAppointmentWithMedicalRecordById } from "@/utils/services/appointment";

interface ParamsProps {
  params: Promise<{ id: string }>;
  searchParams?: Promise<{ [key: string]: string | string[] | undefined }>;
}
const Page = async (props: ParamsProps) => {
  const searchParams = await props.searchParams;
  const params = await props.params;
  const { id } = params;
  const { data } = await getAppointmentWithMedicalRecordById(Number(id));
  const cat = (searchParams?.cat || "charts") as String;

  return (
    <div className="p-6 flex flex-col-reverse lg:flex-row w-full min-h-screen gap-10">
      <div className="w-full lg:w-[65%] flex flex-col gap-6 ">
        {cat === "charts" && <BloodChartContainer id={data?.patient_id!} />}
        {cat === "appointment" && (
          <>
            <AppointmentDetail
              id={data?.id!}
              patient_id={data?.patient_id!}
              appointment_date={data?.appointment_date!}
              time={data?.time!}
              note={data?.note!}
            />

            <VitalSignsCard
              id={id}
              patientId={data?.patient_id!}
              doctor_id={data?.doctor_id!}
            />
          </>
        )}
        {cat === "diagnosis" && (
          <DiagnosisContainer
            id={id}
            patientId={data?.patient_id!}
            doctor_id={data?.doctor_id!}
          />
        )}

        {cat === "medical-history" && (
          <MedicalHistoryContainer id={id} patientId={data?.patient_id!} />
        )}

        {cat === "bills" && <BillsContainer id={id} />}
        {cat === "payments" && <Payments patientId={data?.patient_id!} />}

        {cat === "lab-test" && (
          <MedLabTest id={data?.patient_id!} appId={data?.id!} />
        )}
      </div>

      <div className="flex-1 space-y-6">
        <AppointmentQuickLinks staffId={data?.doctor_id!} />
        <PatientDetailCard data={data?.patient as any} />
      </div>
    </div>
  );
};

export default Page;
