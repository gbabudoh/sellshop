import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { prisma } from "@/lib/db";
import { authOptions } from "@/lib/auth";

export async function GET() {
  try {
    const session = (await getServerSession(authOptions)) as {
      user?: { id?: string; name?: string | null; email?: string | null };
    } | null;

    if (!session || !session.user || !session.user.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = session.user.id;

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        name: true,
        email: true,
        phoneNumber: true,
        address: true,
        bio: true,
        rating: true,
        reviewCount: true,
        createdAt: true,
        image: true,
      }
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Fetch items sold count
    const itemsSoldCount = await prisma.order.count({
      where: {
        sellerId: userId,
        status: "COMPLETED"
      }
    });

    return NextResponse.json({
      ...user,
      itemsSoldCount,
    });

  } catch (error) {
    console.error("Failed to fetch profile:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const session = (await getServerSession(authOptions)) as {
      user?: { id?: string; name?: string | null; email?: string | null };
    } | null;

    if (!session || !session.user || !session.user.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = session.user.id;
    const { name, phoneNumber, address, bio } = await req.json();

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        name,
        phoneNumber,
        address,
        bio,
      }
    });

    return NextResponse.json(updatedUser);

  } catch (error) {
    console.error("Failed to update profile:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
