"use client";

import Link from "next/link";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { BarChart3, Package, DollarSign, TrendingUp, Clock, CheckCircle, AlertCircle, Loader2, MessageSquare } from "lucide-react";

interface OrderData {
  id: string;
  orderNumber: string;
  productTitle: string;
  buyerName: string;
  amount: number;
  status: string;
}

export default function SellerDashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();
  
  const [isLoading, setIsLoading] = useState(true);
  const [stats, setStats] = useState({
    activeListings: 0,
    totalSales: 0,
    pendingOrders: 0,
    rating: "0.0★"
  });
  const [orders, setOrders] = useState<OrderData[]>([]);

  useEffect(() => {
    if (status === "loading") return;
    
    if (!session) {
      router.push("/signin");
      return;
    }

    const userRole = (session.user as { role?: string })?.role;
    if (userRole === "BUYER") {
      router.push("/dashboard/buy");
    }

    async function fetchDashboardData() {
      try {
        const res = await fetch('/api/dashboard/sell');
        if (!res.ok) throw new Error('Failed to fetch data');
        const data = await res.json();
        
        setStats(data.stats);
        setOrders(data.recentOrders);
      } catch (error) {
        console.error("Error fetching seller dashboard data:", error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchDashboardData();

  }, [session, status, router]);

  const statsDisplay = [
    {
      label: "Active Listings",
      value: stats.activeListings.toString(),
      icon: Package,
      color: "bg-blue-100 text-blue-600",
    },
    {
      label: "Total Sales",
      value: `£${stats.totalSales.toLocaleString()}`,
      icon: DollarSign,
      color: "bg-green-100 text-green-600",
    },
    {
      label: "Pending Orders",
      value: stats.pendingOrders.toString(),
      icon: TrendingUp,
      color: "bg-yellow-100 text-yellow-600",
    },
    {
      label: "Rating",
      value: stats.rating,
      icon: BarChart3,
      color: "bg-purple-100 text-purple-600",
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "PENDING":
        return "bg-yellow-100 text-yellow-800";
      case "CONFIRMED":
        return "bg-blue-100 text-blue-800";
      case "COMPLETED":
        return "bg-green-100 text-green-800";
      case "CANCELLED":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "PENDING":
        return <Clock size={16} />;
      case "CONFIRMED":
        return <AlertCircle size={16} />;
      case "COMPLETED":
        return <CheckCircle size={16} />;
      default:
        return null;
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
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
        <motion.div variants={itemVariants} className="flex justify-between items-end mb-12">
          <div>
            <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight">
              {session?.user?.name ? `${session.user.name.split(" ")[0]} Dashboard` : "Seller Dashboard"}
            </h1>
            <p className="text-gray-500 mt-2 font-medium">Welcome back, {session?.user?.name || "Seller"}</p>
          </div>
          <Link
            href="/dashboard/sell/listings/new"
            className="hidden sm:flex bg-primary hover:bg-primary-hover text-white px-6 py-3 rounded-xl shadow-lg hover:shadow-primary/30 font-semibold transition-all items-center gap-2 transform hover:-translate-y-0.5"
          >
            + List New Item
          </Link>
        </motion.div>

        <motion.div variants={itemVariants} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
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
            <div className="flex justify-between items-center mb-2">
              <h2 className="text-2xl font-bold text-gray-900 tracking-tight">Recent Activity</h2>
              <Link href="/dashboard/seller/orders" className="text-primary hover:text-primary-hover font-semibold text-sm transition-colors">
                View all
              </Link>
            </div>
            
            <div className="bg-white/70 backdrop-blur-xl border border-white/50 rounded-3xl shadow-xl overflow-hidden min-h-[200px] relative">
              {isLoading ? (
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-white/50 backdrop-blur-sm z-10">
                  <Loader2 className="w-10 h-10 text-primary animate-spin mb-4" />
                  <p className="text-gray-500 font-medium">Loading activity...</p>
                </div>
              ) : null}
              <div className="divide-y divide-gray-100">
                {orders.length === 0 && !isLoading ? (
                  <div className="p-8 text-center text-gray-500">No recent activity found.</div>
                ) : (
                  orders.map((order, idx) => (
                  <motion.div 
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 * idx }}
                    key={order.id} 
                    className="p-6 hover:bg-gray-50/50 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-4 group"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:bg-white group-hover:shadow-md transition-all">
                        <Package className="w-6 h-6 text-gray-500" />
                      </div>
                      <div>
                        <p className="font-bold text-gray-900 group-hover:text-primary transition-colors">{order.productTitle}</p>
                        <div className="flex items-center gap-2 text-sm text-gray-500 mt-1">
                          <span className="font-semibold text-gray-700">Order #{order.orderNumber}</span>
                          <span>•</span>
                          <span>{order.buyerName}</span>
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
                  </motion.div>
                  ))
                )}
              </div>
            </div>
          </motion.div>

          <motion.div variants={itemVariants} className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900 tracking-tight mb-2">Quick Actions</h2>
            
            <div className="bg-white/70 backdrop-blur-xl border border-white/50 rounded-3xl shadow-xl p-6 space-y-3">
              <Link 
                href="/dashboard/sell/listings" 
                className="group flex items-center justify-between p-4 bg-gray-50/50 rounded-2xl hover:bg-white border border-transparent hover:border-gray-200 hover:shadow-lg transition-all"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center text-blue-600 group-hover:scale-110 transition-transform">
                    <Package size={20} />
                  </div>
                  <span className="font-semibold text-gray-800">Manage Listings</span>
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
                href="/dashboard/sell/offers" 
                className="group flex items-center justify-between p-4 bg-gray-50/50 rounded-2xl hover:bg-white border border-transparent hover:border-gray-200 hover:shadow-lg transition-all"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-amber-100 rounded-xl flex items-center justify-center text-amber-600 group-hover:scale-110 transition-transform">
                    <DollarSign size={20} />
                  </div>
                  <span className="font-semibold text-gray-800">Received Offers</span>
                </div>
                <div className="text-gray-400 group-hover:text-primary transition-colors group-hover:translate-x-1 duration-300">
                  →
                </div>
              </Link>
              
              <Link 
                href="/dashboard/sell/orders" 
                className="group flex items-center justify-between p-4 bg-gray-50/50 rounded-2xl hover:bg-white border border-transparent hover:border-gray-200 hover:shadow-lg transition-all"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center text-green-600 group-hover:scale-110 transition-transform">
                    <TrendingUp size={20} />
                  </div>
                  <span className="font-semibold text-gray-800">View Orders</span>
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
            
            {/* Mobile Fab Button for easy listing on small screens */}
            <Link
              href="/dashboard/sell/listings/new"
              className="sm:hidden flex items-center justify-center gap-2 w-full bg-primary hover:bg-primary-hover text-white py-4 rounded-2xl shadow-xl font-bold"
            >
              <Package size={20} /> List New Item
            </Link>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}
