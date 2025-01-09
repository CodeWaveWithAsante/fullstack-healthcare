import { DiagnosisForm } from "@/components/forms/diagnosis-form";
import { Card } from "@/components/ui/card";
import db from "@/lib/db";
import { auth } from "@clerk/nextjs/server";

const CreateDiagnosisPage = async (props: {
  params: Promise<{ id: string }>;
}) => {
  const { id } = await props.params;
  const { userId } = await auth();

  const data = await db.medicalRecords.findUnique({
    where: { id: Number(id) },
    include: {
      patient: { select: { first_name: true, last_name: true, id: true } },
    },
  });

  const drugs = await db.drug.findMany({
    where: {
      expiryDate: { gte: new Date() },
    },
    select: {
      name: true,
      id: true,
      quantity: true,
      expiryDate: true,
      category: true,
    },
  });

  if (!data) return null;

  return (
    <div className="container mx-auto py-4">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Create Diagnosis</h1>
        <p className="text-sm ">
          Ensure accurate findings are presented and corrected accordingly to
          ensure that they are correct for your application and that they do not
          result in an error.
        </p>
      </div>
      <Card className="p-6">
        <DiagnosisForm data={data} doctorId={userId!} drugs={drugs} />
      </Card>
    </div>
  );
};

export default CreateDiagnosisPage;
