"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence, Variants } from "framer-motion";
import { Edit2, Trash2, Eye, Plus, Search, Filter, PackageOpen, Tag, MapPin, Grid, List as ListIcon } from "lucide-react";

// Types
type ProductStatus = "ACTIVE" | "SOLD" | "DRAFT";

interface Listing {
  id: string;
  title: string;
  price: number;
  status: ProductStatus;
  views: number;
  createdAt: string;
  category: string;
  location: string;
  image: string;
}

// Removed MOCK_LISTINGS in favor of real data

// Animation variants
const containerVariants: Variants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } },
};

const statusConfig: Record<ProductStatus, { color: string; bg: string; label: string }> = {
  ACTIVE: { color: "text-emerald-700", bg: "bg-emerald-100/80 backdrop-blur-sm", label: "Active" },
  SOLD: { color: "text-gray-600", bg: "bg-gray-200/80 backdrop-blur-sm", label: "Sold" },
  DRAFT: { color: "text-amber-700", bg: "bg-amber-100/80 backdrop-blur-sm", label: "Draft" },
};

export default function SellerListingsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<ProductStatus | "ALL">("ALL");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  const [listings, setListings] = useState<Listing[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchListings() {
      try {
        const response = await fetch("/api/dashboard/sell/listings", { cache: "no-store" });
        if (response.ok) {
          const data = await response.json();
          setListings(data);
        }
      } catch (error) {
        console.error("Failed to fetch listings", error);
      } finally {
        setIsLoading(false);
      }
    }
    fetchListings();
  }, []);

  const filteredListings = listings.filter((listing) => {
    const matchesSearch = listing.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "ALL" || listing.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleDelete = async (id: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!confirm("Are you sure you want to delete this listing?")) return;
    
    try {
      const response = await fetch(`/api/products/${id}`, { method: "DELETE" });
      if (response.ok) {
        setListings((prev) => prev.filter((listing) => listing.id !== id));
      } else {
        alert("Failed to delete listing");
      }
    } catch (error) {
      console.error("Error deleting listing", error);
      alert("An error occurred while deleting the listing");
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      
      {/* Header Section */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-10"
      >
        <div>
          <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-600">
            My Product Listing
          </h1>
          <p className="text-gray-500 mt-1">Manage, edit, and track your active listings.</p>
        </div>
        
        <Link href="/dashboard/sell/listings/new">
          <motion.button 
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="flex items-center gap-2 bg-primary hover:bg-primary-hover text-white px-6 py-2.5 rounded-xl font-medium shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer"
          >
            <Plus size={18} />
            <span>Create Listing</span>
          </motion.button>
        </Link>
      </motion.div>

      {/* Toolbar Section */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.1 }}
        className="bg-white/60 backdrop-blur-xl border border-gray-100 p-4 rounded-2xl shadow-sm flex flex-col md:flex-row gap-4 mb-8 sticky top-20 z-10"
      >
        <div className="relative flex-grow">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input
            type="text"
            placeholder="Search listings by title..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-gray-50/50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-sm"
          />
        </div>

        <div className="flex items-center gap-3">
          <div className="relative shrink-0">
            <Filter className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as ProductStatus | "ALL")}
              className="pl-9 pr-8 py-2.5 bg-gray-50/50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary appearance-none text-sm font-medium text-gray-700 cursor-pointer min-w-[140px]"
            >
              <option value="ALL">All Status</option>
              <option value="ACTIVE">Active</option>
              <option value="DRAFT">Drafts</option>
              <option value="SOLD">Sold</option>
            </select>
          </div>

          <div className="flex bg-gray-100 p-1 rounded-xl shrink-0">
            <button
              onClick={() => setViewMode("grid")}
              className={`p-1.5 rounded-lg transition-colors cursor-pointer ${viewMode === "grid" ? "bg-white shadow-sm text-primary" : "text-gray-500 hover:text-gray-700"}`}
            >
              <Grid size={18} />
            </button>
            <button
              onClick={() => setViewMode("list")}
              className={`p-1.5 rounded-lg transition-colors cursor-pointer ${viewMode === "list" ? "bg-white shadow-sm text-primary" : "text-gray-500 hover:text-gray-700"}`}
            >
              <ListIcon size={18} />
            </button>
          </div>
        </div>
      </motion.div>

      {/* Listings Display */}
      <AnimatePresence mode="wait">
        {isLoading ? (
          <motion.div
            key="loading"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex flex-col items-center justify-center py-20 bg-white/40 backdrop-blur-md rounded-2xl border border-dashed border-gray-200 mt-4"
          >
            <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mb-4"></div>
            <p className="text-gray-500 font-medium tracking-wide">Fetching Product Listings...</p>
          </motion.div>
        ) : filteredListings.length === 0 ? (
          <motion.div
            key="empty"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="flex flex-col items-center justify-center py-20 bg-white/40 backdrop-blur-md rounded-2xl border border-dashed border-gray-200 mt-4"
          >
            <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mb-6">
              <PackageOpen size={32} className="text-primary" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No listings found</h3>
            <p className="text-gray-500 text-center max-w-md mb-8">
              {searchQuery ? "We couldn't find any listings matching your search criteria. Try adjusting your filters." : "You haven't created any listings yet. Start selling your items today!"}
            </p>
            {!searchQuery && (
              <Link href="/dashboard/sell/listings/new" className="cursor-pointer">
                <button className="bg-primary text-white px-6 py-2.5 rounded-xl font-medium hover:bg-primary-hover transition-colors shadow-sm cursor-pointer">
                  Create Your First Listing
                </button>
              </Link>
            )}
          </motion.div>
        ) : viewMode === "grid" ? (
          <motion.div
            key="grid"
            variants={containerVariants}
            initial="hidden"
            animate="show"
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-4"
          >
            {filteredListings.map((listing) => (
              <motion.div
                key={listing.id}
                variants={itemVariants}
                className="group bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-xl hover:border-gray-200 transition-all duration-300 flex flex-col"
              >
                {/* Image Container */}
                <div className="relative aspect-[4/3] bg-gray-100 overflow-hidden">
                  <Image 
                    src={listing.image} 
                    alt={listing.title} 
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  {/* Status Badge */}
                  <div className={`absolute top-3 left-3 px-3 py-1 rounded-full text-xs font-bold tracking-wide uppercase shadow-sm ${statusConfig[listing.status].bg} ${statusConfig[listing.status].color}`}>
                    {statusConfig[listing.status].label}
                  </div>
                  
                  {/* Action Icons (Permanent) */}
                  <div className="absolute top-3 right-3 flex items-center justify-end gap-2">
                     <Link href={`/dashboard/sell/listings/${listing.id}`} className="cursor-pointer">
                      <button className="p-2 bg-white/90 backdrop-blur-sm hover:bg-white hover:text-gray-900 text-gray-700 rounded-full shadow-sm hover:shadow-md transition-all hover:scale-105 cursor-pointer">
                        <Eye size={16} />
                      </button>
                    </Link>
                    <Link href={`/dashboard/sell/listings/${listing.id}/edit`} className="cursor-pointer">
                      <button className="p-2 bg-white/90 backdrop-blur-sm hover:bg-white hover:text-blue-700 text-blue-600 rounded-full shadow-sm hover:shadow-md transition-all hover:scale-105 cursor-pointer">
                        <Edit2 size={16} />
                      </button>
                    </Link>
                    <button onClick={(e) => handleDelete(listing.id, e)} className="p-2 bg-white/90 backdrop-blur-sm hover:bg-white hover:text-red-700 text-red-500 rounded-full shadow-sm hover:shadow-md transition-all hover:scale-105 cursor-pointer">
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>

                {/* Content */}
                <div className="p-5 flex flex-col flex-grow">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-bold text-gray-900 text-lg line-clamp-1 group-hover:text-primary transition-colors">{listing.title}</h3>
                    <span className="font-bold text-lg text-primary shrink-0 ml-2">£{listing.price.toLocaleString()}</span>
                  </div>
                  
                  <div className="flex flex-wrap items-center gap-y-2 gap-x-4 text-xs text-gray-500 mt-auto pt-4">
                    <span className="flex items-center gap-1.5 bg-gray-50 px-2 py-1 rounded-md">
                      <Tag size={12} className="text-gray-400" />
                      {listing.category}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <MapPin size={12} className="text-gray-400" />
                      {listing.location}
                    </span>
                    <span className="flex items-center gap-1.5 ml-auto">
                      <Eye size={12} className="text-gray-400" />
                      {listing.views} views
                    </span>
                  </div>
                </div>
                
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <motion.div
            key="list"
            variants={containerVariants}
            initial="hidden"
            animate="show"
            className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden mt-4"
          >
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50/80 border-b border-gray-100">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Product</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Price</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Performance</th>
                    <th className="px-6 py-4 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {filteredListings.map((listing) => (
                    <motion.tr 
                      variants={itemVariants}
                      key={listing.id} 
                      className="hover:bg-gray-50/50 transition-colors group"
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-4">
                          <Image src={listing.image} alt={listing.title} width={48} height={48} className="rounded-lg object-cover shadow-sm shrink-0" />
                          <div>
                            <div className="text-sm font-semibold text-gray-900 group-hover:text-primary transition-colors">{listing.title}</div>
                            <div className="text-xs text-gray-500 flex items-center gap-1 mt-0.5"><Tag size={10}/>{listing.category}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-3 py-1 rounded-full text-xs font-bold tracking-wide uppercase shadow-sm ${statusConfig[listing.status].bg} ${statusConfig[listing.status].color}`}>
                          {statusConfig[listing.status].label}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-bold text-gray-900">£{listing.price.toLocaleString()}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center text-sm text-gray-600 gap-2 font-medium">
                          <Eye size={14} className="text-gray-400" />
                          {listing.views} views
                        </div>
                        <div className="text-xs text-gray-400 mt-1">Listed {listing.createdAt}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex items-center justify-end gap-2">
                           <Link href={`/dashboard/sell/listings/${listing.id}`} className="cursor-pointer">
                            <button className="p-2 text-gray-500 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors cursor-pointer"><Eye size={16} /></button>
                           </Link>
                           <Link href={`/dashboard/sell/listings/${listing.id}/edit`} className="cursor-pointer">
                            <button className="p-2 text-blue-500 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-colors cursor-pointer"><Edit2 size={16} /></button>
                           </Link>
                          <button onClick={(e) => handleDelete(listing.id, e)} className="p-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"><Trash2 size={16} /></button>
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
