import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { ProductCondition } from "@prisma/client";
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
    const file = formData.get("image") as File;

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

    // Generate slug
    const baseSlug = slugify(title);
    const uniqueSlug = `${baseSlug}-${Math.random().toString(36).substr(2, 5)}`;

    const session = (await getServerSession(authOptions)) as {
      user?: { id?: string; name?: string | null; email?: string | null };
    } | null;

    let sellerId = "";

    if (session?.user?.id) {
      const userExists = await prisma.user.findUnique({
        where: { id: session.user.id }
      });
      if (!userExists) {
        return NextResponse.json(
          { error: "Your session is invalid (likely due to a database reset). Please log out and sign back in." },
          { status: 401 }
        );
      }
      sellerId = session.user.id;
    } else {
      // Get a default seller if not logged in (for demo purposes)
      let demoSeller = await prisma.user.findFirst({
        where: { email: "seller@demo.com" }
      });

      if (!demoSeller) {
        demoSeller = await prisma.user.findFirst();
        
        if (!demoSeller) {
          demoSeller = await prisma.user.create({
            data: {
              email: "seller@demo.com",
              name: "Demo Seller",
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              role: "SELLER" as any
            }
          });
        }
      }
      sellerId = demoSeller.id;
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
        images: imageUrls,
        status: "ACTIVE",
        sellerId: sellerId,
      },
      include: {
        seller: true
      }
    });

    return NextResponse.json(newProduct, { status: 201 });
  } catch (error) {
    console.error("Failed to create product:", error);
    return NextResponse.json({ error: "Failed to create product", details: String(error) }, { status: 500 });
  }
}
