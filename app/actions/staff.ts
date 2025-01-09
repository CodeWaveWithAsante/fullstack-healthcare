"use server";

import db from "@/lib/db";
import { StaffSchema } from "@/lib/schema";
import { checkRole } from "@/utils/roles";
import { auth, clerkClient } from "@clerk/nextjs/server";

export const createStaff = async (data: any) => {
  try {
    const { userId } = await auth();
    const isAdmin = await checkRole("ADMIN");
    if (!userId && !isAdmin) {
      throw new Error("Unauthorized user");
    }

    const values = StaffSchema.safeParse(data);

    if (!values.success) {
      return { success: false, error: true, msg: "Provide all fields." };
    }

    const validatedData = values?.data;
    // delete validatedData["password"];

    const client = await clerkClient();
    // const role =
    //   data?.role === "NURSE"
    //     ? "nurse"
    //     : data?.role === "LABORATORY"
    //     ? "laboratory"
    //     : "pharmacy";

    const user = await client.users.createUser({
      emailAddress: [validatedData.email],
      password: validatedData.password,
      firstName: validatedData.name.split(" ")[0],
      lastName: validatedData.name.split(" ")[1],
      publicMetadata: { role: data?.role?.toLowerCase() },
    });

    await db.staff.create({
      data: {
        id: user.id,
        name: validatedData.name,
        role: validatedData.role,
        phone: validatedData.phone,
        email: validatedData.email,
        address: validatedData.address,
      },
    });

    await db.notification.create({
      data: {
        title: "Welcome on board",
        message: `You are welcome to the Healthcare Management System ${validatedData.name}.`,
        user_id: user.id,
      },
    });

    return { success: true, error: false, msg: "Doctor added successfully." };
  } catch (error: any) {
    console.dir(error, { depth: null });
    console.log(error);
    return { success: false, error: true, msg: error?.message };
  }
};
