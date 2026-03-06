"use client";

import { motion } from "framer-motion";
import { Camera, CheckCircle, HandCoins } from "lucide-react";

const steps = [
  {
    icon: <Camera className="w-8 h-8 text-white" />,
    title: "Snap & List",
    description: "Take a photo, add a description, and set your price. It takes less than a minute.",
    color: "bg-blue-600",
  },
  {
    icon: <HandCoins className="w-8 h-8 text-white" />,
    title: "Secure Payment",
    description: "Buyer pays securely through our platform. Funds are held in escrow until you meet.",
    color: "bg-purple-600",
  },
  {
    icon: <CheckCircle className="w-8 h-8 text-white" />,
    title: "Exchange & Earn",
    description: "Meet locally, hand over the item, and confirm in the app. Funds are released instantly.",
    color: "bg-green-600",
  },
];

export default function HowItWorks() {
  return (
    <section className="py-24 bg-white overflow-hidden">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto mb-20">
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
            Simple as 1, 2, 3
          </h2>
          <p className="text-lg text-gray-600">
            Start earning from your unused items today.
          </p>
        </div>

        <div className="relative">
          {/* Connecting Line (Desktop) */}
          <div className="hidden lg:block absolute top-1/2 left-0 w-full h-1 bg-gray-100 transform -translate-y-1/2 -z-10"></div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 lg:gap-8">
            {steps.map((step, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.2 }}
                className="relative bg-white p-6 rounded-2xl border border-gray-100 shadow-lg lg:shadow-none lg:border-none text-center"
              >
                <div className={`w-20 h-20 ${step.color} rounded-full flex items-center justify-center mx-auto mb-6 shadow-xl transform transition-transform hover:scale-110`}>
                  {step.icon}
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">{step.title}</h3>
                <p className="text-gray-600 leading-relaxed max-w-xs mx-auto">
                  {step.description}
                </p>
                
                {/* Step Number Badge */}
                <div className="absolute top-4 right-4 lg:top-0 lg:right-1/4 bg-gray-900 text-white w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm shadow-md">
                  {index + 1}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
