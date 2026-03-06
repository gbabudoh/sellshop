"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Upload, Type, AlignLeft, PoundSterling, Tag, Package, MapPin, Loader2, Image as ImageIcon, Sparkles, CheckCircle2 } from "lucide-react";
import Image from "next/image";

export default function NewListingPage() {
  const router = useRouter();
  const [isSuccess, setIsSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    price: "",
    category: "Electronics",
    condition: "USED_LIKE_NEW",
    address: "",
    isNegotiable: false,
    quantity: 1,
    duration: "4", // weeks
  });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    const data = new FormData();
    Object.entries(formData).forEach(([key, value]) => {
      data.append(key, value.toString());
    });
    if (imageFile) {
      data.append("image", imageFile);
    }

    setIsProcessing(true);
    try {
      const response = await fetch("/api/products", {
        method: "POST",
        body: data,
      });

      if (response.ok) {
        setIsSuccess(true);
      } else {
        const errData = await response.json();
        alert(`Failed to create: ${errData.error || "Unknown error"}`);
      }
    } catch {
      alert("Failed to create listing");
    } finally {
      setIsLoading(false);
      setIsProcessing(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const containerVariants: any = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const itemVariants: any = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-gray-100 to-gray-200 relative py-12 px-4 sm:px-6 lg:px-8">
      
      {/* Background Orbs */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/10 rounded-full mix-blend-multiply filter blur-[100px] pointer-events-none"></div>
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-300/20 rounded-full mix-blend-multiply filter blur-[100px] pointer-events-none"></div>

      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="max-w-3xl mx-auto relative z-10"
      >
        <motion.div variants={itemVariants} className="mb-8 text-center sm:text-left">
          <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 tracking-tight">Create New Listing</h1>
          <p className="text-gray-500 mt-2 font-medium">Add a new product to your portfolio. We&apos;ll automatically refine your images.</p>
        </motion.div>

        {isSuccess ? (
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white/70 backdrop-blur-xl rounded-3xl shadow-xl border border-white/50 p-10 sm:p-14 text-center max-w-xl mx-auto"
          >
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle2 className="w-10 h-10 text-green-600" />
            </div>
            <h2 className="text-3xl font-extrabold text-gray-900 mb-4">Listing Created!</h2>
            <p className="text-gray-600 mb-8 font-medium">Your product has been successfully added to your portfolio and its images have been professionally refined.</p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => router.push("/dashboard/sell/listings")}
                className="px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-900 font-bold rounded-xl transition-colors"
              >
                View Listings
              </button>
              <button
                onClick={() => {
                  setFormData({
                    title: "",
                    description: "",
                    price: "",
                    category: "Electronics",
                    condition: "USED_LIKE_NEW",
                    address: "",
                    isNegotiable: false,
                    quantity: 1,
                    duration: "4",
                  });
                  setImageFile(null);
                  setImagePreview(null);
                  setIsSuccess(false);
                }}
                className="px-6 py-3 bg-primary hover:bg-primary-hover text-white font-bold rounded-xl shadow-lg transition-transform hover:scale-105"
              >
                Add Another
              </button>
            </div>
          </motion.div>
        ) : (
        <motion.form 
          variants={itemVariants}
          onSubmit={handleSubmit} 
          className="bg-white/70 backdrop-blur-xl rounded-3xl shadow-xl border border-white/50 p-6 sm:p-10 space-y-8"
        >
          
          {/* Main Info Section */}
          <div className="space-y-6">
            <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2 border-b border-gray-100 pb-3">
              <Package size={20} className="text-primary" /> Basic Information
            </h2>
            
            <motion.div variants={itemVariants} className="space-y-1.5">
              <label className="text-sm font-semibold text-gray-700 ml-1">Title</label>
              <div className="relative">
                <Type className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <input
                  type="text"
                  placeholder="What are you selling?"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all font-medium text-gray-900 placeholder:text-gray-400"
                  required
                />
              </div>
            </motion.div>

            <motion.div variants={itemVariants} className="space-y-1.5">
              <label className="text-sm font-semibold text-gray-700 ml-1">Description</label>
              <div className="relative">
                <AlignLeft className="absolute left-4 top-4 text-gray-400" size={18} />
                <textarea
                  placeholder="Describe your item in detail (features, history, etc)..."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all font-medium text-gray-900 placeholder:text-gray-400 min-h-[120px]"
                  required
                />
              </div>
            </motion.div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <motion.div variants={itemVariants} className="space-y-1.5">
                <label className="text-sm font-semibold text-gray-700 ml-1">Price</label>
                <div className="relative">
                  <PoundSterling className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    placeholder="0.00"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    className="w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all font-medium text-gray-900 placeholder:text-gray-400"
                    required
                  />
                </div>
              </motion.div>

              <motion.div variants={itemVariants} className="space-y-1.5">
                <label className="text-sm font-semibold text-gray-700 ml-1">Category</label>
                <div className="relative">
                  <Tag className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 z-10" size={18} />
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all font-medium text-gray-900 appearance-none cursor-pointer relative z-0"
                    required
                  >
                    <option value="Electronics">Electronics</option>
                    <option value="Computers">Computers</option>
                    <option value="Audio">Audio</option>
                    <option value="Photography">Photography</option>
                    <option value="Smartphones">Smartphones</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </motion.div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <motion.div variants={itemVariants} className="space-y-1.5">
                <div className="flex justify-between items-center ml-1">
                  <label className="text-sm font-semibold text-gray-700">Product Quantity</label>
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest bg-gray-100 px-2 py-0.5 rounded-md border border-gray-200">
                    Max 20
                  </span>
                </div>
                <div className="relative">
                  <Package className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                  <input
                    type="number"
                    min="1"
                    max="20"
                    value={formData.quantity}
                    onChange={(e) => setFormData({ ...formData, quantity: parseInt(e.target.value) || 1 })}
                    className="w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all font-medium text-gray-900"
                    required
                  />
                </div>
              </motion.div>

              <motion.div variants={itemVariants} className="space-y-1.5">
                <label className="text-sm font-semibold text-gray-700 ml-1">Listing Duration</label>
                <div className="relative">
                  <Tag className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 z-10" size={18} />
                  <select
                    value={formData.duration}
                    onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                    className="w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all font-medium text-gray-900 appearance-none cursor-pointer relative z-0"
                    required
                  >
                    <option value="1">1 Week</option>
                    <option value="2">2 Weeks</option>
                    <option value="4">4 Weeks (Default)</option>
                  </select>
                </div>
              </motion.div>
            </div>
          </div>

          {/* Details Section */}
          <div className="space-y-6 pt-2">
            <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2 border-b border-gray-100 pb-3">
              <MapPin size={20} className="text-primary" /> Details & Location
            </h2>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <motion.div variants={itemVariants} className="space-y-1.5">
                <label className="text-sm font-semibold text-gray-700 ml-1">Condition</label>
                <select
                  value={formData.condition}
                  onChange={(e) => setFormData({ ...formData, condition: e.target.value })}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all font-medium text-gray-900 cursor-pointer"
                  required
                >
                  <option value="NEW">New (Sealed)</option>
                  <option value="USED_LIKE_NEW">Like New</option>
                  <option value="USED_GOOD">Good</option>
                  <option value="USED_FAIR">Fair</option>
                  <option value="FOR_PARTS">For Parts</option>
                </select>
              </motion.div>

              <motion.div variants={itemVariants} className="space-y-1.5">
                <label className="text-sm font-semibold text-gray-700 ml-1">Dispatch Location</label>
                <div className="relative">
                  <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                  <input
                    type="text"
                    placeholder="City, Country"
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    className="w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all font-medium text-gray-900 placeholder:text-gray-400"
                    required
                  />
                </div>
              </motion.div>
            </div>

            <motion.label variants={itemVariants} className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl border border-gray-200 cursor-pointer hover:bg-white transition-colors">
              <div className="relative flex items-center">
                <input
                  type="checkbox"
                  checked={formData.isNegotiable}
                  onChange={(e) => setFormData({ ...formData, isNegotiable: e.target.checked })}
                  className="w-5 h-5 rounded border-gray-300 text-primary focus:ring-primary/20 cursor-pointer"
                />
              </div>
              <span className="text-gray-900 font-medium">I am open to reasonable offers (Price is negotiable)</span>
            </motion.label>
          </div>

          {/* Media Section */}
          <div className="space-y-4 pt-2">
            <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2 border-b border-gray-100 pb-3">
              <ImageIcon size={20} className="text-primary" /> Product Media
            </h2>
            
            <motion.div variants={itemVariants}>
              <div className="relative group border-2 border-dashed border-gray-300 rounded-2xl p-8 transition-all hover:border-primary hover:bg-primary/5 bg-gray-50/50">
                <input
                  type="file"
                  onChange={handleFileChange}
                  accept="image/*"
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                  required={!imagePreview}
                />
                
                <AnimatePresence mode="wait">
                  {imagePreview ? (
                    <motion.div 
                      key="preview"
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      className="text-center"
                    >
                      <div className="relative inline-block w-full max-w-sm rounded-2xl overflow-hidden shadow-lg border-4 border-white">
                        <Image 
                          src={imagePreview} 
                          alt="Product Preview" 
                          width={400} 
                          height={400} 
                          className="w-full h-auto object-cover aspect-square" 
                        />
                        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center pointer-events-none">
                          <p className="text-white font-bold flex items-center gap-2 bg-black/40 px-4 py-2 rounded-full backdrop-blur-md">
                            <Upload size={16} /> Change Image
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  ) : (
                    <motion.div 
                      key="empty"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="text-center py-6"
                    >
                      <div className="w-16 h-16 bg-white rounded-full shadow-sm flex items-center justify-center mx-auto mb-4 group-hover:bg-primary/10 transition-colors">
                        <Upload className="w-8 h-8 text-gray-400 group-hover:text-primary transition-colors" />
                      </div>
                      <p className="text-gray-900 font-bold text-lg mb-1">Click or drag image here</p>
                      <p className="text-gray-500 font-medium text-sm flex items-center justify-center gap-1">
                        <Sparkles size={14} className="text-primary" /> Background will be automatically removed
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <AnimatePresence>
                {isProcessing && (
                  <motion.div 
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="overflow-hidden"
                  >
                    <div className="flex items-center gap-3 text-primary mt-4 py-3 px-4 bg-primary/5 rounded-xl border border-primary/10">
                      <Loader2 className="w-5 h-5 animate-spin" />
                      <span className="text-sm font-semibold">AI is professionally refining your image background...</span>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          </div>

          <motion.div variants={itemVariants} className="flex flex-col sm:flex-row gap-4 pt-6 border-t border-gray-100">
            <button
              type="button"
              onClick={() => router.back()}
              className="flex-1 px-6 py-3.5 bg-gray-100 hover:bg-gray-200 text-gray-900 font-bold rounded-xl transition-colors cursor-pointer disabled:opacity-50"
              disabled={isLoading || isProcessing}
            >
              Cancel
            </button>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={isLoading || isProcessing}
              className="flex-1 px-6 py-3.5 bg-primary hover:bg-primary-hover text-white font-bold rounded-xl shadow-lg hover:shadow-primary/30 transition-all cursor-pointer disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isLoading || isProcessing ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Processing...
                </>
              ) : (
                "Post Listing"
              )}
            </motion.button>
          </motion.div>

        </motion.form>
        )}
      </motion.div>
    </div>
  );
}
