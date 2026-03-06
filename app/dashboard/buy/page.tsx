"use client";

import Link from "next/link";
import { ShoppingBag, Heart, DollarSign, Package, Clock, CheckCircle, AlertCircle, Loader2, MessageSquare } from "lucide-react";
import { useSession } from "next-auth/react";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface OrderData {
  id: string;
  orderNumber: string;
  productTitle: string;
  sellerName?: string;
  buyerName?: string;
  amount: number;
  status: string;
}

export default function BuyerDashboard() {
  const { data: session } = useSession();
  const [activeTab, setActiveTab] = useState<"purchases" | "sales">("purchases");
  const [isLoading, setIsLoading] = useState(true);
  const [stats, setStats] = useState({
    activeOrders: 0,
    savedItems: 0,
    totalSpent: 0
  });
  const [myPurchases, setMyPurchases] = useState<OrderData[]>([]);
  const [ordersFromOthers, setOrdersFromOthers] = useState<OrderData[]>([]);

  useEffect(() => {
    async function fetchDashboardData() {
      try {
        const res = await fetch('/api/dashboard/buy');
        if (!res.ok) throw new Error('Failed to fetch data');
        const data = await res.json();
        
        setStats(data.stats);
        setMyPurchases(data.myPurchases);
        setOrdersFromOthers(data.ordersFromOthers);
      } catch (error) {
        console.error("Error fetching buyer dashboard data:", error);
      } finally {
        setIsLoading(false);
      }
    }

    if (session?.user) {
      fetchDashboardData();
    }
  }, [session]);

  const statsDisplay = [
    {
      label: "Active Orders",
      value: stats.activeOrders.toString(),
      icon: ShoppingBag,
      color: "bg-blue-100 text-blue-600",
    },
    {
      label: "Saved Items",
      value: stats.savedItems.toString(),
      icon: Heart,
      color: "bg-red-100 text-red-600",
    },
    {
      label: "Total Spent",
      value: `£${stats.totalSpent.toLocaleString()}`,
      icon: DollarSign,
      color: "bg-green-100 text-green-600",
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "PENDING":
        return "bg-yellow-100 text-yellow-800";
      case "IN TRANSIT":
        return "bg-blue-100 text-blue-800";
      case "COMPLETED":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "PENDING":
        return <Clock size={16} />;
      case "IN TRANSIT":
        return <AlertCircle size={16} />;
      case "COMPLETED":
        return <CheckCircle size={16} />;
      default:
        return <Package size={16} />;
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-gray-100 to-gray-200 relative overflow-hidden pb-20">
      
      {/* Animated Subtle Background Orbs */}
      <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-primary/20 rounded-full mix-blend-multiply filter blur-[100px] opacity-70 animate-blob pointer-events-none"></div>
      <div className="absolute top-[20%] right-[-5%] w-96 h-96 bg-purple-300/30 rounded-full mix-blend-multiply filter blur-[100px] opacity-70 animate-blob animation-delay-2000 pointer-events-none"></div>
      <div className="absolute bottom-[-10%] left-[20%] w-96 h-96 bg-blue-300/30 rounded-full mix-blend-multiply filter blur-[100px] opacity-50 animate-blob animation-delay-4000 pointer-events-none"></div>

      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="max-w-7xl mx-auto px-4 pt-12 relative z-10"
      >
        <motion.div variants={itemVariants} className="mb-12">
          <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight">
            {session?.user?.name ? `${session.user.name.split(" ")[0]} Dashboard` : "Buyer Dashboard"}
          </h1>
          <p className="text-gray-500 mt-2 font-medium">Welcome back, {session?.user?.name || "Buyer"}</p>
        </motion.div>

        <motion.div variants={itemVariants} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {statsDisplay.map((stat) => {
            const Icon = stat.icon;
            return (
              <motion.div 
                key={stat.label} 
                whileHover={{ y: -5, scale: 1.02 }}
                transition={{ type: "spring", stiffness: 300 }}
                className="bg-white/70 backdrop-blur-xl border border-white/50 rounded-2xl shadow-xl hover:shadow-2xl transition-all p-6 relative overflow-hidden group"
              >
                <div className={`absolute -right-6 -top-6 w-24 h-24 ${stat.color.split(' ')[0]} rounded-full opacity-10 blur-2xl group-hover:opacity-30 transition-opacity`}></div>
                
                <div className={`w-12 h-12 rounded-xl ${stat.color} flex items-center justify-center mb-4 shadow-sm group-hover:scale-110 transition-transform`}>
                  <Icon size={24} />
                </div>
                <p className="text-gray-500 font-medium text-sm mb-1">{stat.label}</p>
                {isLoading ? (
                  <div className="h-9 w-24 bg-gray-200 animate-pulse rounded-md mt-1"></div>
                ) : (
                  <p className="text-3xl font-bold text-gray-900 tracking-tight">{stat.value}</p>
                )}
              </motion.div>
            );
          })}
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <motion.div variants={itemVariants} className="lg:col-span-2 space-y-6">
            
            {/* Tabs Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-2">
              <h2 className="text-2xl font-bold text-gray-900 tracking-tight">Order Management</h2>
              
              <div className="bg-white/50 backdrop-blur-md border border-gray-200 p-1 rounded-xl inline-flex shadow-sm">
                <button
                  onClick={() => setActiveTab("purchases")}
                  className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                    activeTab === "purchases" 
                      ? "bg-white text-primary shadow-md" 
                      : "text-gray-500 hover:text-gray-700"
                  }`}
                >
                  My Purchases
                </button>
                <button
                  onClick={() => setActiveTab("sales")}
                  className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                    activeTab === "sales" 
                      ? "bg-white text-primary shadow-md" 
                      : "text-gray-500 hover:text-gray-700"
                  }`}
                >
                  Orders from Others
                </button>
              </div>
            </div>
            
            {/* Tab Content Panes */}
            <div className="bg-white/70 backdrop-blur-xl border border-white/50 rounded-3xl shadow-xl overflow-hidden min-h-[300px] relative">
              {isLoading ? (
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-white/50 backdrop-blur-sm z-10">
                  <Loader2 className="w-10 h-10 text-primary animate-spin mb-4" />
                  <p className="text-gray-500 font-medium">Loading orders...</p>
                </div>
              ) : null}
              
              <AnimatePresence mode="wait">
                
                {/* MY PURCHASES TAB */}
                {activeTab === "purchases" && (
                  <motion.div
                    key="purchases"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    transition={{ duration: 0.3 }}
                    className="divide-y divide-gray-100"
                  >
                    {myPurchases.length === 0 ? (
                      <div className="p-8 text-center text-gray-500">You haven&apos;t purchased anything yet.</div>
                    ) : (
                      myPurchases.map((order) => (
                        <div key={order.id} className="p-6 hover:bg-gray-50/50 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-4 group">
                          <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:bg-white group-hover:shadow-md transition-all">
                              <ShoppingBag className="w-6 h-6 text-blue-500" />
                            </div>
                            <div>
                              <p className="font-bold text-gray-900 group-hover:text-primary transition-colors">{order.productTitle}</p>
                              <div className="flex items-center gap-2 text-sm text-gray-500 mt-1">
                                <span className="font-semibold text-gray-700">Order #{order.orderNumber}</span>
                                <span>•</span>
                                <span>Seller: {order.sellerName}</span>
                              </div>
                            </div>
                          </div>
                          <div className="flex flex-row sm:flex-col items-center sm:items-end justify-between sm:justify-center gap-2">
                             <p className="font-bold text-lg text-gray-900">£{order.amount}</p>
                            <span className={`px-3 py-1 rounded-full text-xs font-bold tracking-wide flex items-center gap-1.5 ${getStatusColor(order.status)}`}>
                              {getStatusIcon(order.status)}
                              {order.status}
                            </span>
                          </div>
                        </div>
                      ))
                    )}
                  </motion.div>
                )}

                {/* ORDERS FROM OTHERS TAB */}
                {activeTab === "sales" && (
                  <motion.div
                    key="sales"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    transition={{ duration: 0.3 }}
                    className="divide-y divide-gray-100"
                  >
                    {ordersFromOthers.length === 0 ? (
                      <div className="p-8 text-center text-gray-500">No one has ordered your items yet.</div>
                    ) : (
                      ordersFromOthers.map((order) => (
                        <div key={order.id} className="p-6 hover:bg-gray-50/50 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-4 group">
                          <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-green-50 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:bg-white group-hover:shadow-md transition-all">
                              <Package className="w-6 h-6 text-green-500" />
                            </div>
                            <div>
                              <p className="font-bold text-gray-900 group-hover:text-primary transition-colors">{order.productTitle}</p>
                              <div className="flex items-center gap-2 text-sm text-gray-500 mt-1">
                                <span className="font-semibold text-gray-700">Order #{order.orderNumber}</span>
                                <span>•</span>
                                <span>Buyer: {order.buyerName}</span>
                              </div>
                            </div>
                          </div>
                          <div className="flex flex-row sm:flex-col items-center sm:items-end justify-between sm:justify-center gap-2">
                            <p className="font-bold text-lg text-gray-900">£{order.amount}</p>
                            <span className={`px-3 py-1 rounded-full text-xs font-bold tracking-wide flex items-center gap-1.5 ${getStatusColor(order.status)}`}>
                              {getStatusIcon(order.status)}
                              {order.status}
                            </span>
                          </div>
                        </div>
                      ))
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>

          {/* Quick Links Column */}
          <motion.div variants={itemVariants} className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900 tracking-tight mb-2">Quick Actions</h2>
            
            <div className="bg-white/70 backdrop-blur-xl border border-white/50 rounded-3xl shadow-xl p-6 space-y-3">
              <Link 
                href="/products" 
                className="group flex items-center justify-between p-4 bg-gray-50/50 rounded-2xl hover:bg-white border border-transparent hover:border-gray-200 hover:shadow-lg transition-all"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center text-blue-600 group-hover:scale-110 transition-transform">
                    <ShoppingBag size={20} />
                  </div>
                  <span className="font-semibold text-gray-800">Browse Items</span>
                </div>
                <div className="text-gray-400 group-hover:text-primary transition-colors group-hover:translate-x-1 duration-300">
                  →
                </div>
              </Link>
              
              <Link 
                href="/dashboard/buy/saved" 
                className="group flex items-center justify-between p-4 bg-gray-50/50 rounded-2xl hover:bg-white border border-transparent hover:border-gray-200 hover:shadow-lg transition-all"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-red-100 rounded-xl flex items-center justify-center text-red-600 group-hover:scale-110 transition-transform">
                    <Heart size={20} />
                  </div>
                  <span className="font-semibold text-gray-800">Saved Items</span>
                </div>
                <div className="text-gray-400 group-hover:text-primary transition-colors group-hover:translate-x-1 duration-300">
                  →
                </div>
              </Link>

              <Link 
                href="/dashboard/sell/messages" 
                className="group flex items-center justify-between p-4 bg-gray-50/50 rounded-2xl hover:bg-white border border-transparent hover:border-gray-200 hover:shadow-lg transition-all"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center text-blue-600 group-hover:scale-110 transition-transform">
                    <MessageSquare size={20} />
                  </div>
                  <span className="font-semibold text-gray-800">Messages</span>
                </div>
                <div className="text-gray-400 group-hover:text-primary transition-colors group-hover:translate-x-1 duration-300">
                  →
                </div>
              </Link>

              <Link 
                href="/dashboard/buy/offers" 
                className="group flex items-center justify-between p-4 bg-gray-50/50 rounded-2xl hover:bg-white border border-transparent hover:border-gray-200 hover:shadow-lg transition-all"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-amber-100 rounded-xl flex items-center justify-center text-amber-600 group-hover:scale-110 transition-transform">
                    <DollarSign size={20} />
                  </div>
                  <span className="font-semibold text-gray-800">My Offers</span>
                </div>
                <div className="text-gray-400 group-hover:text-primary transition-colors group-hover:translate-x-1 duration-300">
                  →
                </div>
              </Link>

              <Link 
                href="/dashboard/profile" 
                className="group flex items-center justify-between p-4 bg-gray-50/50 rounded-2xl hover:bg-white border border-transparent hover:border-gray-200 hover:shadow-lg transition-all"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-purple-100 rounded-xl flex items-center justify-center text-purple-600 group-hover:scale-110 transition-transform">
                    <Clock size={20} />
                  </div>
                  <span className="font-semibold text-gray-800">Edit Profile</span>
                </div>
                <div className="text-gray-400 group-hover:text-primary transition-colors group-hover:translate-x-1 duration-300">
                  →
                </div>
              </Link>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}
