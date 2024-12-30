import db from "@/lib/db";

export async function getDoctors() {
  try {
    const data = await db.doctor.findMany();

    return { success: true, data, status: 200 };
  } catch (error) {
    console.log(error);
    return { success: false, message: "Internal Server Error", status: 500 };
  }
}
