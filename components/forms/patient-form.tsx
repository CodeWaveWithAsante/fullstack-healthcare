"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Plus } from "lucide-react";
import { useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { z } from "zod";

import { createNewPatient } from "@/app/actions/patient";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { PatientFormSchema } from "@/lib/schema";
import { GENDER, MARITAL_STATUS, RELATION } from "@/utils";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { CustomInput } from "../custom-inputs";
import { StepProgress } from "../step-progress";
import { Button } from "../ui/button";
import { Form } from "../ui/form";

const steps = [
  {
    id: "1",
    name: "Bio",
    fields: [
      "first_name",
      "last_name",
      "date_of_birth",
      "gender",
      "phone",
      "email",
      "marital_status",
      "address",
    ],
  },
  {
    id: "2",
    name: "Family",
    fields: ["emergency_contact_name", "emergency_contact_number", "relation"],
  },
  {
    id: "3",
    name: "Medical",
    fields: [
      "blood_group",
      "allergies",
      "medical_conditions",
      "medical_history",
      "insurance_provider",
      "insurance_number",
    ],
  },
  { id: "4", name: "Complete", fields: [""] },
];

export const PatientForm = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const [imgURL, setImgURL] = useState<any>();

  const form = useForm<z.infer<typeof PatientFormSchema>>({
    resolver: zodResolver(PatientFormSchema),
    defaultValues: {
      first_name: "",
      last_name: "",
      date_of_birth: "",
      gender: "MALE",
      phone: "",
      email: "",
      marital_status: "single",
      address: "",
      emergency_contact_name: "",
      emergency_contact_number: "",
      relation: "father",
      blood_group: "",
      allergies: "",
      medical_conditions: "",
      medical_history: "",
      insurance_provider: "",
      insurance_number: "",
      privacy_consent: true,
      service_consent: true,
      medical_consent: true,
    },
  });

  const onSubmit: SubmitHandler<z.infer<typeof PatientFormSchema>> = async (
    values
  ) => {
    try {
      setIsLoading(true);
      const resp = await createNewPatient(values, "new-patient");

      if (resp.success) {
        toast.success(resp.msg);

        router.refresh();

        form.reset();
      } else if (resp.error) {
        toast.error(resp.msg);
      }
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  type FieldName = keyof z.infer<typeof PatientFormSchema>;

  const nextStep = async () => {
    const fields = steps[currentStep]?.fields;

    const output = await form.trigger(fields as FieldName[], {
      shouldFocus: true,
    });

    if (!output) return;

    if (currentStep < steps.length) {
      if (currentStep === steps.length - 1) {
        await form.handleSubmit(onSubmit)();
      }

      currentStep < steps.length - 1 && setCurrentStep((step) => step + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      // setPreviousStep(currentStep);
      setCurrentStep((step) => step - 1);
    }
  };

  return (
    <Sheet>
      <Button size="sm" className="text-sm font-normal" asChild>
        <SheetTrigger>
          <Plus size={20} />
          Add Patient
        </SheetTrigger>
      </Button>

      <SheetContent className="rounded-xl h-[90%] top-[5%] md:right-[1%] w-full z-50">
        <SheetHeader>
          <SheetTitle>Add New Patient</SheetTitle>

          {currentStep < steps.length && (
            <StepProgress currentStep={currentStep} steps={steps} />
          )}
        </SheetHeader>
        <div>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="space-y-8 mt-5 2xl:mt-10"
            >
              {/* STEP 1 */}
              {currentStep === 0 && (
                <>
                  {/* <ImageUploader
                    imgURL={imgURL?.secure_url}
                    setImgURL={setImgURL}
                  /> */}

                  <div className="flex items-center gap-2">
                    <CustomInput
                      type="input"
                      control={form.control}
                      name="first_name"
                      placeholder="John"
                      label="First Name"
                    />
                    <CustomInput
                      type="input"
                      control={form.control}
                      name="last_name"
                      placeholder="Doe"
                      label="Last Name"
                    />
                  </div>
                  <CustomInput
                    type="input"
                    control={form.control}
                    name="email"
                    placeholder="john@example.com"
                    label="Email Address"
                  />
                  <div className="flex items-center gap-2">
                    <CustomInput
                      type="select"
                      control={form.control}
                      name="gender"
                      placeholder="Select gender"
                      label="Gender"
                      selectList={GENDER!}
                    />
                    <CustomInput
                      type="input"
                      control={form.control}
                      name="date_of_birth"
                      placeholder="01-05-2000"
                      label="Date of Birth"
                      inputType="date"
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    <CustomInput
                      type="input"
                      control={form.control}
                      name="phone"
                      placeholder="9225600735"
                      label="Contact Number"
                    />
                    <CustomInput
                      type="select"
                      control={form.control}
                      name="marital_status"
                      placeholder="Select marital status"
                      label="Marital Status"
                      selectList={MARITAL_STATUS!}
                    />
                  </div>
                  <CustomInput
                    type="input"
                    control={form.control}
                    name="address"
                    placeholder="1479 Street, Apt 1839-G, NY"
                    label="Address"
                  />
                </>
              )}
              {/* STEP 2 */}
              {currentStep === 1 && (
                <>
                  <CustomInput
                    type="input"
                    control={form.control}
                    name="emergency_contact_name"
                    placeholder="Anne Smith"
                    label="Emergency contact name"
                  />
                  <CustomInput
                    type="input"
                    control={form.control}
                    name="emergency_contact_number"
                    placeholder="675444467"
                    label="Emergency contact"
                  />
                  <CustomInput
                    type="select"
                    control={form.control}
                    name="relation"
                    placeholder="Select relation with contact person"
                    label="Relation"
                    selectList={RELATION}
                  />
                </>
              )}

              {/* STEP 3 */}
              {currentStep === 2 && (
                <>
                  <CustomInput
                    type="input"
                    control={form.control}
                    name="blood_group"
                    placeholder="A+"
                    label="Blood group"
                  />
                  <CustomInput
                    type="input"
                    control={form.control}
                    name="allergies"
                    placeholder="Milk"
                    label="Allergies"
                  />
                  <CustomInput
                    type="input"
                    control={form.control}
                    name="medical_conditions"
                    placeholder="Medical conditions"
                    label="Medical conditions"
                  />
                  <CustomInput
                    type="input"
                    control={form.control}
                    name="medical_history"
                    placeholder="Medical history"
                    label="Medical history"
                  />
                  <div className="flex items-center gap-2">
                    <CustomInput
                      type="input"
                      control={form.control}
                      name="insurance_provider"
                      placeholder="Insurance provider"
                      label="Insurance provider"
                    />{" "}
                    <CustomInput
                      type="input"
                      control={form.control}
                      name="insurance_number"
                      placeholder="Insurance number"
                      label="Insurance number"
                    />
                  </div>
                </>
              )}

              {/* STEP 4 */}
              {currentStep === 3 && (
                <>
                  <div className="flex flex-col justify-center items-center py-10 h-[30vh] gap-2">
                    <h4 className="text-2xl font-semibold">
                      Verify your information
                    </h4>
                    <p className="text-sm">
                      Ensure all information provided are true and accurate.
                    </p>
                  </div>
                </>
              )}
            </form>
          </Form>

          {currentStep < steps.length && (
            <div className="flex items-center gap-2 mt-8 justify-between">
              <Button
                disabled={currentStep === 0 || isLoading}
                type="button"
                variant="outline"
                onClick={prevStep}
              >
                Prev
              </Button>
              <Button type="button" onClick={nextStep} disabled={isLoading}>
                {currentStep === steps.length - 1 ? "Submit" : "Next"}
              </Button>
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
};
