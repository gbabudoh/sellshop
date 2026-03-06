"use client";

import { Filter, X, Check } from "lucide-react";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface ProductFiltersProps {
  categories: string[];
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
  selectedConditions: string[];
  onConditionsChange: (conditions: string[]) => void;
  priceRange: [number, number];
  onPriceChange: (range: [number, number]) => void;
  className?: string;
}

export function ProductFilters({
  categories,
  selectedCategory,
  onCategoryChange,
  selectedConditions,
  onConditionsChange,
  priceRange,
  onPriceChange,
  className = "",
}: ProductFiltersProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [minPrice, setMinPrice] = useState(priceRange[0].toString());
  const [maxPrice, setMaxPrice] = useState(priceRange[1].toString());

  const handlePriceApply = () => {
    const min = parseInt(minPrice) || 0;
    const max = parseInt(maxPrice) || 10000;
    onPriceChange([min, max]);
  };

  return (
    <>
      {/* Mobile Filter Toggle */}
      <button
        onClick={() => setIsOpen(true)}
        className="lg:hidden fixed bottom-6 right-6 z-50 bg-blue-600 text-white p-4 rounded-full shadow-lg hover:bg-blue-700 transition-colors flex items-center gap-2 cursor-pointer"
      >
        <Filter size={24} />
        <span className="font-semibold">Filters</span>
      </button>

      {/* Backdrop for Mobile */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsOpen(false)}
            className="fixed inset-0 bg-black/50 z-40 lg:hidden backdrop-blur-sm"
          />
        )}
      </AnimatePresence>

      {/* Sidebar Container */}
      <motion.aside
        className={`fixed lg:static inset-y-0 right-0 z-50 w-80 lg:w-64 bg-white lg:bg-transparent shadow-2xl lg:shadow-none transform transition-transform duration-300 ease-in-out ${
          isOpen ? "translate-x-0" : "translate-x-full lg:translate-x-0"
        } ${className}`}
      >
        <div className="h-full overflow-y-auto p-6 lg:p-0">
          <div className="flex items-center justify-between mb-8 lg:hidden">
            <h2 className="text-xl font-bold text-gray-900">Filters</h2>
            <button
              onClick={() => setIsOpen(false)}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors cursor-pointer"
            >
              <X size={24} className="text-gray-500" />
            </button>
          </div>

          <div className="space-y-8">
            {/* Categories Section */}
            <div>
              <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-4">
                Categories
              </h3>
              <div className="space-y-2">
                {categories.map((category) => (
                  <button
                    key={category}
                    onClick={() => {
                      onCategoryChange(category);
                      setIsOpen(false);
                    }}
                    className={`nav-link w-full text-left px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 flex items-center justify-between group cursor-pointer ${
                      selectedCategory === category
                        ? "bg-blue-50 text-blue-700"
                        : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                    }`}
                  >
                    <span>{category}</span>
                    {selectedCategory === category && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="text-blue-600"
                      >
                        <Check size={16} />
                      </motion.div>
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Price Range Section */}
            <div>
              <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-4">
                Price Range
              </h3>
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <div className="relative flex-1">
                    <span className="absolute left-3 top-2.5 text-gray-500 text-sm">£</span>
                    <input
                      type="number"
                      value={minPrice}
                      onChange={(e) => setMinPrice(e.target.value)}
                      className="w-full pl-6 pr-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                      placeholder="Min"
                    />
                  </div>
                  <span className="text-gray-400">-</span>
                  <div className="relative flex-1">
                    <span className="absolute left-3 top-2.5 text-gray-500 text-sm">£</span>
                    <input
                      type="number"
                      value={maxPrice}
                      onChange={(e) => setMaxPrice(e.target.value)}
                      className="w-full pl-6 pr-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                      placeholder="Max"
                    />
                  </div>
                </div>
                <button
                  onClick={handlePriceApply}
                  className="w-full py-2 bg-gray-900 text-white rounded-lg text-sm font-medium hover:bg-gray-800 transition-colors shadow-sm cursor-pointer"
                >
                  Apply Price
                </button>
              </div>
            </div>

            {/* Condition Section */}
            <div>
              <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-4">
                Condition
              </h3>
              <div className="space-y-3">
                {["New", "Used - Like New", "Used - Good", "Used - Fair"].map((cond) => (
                  <label key={cond} className="flex items-center gap-3 cursor-pointer group">
                    <div className="relative flex items-center">
                      <input
                        type="checkbox"
                        checked={selectedConditions.includes(cond)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            onConditionsChange([...selectedConditions, cond]);
                          } else {
                            onConditionsChange(selectedConditions.filter(c => c !== cond));
                          }
                        }}
                        className="peer h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500/20 transition-all cursor-pointer"
                      />
                    </div>
                    <span className={`text-sm transition-colors ${selectedConditions.includes(cond) ? 'text-blue-700 font-medium' : 'text-gray-600 group-hover:text-gray-900'}`}>
                      {cond}
                    </span>
                  </label>
                ))}
              </div>
            </div>
          </div>
        </div>
      </motion.aside>
    </>
  );
}
