"use client";

import { useState, useEffect, useRef } from "react";
import { useSession } from "next-auth/react";
import { use } from "react";
import { motion } from "framer-motion";
import { Send, ArrowLeft, Loader2, User, Package, ExternalLink } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

interface Message {
  id: string;
  content: string;
  senderId: string;
  createdAt: string;
  sender: {
    id: string;
    name: string;
    image: string | null;
  };
}

interface Conversation {
  id: string;
  product: {
    id: string;
    title: string;
    images: string[];
    price: number;
    slug: string;
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
}

export default function ChatPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { data: session } = useSession();
  const [conversation, setConversation] = useState<Conversation | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [newMessage, setNewMessage] = useState("");
  const [isSending, setIsSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    async function fetchChat() {
      try {
        const res = await fetch(`/api/messages/conversations/${id}`);
        if (res.ok) {
          const data = await res.json();
          setConversation(data.conversation);
          setMessages(data.messages);
        }
      } catch (error) {
        console.error("Failed to fetch chat:", error);
      } finally {
        setIsLoading(false);
      }
    }

    if (session?.user) {
      fetchChat();
    }
  }, [id, session]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Polling for new messages (simple real-time substitute)
  useEffect(() => {
    const interval = setInterval(async () => {
      if (!session?.user) return;
      try {
        const res = await fetch(`/api/messages/conversations/${id}`);
        if (res.ok) {
          const data = await res.json();
          // Only update if there are new messages
          if (data.messages.length > messages.length) {
            setMessages(data.messages);
          }
        }
      } catch (error) {
        console.error("Polling error:", error);
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [id, messages.length, session]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || isSending) return;

    setIsSending(true);
    try {
      const res = await fetch(`/api/messages/conversations/${id}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: newMessage }),
      });

      if (res.ok) {
        const message = await res.json();
        // Add sender info for UI
        const optimisticMessage = {
          ...message,
          sender: {
            id: session?.user?.id,
            name: session?.user?.name,
            image: session?.user?.image,
          }
        };
        setMessages([...messages, optimisticMessage]);
        setNewMessage("");
      }
    } catch (error) {
      console.error("Failed to send message:", error);
    } finally {
      setIsSending(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-[calc(100vh-200px)]">
        <Loader2 className="w-12 h-12 text-blue-500 animate-spin mb-4" />
        <p className="text-gray-500 font-medium tracking-wide">Connecting to chat...</p>
      </div>
    );
  }

  if (!conversation) {
    return (
      <div className="flex flex-col items-center justify-center h-[calc(100vh-200px)] p-8 text-center">
        <h3 className="text-xl font-bold text-gray-900 mb-2">Conversation not found</h3>
        <Link href="/dashboard/sell/messages" className="text-blue-600 font-semibold hover:underline">
          Back to all messages
        </Link>
      </div>
    );
  }

  const otherUser = 
    conversation.participant1.id === session?.user?.id 
      ? conversation.participant2 
      : conversation.participant1;

  return (
    <div className="flex flex-col h-[calc(100vh-120px)] max-w-5xl mx-auto bg-white shadow-2xl rounded-3xl overflow-hidden border border-gray-100 my-4">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-xl border-b border-gray-100 p-4 flex items-center justify-between sticky top-0 z-10">
        <div className="flex items-center gap-4">
          <Link 
            href="/dashboard/sell/messages"
            className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-500"
          >
            <ArrowLeft size={20} />
          </Link>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gray-100 overflow-hidden flex items-center justify-center border border-gray-200">
              {otherUser.image ? (
                <Image src={otherUser.image} alt={otherUser.name} width={40} height={40} className="object-cover" />
              ) : (
                <User size={20} className="text-gray-400" />
              )}
            </div>
            <div>
              <h3 className="font-bold text-gray-900 leading-tight">{otherUser.name}</h3>
              <p className="text-xs text-green-500 font-semibold flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-green-500"></span> Online
              </p>
            </div>
          </div>
        </div>

        {/* Product Context Mini Card */}
        <Link 
          href={`/products/${conversation.product.slug}`}
          className="hidden sm:flex items-center gap-3 p-2 pr-4 bg-gray-50 rounded-2xl hover:bg-gray-100 transition-all border border-gray-100 group"
        >
          <div className="w-10 h-10 rounded-lg overflow-hidden flex-shrink-0 border border-white shadow-sm">
            {conversation.product.images[0] ? (
              <Image 
                src={conversation.product.images[0]} 
                alt={conversation.product.title} 
                width={40} 
                height={40} 
                className="object-cover" 
              />
            ) : (
              <Package size={20} className="text-gray-400 m-2.5" />
            )}
          </div>
          <div className="min-w-0">
            <p className="text-xs font-bold text-gray-900 truncate max-w-[150px]">{conversation.product.title}</p>
            <p className="text-xs font-bold text-blue-600">£{conversation.product.price}</p>
          </div>
          <ExternalLink size={14} className="text-gray-400 group-hover:text-blue-500 transition-colors" />
        </Link>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 bg-gray-50/50 flex flex-col custom-scrollbar">
        {messages.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center text-center p-8">
            <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center mb-4">
              <MessageSquare size={32} className="text-blue-400" />
            </div>
            <h4 className="font-bold text-gray-900">Start the conversation</h4>
            <p className="text-sm text-gray-500 max-w-[250px] mt-2">
              Say hello and ask about availability or request more details about the item.
            </p>
          </div>
        ) : (
          messages.map((msg, idx) => {
            const isMe = msg.senderId === session?.user?.id;
            const showAvatar = idx === 0 || messages[idx - 1].senderId !== msg.senderId;

            return (
              <div 
                key={msg.id} 
                className={`flex items-end gap-2 ${isMe ? "flex-row-reverse" : "flex-row"}`}
              >
                {!isMe && (
                  <div className="w-8 h-8 rounded-full overflow-hidden flex-shrink-0 bg-gray-200 border border-white shadow-sm mb-1">
                    {showAvatar ? (
                      otherUser.image ? (
                        <Image src={otherUser.image} alt={otherUser.name} width={32} height={32} />
                      ) : (
                        <User size={16} className="text-gray-400 m-2" />
                      )
                    ) : null}
                  </div>
                )}
                <div className={`flex flex-col ${isMe ? "items-end" : "items-start"} max-w-[80%]`}>
                  <motion.div 
                    initial={{ scale: 0.95, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className={`px-4 py-3 rounded-2xl shadow-sm ${
                      isMe 
                        ? "bg-blue-600 text-white rounded-br-none" 
                        : "bg-white text-gray-800 border border-gray-100 rounded-bl-none"
                    }`}
                  >
                    <p className="text-sm font-medium leading-relaxed">{msg.content}</p>
                  </motion.div>
                  <span className="text-[10px] text-gray-400 font-bold uppercase mt-1 px-1">
                    {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              </div>
            );
          })
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="p-4 bg-white border-t border-gray-100">
        <form onSubmit={handleSendMessage} className="flex gap-3">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type your message..."
            className="flex-1 px-5 py-3.5 bg-gray-50 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-medium"
            disabled={isSending}
          />
          <button
            type="submit"
            disabled={!newMessage.trim() || isSending}
            className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all shadow-lg ${
              !newMessage.trim() || isSending
                ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                : "bg-blue-600 text-white hover:bg-blue-700 hover:shadow-blue-500/30 transform active:scale-95"
            }`}
          >
            {isSending ? (
              <Loader2 className="w-6 h-6 animate-spin" />
            ) : (
              <Send size={24} className="-mr-0.5" />
            )}
          </button>
        </form>
      </div>

      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #e5e7eb;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #d1d5db;
        }
      `}</style>
    </div>
  );
}
import { MessageSquare } from "lucide-react";
