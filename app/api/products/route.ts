import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { ProductCondition, UserRole } from "@prisma/client";
import { slugify } from "@/utils/slugify";
import { ImageService } from "@/lib/imageService";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const products = await prisma.product.findMany({
      where: {
        status: "ACTIVE",
      },
      include: {
        seller: {
          select: {
            name: true,
            rating: true,
            reviewCount: true,
          }
        }
      },
      orderBy: {
        createdAt: "desc",
      }
    });

    return NextResponse.json(products);
  } catch (error) {
    console.error("Failed to fetch products:", error);
    return NextResponse.json({ error: "Failed to fetch products" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const title = formData.get("title") as string;
    const description = formData.get("description") as string;
    const price = parseFloat(formData.get("price") as string);
    const category = formData.get("category") as string;
    const condition = formData.get("condition") as string; // Map to enum if needed
    const address = formData.get("address") as string;
    const isNegotiable = formData.get("isNegotiable") === "true";
    const quantity = parseInt(formData.get("quantity") as string) || 1;
    const durationWeeks = parseInt(formData.get("duration") as string) || 4;
    const file = formData.get("image") as File;

    // Calculate expiration date
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + (durationWeeks * 7));

    const imageUrls: string[] = [];
    if (file) {
      const buffer = Buffer.from(await file.arrayBuffer());
      // 1. Remove background
      const refinedBuffer = await ImageService.removeBackground(buffer);
      // 2. Store image
      const rawUrl = await ImageService.storeImage(refinedBuffer);
      // 3. Generate optimized URL
      imageUrls.push(ImageService.getOptimizedUrl(rawUrl));
    }

    // Generate slug - only add suffix if slug already exists
    const baseSlug = slugify(title);
    // @ts-ignore
    const existing = await prisma.product.findFirst({ where: { slug: baseSlug } as any });
    const uniqueSlug = existing ? `${baseSlug}-${Math.random().toString(36).substr(2, 5)}` : baseSlug;

    const session = (await getServerSession(authOptions)) as {
      user?: { id?: string; name?: string | null; email?: string | null };
    } | null;

    let sellerId = "";

    if (session?.user?.id) {
      const dbUser = await prisma.user.findUnique({
        where: { id: session.user.id }
      });
      if (dbUser) {
        sellerId = dbUser.id;
      }
    }

    // Fallback: try finding user by email from session
    if (!sellerId && session?.user?.email) {
      const dbUser = await prisma.user.findUnique({
        where: { email: session.user.email }
      });
      if (dbUser) {
        sellerId = dbUser.id;
      }
    }

    if (!sellerId) {
      return NextResponse.json({ error: "You must be signed in to create a listing" }, { status: 401 });
    }

    const newProduct = await prisma.product.create({
      data: {
        title,
        // @ts-expect-error - Prisma client needs TS Server restart
        slug: uniqueSlug,
        description,
        price,
        category,
        condition: (condition as ProductCondition) || ProductCondition.USED_GOOD,
        address,
        isNegotiable,
        quantity,
        expiresAt,
        images: imageUrls,
        status: "ACTIVE",
        sellerId: sellerId,
      },
      include: {
        seller: true
      }
    });

    return NextResponse.json(newProduct, { status: 201 });
  } catch (error: unknown) {
    const err = error as Error;
    console.error("CRITICAL ERROR in POST /api/products:", err);
    return NextResponse.json(
      { 
        error: "Failed to create product", 
        details: err?.message || String(error),
        stack: err?.stack
      }, 
      { status: 500 }
    );
  }
}
