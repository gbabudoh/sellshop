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

    // Fetch active listings
    const activeListingsCount = await prisma.product.count({
      where: {
        sellerId: userId,
        status: "ACTIVE"
      }
    });

    // Calculate total sales
    const completedSales = await prisma.order.findMany({
      where: {
        sellerId: userId,
        status: "COMPLETED"
      },
      select: {
        sellerEarnings: true
      }
    });
    
    const totalSales = completedSales.reduce((acc: number, order: { sellerEarnings: number }) => acc + order.sellerEarnings, 0);

    // Fetch pending orders count
    const pendingOrdersCount = await prisma.order.count({
      where: {
        sellerId: userId,
        status: "PENDING"
      }
    });
    
    // Fetch seller rating
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { rating: true }
    });

    // Fetch recent orders (for the seller dashboard table)
    const recentOrders = await prisma.order.findMany({
      where: {
        sellerId: userId
      },
      include: {
        product: true,
        buyer: {
          select: {
            name: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      },
      take: 5
    });

    const formattedOrders = recentOrders.map((order: { id: string; status: string; totalAmount: number; product: { title: string }; buyer: { name: string | null } }) => ({
      id: order.id,
      orderNumber: order.id.slice(0, 8).toUpperCase(),
      productTitle: order.product.title,
      buyerName: order.buyer.name || "Unknown Buyer",
      amount: order.totalAmount, // Assuming the seller wants to see the total amount charged to buyer
      status: order.status,
    }));

    return NextResponse.json({
      stats: {
        activeListings: activeListingsCount,
        totalSales: totalSales,
        pendingOrders: pendingOrdersCount,
        rating: user?.rating ? user.rating.toFixed(1) + "★" : "0.0★"
      },
      recentOrders: formattedOrders
    });

  } catch (error) {
    console.error("Failed to fetch seller dashboard data:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
