"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { motion } from "framer-motion";
import { DollarSign, Clock, CheckCircle, XCircle, Loader2, Package, Store } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

interface Offer {
  id: string;
  price: number;
  status: "PENDING" | "ACCEPTED" | "DECLINED";
  createdAt: string;
  productId: string;
  product: {
    title: string;
    images: string[];
    price: number;
    slug: string;
  };
  seller: {
    name: string;
    image: string | null;
  };
}

export default function BuyerOffersPage() {
  const { data: session } = useSession();
  const [offers, setOffers] = useState<Offer[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchOffers() {
      try {
        const res = await fetch("/api/offers?type=sent");
        if (res.ok) {
          const data = await res.json();
          setOffers(data);
        }
      } catch (error) {
        console.error("Failed to fetch offers:", error);
      } finally {
        setIsLoading(false);
      }
    }

    if (session?.user) {
      fetchOffers();
    }
  }, [session]);

  const statusStyles = {
    PENDING: {
      bg: "bg-amber-50",
      text: "text-amber-700",
      border: "border-amber-100",
      icon: <Clock size={16} />
    },
    ACCEPTED: {
      bg: "bg-green-50",
      text: "text-green-700",
      border: "border-green-100",
      icon: <CheckCircle size={16} />
    },
    DECLINED: {
      bg: "bg-red-50",
      text: "text-red-700",
      border: "border-red-100",
      icon: <XCircle size={16} />
    },
  };

  return (
    <div className="max-w-7xl mx-auto px-4 pt-12">
      <div className="mb-8">
        <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight">My Offers</h1>
        <p className="text-gray-500 mt-2 font-medium text-lg">Track your price negotiations</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {isLoading ? (
          <div className="col-span-full flex flex-col items-center justify-center py-20 bg-white/50 rounded-3xl border border-gray-100 shadow-sm">
            <Loader2 className="w-12 h-12 text-blue-500 animate-spin mb-4" />
            <p className="text-gray-500 font-medium">Loading your offers...</p>
          </div>
        ) : offers.length === 0 ? (
          <div className="col-span-full flex flex-col items-center justify-center py-20 bg-white rounded-3xl border border-gray-200 shadow-sm text-center px-8">
            <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mb-4">
              <DollarSign size={32} className="text-gray-300" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">No offers sent</h3>
            <p className="text-gray-500 max-w-sm">
              When you make offers on items, you can track their status here.
            </p>
            <Link href="/products" className="mt-6 text-blue-600 font-bold hover:underline">
              Browse Marketplace
            </Link>
          </div>
        ) : (
          offers.map((offer) => (
            <motion.div
              key={offer.id}
              whileHover={{ y: -5 }}
              className="bg-white border border-gray-100 rounded-3xl shadow-sm hover:shadow-xl transition-all overflow-hidden flex flex-col"
            >
              {/* Product Info */}
              <div className="p-5 border-b border-gray-50">
                <div className="flex gap-4">
                  <div className="w-20 h-20 rounded-2xl overflow-hidden border border-gray-100 flex-shrink-0 relative">
                    {offer.product.images[0] ? (
                      <Image 
                        src={offer.product.images[0]} 
                        alt={offer.product.title} 
                        width={80} 
                        height={80} 
                        className="object-cover w-full h-full" 
                      />
                    ) : (
                      <Package size={24} className="text-gray-400 absolute inset-0 m-auto" />
                    )}
                  </div>
                  <div className="min-w-0">
                    <Link href={`/products/${offer.product.slug}`} className="font-bold text-gray-900 hover:text-blue-600 transition-colors line-clamp-2">
                      {offer.product.title}
                    </Link>
                    <p className="text-xs font-bold text-gray-400 mt-1 uppercase">Listed: £{offer.product.price}</p>
                  </div>
                </div>
              </div>

              {/* Offer Details */}
              <div className="p-5 flex-1 flex flex-col justify-between">
                <div className="flex justify-between items-center mb-4">
                  <div>
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block mb-1">Your Offer</span>
                    <p className="text-2xl font-black text-blue-600">£{offer.price}</p>
                  </div>
                  <div className={`px-3 py-1.5 rounded-xl border font-bold text-xs flex items-center gap-1.5 ${statusStyles[offer.status].bg} ${statusStyles[offer.status].text} ${statusStyles[offer.status].border}`}>
                    {statusStyles[offer.status].icon}
                    {offer.status}
                  </div>
                </div>

                <div className="pt-4 border-t border-gray-50 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Store size={14} className="text-gray-400" />
                    <span className="text-xs font-bold text-gray-600">{offer.seller.name}</span>
                  </div>
                  <span className="text-[10px] text-gray-400 font-bold uppercase">{new Date(offer.createdAt).toLocaleDateString()}</span>
                </div>
              </div>
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
}
