import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET() {
  try {
    const products = await prisma.product.findMany({
      orderBy: { createdAt: "desc" },
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
      },
    });

    const listings = products.map((p) => ({
      id: p.id,
      title: p.title,
      price: p.price,
      status: p.status,
      views: p.viewCount,
      createdAt: new Date(p.createdAt).toLocaleDateString(),
      category: p.category,
      location: p.address || "Not specified",
      image: p.images[0] || "https://via.placeholder.com/400x300?text=No+Image",
    }));

    return NextResponse.json(listings);
  } catch (error) {
    console.error("Failed to fetch seller listings:", error);
    return NextResponse.json([], { status: 500 });
  }
}
