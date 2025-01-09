import { auth } from "@clerk/nextjs/server";

import { NewPatientForm } from "@/components/forms/new-patient-form";
import { getDoctors } from "@/utils/services/doctor";
import { getPatientDataById } from "@/utils/services/patient";

const NewPatientPage = async () => {
  const { userId } = await auth();
  const { data } = await getPatientDataById(userId!);
  const { data: doctors } = await getDoctors();

  return (
    <div className="h-full w-full relative flex justify-center">
      <div className="max-w-6xl w-full py-6">
        <NewPatientForm
          data={data!}
          physiciansData={doctors!}
          type={!data ? "create" : "update"}
        />
      </div>
    </div>
  );
};

export default NewPatientPage;
