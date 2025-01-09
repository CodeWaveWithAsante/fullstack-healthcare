"use server";

import db from "@/lib/db";
import { AppointmentSchema, VitalSignsSchema } from "@/lib/schema";
import { AppointmentStatus, VitalSigns } from "@prisma/client";

export async function appointmentAction(
  id: string | number,
  status: AppointmentStatus,
  reason: string
) {
  try {
    await db.appointment.update({
      where: { id: Number(id) },
      data: {
        status: status,
        reason: reason,
      },
    });

    const data = await db.appointment.findUnique({
      where: { id: Number(id) },
      include: {
        doctor: { select: { name: true } },
      },
    });

    // create notification
    await db.notification.create({
      data: {
        user_id: data?.patient_id!,
        title: "Appointment notice",
        message: `Your appointment with ${
          data?.doctor?.name
        } has been ${status.toLowerCase()}`,
      },
    });

    return {
      success: true,
      error: false,
      msg: `Appointment ${status.toLowerCase()} successfully`,
    };
  } catch (error) {
    console.log(error);
    return { success: false, msg: "Internal Server Error" };
  }
}

export async function addNewVitalSigns(data: any) {
  try {
    const isValidData = VitalSignsSchema.safeParse(data);

    const validatedData = isValidData.data;
    let medicalRecords = null;

    if (!validatedData?.medical_id) {
      medicalRecords = await db.medicalRecords.create({
        data: {
          patient_id: validatedData?.patient_id!,
          doctor_id: data?.doctor_id!,
          appointment_id: Number(data?.appointment_id),
        },
      });
    }
    const med_id = validatedData?.medical_id || medicalRecords?.id;

    const res = await db.vitalSigns.create({
      data: {
        ...validatedData!,
        medical_id: Number(med_id!),
      },
    });

    return {
      success: true,
      error: false,
      msg: `Vital signs added successfully`,
    };
  } catch (error) {
    console.log(error);
    return { success: false, msg: "Internal Server Error" };
  }
}

export async function createNewAppointment(data: any) {
  try {
    const validated = AppointmentSchema.safeParse(data);

    const validatedData = validated.data;

    const patient = await db.appointment.create({
      data: {
        ...validatedData!,
        patient_id: data?.patient_id!,
        appointment_date: new Date(validatedData?.appointment_date!),
      },
    });

    return {
      success: true,
      data: patient,
      message: "Appointment booked successfully",
    };
  } catch (error) {
    console.log(error);
    return { success: false, msg: "Internal Server Error" };
  }
}
