import { IssuanceForm } from "@/components/pharmacy/drugs/issuance-form";
import { getPrescriptionById } from "@/utils/services/pharmacy";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const IssueDrugsPage = async (props: { params: Promise<{ id: string }> }) => {
  const params = await props.params;

  const { data } = await getPrescriptionById(params?.id);

  return (
    <div className="container mx-auto py-6">
      <h1 className="text-3xl font-bold mb-6">Issue Drugs</h1>
      <IssuanceForm prescription={data} />
    </div>
  );
};

export default IssueDrugsPage;
