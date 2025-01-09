import db from "@/lib/db";

export async function fetUserNotifications(userId: string, perPage?: number) {
  try {
    const data = await db.notification.findMany({
      where: { user_id: userId },
      take: perPage || undefined,
      orderBy: { created_at: "desc" },
    });

    if (!data) {
      return {
        success: false,
        message: "Data not found",
        status: 404,
        data: [],
      };
    }

    return {
      success: true,
      data,
      status: 200,
    };
  } catch (error) {
    console.log(error);
    return { success: false, message: "Internal Server Error", status: 500 };
  }
}
