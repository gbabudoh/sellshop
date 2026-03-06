import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get("q");

    if (!query || query.length < 2) {
      return NextResponse.json([]);
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const suggestions = await (prisma as any).product.findMany({
      where: {
        status: "ACTIVE",
        OR: [
          { title: { contains: query, mode: "insensitive" } },
          { category: { contains: query, mode: "insensitive" } },
        ],
      },
      select: {
        id: true,
        title: true,
        category: true,
        slug: true,
      },
      take: 8,
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json(suggestions);
  } catch (error) {
    console.error("Failed to fetch suggestions:", error);
    return NextResponse.json({ error: "Failed to fetch suggestions" }, { status: 500 });
  }
}
