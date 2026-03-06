"use client";

import Image from "next/image";
import Link from "next/link";
import { MessageSquare, Clock } from "lucide-react";
import { motion } from "framer-motion";

interface ArticleCardProps {
  title: string;
  excerpt?: string;
  image: string;
  author: {
    name: string;
    image: string;
  };
  date: string;
  readTime: string;
  categories: string[];
  commentsCount: number;
  variant?: "featured" | "small" | "grid" | "horizontal";
}

export default function ArticleCard({
  title,
  excerpt,
  image,
  author,
  date,
  readTime,
  categories,
  commentsCount,
  variant = "grid",
}: ArticleCardProps) {
  if (variant === "featured") {
    return (
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="group relative h-[600px] rounded-3xl overflow-hidden cursor-pointer"
      >
        <Image 
          src={image} 
          alt={title} 
          fill 
          className="object-cover transition-transform duration-700 group-hover:scale-105"
          unoptimized
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
        <div className="absolute bottom-0 left-0 p-8 md:p-12 w-full">
          <div className="flex flex-wrap gap-2 mb-4">
            {categories.map(cat => (
              <span key={cat} className="text-xs font-bold uppercase tracking-wider text-white/90 bg-white/20 backdrop-blur-md px-3 py-1 rounded-full border border-white/30">
                {cat}
              </span>
            ))}
          </div>
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-6 leading-tight group-hover:text-blue-300 transition-colors">
            {title}
          </h2>
          {excerpt && <p className="text-white/70 text-lg mb-8 max-w-2xl line-clamp-2">{excerpt}</p>}
          <div className="flex items-center gap-4 border-t border-white/20 pt-6">
            <div className="w-10 h-10 rounded-full overflow-hidden border border-white/30">
              <Image src={author.image} alt={author.name} width={40} height={40} className="object-cover" unoptimized />
            </div>
            <div className="text-white">
              <p className="text-sm font-semibold">{author.name}</p>
              <p className="text-xs text-white/60">{date} — {readTime}</p>
            </div>
          </div>
        </div>
      </motion.div>
    );
  }

  if (variant === "small") {
    return (
      <motion.div 
        initial={{ opacity: 0, x: 20 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true }}
        className="group flex gap-4 cursor-pointer p-4 rounded-2xl hover:bg-muted transition-colors"
      >
        <div className="relative w-24 h-24 rounded-xl overflow-hidden flex-shrink-0">
          <Image 
            src={image} 
            alt={title} 
            fill 
            className="object-cover transition-transform duration-500 group-hover:scale-110"
            unoptimized
          />
        </div>
        <div className="flex flex-col justify-center gap-2">
          <div className="flex gap-2">
            {categories.map(cat => (
              <span key={cat} className="text-[10px] font-bold uppercase tracking-widest text-blue-600">
                {cat}
              </span>
            ))}
          </div>
          <h3 className="font-bold text-foreground group-hover:text-blue-600 transition-colors line-clamp-2 leading-snug">
            {title}
          </h3>
          <div className="flex items-center gap-3 mt-1">
             <div className="w-6 h-6 rounded-full overflow-hidden">
               <Image src={author.image} alt={author.name} width={24} height={24} className="object-cover" unoptimized />
             </div>
             <div className="text-[11px] text-muted-foreground">
               <span className="font-semibold text-foreground">{author.name}</span>
               <span className="mx-1">•</span>
               <span>{date}</span>
             </div>
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="group flex flex-col cursor-pointer"
    >
      <div className="relative aspect-[4/3] rounded-2xl overflow-hidden mb-5">
        <Image 
          src={image} 
          alt={title} 
          fill 
          className="object-cover transition-transform duration-700 group-hover:scale-105"
          unoptimized
        />
        <div className="absolute top-4 left-4 opacity-0 group-hover:opacity-100 transition-opacity">
           <div className="bg-white/90 backdrop-blur px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest shadow-sm">
             Quick Read
           </div>
        </div>
      </div>
      <div className="flex flex-col gap-3">
        <h3 className="text-xl font-bold text-foreground group-hover:text-blue-600 transition-colors leading-tight">
          {title}
        </h3>
        {excerpt && <p className="text-muted-foreground text-sm line-clamp-2 leading-relaxed">{excerpt}</p>}
        <div className="flex flex-wrap gap-2 mt-1">
          {categories.slice(0, 2).map(cat => (
            <span key={cat} className="text-[10px] font-bold uppercase tracking-widest text-blue-600 bg-blue-50 px-2 py-0.5 rounded">
              {cat}
            </span>
          ))}
          <span className="flex items-center gap-1 text-[10px] text-muted-foreground ml-auto">
            <MessageSquare size={12} /> {commentsCount}
          </span>
        </div>
        <div className="flex items-center gap-3 pt-4 border-t border-border/50">
           <div className="w-8 h-8 rounded-full overflow-hidden">
             <Image src={author.image} alt={author.name} width={32} height={32} className="object-cover" unoptimized />
           </div>
           <div className="flex flex-col">
             <span className="text-xs font-semibold text-foreground">{author.name}</span>
             <span className="text-[10px] text-muted-foreground">{date} — {readTime}</span>
           </div>
        </div>
      </div>
    </motion.div>
  );
}
