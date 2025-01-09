import { AddDrugForm } from "@/components/pharmacy/drugs/add-drug-form";
import { Card } from "@/components/ui/card";

const AddDrugPage = () => {
  return (
    <div className="container mx-auto py-6">
      <h1 className="text-3xl font-bold mb-6">Add New Drug</h1>
      <Card className="p-6">
        <AddDrugForm />
      </Card>
    </div>
  );
};

export default AddDrugPage;
