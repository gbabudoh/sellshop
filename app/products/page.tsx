"use client";

import { Header } from "../../components/layout/Header";
import { Footer } from "../../components/layout/Footer";
import { ProductCard } from "../../components/product/ProductCard";
import { ProductFilters } from "../../components/product/ProductFilters";
import { useState, useMemo, useEffect } from "react";
import { Search, ChevronDown, Check, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useSearchParams } from "next/navigation";

interface Product {
  id: string;
  slug: string;
  title: string;
  price: number;
  description: string;
  category: string;
  condition: string;
  address: string;
  images: string[];
  isNegotiable: boolean;
  createdAt: string;
  seller: {
    name: string;
    rating: number;
    reviewCount: number;
  };
}

const CATEGORIES = ["All", "Electronics", "Fashion", "Furniture", "Books", "Sports", "Automotive"];
const SORT_OPTIONS = ["Newest", "Price: Low to High", "Price: High to Low"];

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedConditions, setSelectedConditions] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 10000]);
  const [sortBy, setSortBy] = useState("Newest");
  const searchParams = useSearchParams();

  // Sync search query from URL
  useEffect(() => {
    const query = searchParams.get("search");
    if (query !== null) {
      setSearchQuery(query);
    }
  }, [searchParams]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch("/api/products", { cache: "no-store" });
        if (response.ok) {
          const data = await response.json();
          setProducts(data);
        }
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const matchesSearch =
        product.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.category.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = selectedCategory === "All" || product.category === selectedCategory;
      const matchesPrice = product.price >= priceRange[0] && product.price <= priceRange[1];
      
      const matchesCondition = 
        selectedConditions.length === 0 || 
        selectedConditions.some(cond => {
          // Map frontend display names back to Prisma enum if needed, or check both
          // For now, we'll try to match against displayed/stored condition values flexibly
          const productCond = product.condition.replace(/_/g, " ").toLowerCase();
          return cond.toLowerCase() === productCond || cond.toLowerCase().includes(productCond);
        });

      return matchesSearch && matchesCategory && matchesPrice && matchesCondition;
    }).sort((a, b) => {
      if (sortBy === "Price: Low to High") return a.price - b.price;
      if (sortBy === "Price: High to Low") return b.price - a.price;
      if (sortBy === "Newest") return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      return 0;
    });
  }, [products, searchQuery, selectedCategory, selectedConditions, priceRange, sortBy]);
  
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
      <Header />

      <main className="flex-1 w-full max-w-[1600px] mx-auto px-4 py-8 lg:px-8">
        
        {/* Page Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Marketplace</h1>
            <p className="text-gray-500 mt-1">Discover unique items from sellers near you</p>
          </div>

          {/* Search Bar */}
          <div className="relative w-full md:w-96">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search products, brands..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-white border border-gray-200 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
            />
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          
          {/* Sidebar Filters */}
          <ProductFilters
            categories={CATEGORIES}
            selectedCategory={selectedCategory}
            onCategoryChange={setSelectedCategory}
            selectedConditions={selectedConditions}
            onConditionsChange={setSelectedConditions}
            priceRange={priceRange}
            onPriceChange={setPriceRange}
            className="flex-shrink-0"
          />

          {/* Product Grid */}
          <div className="flex-1">
            
            {/* Toolbar */}
            <div className="flex items-center justify-between mb-6 bg-white p-4 rounded-xl shadow-sm border border-gray-100">
               <div className="text-sm text-gray-500">
                  Showing <span className="font-bold text-gray-900">{filteredProducts.length}</span> results
               </div>
               
               <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-500 hidden sm:inline">Sort by:</span>
                  <div className="relative group">
                     <button className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-gray-700 hover:text-blue-600 transition-colors cursor-pointer">
                        {sortBy} <ChevronDown size={14} />
                     </button>
                     <div className="absolute right-0 top-full mt-1 w-48 bg-white rounded-lg shadow-lg border border-gray-100 py-1 hidden group-hover:block z-20">
                        {SORT_OPTIONS.map(option => (
                           <button 
                              key={option}
                              onClick={() => setSortBy(option)}
                              className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-50 flex items-center justify-between cursor-pointer ${sortBy === option ? 'text-blue-600 font-medium' : 'text-gray-600'}`}
                           >
                              {option}
                              {sortBy === option && <Check size={14} />}
                           </button>
                        ))}
                     </div>
                  </div>
               </div>
            </div>

            <AnimatePresence mode="wait">
              {isLoading ? (
                <div className="flex flex-col items-center justify-center py-20">
                  <Loader2 className="w-10 h-10 animate-spin text-blue-600 mb-4" />
                  <p className="text-gray-500">Loading marketplace items...</p>
                </div>
              ) : filteredProducts.length === 0 ? (
                <motion.div 
                  initial={{ opacity: 0 }} 
                  animate={{ opacity: 1 }} 
                  exit={{ opacity: 0 }}
                  className="bg-white rounded-2xl p-12 text-center border border-dashed border-gray-300"
                >
                  <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4 text-gray-400">
                    <Search size={32} />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-1">No products found</h3>
                  <p className="text-gray-500">Try adjusting your search or filters to find what you&apos;re looking for.</p>
                   <button 
                      onClick={() => { 
                         setSearchQuery(""); 
                         setSelectedCategory("All"); 
                         setSelectedConditions([]);
                         setPriceRange([0, 10000]); 
                      }}
                      className="mt-6 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-sm font-medium cursor-pointer"
                   >
                      Clear all filters
                   </button>
                </motion.div>
              ) : (
                <motion.div 
                  layout
                  className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
                >
                  {filteredProducts.map((product) => (
                    <ProductCard 
                      key={product.id} 
                      id={product.id}
                      slug={product.slug}
                      title={product.title}
                      price={product.price}
                      image={product.images[0]}
                      seller={product.seller}
                      address={product.address}
                      condition={product.condition}
                      isNegotiable={product.isNegotiable}
                      category={product.category}
                    />
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}


// End of file
