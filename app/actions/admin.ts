"use server";

import db from "@/lib/db";
import { ServicesSchema } from "@/lib/schema";
import { getRole } from "@/utils/roles";
import { auth } from "@clerk/nextjs/server";

export async function addNewService(data: any) {
  try {
    const { userId } = await auth();

    if (!userId) {
      throw new Error("Unauthorized user");
    }

    const role = await getRole();

    if (role !== "admin" && role !== "lab_technician")
      return { success: false, error: true, message: "Unauthorized access" };

    const isValidData = ServicesSchema.safeParse(data);

    const validatedData = isValidData.data;

    await db.services.create({
      data: {
        ...validatedData!,
        price: Number(data.price),
        tat: Number(data.tat),
        department: data?.department,
      },
    });

    return {
      success: true,
      error: false,
      message: `Service added successfully`,
    };
  } catch (error) {
    console.log(error);
    return { success: false, msg: "Internal Server Error" };
  }
}

export async function updateService(data: any, id: number) {
  try {
    const role = await getRole();

    if (role !== "admin" && role !== "lab_technician")
      return { success: false, error: true, message: "Unauthorized access" };

    const isValidData = ServicesSchema.safeParse(data);

    const validatedData = isValidData.data;

    await db.services.update({
      where: { id },
      data: {
        ...validatedData!,
        price: Number(data.price),
        tat: Number(data.tat),
        department: data?.department,
      },
    });

    return {
      success: true,
      error: false,
      message: `Service update successfully`,
    };
  } catch (error) {
    console.log(error);
    return { success: false, msg: "Internal Server Error" };
  }
}
