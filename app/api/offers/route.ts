import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { prisma } from "@/lib/db";
import { authOptions } from "@/lib/auth";

// GET /api/offers - List received or sent offers
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = session.user.id;
    const { searchParams } = new URL(request.url);
    const type = searchParams.get("type"); // "received" or "sent"

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const offers = await (prisma as any).offer.findMany({
      where: type === "sent" 
        ? { buyerId: userId } 
        : { sellerId: userId },
      include: {
        product: {
          select: {
            title: true,
            images: true,
            price: true,
          }
        },
        buyer: {
          select: {
            name: true,
            image: true,
          }
        },
        seller: {
          select: {
            name: true,
            image: true,
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    return NextResponse.json(offers);
  } catch (error) {
    console.error("Failed to fetch offers:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

// POST /api/offers - Create a new offer
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { productId, sellerId, price } = await request.json();
    const buyerId = session.user.id;

    if (!productId || !sellerId || !price) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // Don't allow offers to yourself
    if (buyerId === sellerId) {
      return NextResponse.json({ error: "You cannot make an offer to yourself" }, { status: 400 });
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const offer = await (prisma as any).offer.create({
      data: {
        price: parseFloat(price),
        productId,
        buyerId,
        sellerId,
        status: "PENDING",
      }
    });

    return NextResponse.json(offer);
  } catch (error) {
    console.error("Failed to create offer:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
