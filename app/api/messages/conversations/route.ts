import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { prisma } from "@/lib/db";
import { authOptions } from "@/lib/auth";

// GET /api/messages/conversations - List conversations for the current user
export async function GET() {
  try {
    const session = await getServerSession(authOptions) as { user: { id: string } } | null;
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = session.user.id;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const conversations = await (prisma as any).conversation.findMany({
      where: {
        OR: [
          { participant1Id: userId },
          { participant2Id: userId }
        ]
      },
      include: {
        product: {
          select: {
            title: true,
            images: true,
            price: true,
          }
        },
        participant1: {
          select: {
            id: true,
            name: true,
            image: true,
          }
        },
        participant2: {
          select: {
            id: true,
            name: true,
            image: true,
          }
        },
        messages: {
          orderBy: {
            createdAt: 'desc'
          },
          take: 1,
        }
      },
      orderBy: {
        lastMessageAt: 'desc'
      }
    });

    return NextResponse.json(conversations);
  } catch (error) {
    console.error("Failed to fetch conversations:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

// POST /api/messages/conversations - Create or find a conversation
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions) as { user: { id: string } } | null;
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { productId, sellerId } = await request.json();
    const buyerId = session.user.id;

    if (!productId || !sellerId) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // Don't allow messaging yourself
    if (buyerId === sellerId) {
      return NextResponse.json({ error: "You cannot message yourself" }, { status: 400 });
    }

    // Try to find existing conversation
    // Important: We need to check both ways as participant1/participant2
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let conversation = await (prisma as any).conversation.findFirst({
      where: {
        productId,
        OR: [
          { participant1Id: buyerId, participant2Id: sellerId },
          { participant1Id: sellerId, participant2Id: buyerId }
        ]
      }
    });

    if (!conversation) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      conversation = await (prisma as any).conversation.create({
        data: {
          productId,
          participant1Id: buyerId,
          participant2Id: sellerId,
        }
      });
    }

    return NextResponse.json(conversation);
  } catch (error) {
    console.error("Failed to create conversation:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
