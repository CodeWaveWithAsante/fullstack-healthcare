"use server";

import db from "@/lib/db";
import { clerkClient } from "@clerk/nextjs/server";

export async function deleteDataById(
  id: string,

  deleteType: "doctor" | "staff" | "patient"
) {
  try {
    switch (deleteType) {
      case "doctor":
        await db.doctor.delete({ where: { id: id } });
    }

    if (
      deleteType === "staff" ||
      deleteType === "patient" ||
      deleteType === "doctor"
    ) {
      const client = await clerkClient();
      await client.users.deleteUser(id);
    }

    return {
      success: true,
      message: "Data deleted successfully",
      status: 200,
    };
  } catch (error) {
    console.log(error);

    return {
      success: false,
      message: "Internal Server Error",
      status: 500,
    };
  }
}
