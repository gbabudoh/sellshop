"use client";

import { motion } from "framer-motion";
import ArticleCard from "../common/ArticleCard";

const artPosts = [
  {
    title: "Finding Balance in Creativity and Life",
    image: "https://images.unsplash.com/photo-1518199266791-5375a83190b7?w=600&auto=format&fit=crop&q=80",
    author: {
      name: "Thomas Fischer",
      image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&auto=format&fit=crop&q=80",
    },
    date: "Jan 12, 2025",
    readTime: "2 min read",
    categories: ["Mindfulness", "Nature"],
    commentsCount: 5,
  },
  {
    title: "Cultivaring a Mindset for Creativity",
    image: "https://images.unsplash.com/photo-1515378791036-0648a3ef77b2?w=600&auto=format&fit=crop&q=80",
    author: {
      name: "Carlos Ramirez",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80",
    },
    date: "Jan 11, 2025",
    readTime: "4 min read",
    categories: ["Inspiration", "Collaboration"],
    commentsCount: 12,
  },
  {
    title: "The Art of Daily Reflection",
    image: "https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=600&auto=format&fit=crop&q=80",
    author: {
      name: "Kateryna Ivanova",
      image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&auto=format&fit=crop&q=80",
    },
    date: "Jan 10, 2025",
    readTime: "3 min read",
    categories: ["Mindfulness", "Personal Growth"],
    commentsCount: 18,
  },
  {
    title: "The Art of Balancing Life's Responsibilities",
    image: "https://images.unsplash.com/photo-1488190211105-8b0e65b80b4e?w=600&auto=format&fit=crop&q=80",
    author: {
      name: "Luca Moretti",
      image: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=100&auto=format&fit=crop&q=80",
    },
    date: "Jan 09, 2025",
    readTime: "5 min read",
    categories: ["Mindfulness", "Inspiration"],
    commentsCount: 7,
  }
];

export default function CategorySection({ title }: { title: string }) {
  return (
    <section className="py-20 bg-[#0a0a0a] text-white">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex items-center justify-between mb-12">
           <h2 className="text-5xl md:text-7xl font-bold tracking-tight">{title}</h2>
           <button className="text-sm font-semibold border-b-2 border-white/30 hover:border-white transition-colors pb-1">
             View All
           </button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {artPosts.map((post, index) => (
             <ArticleCard key={index} {...post} />
          ))}
        </div>
      </div>
    </section>
  );
}
