import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const type = searchParams.get("type"); // "buyer" or "seller"

    // Mock data - replace with actual database queries
    const orders = [
      {
        id: "order1",
        status: "PENDING",
        totalAmount: 799,
        commission: 63.92,
        sellerEarnings: 735.08,
        paymentStatus: "PENDING",
        createdAt: new Date(),
        productId: "1",
        buyerId: "buyer1",
        sellerId: "seller1",
      },
    ];

    return NextResponse.json(orders);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch orders" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Mock creation - replace with actual database insert
    const newOrder = {
      id: Math.random().toString(36).substr(2, 9),
      ...body,
      status: "PENDING",
      paymentStatus: "PENDING",
      commission: body.totalAmount * 0.08,
      sellerEarnings: body.totalAmount * 0.92,
      createdAt: new Date(),
    };

    return NextResponse.json(newOrder, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: "Failed to create order" }, { status: 500 });
  }
}
