"use client";

import { motion } from "framer-motion";
import { Heart, MapPin, Star, ArrowRight } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import Image from "next/image";

interface ProductCardProps {
  id: string;
  title: string;
  price: number;
  condition: string;
  address: string;
  slug?: string;
  image: string;
  isNegotiable: boolean;
  category: string;
  seller: {
    name: string | null;
    rating: number | null;
    reviewCount: number;
  };
}

export function ProductCard({
  id,
  title,
  price,
  condition,
  address,
  slug,
  image,
  isNegotiable,
  category,
  seller,
}: ProductCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [isLiked, setIsLiked] = useState(false);

  return (
    <Link href={`/products/${slug || id}`}>
      <motion.div
  initial={{ opacity: 0, scale: 0.95 }}
  animate={{ opacity: 1, scale: 1 }}
  whileHover={{ y: -8 }}
  transition={{ duration: 0.3 }}
  onMouseEnter={() => setIsHovered(true)}
  onMouseLeave={() => setIsHovered(false)}
  className="bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden group h-full flex flex-col relative border border-gray-100"
>
  {/* Image Container with Overlay */}
  <div className="relative w-full aspect-[4/3] overflow-hidden bg-gray-100">
    <motion.div
      className="w-full h-full"
      style={{ scale: isHovered ? 1.1 : 1 }}
      transition={{ duration: 0.7, ease: "easeOut" }}
    >
      <Image
        src={image}
        alt={title}
        fill
        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        className="object-cover"
      />
    </motion.div>
    
    {/* Badges Container */}
    <div className="absolute top-3 left-3 flex flex-col gap-2 z-10">
      {/* Category Badge */}
      <div className="bg-white/70 backdrop-blur-md px-3 py-1 rounded-full text-[10px] font-bold text-primary shadow-sm border border-white/50 uppercase tracking-widest w-fit">
        {category}
      </div>

      {/* Condition Badge (Only show if new or like new) */}
      {(condition === "New" || condition === "Used - Like New") && (
        <div className="bg-blue-600/80 backdrop-blur-md text-white px-3 py-1 rounded-full text-[10px] font-bold shadow-sm uppercase tracking-widest border border-blue-400/30 w-fit">
          {condition === "New" ? "Brand New" : "Like New"}
        </div>
      )}
    </div>

    {/* Interactive Overlay Actions */}
    <div className={`absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-between p-4`}>
       <button className="bg-white text-gray-900 px-5 py-2.5 rounded-full font-bold text-xs flex items-center gap-2 hover:bg-primary hover:text-white transition-all shadow-xl transform translate-y-4 group-hover:translate-y-0 duration-300 cursor-pointer">
          View Details <ArrowRight size={14} />
       </button>
    </div>

    {/* Like Button */}
    <button
      onClick={(e) => {
        e.preventDefault();
        setIsLiked(!isLiked);
      }}
      className="absolute top-3 right-3 p-2.5 bg-white/70 backdrop-blur-md rounded-full shadow-lg hover:bg-white transition-all active:scale-90 z-20 cursor-pointer border border-white/50"
    >
      <Heart
        size={18}
        className={`transition-colors ${isLiked ? "fill-red-500 text-red-500" : "text-gray-600 hover:text-red-500"}`}
      />
    </button>
  </div>

  {/* Content Section */}
  <div className="p-5 flex-1 flex flex-col">
    <div className="flex justify-between items-start mb-2">
      <h3 className="font-bold text-gray-900 text-lg leading-tight line-clamp-2 group-hover:text-blue-600 transition-colors">
        {title}
      </h3>
      <div className="flex flex-col items-end">
         <span className="text-xl font-extrabold text-blue-600">£{price.toLocaleString()}</span>
         {isNegotiable && <span className="text-[10px] text-green-600 font-bold uppercase tracking-wide bg-green-50 px-1.5 py-0.5 rounded">Negotiable</span>}
      </div>
    </div>

    <div className="flex items-center gap-1 text-gray-500 text-sm mb-4">
      <MapPin size={14} className="text-gray-400" />
      <span className="truncate max-w-[150px]">{address}</span>
      <span className="mx-1">•</span>
      <span className="text-gray-400 text-xs">{condition.replace(/_/g, " ")}</span>
    </div>

    {/* Seller Info & Actions - Footer */}
    <div className="mt-auto pt-4 border-t border-gray-100 flex items-center justify-between">
      <div className="flex items-center gap-2.5">
        <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-blue-100 to-indigo-100 flex items-center justify-center text-blue-600 font-bold text-xs ring-2 ring-white shadow-sm">
          {seller.name?.charAt(0).toUpperCase() || "U"}
        </div>
        <div className="flex flex-col">
          <span className="text-xs font-semibold text-gray-900 leading-none mb-0.5">
            {seller.name || "Seller"}
          </span>
          <div className="flex items-center gap-0.5">
            <Star size={10} className="fill-amber-400 text-amber-400" />
            <span className="text-[10px] font-medium text-gray-500">{seller.rating?.toFixed(1) || "5.0"} ({seller.reviewCount})</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</motion.div>
    </Link>
  );
}
