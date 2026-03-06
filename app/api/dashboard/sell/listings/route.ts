import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { prisma } from "@/lib/db";
import { authOptions } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const session = (await getServerSession(authOptions)) as {
      user?: { id?: string; name?: string | null; email?: string | null };
    } | null;

    if (!session || !session.user || !session.user.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = session.user.id;

    // Fetch listings
    const listings = await prisma.product.findMany({
      where: {
        sellerId: userId,
      },
      orderBy: {
        createdAt: "desc",
      },
      select: {
        id: true,
        title: true,
        price: true,
        status: true,
        viewCount: true,
        createdAt: true,
        category: true,
        address: true,
        images: true,
      }
    });

    const formattedListings = listings.map((item) => ({
      id: item.id,
      title: item.title,
      price: item.price,
      status: item.status,
      views: item.viewCount,
      createdAt: new Date(item.createdAt).toISOString().split('T')[0],
      category: item.category,
      location: item.address || "No Location",
      image: item.images && item.images.length > 0 ? item.images[0] : "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=500&q=80",
    }));

    return NextResponse.json(formattedListings);
  } catch (error) {
    console.error("Failed to fetch seller listings:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
