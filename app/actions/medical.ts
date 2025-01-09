"use server";

import db from "@/lib/db";
import {
  DiagnosisSchema,
  LabRequestSchema,
  LabResultSchema,
  PatientBillSchema,
  PaymentSchema,
} from "@/lib/schema";
import { LabTest } from "@prisma/client";
import { revalidatePath } from "next/cache";

export async function addNewDiagnosis(data: any) {
  try {
    const isValidData = DiagnosisSchema.safeParse(data);

    const validatedData = isValidData.data;
    let medicalRecords = null;

    if (!validatedData?.medical_id) {
      medicalRecords = await db.medicalRecords.create({
        data: {
          patient_id: validatedData?.patient_id!,
          doctor_id: data?.doctor_id!,
          appointment_id: data?.appointment_id,
        },
      });
    }

    const med_id = validatedData?.medical_id || medicalRecords?.id;

    const res = await db.diagnosis.create({
      data: {
        ...validatedData!,
        medical_id: Number(med_id!),
      },
    });

    return {
      success: true,
      error: false,
      msg: `Diagnosis added successfully`,
    };
  } catch (error) {
    console.log(error);
    return { success: false, msg: "Internal Server Error" };
  }
}

export async function addNewBill(data: any) {
  try {
    const isValidData = PatientBillSchema.safeParse(data);

    const validatedData = isValidData.data;
    let bill_info = null;

    if (!data?.bill_id || data?.bill_id === "undefined") {
      const info = await db.appointment.findUnique({
        where: { id: Number(data?.appointment_id)! },
        select: {
          id: true,
          patient_id: true,
          bills: {
            where: {
              appointment_id: Number(data?.appointment_id),
            },
          },
        },
      });

      if (!info?.bills?.length) {
        bill_info = await db.payment.create({
          data: {
            appointment_id: Number(data?.appointment_id),
            patient_id: info?.patient_id!,
            bill_date: new Date(),
            payment_date: new Date(),
            discount: 0.0,
            amount_paid: 0.0,
            total_amount: 0.0,
          },
        });
      } else {
        bill_info = info?.bills[0];
      }
    } else {
      bill_info = {
        id: data?.bill_id,
      };
    }

    await db.patientBills.create({
      data: {
        bill_id: Number(bill_info?.id),
        service_id: Number(validatedData?.service_id),
        service_date: new Date(validatedData?.service_date!),
        quantity: Number(validatedData?.quantity),
        unit_cost: Number(validatedData?.unit_cost),
        total_cost: Number(validatedData?.total_cost),
      },
    });

    return {
      success: true,
      error: false,
      msg: `Bill added successfully`,
    };
  } catch (error) {
    console.log(error);
    return { success: false, msg: "Internal Server Error" };
  }
}

export async function generateBill(data: any) {
  try {
    const isValidData = PaymentSchema.safeParse(data);

    const validatedData = isValidData.data;

    const discountAmount =
      (Number(validatedData?.discount) / 100) *
      Number(validatedData?.total_amount);

    const res = await db.payment.update({
      data: {
        bill_date: validatedData?.bill_date,
        discount: discountAmount,
        total_amount: Number(validatedData?.total_amount)!,
      },
      where: { id: Number(validatedData?.id) },
    });

    await db.appointment.update({
      data: {
        status: "COMPLETED",
      },
      where: { id: res.appointment_id },
    });
    return {
      success: true,
      error: false,
      msg: `Bill generated successfully`,
    };
  } catch (error) {
    console.log(error);
    return { success: false, msg: "Internal Server Error" };
  }
}

export async function addLabRequest(data: any) {
  try {
    const isValidData = LabRequestSchema.safeParse(data);

    const validatedData = isValidData.data;
    let medicalRecords = null;

    if (!data?.recordId) {
      medicalRecords = await db.medicalRecords.create({
        data: {
          patient_id: data?.patientId,
          doctor_id: data?.doctorId!,
          appointment_id: data?.appointmentId,
        },
      });
    }

    const med_id = data?.recordId || medicalRecords?.id;

    const labData = validatedData?.testTypes.map((el) => ({
      service_id: Number(el),
      record_id: Number(med_id!),
      patient_id: data?.patientId,
    }));

    console.log(labData);

    await db.labTest.createMany({ data: labData! });

    return {
      success: true,
      error: false,
      msg: `Request successful`,
    };
  } catch (error) {
    console.log(error);
    return { success: false, msg: "Internal Server Error" };
  }
}

export async function addLabResult(data: any) {
  try {
    const isValidData = LabResultSchema.safeParse(data);

    if (!isValidData.success) {
      return {
        success: false,
        error: true,
        message: "Provide all required fields",
      };
    }

    const validatedData = isValidData.data;

    await db.labTest.update({
      where: { id: Number(validatedData.testId) },
      data: {
        result: validatedData.result,
        test_date: new Date(validatedData?.testDate),
        resultNote: validatedData.notes,
        status: validatedData.status,
      },
    });

    return {
      success: true,
      error: false,
      message: `Result added Successful`,
    };
  } catch (error) {
    console.log(error);
    return { success: false, msg: "Internal Server Error" };
  }
}

export async function createNewDiagnosis(data: {
  patientId: string;
  doctorId: string;
  diagnosis: string;
  medicalId?: string;
  symptoms: string;
  follow_up_plan?: string;
  notes?: string;
  drugs: {
    drugId: string;
    quantity: number;
    instructions?: string;
    frequency?: string;
    duration?: number;
  }[];
}) {
  try {
    const diagnosis = await db.diagnosis.create({
      data: {
        patient_id: data.patientId,
        doctor_id: data.doctorId,
        diagnosis: data.diagnosis,
        medical_id: Number(data?.medicalId),
        symptoms: data.symptoms,
        follow_up_plan: data.follow_up_plan,
        notes: data.notes,
      },

      include: {
        medical: {
          select: { appointment_id: true },
        },
      },
    });

    if (data?.drugs.length > 0) {
      const pres = await db.prescription.create({
        data: {
          patientId: data.patientId,
          doctorId: data.doctorId,
          diagnosisId: diagnosis?.id,
          drugs: {
            create: data.drugs,
          },
        },
      });
    }

    revalidatePath(
      `/record/appointments/${diagnosis?.medical?.appointment_id}`
    );
    return { diagnosis };
  } catch (error) {
    console.log(error);
    return { error: "Failed to create prescription" };
  }
}
