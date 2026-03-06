"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { motion } from "framer-motion";
import { DollarSign, Clock, CheckCircle, XCircle, Loader2, Package, User } from "lucide-react";
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
  };
  buyer: {
    name: string;
    image: string | null;
  };
}

export default function SellerOffersPage() {
  const { data: session } = useSession();
  const [offers, setOffers] = useState<Offer[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  useEffect(() => {
    async function fetchOffers() {
      try {
        const res = await fetch("/api/offers?type=received");
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

  const handleUpdateStatus = async (offerId: string, status: "ACCEPTED" | "DECLINED") => {
    setActionLoading(offerId);
    try {
      const res = await fetch(`/api/offers/${offerId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });

      if (res.ok) {
        setOffers(offers.map(o => o.id === offerId ? { ...o, status } : o));
      }
    } catch (error) {
      console.error("Failed to update offer status:", error);
    } finally {
      setActionLoading(null);
    }
  };

  const statusColors = {
    PENDING: "bg-amber-100 text-amber-700 border-amber-200",
    ACCEPTED: "bg-green-100 text-green-700 border-green-200",
    DECLINED: "bg-red-100 text-red-700 border-red-200",
  };

  return (
    <div className="max-w-7xl mx-auto px-4 pt-12">
      <div className="mb-8">
        <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight">Received Offers</h1>
        <p className="text-gray-500 mt-2 font-medium text-lg">Manage your price negotiations</p>
      </div>

      <div className="space-y-4">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-20 bg-white/50 rounded-3xl border border-gray-100 shadow-sm">
            <Loader2 className="w-12 h-12 text-blue-500 animate-spin mb-4" />
            <p className="text-gray-500 font-medium">Loading offers...</p>
          </div>
        ) : offers.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 bg-white rounded-3xl border border-gray-200 shadow-sm text-center px-8">
            <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mb-4">
              <DollarSign size={32} className="text-gray-300" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">No offers yet</h3>
            <p className="text-gray-500 max-w-sm">
              When buyers make offers on your items, they will appear here for you to review.
            </p>
          </div>
        ) : (
          offers.map((offer) => (
            <motion.div
              key={offer.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white border border-gray-100 rounded-3xl shadow-sm hover:shadow-md transition-shadow overflow-hidden"
            >
              <div className="p-6 flex flex-col md:flex-row items-start md:items-center gap-6">
                {/* Product Info */}
                <div className="flex items-center gap-4 flex-1">
                  <div className="w-20 h-20 rounded-2xl overflow-hidden border border-gray-100 flex-shrink-0 relative group">
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
                    <h3 className="font-bold text-gray-900 truncate text-lg">{offer.product.title}</h3>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-sm font-medium text-gray-400">Listed for:</span>
                      <span className="text-sm font-bold text-gray-600">£{offer.product.price}</span>
                    </div>
                  </div>
                </div>

                {/* Offer Price */}
                <div className="flex flex-col md:items-center md:px-8 border-l border-r border-gray-50">
                  <span className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Offer Price</span>
                  <p className="text-3xl font-black text-blue-600">£{offer.price}</p>
                </div>

                {/* Buyer Info */}
                <div className="flex items-center gap-3 md:px-4">
                  <div className="w-10 h-10 rounded-full bg-gray-100 overflow-hidden flex items-center justify-center border border-gray-200">
                    {offer.buyer.image ? (
                      <Image src={offer.buyer.image} alt={offer.buyer.name} width={40} height={40} className="object-cover" />
                    ) : (
                      <User size={20} className="text-gray-400" />
                    )}
                  </div>
                  <div>
                    <p className="text-sm font-bold text-gray-900">{offer.buyer.name}</p>
                    <span className="text-[10px] text-gray-400 font-bold uppercase tracking-tight flex items-center gap-1">
                      <Clock size={10} /> {new Date(offer.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>

                {/* Status or Actions */}
                <div className="flex-shrink-0 w-full md:w-auto">
                  {offer.status === "PENDING" ? (
                    <div className="flex gap-2 w-full">
                      <button
                        onClick={() => handleUpdateStatus(offer.id, "ACCEPTED")}
                        disabled={actionLoading === offer.id}
                        className="flex-1 md:flex-none flex items-center justify-center gap-2 px-5 py-3 bg-green-600 text-white rounded-2xl font-bold text-sm hover:bg-green-700 transition-colors shadow-lg shadow-green-200 disabled:opacity-50"
                      >
                        {actionLoading === offer.id ? <Loader2 size={16} className="animate-spin" /> : <><CheckCircle size={16} /> Accept</>}
                      </button>
                      <button
                        onClick={() => handleUpdateStatus(offer.id, "DECLINED")}
                        disabled={actionLoading === offer.id}
                        className="flex-1 md:flex-none flex items-center justify-center gap-2 px-5 py-3 bg-white border-2 border-red-100 text-red-600 rounded-2xl font-bold text-sm hover:bg-red-50 transition-colors disabled:opacity-50"
                      >
                        {actionLoading === offer.id ? <Loader2 size={16} className="animate-spin" /> : <><XCircle size={16} /> Decline</>}
                      </button>
                    </div>
                  ) : (
                    <div className={`px-4 py-2 rounded-xl border-2 font-bold text-sm flex items-center gap-2 ${statusColors[offer.status]}`}>
                      {offer.status === "ACCEPTED" ? <CheckCircle size={16} /> : <XCircle size={16} />}
                      {offer.status}
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
}
