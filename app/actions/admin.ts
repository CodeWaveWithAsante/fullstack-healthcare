"use server";

import db from "@/lib/db";
import { DoctorSchema, WorkingDaysSchema } from "@/lib/schema";
import { clerkClient } from "@clerk/nextjs/server";

export async function createNewDoctor(data: any) {
  try {
    const values = DoctorSchema.safeParse(data);

    const workingDaysValues = WorkingDaysSchema.safeParse(data?.work_schedule);

    if (!values.success || !workingDaysValues.success) {
      return {
        success: false,
        errors: true,
        message: "Please provide all required info",
      };
    }

    const validatedValues = values.data;
    const workingDayData = workingDaysValues.data!;

    const client = await clerkClient();

    const user = await client.users.createUser({
      emailAddress: [validatedValues.email],
      password: validatedValues.password,
      firstName: validatedValues.name.split(" ")[0],
      lastName: validatedValues.name.split(" ")[1],
      publicMetadata: { role: "doctor" },
    });

    delete validatedValues["password"];

    const doctor = await db.doctor.create({
      data: {
        ...validatedValues,
        id: user.id,
      },
    });

    await Promise.all(
      workingDayData?.map((el) =>
        db.workingDays.create({
          data: { ...el, doctor_id: doctor.id },
        })
      )
    );

    return {
      success: true,
      message: "Doctor added successfully",
      error: false,
    };
  } catch (error) {
    console.log(error);
    return { error: true, success: false, message: "Something went wrong" };
  }
}
