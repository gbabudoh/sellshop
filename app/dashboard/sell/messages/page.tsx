"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { motion } from "framer-motion";
import { MessageSquare, Search, Clock, ChevronRight, Loader2, User } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

interface Conversation {
  id: string;
  productId: string;
  product: {
    title: string;
    images: string[];
  };
  participant1: {
    id: string;
    name: string;
    image: string | null;
  };
  participant2: {
    id: string;
    name: string;
    image: string | null;
  };
  messages: {
    content: string;
    createdAt: string;
  }[];
  lastMessageAt: string;
}

export default function MessagesPage() {
  const { data: session } = useSession();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    async function fetchConversations() {
      try {
        const res = await fetch("/api/messages/conversations");
        if (res.ok) {
          const data = await res.json();
          setConversations(data);
        }
      } catch (error) {
        console.error("Failed to fetch conversations:", error);
      } finally {
        setIsLoading(false);
      }
    }

    if (session?.user) {
      fetchConversations();
    }
  }, [session]);

  const filteredConversations = conversations.filter((conv) => {
    const otherUser = 
      conv.participant1.id === session?.user?.id 
        ? conv.participant2 
        : conv.participant1;
    
    return (
      otherUser.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      conv.product.title.toLowerCase().includes(searchQuery.toLowerCase())
    );
  });

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (days === 0) {
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } else if (days < 7) {
      return date.toLocaleDateString([], { weekday: 'short' });
    } else {
      return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 pt-12">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight">Messages</h1>
          <p className="text-gray-500 mt-2 font-medium">Manage your inquiries and negotiations</p>
        </div>

        {/* Search Bar */}
        <div className="relative w-full md:w-80">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input
            type="text"
            placeholder="Search conversations..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-medium text-sm"
          />
        </div>
      </div>

      <div className="bg-white/70 backdrop-blur-xl border border-white/50 rounded-3xl shadow-xl overflow-hidden min-h-[500px]">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center h-[500px]">
            <Loader2 className="w-12 h-12 text-blue-500 animate-spin mb-4" />
            <p className="text-gray-500 font-medium">Loading your conversations...</p>
          </div>
        ) : filteredConversations.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-[500px] p-8 text-center text-gray-500">
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-4">
              <MessageSquare size={32} className="text-gray-400" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">No messages yet</h3>
            <p className="max-w-sm">
              Your conversations with buyers and sellers will appear here once you start communicating.
            </p>
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {filteredConversations.map((conv) => {
              const otherUser = 
                conv.participant1.id === session?.user?.id 
                  ? conv.participant2 
                  : conv.participant1;
              const lastMessage = conv.messages[0];

              return (
                <Link 
                  key={conv.id} 
                  href={`/dashboard/sell/messages/${conv.id}`}
                  className="block group"
                >
                  <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="p-6 hover:bg-blue-50/50 transition-all flex items-center gap-4"
                  >
                    {/* User Avatar */}
                    <div className="relative flex-shrink-0">
                      <div className="w-14 h-14 rounded-full overflow-hidden border-2 border-white shadow-md bg-gray-100 flex items-center justify-center">
                        {otherUser.image ? (
                          <Image
                            src={otherUser.image}
                            alt={otherUser.name}
                            width={56}
                            height={56}
                            className="object-cover"
                          />
                        ) : (
                          <User size={24} className="text-gray-400" />
                        )}
                      </div>
                      <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-lg bg-white shadow-sm flex items-center justify-center border border-gray-100">
                        {conv.product.images[0] ? (
                          <Image
                            src={conv.product.images[0]}
                            alt="Product"
                            width={16}
                            height={16}
                            className="rounded-sm object-cover"
                          />
                        ) : (
                          <div className="w-4 h-4 bg-gray-200 rounded-sm"></div>
                        )}
                      </div>
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <h4 className="font-bold text-gray-900 group-hover:text-blue-600 transition-colors truncate">
                          {otherUser.name}
                        </h4>
                        <span className="text-xs text-gray-400 whitespace-nowrap flex items-center gap-1">
                          <Clock size={12} />
                          {formatDate(conv.lastMessageAt)}
                        </span>
                      </div>
                      <div className="flex items-center gap-1.5 mb-1.5">
                        <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Re:</span>
                        <span className="text-xs font-semibold text-gray-600 truncate">{conv.product.title}</span>
                      </div>
                      <p className="text-sm text-gray-500 truncate italic">
                        {lastMessage ? lastMessage.content : "No messages yet"}
                      </p>
                    </div>

                    <div className="flex-shrink-0 text-gray-300 group-hover:text-blue-400 transition-all transform group-hover:translate-x-1">
                      <ChevronRight size={24} />
                    </div>
                  </motion.div>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
