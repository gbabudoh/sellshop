import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { prisma } from "@/lib/db";
import { authOptions } from "@/lib/auth";

// PATCH /api/offers/[id] - Update offer status (Accept/Decline)
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const { status } = await request.json(); // "ACCEPTED" or "DECLINED"
    const userId = session.user.id;

    if (!["ACCEPTED", "DECLINED"].includes(status)) {
      return NextResponse.json({ error: "Invalid status" }, { status: 400 });
    }

    // Verify offer existence and ownership (only seller can accept/decline)
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const offer = await (prisma as any).offer.findUnique({
      where: { id }
    });

    if (!offer) {
      return NextResponse.json({ error: "Offer not found" }, { status: 404 });
    }

    if (offer.sellerId !== userId) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const updatedOffer = await (prisma as any).offer.update({
      where: { id },
      data: { status }
    });

    return NextResponse.json(updatedOffer);
  } catch (error) {
    console.error("Failed to update offer:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
