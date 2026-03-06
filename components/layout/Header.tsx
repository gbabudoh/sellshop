"use client";

import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { useState, useRef, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Search, ShoppingBag, User, LogOut, ChevronDown, LogIn, UserPlus, Loader2 } from "lucide-react";

import Image from "next/image";

export function Header() {
  const { data: session } = useSession();
  const router = useRouter();
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const profileRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setIsProfileOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <Image 
            src="/logo.png" 
            alt="Sellshop" 
            width={120} 
            height={40} 
            className="h-8 w-auto object-contain"
          />
        </Link>

        <div className="flex-1 max-w-md mx-8">
          <Suspense fallback={<div className="h-10 w-full bg-gray-100/50 rounded-lg animate-pulse" />}>
            <SearchBarWrapper />
          </Suspense>
        </div>

        <nav className="flex items-center gap-6">
          {session ? (
            <>
              <Link href="/dashboard/sell/listings" className="text-gray-700 hover:text-primary">
                Sell
              </Link>
              <Link href="/dashboard/buy" className="text-gray-700 hover:text-primary flex items-center gap-1">
                <ShoppingBag size={20} />
                Orders
              </Link>
              <div className="relative" ref={profileRef}>
                <button
                  onClick={() => setIsProfileOpen(!isProfileOpen)}
                  className="flex items-center gap-2 text-gray-700 hover:text-primary py-2 px-3 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
                >
                  <User size={20} />
                  {session.user?.name || "Account"}
                  <ChevronDown size={16} className={`transition-transform ${isProfileOpen ? "rotate-180" : ""}`} />
                </button>
                {isProfileOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-10">
                    <button
                      onClick={() => {
                        setIsProfileOpen(false);
                        router.push("/dashboard/sell");
                      }}
                      className="w-full text-left block px-4 py-2 text-gray-700 hover:bg-gray-100 transition-colors cursor-pointer"
                    >
                      Dashboard
                    </button>
                    <button
                      onClick={() => {
                        setIsProfileOpen(false);
                        signOut();
                      }}
                      className="w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100 flex items-center gap-2 transition-colors cursor-pointer"
                    >
                      <LogOut size={16} />
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            </>
          ) : (
            <>
              <Link 
                href="/signin" 
                className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:text-primary font-medium transition-colors"
              >
                <LogIn size={18} />
                Sign In
              </Link>
              <Link 
                href="/signup" 
                className="flex items-center gap-2 bg-primary text-white px-5 py-2.5 rounded-full font-medium shadow-md hover:bg-primary-hover hover:shadow-lg transition-all transform hover:-translate-y-0.5"
              >
                <UserPlus size={18} />
                Sign Up
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}

function SearchBarWrapper() {
  const searchParams = useSearchParams();
  const search = searchParams.get("search") || "";
  
  // Use a key to force re-mounting and state re-initialization when search param changes
  return <SearchBar key={search} initialValue={search} />;
}

interface Suggestion {
  id: string;
  title: string;
  category: string;
  slug: string;
}

function SearchBar({ initialValue }: { initialValue: string }) {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState(initialValue);
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const [isLoading, setIsLoading] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Sync state with URL changes
  useEffect(() => {
    setSearchTerm(initialValue);
  }, [initialValue]);

  // Debounced suggestion fetching
  useEffect(() => {
    const fetchSuggestions = async () => {
      if (searchTerm.trim().length < 2) {
        setSuggestions([]);
        return;
      }

      setIsLoading(true);
      try {
        const res = await fetch(`/api/search/suggestions?q=${encodeURIComponent(searchTerm)}`);
        if (res.ok) {
          const data = await res.json();
          setSuggestions(data);
        }
      } catch (err) {
        console.error("Suggestions fetch error:", err);
      } finally {
        setIsLoading(false);
      }
    };

    const timer = setTimeout(fetchSuggestions, 300);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  // Click outside handling
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSubmit = (e?: React.FormEvent) => {
    e?.preventDefault();
    setShowSuggestions(false);
    if (searchTerm.trim()) {
      router.push(`/products?search=${encodeURIComponent(searchTerm.trim())}`);
    } else {
      router.push("/products");
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIndex(prev => (prev < suggestions.length - 1 ? prev + 1 : prev));
      setShowSuggestions(true);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex(prev => (prev > 0 ? prev - 1 : prev));
    } else if (e.key === "Enter") {
      if (activeIndex >= 0 && suggestions[activeIndex]) {
        e.preventDefault();
        const selected = suggestions[activeIndex];
        router.push(`/products/${selected.slug}`);
        setShowSuggestions(false);
      } else {
        handleSubmit();
      }
    } else if (e.key === "Escape") {
      setShowSuggestions(false);
    }
  };

  return (
    <div className="relative group/search" ref={containerRef}>
      <form onSubmit={handleSubmit} className="relative z-10">
        <input
          type="text"
          placeholder="Search items..."
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setShowSuggestions(true);
            setActiveIndex(-1);
          }}
          onFocus={() => setShowSuggestions(true)}
          onKeyDown={handleKeyDown}
          className="w-full px-4 py-2.5 pr-10 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/10 focus:border-primary transition-all font-medium text-gray-700 bg-gray-50/50 hover:bg-white focus:bg-white"
        />
        <button 
          type="submit"
          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-primary transition-colors p-1"
        >
          <Search size={18} />
        </button>
      </form>

      {/* Suggestions Dropdown */}
      <AnimatePresence>
        {showSuggestions && (searchTerm.length >= 2) && (suggestions.length > 0 || isLoading) && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute top-full left-0 right-0 mt-2 bg-white/95 backdrop-blur-md rounded-2xl shadow-2xl border border-gray-100 overflow-hidden z-50 py-2"
          >
            {isLoading && suggestions.length === 0 ? (
              <div className="px-4 py-3 flex items-center gap-3 text-gray-400">
                <Loader2 className="w-4 h-4 animate-spin" />
                <span className="text-sm">Finding matches...</span>
              </div>
            ) : (
              <div className="max-h-80 overflow-y-auto">
                <div className="px-3 pb-1 mb-1 border-b border-gray-50 flex items-center justify-between">
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Suggestions</span>
                  {isLoading && <Loader2 className="w-3 h-3 animate-spin text-primary" />}
                </div>
                {suggestions.map((item, index) => (
                  <button
                    key={item.id}
                    onClick={() => {
                      router.push(`/products/${item.slug}`);
                      setShowSuggestions(false);
                    }}
                    onMouseEnter={() => setActiveIndex(index)}
                    className={`w-full text-left px-4 py-2.5 flex items-center justify-between group transition-colors cursor-pointer ${
                      activeIndex === index ? "bg-primary/5" : "hover:bg-gray-50"
                    }`}
                  >
                    <div className="flex flex-col">
                      <span className={`text-sm font-semibold transition-colors ${
                        activeIndex === index ? "text-primary" : "text-gray-800"
                      }`}>
                        {item.title}
                      </span>
                      <span className="text-[11px] text-gray-500">{item.category}</span>
                    </div>
                    <Search 
                      size={14} 
                      className={`transition-all ${
                        activeIndex === index ? "text-primary opacity-100 translate-x-0" : "text-gray-300 opacity-0 -translate-x-2"
                      }`} 
                    />
                  </button>
                ))}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
