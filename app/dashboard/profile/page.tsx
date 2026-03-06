"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Shield, 
  Star, 
  Calendar, 
  Bell, 
  Lock, 
  Check, 
  Loader2,
  Camera,
  LogOut
} from "lucide-react";
import Image from "next/image";

export default function ProfilePage() {
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phoneNumber: "",
    address: "",
    bio: "",
    rating: 0,
    reviewCount: 0,
    itemsSoldCount: 0,
    memberSince: "",
    image: null as string | null,
  });

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const response = await fetch("/api/profile");
      if (response.ok) {
        const data = await response.json();
        setFormData({
          name: data.name || "",
          email: data.email || "",
          phoneNumber: data.phoneNumber || "",
          address: data.address || "",
          bio: data.bio || "",
          rating: data.rating || 0,
          reviewCount: data.reviewCount || 0,
          itemsSoldCount: data.itemsSoldCount || 0,
          memberSince: new Date(data.createdAt).toLocaleDateString("en-US", { month: "long", year: "numeric" }),
          image: data.image,
        });
      }
    } catch (error) {
      console.error("Failed to fetch profile:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setSaveSuccess(false);

    try {
      const response = await fetch("/api/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.name,
          phoneNumber: formData.phoneNumber,
          address: formData.address,
          bio: formData.bio,
        }),
      });

      if (response.ok) {
        setSaveSuccess(true);
        setTimeout(() => setSaveSuccess(false), 3000);
      }
    } catch (error) {
      console.error("Failed to update profile:", error);
    } finally {
      setIsSaving(false);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-12 h-12 text-primary animate-spin" />
          <p className="text-gray-500 font-medium">Loading your profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen relative overflow-hidden pt-6 pb-20">
      {/* Background Orbs */}
      <div className="absolute top-[-10%] left-[-5%] w-[40%] h-[40%] bg-primary/10 rounded-full blur-[120px] -z-10 animate-pulse" />
      <div className="absolute bottom-[-10%] right-[-5%] w-[40%] h-[40%] bg-blue-400/10 rounded-full blur-[120px] -z-10" />

      <motion.div 
        className="max-w-6xl mx-auto px-4 "
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.div variants={itemVariants} className="mb-10">
          <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight">My Profile</h1>
          <p className="text-gray-500 mt-2 text-lg">Manage your personal information and account settings.</p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* Left Column: Form */}
          <motion.div variants={itemVariants} className="lg:col-span-2 space-y-8">
            <div className="bg-white/70 backdrop-blur-2xl border border-white/50 rounded-3xl shadow-2xl p-8 lg:p-10 relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none group-hover:scale-110 transition-transform duration-700">
                <User size={120} />
              </div>
              
              <h2 className="text-2xl font-bold text-gray-900 mb-8 flex items-center gap-3">
                <span className="p-2 bg-primary/10 rounded-xl">
                  <User className="text-primary" />
                </span>
                Profile Information
              </h2>

              <form onSubmit={handleSubmit} className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-gray-700 px-1">Full Name</label>
                    <div className="relative group">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400 group-focus-within:text-primary transition-colors">
                        <User size={18} />
                      </div>
                      <input
                        type="text"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="w-full pl-10 pr-4 py-3 bg-white/50 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all shadow-sm"
                        placeholder="Your full name"
                        disabled={isSaving}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-gray-700 px-1">Email Address</label>
                    <div className="relative group grayscale opacity-70">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                        <Mail size={18} />
                      </div>
                      <input
                        type="email"
                        value={formData.email}
                        readOnly
                        className="w-full pl-10 pr-4 py-3 bg-gray-100/50 border border-gray-200 rounded-2xl cursor-not-allowed italic"
                        title="Email cannot be changed"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-gray-700 px-1">Phone Number</label>
                    <div className="relative group">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400 group-focus-within:text-primary transition-colors">
                        <Phone size={18} />
                      </div>
                      <input
                        type="tel"
                        value={formData.phoneNumber}
                        onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
                        className="w-full pl-10 pr-4 py-3 bg-white/50 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all shadow-sm"
                        placeholder="+1 (555) 000-0000"
                        disabled={isSaving}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-gray-700 px-1">Location / Address</label>
                    <div className="relative group">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400 group-focus-within:text-primary transition-colors">
                        <MapPin size={18} />
                      </div>
                      <input
                        type="text"
                        value={formData.address}
                        onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                        className="w-full pl-10 pr-4 py-3 bg-white/50 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all shadow-sm"
                        placeholder="City, State, Country"
                        disabled={isSaving}
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-700 px-1">About Me (Bio)</label>
                  <textarea
                    value={formData.bio}
                    onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                    className="w-full px-4 py-3 bg-white/50 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all shadow-sm min-h-[120px] resize-none"
                    placeholder="Tell the community about yourself..."
                    disabled={isSaving}
                  />
                </div>

                <div className="flex items-center justify-end gap-4">
                  <AnimatePresence>
                    {saveSuccess && (
                      <motion.span 
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 20 }}
                        className="text-green-600 font-medium flex items-center gap-2"
                      >
                        <Check size={18} />
                        Changes saved successfully
                      </motion.span>
                    )}
                  </AnimatePresence>
                  
                  <button 
                    type="submit" 
                    disabled={isSaving}
                    className="px-8 py-3 bg-primary text-white font-bold rounded-2xl shadow-lg hover:shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 disabled:scale-100 flex items-center gap-2"
                  >
                    {isSaving ? (
                      <>
                        <Loader2 size={20} className="animate-spin" />
                        Saving...
                      </>
                    ) : (
                      "Save Changes"
                    )}
                  </button>
                </div>
              </form>
            </div>
          </motion.div>

          {/* Right Column: Stats & Settings */}
          <motion.div variants={itemVariants} className="space-y-8">
            {/* Avatar Card */}
            <div className="bg-white/70 backdrop-blur-2xl border border-white/50 rounded-3xl shadow-xl p-8 flex flex-col items-center text-center group">
              <div className="relative mb-6">
                <div className="w-32 h-32 bg-gradient-to-tr from-primary to-blue-400 rounded-full p-1 shadow-2xl group-hover:rotate-6 transition-transform duration-500">
                  <div className="w-full h-full bg-white rounded-full overflow-hidden flex items-center justify-center">
                    {formData.image ? (
                      <Image 
                        src={formData.image} 
                        alt={formData.name} 
                        width={128} 
                        height={128} 
                        className="w-full h-full object-cover" 
                      />
                    ) : (
                      <User size={64} className="text-gray-300" />
                    )}
                  </div>
                </div>
                <button className="absolute bottom-0 right-0 p-2.5 bg-white shadow-xl border border-gray-100 rounded-full hover:scale-110 active:scale-90 transition-all text-primary">
                  <Camera size={18} />
                </button>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-1">{formData.name || "Set your name"}</h3>
              <p className="text-gray-500 text-sm mb-6 font-medium">{formData.email}</p>
              
              <div className="grid grid-cols-2 gap-4 w-full">
                <div className="p-3 bg-gray-50/50 rounded-2xl hover:bg-white hover:shadow-md transition-all">
                  <p className="text-xs text-gray-500 font-bold uppercase tracking-wider mb-1">Items Sold</p>
                  <p className="text-xl font-black text-primary">{formData.itemsSoldCount}</p>
                </div>
                <div className="p-3 bg-gray-50/50 rounded-2xl hover:bg-white hover:shadow-md transition-all">
                  <p className="text-xs text-gray-500 font-bold uppercase tracking-wider mb-1">Rating</p>
                  <p className="text-xl font-black text-amber-500 flex items-center justify-center gap-1">
                    {formData.rating.toFixed(1)} <Star size={16} fill="currentColor" />
                  </p>
                </div>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="bg-white/70 backdrop-blur-2xl border border-white/50 rounded-3xl shadow-xl p-8 space-y-5">
              <h3 className="text-lg font-bold text-gray-900 border-b border-gray-100 pb-3">Account Insights</h3>
              
              <div className="flex items-center gap-4 group">
                <div className="w-10 h-10 bg-amber-50 rounded-xl flex items-center justify-center text-amber-500 group-hover:scale-110 transition-transform">
                  <Star size={18} />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Overall Rating</p>
                  <p className="font-bold text-gray-900">{formData.rating.toFixed(1)}/5.0 ({formData.reviewCount} Reviews)</p>
                </div>
              </div>

              <div className="flex items-center gap-4 group">
                <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center text-blue-500 group-hover:scale-110 transition-transform">
                  <Calendar size={18} />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Member Since</p>
                  <p className="font-bold text-gray-900">{formData.memberSince || "New Member"}</p>
                </div>
              </div>

              <div className="flex items-center gap-4 group">
                <div className="w-10 h-10 bg-green-50 rounded-xl flex items-center justify-center text-green-500 group-hover:scale-110 transition-transform">
                  <Shield size={18} />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Security Status</p>
                  <p className="font-bold text-green-600 flex items-center gap-1">Verified Account</p>
                </div>
              </div>
            </div>

            {/* Account Management */}
            <div className="bg-white/70 backdrop-blur-2xl border border-white/50 rounded-3xl shadow-xl p-8 space-y-4">
              <h3 className="text-lg font-bold text-gray-900 border-b border-gray-100 pb-3">Quick Settings</h3>
              
              <button className="w-full p-4 flex items-center justify-between bg-gray-50/50 hover:bg-white hover:shadow-lg hover:scale-[1.03] transition-all rounded-2xl group">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center text-gray-500 group-hover:bg-primary/10 group-hover:text-primary transition-colors">
                    <Lock size={16} />
                  </div>
                  <span className="font-bold text-gray-700">Security & Privacy</span>
                </div>
                <div className="w-2 h-2 rounded-full bg-green-500" />
              </button>

              <button className="w-full p-4 flex items-center justify-between bg-gray-50/50 hover:bg-white hover:shadow-lg hover:scale-[1.03] transition-all rounded-2xl group">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center text-gray-500 group-hover:bg-primary/10 group-hover:text-primary transition-colors">
                    <Bell size={16} />
                  </div>
                  <span className="font-bold text-gray-700">Notifications</span>
                </div>
                <div className="w-6 h-6 flex items-center justify-center bg-primary text-white text-[10px] font-bold rounded-full">3</div>
              </button>

              <button className="w-full p-4 flex items-center gap-3 text-red-500 hover:bg-red-50 transition-all rounded-2xl font-bold mt-4">
                <LogOut size={18} />
                Sign Out
              </button>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}
