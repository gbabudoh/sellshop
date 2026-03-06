import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET() {
  try {
    const session = (await getServerSession(authOptions)) as {
      user?: { id?: string; name?: string | null; email?: string | null };
    } | null;

    if (!session || !session.user || !session.user.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Return empty state for the user
    return NextResponse.json({
      stats: {
        activeOrders: 0,
        savedItems: 0,
        totalSpent: 0
      },
      myPurchases: [],
      ordersFromOthers: []
    });

  } catch (error) {
    console.error("Failed to fetch buyer dashboard data:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
