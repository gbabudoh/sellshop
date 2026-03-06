"use client";

import { motion } from "framer-motion";
import { ArrowRight, Users } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export default function Hero() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-indigo-50/50 via-white to-orange-50/30 pt-12 pb-20 lg:pt-16 lg:pb-32">
      <div className="container mx-auto px-4 relative z-10">
        <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-20">
          
          {/* Text Content */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="lg:w-1/2 text-center lg:text-left"
          >
            <h1 className="font-extrabold tracking-tight text-gray-900 mb-6 leading-tight">
              <span className="block text-6xl lg:text-9xl mb-2 bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">Sell it</span>
              <span className="block text-4xl lg:text-7xl text-primary">with Sellshop</span>
            </h1>
            <p className="text-xl text-gray-600 mb-10 max-w-xl mx-auto lg:mx-0 leading-relaxed font-medium">
              Experience the future of local commerce. A modern marketplace where trust meets convenience. Buy safely, sell instantly, and connect with your community.
            </p>
            <div className="flex flex-col sm:flex-row gap-5 justify-center lg:justify-start">
              <Link 
                href="/signup" 
                className="inline-flex items-center justify-center px-10 py-5 text-lg font-bold text-white bg-primary rounded-full hover:bg-primary-hover transition-all shadow-xl shadow-primary/20 hover:shadow-2xl hover:shadow-primary/30 transform hover:-translate-y-1 active:scale-95"
              >
                Get Started
                <ArrowRight className="ml-2 w-6 h-6" />
              </Link>
              <Link 
                href="/products" 
                className="inline-flex items-center justify-center px-10 py-5 text-lg font-bold text-primary bg-white border-2 border-primary/10 rounded-full hover:border-primary/30 hover:bg-primary/5 transition-all active:scale-95"
              >
                Browse Marketplace
              </Link>
            </div>
          </motion.div>

          {/* Animated Visuals */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.9, x: 50 }}
            animate={{ opacity: 1, scale: 1, x: 0 }}
            transition={{ duration: 1, delay: 0.2 }}
            className="lg:w-1/2 relative"
          >
            <div className="relative w-full aspect-square max-w-xl mx-auto">
              {/* Background Blobs (Premium) */}
              <div className="absolute inset-0 bg-blue-100/50 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob"></div>
              <div className="absolute top-0 -right-4 w-80 h-80 bg-orange-100/50 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob animation-delay-2000"></div>
              <div className="absolute -bottom-8 left-20 w-80 h-80 bg-indigo-100/50 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob animation-delay-4000"></div>

              {/* Main Product Visual */}
              <div className="relative z-20 w-full h-full flex items-center justify-center">
                <motion.div 
                  initial={{ y: 0 }}
                  animate={{ y: [-15, 15, -15] }}
                  transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                  className="relative group"
                >
                  {/* Premium Product Card Cluster */}
                  <div className="relative">
                    {/* Primary Card */}
                    <div className="w-[340px] md:w-[420px] bg-white p-6 rounded-[2.5rem] shadow-[0_30px_70px_rgba(0,0,0,0.12)] border border-white/50 relative z-30 transform -rotate-3 hover:rotate-0 transition-all duration-700">
                      <div className="relative aspect-[4/5] w-full rounded-[2rem] overflow-hidden bg-[#ffdb4d] mb-6">
                        <Image
                          src="/images/headphones.png"
                          alt="Premium Headphones"
                          fill
                          className="object-contain p-8 transform transition-transform duration-700 group-hover:scale-110"
                        />
                      </div>
                      <div className="flex justify-between items-center mb-2">
                        <div>
                          <h3 className="text-xl font-bold text-gray-900">Premium Audio</h3>
                          <p className="text-sm text-gray-500 font-medium">Exclusive Collection</p>
                        </div>
                        <div className="text-2xl font-black text-primary">£129</div>
                      </div>
                    </div>

                    {/* Secondary Floating Elements */}
                    <motion.div 
                      animate={{ y: [0, -20, 0] }}
                      transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                      className="absolute -top-10 -right-10 w-44 bg-white/90 backdrop-blur-md p-4 rounded-3xl shadow-2xl border border-white z-40"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center text-green-600">
                          <Users size={20} />
                        </div>
                        <div>
                          <div className="text-xs font-bold text-gray-800">Verified</div>
                          <div className="text-[10px] text-gray-500">Local Seller</div>
                        </div>
                      </div>
                    </motion.div>
                  </div>
                </motion.div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
