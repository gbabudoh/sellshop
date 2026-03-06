"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, Edit2, Eye, MapPin, Tag, Clock, Loader2, Package } from "lucide-react";

interface Product {
  id: string;
  title: string;
  slug: string;
  description: string;
  price: number;
  category: string;
  condition: string;
  status: string;
  address: string;
  images: string[];
  isNegotiable: boolean;
  viewCount: number;
  createdAt: string;
  seller: {
    name: string;
    rating: number;
    reviewCount: number;
  };
}

export default function ListingDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const [product, setProduct] = useState<Product | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    async function fetchProduct() {
      try {
        const res = await fetch(`/api/products/${id}`);
        if (res.ok) {
          setProduct(await res.json());
        }
      } catch (err) {
        console.error("Failed to fetch product:", err);
      } finally {
        setIsLoading(false);
      }
    }
    fetchProduct();
  }, [id]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Loader2 className="w-10 h-10 text-blue-600 animate-spin" />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center gap-4">
        <h2 className="text-2xl font-bold text-gray-900">Listing Not Found</h2>
        <button onClick={() => router.push("/dashboard/sell/listings")} className="text-blue-600 font-medium hover:underline">
          Back to Listings
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <button onClick={() => router.back()} className="flex items-center gap-2 text-gray-600 hover:text-gray-900 font-medium transition-colors">
            <ArrowLeft size={20} /> Back
          </button>
          <div className="flex gap-3">
            <Link href={`/products/${product.slug || product.id}`} className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-xl text-gray-700 font-medium hover:bg-gray-50 transition-colors shadow-sm">
              <Eye size={16} /> Public View
            </Link>
            <Link href={`/dashboard/sell/listings/${product.id}/edit`} className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 transition-colors shadow-sm">
              <Edit2 size={16} /> Edit
            </Link>
          </div>
        </div>

        {/* Content */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          {/* Image */}
          {product.images?.length > 0 && (
            <div className="w-full flex justify-center bg-gray-50 p-6">
              <Image
                src={product.images[0]}
                alt={product.title}
                width={500}
                height={500}
                className="max-h-[400px] w-auto object-contain rounded-xl"
              />
            </div>
          )}

          {/* Details */}
          <div className="p-6 sm:p-8 space-y-6">
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-semibold">{product.category}</span>
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${product.status === "ACTIVE" ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-600"}`}>
                    {product.status}
                  </span>
                </div>
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">{product.title}</h1>
              </div>
              <p className="text-3xl font-bold text-blue-600 whitespace-nowrap">£{product.price.toLocaleString()}</p>
            </div>

            {product.isNegotiable && (
              <span className="inline-block text-xs font-semibold text-green-600 bg-green-50 px-3 py-1 rounded-full">Negotiable</span>
            )}

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 py-4 border-y border-gray-100">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Package size={16} className="text-gray-400" />
                <span>{product.condition.replace(/_/g, " ")}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <MapPin size={16} className="text-gray-400" />
                <span>{product.address || "Not specified"}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Eye size={16} className="text-gray-400" />
                <span>{product.viewCount} views</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Clock size={16} className="text-gray-400" />
                <span>{new Date(product.createdAt).toLocaleDateString()}</span>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">Description</h3>
              <p className="text-gray-600 leading-relaxed whitespace-pre-line">{product.description}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}