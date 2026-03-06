import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

// One-time fix: reassign products from Demo Seller to Godwin and clean slugs
export async function GET() {
  try {
    // Clean up slugs: remove random suffixes where possible
    const products = await prisma.product.findMany();
    for (const product of products) {
      // Strip the random suffix (last -xxxxx pattern)
      const cleanSlug = product.slug.replace(/-[a-z0-9]{5}$/, "");
      // Check if clean slug is available
      // @ts-ignore
      const conflict = await prisma.product.findFirst({
        where: { slug: cleanSlug, id: { not: product.id } } as any,
      });
      if (!conflict && cleanSlug !== product.slug) {
        await prisma.product.update({
          where: { id: product.id },
          data: { slug: cleanSlug } as any,
        });
      }
    }
    // Find Godwin
    const godwin = await prisma.user.findFirst({
      where: { name: { contains: "Godwin" } },
    });

    if (!godwin) {
      // List all users so we can find the right one
      const users = await prisma.user.findMany({
        select: { id: true, name: true, email: true },
      });
      return NextResponse.json({ error: "Godwin not found", users });
    }

    // Find Demo Seller
    const demoSeller = await prisma.user.findFirst({
      where: { name: "Demo Seller" },
    });

    if (!demoSeller) {
      return NextResponse.json({ error: "Demo Seller not found" });
    }

    // Reassign all Demo Seller products to Godwin
    const result = await prisma.product.updateMany({
      where: { sellerId: demoSeller.id },
      data: { sellerId: godwin.id },
    });

    return NextResponse.json({
      success: true,
      reassigned: result.count,
      from: demoSeller?.name,
      to: godwin?.name,
      slugsCleaned: true,
    });
  } catch (error) {
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}
