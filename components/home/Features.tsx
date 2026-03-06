"use client";

import { useRef } from "react";
import { motion, useMotionTemplate, useMotionValue } from "framer-motion";
import { Shield, Zap, MapPin, TrendingUp } from "lucide-react";

const features = [
  {
    icon: <Zap className="w-8 h-8 text-yellow-500" />,
    title: "Lightning Fast",
    description: "List items in seconds. Our streamlined process gets your products in front of buyers instantly.",
    gradient: "from-yellow-500/20 to-orange-500/20",
  },
  {
    icon: <Shield className="w-8 h-8 text-green-500" />,
    title: "Secure Escrow",
    description: "Trade with confidence. Payments are held safely until both parties confirm the transaction.",
    gradient: "from-green-500/20 to-emerald-500/20",
  },
  {
    icon: <MapPin className="w-8 h-8 text-red-500" />,
    title: "Local Connections",
    description: "Find what you need nearby. Meet your neighbors and build a trusted local trading community.",
    gradient: "from-red-500/20 to-pink-500/20",
  },
  {
    icon: <TrendingUp className="w-8 h-8 text-blue-500" />,
    title: "Low Fees",
    description: "Keep more of your money. Our fair 8% commission structure ensures value for everyone.",
    gradient: "from-blue-500/20 to-indigo-500/20",
  },
];

function FeatureCard({ feature, index }: { feature: typeof features[0]; index: number }) {
  const divRef = useRef<HTMLDivElement>(null);
  const position = { x: useMotionValue(0), y: useMotionValue(0) };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!divRef.current) return;
    const rect = divRef.current.getBoundingClientRect();
    position.x.set(e.clientX - rect.left);
    position.y.set(e.clientY - rect.top);
  };

  return (
    <motion.div
      ref={divRef}
      onMouseMove={handleMouseMove}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="relative rounded-3xl border border-gray-200 bg-white overflow-hidden group"
    >
      {/* Spotlight Gradient */}
      <motion.div
        className="pointer-events-none absolute -inset-px rounded-3xl opacity-0 transition duration-300 group-hover:opacity-100"
        style={{
          background: useMotionTemplate`
            radial-gradient(
              650px circle at ${position.x}px ${position.y}px,
              rgba(59, 130, 246, 0.1),
              transparent 80%
            )
          `,
        }}
      />
      
      <div className="relative h-full p-8 flex flex-col z-10">
        <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-6 bg-gradient-to-br ${feature.gradient} group-hover:scale-110 transition-transform duration-300`}>
          {feature.icon}
        </div>
        
        <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors">
          {feature.title}
        </h3>
        
        <p className="text-gray-600 leading-relaxed flex-grow">
          {feature.description}
        </p>

        {/* Decorative bottom line */}
        <div className="mt-6 h-1 w-12 bg-gray-200 rounded-full group-hover:w-full group-hover:bg-blue-500 transition-all duration-500" />
      </div>
    </motion.div>
  );
}

export default function Features() {
  return (
    <section className="py-24 bg-gray-50 overflow-hidden">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 relative">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
          <div className="relative z-10">
            <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6 tracking-tight">
              Why Choose Sellshop?
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              We&apos;ve reimagined the marketplace experience to be safer, faster, and more community-focused.
            </p>
          </div>
        </div>

        {/* Grid Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
          {features.map((feature, index) => (
            <FeatureCard key={index} feature={feature} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}
