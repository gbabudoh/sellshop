import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { prisma } from "@/lib/db";
import { authOptions } from "@/lib/auth";

// GET /api/messages/conversations/[id] - Get message history
export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const userId = session.user.id;

    // Verify user is part of the conversation
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const conversation = await (prisma as any).conversation.findUnique({
      where: { id },
      include: {
        participant1: true,
        participant2: true,
      }
    });

    if (!conversation) {
      return NextResponse.json({ error: "Conversation not found" }, { status: 404 });
    }

    if (conversation.participant1Id !== userId && conversation.participant2Id !== userId) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const messages = await (prisma as any).message.findMany({
      where: {
        conversationId: id
      },
      orderBy: {
        createdAt: 'asc'
      },
      include: {
        sender: {
          select: {
            id: true,
            name: true,
            image: true,
          }
        }
      }
    });

    return NextResponse.json({
      conversation,
      messages
    });
  } catch (error) {
    console.error("Failed to fetch messages:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

// POST /api/messages/conversations/[id] - Send a message
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const { content } = await request.json();
    const userId = session.user.id;

    if (!content) {
      return NextResponse.json({ error: "Content is required" }, { status: 400 });
    }

    // Verify conversation existence and membership
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const conversation = await (prisma as any).conversation.findUnique({
      where: { id }
    });

    if (!conversation) {
      return NextResponse.json({ error: "Conversation not found" }, { status: 404 });
    }

    if (conversation.participant1Id !== userId && conversation.participant2Id !== userId) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const receiverId = conversation.participant1Id === userId 
      ? conversation.participant2Id 
      : conversation.participant1Id;

    // Use a transaction to create message and update conversation timestamp
    const [newMessage] = await prisma.$transaction([
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (prisma as any).message.create({
        data: {
          content,
          senderId: userId,
          receiverId: receiverId,
          conversationId: id,
          productId: conversation.productId,
        }
      }),
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (prisma as any).conversation.update({
        where: { id: id },
        data: {
          lastMessageAt: new Date()
        }
      })
    ]);

    return NextResponse.json(newMessage);
  } catch (error) {
    console.error("Failed to send message:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
