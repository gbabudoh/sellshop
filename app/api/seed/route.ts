import { NextResponse } from "next/server";
import { prisma } from "../../../lib/db";
import bcrypt from "bcryptjs";

export async function POST() {
  try {
    // Create demo seller account
    const hashedPassword = await bcrypt.hash("DemoSeller123!", 10);

    const demoSeller = await prisma.user.upsert({
      where: { email: "seller@demo.com" },
      update: {},
      create: {
        email: "seller@demo.com",
        name: "Demo Seller",
        hashedPassword,
        // @ts-expect-error - Prisma client needs TS Server restart
        role: "SELLER",
        phoneNumber: "+44 7700 900000",
        address: "221B Baker St, London NW1 6XE, UK",
        bio: "Trusted UK seller with quality items. Fast shipping and great customer service across Europe!",
        rating: 4.8,
        reviewCount: 12,
      },
    });

    // Create demo buyer account
    const demoBuyer = await prisma.user.upsert({
      where: { email: "buyer@demo.com" },
      update: {},
      create: {
        email: "buyer@demo.com",
        name: "Demo Buyer",
        hashedPassword,
        // @ts-expect-error - Prisma client needs TS Server restart
        role: "BUYER",
        phoneNumber: "+33 1 42 27 27 27",
        address: "5 Avenue Anatole France, 75007 Paris, France",
        bio: "Looking for great deals on premium items across the EU!",
        rating: 4.5,
        reviewCount: 8,
      },
    });

    // Create sample products for the demo seller
    const product1 = await prisma.product.create({
      data: {
        title: "iPhone 13 Pro",
        // @ts-expect-error - Prisma client needs TS Server restart
        slug: "iphone-13-pro",
        description:
          "Excellent condition, minimal scratches. Comes with original box and charger. Battery health at 95%. All functions working perfectly. Screen protector included.",
        price: 799,
        category: "Electronics",
        condition: "USED_LIKE_NEW",
        status: "ACTIVE",
        address: "London, UK",
        images: [
          "https://via.placeholder.com/500x500?text=iPhone+13+Pro",
          "https://via.placeholder.com/500x500?text=iPhone+13+Back",
          "https://via.placeholder.com/500x500?text=iPhone+13+Side",
        ],
        isNegotiable: true,
        viewCount: 245,
        sellerId: demoSeller.id,
      },
    });

    const product2 = await prisma.product.create({
      data: {
        title: "MacBook Air M1",
        // @ts-expect-error - Prisma client needs TS Server restart
        slug: "macbook-air-m1",
        description:
          "Like new condition, barely used. Perfect for students and professionals. Includes original charger and box. No scratches or damage.",
        price: 999,
        category: "Electronics",
        condition: "USED_LIKE_NEW",
        status: "ACTIVE",
        address: "Manchester, UK",
        images: [
          "https://via.placeholder.com/500x500?text=MacBook+Air+M1",
          "https://via.placeholder.com/500x500?text=MacBook+Keyboard",
        ],
        isNegotiable: true,
        viewCount: 156,
        sellerId: demoSeller.id,
      },
    });

    const product3 = await prisma.product.create({
      data: {
        title: "AirPods Pro",
        // @ts-expect-error - Prisma client needs TS Server restart
        slug: "airpods-pro",
        description:
          "Original Apple AirPods Pro with active noise cancellation. Excellent sound quality. Comes with charging case and all original accessories.",
        price: 199,
        category: "Electronics",
        condition: "USED_GOOD",
        status: "ACTIVE",
        address: "Berlin, Germany",
        images: [
          "https://via.placeholder.com/500x500?text=AirPods+Pro",
          "https://via.placeholder.com/500x500?text=AirPods+Case",
        ],
        isNegotiable: false,
        viewCount: 89,
        sellerId: demoSeller.id,
      },
    });

    return NextResponse.json(
      {
        message: "Demo accounts and products created successfully!",
        seller: {
          email: demoSeller.email,
          password: "DemoSeller123!",
          name: demoSeller.name,
          role: demoSeller.role,
        },
        buyer: {
          email: demoBuyer.email,
          password: "DemoSeller123!",
          name: demoBuyer.name,
          role: demoBuyer.role,
        },
        products: [product1, product2, product3],
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Seed error:", error);
    return NextResponse.json(
      { error: "Failed to create demo accounts", details: String(error) },
      { status: 500 }
    );
  }
}
