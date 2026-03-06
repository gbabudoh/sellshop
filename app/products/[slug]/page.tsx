"use client";

import { Header } from "../../../components/layout/Header";
import { Footer } from "../../../components/layout/Footer";
import { Button } from "../../../components/common/Button";
import { Heart, MapPin, Star, Share2, Clock, Eye, Shield, CheckCircle, Loader2 } from "lucide-react";
import { useState, use, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";

type ProductDetail = {
  id: string;
  slug: string;
  title: string;
  description: string;
  price: number;
  category: string;
  condition: string;
  status: string;
  address: string;
  images: string[];
  isNegotiable: boolean;
  viewCount: number;
  sellerId: string;
  seller: {
    id: string;
    name: string;
    image: string | null;
    rating: number;
    reviewCount: number;
    responseTime: string;
    memberSince: string;
    itemsSold: number;
  };
  createdAt: string;
  details: Record<string, string>;
};

export default function ProductDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  const router = useRouter();
  const { data: session } = useSession();
  
  const [product, setProduct] = useState<ProductDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const [isSaved, setIsSaved] = useState(false);
  const [selectedImage, setSelectedImage] = useState(0);
  const [showContactForm, setShowContactForm] = useState(false);
  const [showOfferModal, setShowOfferModal] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [contactMessage, setContactMessage] = useState("");
  const [offerPrice, setOfferPrice] = useState("");
  const [isSubmittingOffer, setIsSubmittingOffer] = useState(false);
  const [isSendingMessage, setIsSendingMessage] = useState(false);

  useEffect(() => {
    async function fetchProduct() {
      try {
        const response = await fetch(`/api/products/${slug}`);
        if (response.ok) {
          const data = await response.json();
          setProduct(data);
        } else {
          setProduct(null);
        }
      } catch (error) {
        console.error("Failed to fetch product:", error);
      } finally {
        setIsLoading(false);
      }
    }
    fetchProduct();
  }, [slug]);

  const showToast = (message: string) => {
    setToastMessage(message);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleSave = () => {
    setIsSaved(!isSaved);
    showToast(isSaved ? "Item removed from saved list" : "Item saved to favorites");
  };

  const handleShare = async () => {
    if (!product) return;
    try {
      if (navigator.share) {
        await navigator.share({ title: product.title, url: window.location.href });
      } else {
        await navigator.clipboard.writeText(window.location.href);
        showToast("Link copied to clipboard");
      }
    } catch (err) {
      console.error("Share failed:", err);
    }
  };

  const handleSendMessage = async () => {
    if (!session) {
      router.push("/signin");
      return;
    }
    if (!product || !contactMessage.trim() || isSendingMessage) return;

    setIsSendingMessage(true);
    try {
      // 1. Create or find conversation
      const convRes = await fetch("/api/messages/conversations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          productId: product.id, 
          sellerId: product.sellerId 
        }),
      });

      if (!convRes.ok) throw new Error("Failed to start conversation");
      const conversation = await convRes.json();

      // 2. Send the initial message
      const msgRes = await fetch(`/api/messages/conversations/${conversation.id}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: contactMessage }),
      });

      if (!msgRes.ok) throw new Error("Failed to send message");

      showToast("Message sent! Redirecting to chat...");
      setTimeout(() => {
        router.push(`/dashboard/sell/messages/${conversation.id}`);
      }, 1500);
    } catch (err) {
      console.error(err);
      showToast("Failed to send message. Please try again.");
    } finally {
      setIsSendingMessage(false);
    }
  };

  const handleMakeOffer = async () => {
    if (!session) {
      router.push("/signin");
      return;
    }
    if (!product || !offerPrice || isSubmittingOffer) return;

    setIsSubmittingOffer(true);
    try {
      const res = await fetch("/api/offers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          productId: product.id,
          sellerId: product.sellerId,
          price: offerPrice,
        }),
      });

      if (!res.ok) throw new Error("Failed to submit offer");

      showToast("Your offer has been submitted!");
      setShowOfferModal(false);
      setOfferPrice("");
    } catch (err) {
      console.error(err);
      showToast("Failed to submit offer. Please try again.");
    } finally {
      setIsSubmittingOffer(false);
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col relative">
      <Header />

      {toastMessage && (
        <div className="fixed bottom-4 left-1/2 -translate-x-1/2 bg-gray-900 text-white px-6 py-3 rounded-full shadow-xl font-medium z-50">
          {toastMessage}
        </div>
      )}

      <main className="flex-1">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-20 px-4">
            <Loader2 className="w-10 h-10 animate-spin text-blue-600 mb-4" />
            <p className="text-gray-500 font-medium">Loading details...</p>
          </div>
        ) : !product ? (
          <div className="flex flex-col items-center justify-center py-20 px-4">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Product Not Found</h2>
            <p className="text-gray-500 mb-8 max-w-md text-center">We couldn&apos;t find the product you&apos;re looking for. It may have been sold or removed by the seller.</p>
            <Button onClick={() => window.location.href = "/products"}>Back to Market</Button>
          </div>
        ) : (
        <div className="max-w-7xl mx-auto px-4 py-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Image Gallery */}
            <div>
              <div className="rounded-2xl overflow-hidden mb-4 relative">
                <Image
                  src={product.images[selectedImage] || "https://via.placeholder.com/500x500"}
                  alt={product.title}
                  width={800}
                  height={800}
                  className="w-full h-[500px] object-contain"
                />
                <div className="absolute top-4 right-4 bg-white px-3 py-1 rounded-full text-sm font-medium text-gray-700">
                  {selectedImage + 1} / {product.images.length}
                </div>
              </div>
              <div className="flex gap-2">
                {product.images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`w-20 h-20 rounded-lg overflow-hidden border-2 transition-colors cursor-pointer ${
                      selectedImage === index ? "border-blue-600" : "border-gray-300"
                    }`}
                  >
                    <Image src={image} alt={`${product.title} ${index + 1}`} width={100} height={100} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            </div>

            {/* Product Info */}
            <div>
              <div className="flex justify-between items-start mb-4">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-semibold">
                      {product.category}
                    </span>
                  </div>
                  <h1 className="text-3xl font-bold text-gray-900 mb-2">{product.title}</h1>
                  <div className="flex items-center gap-4 text-sm text-gray-600">
                    <div className="flex items-center gap-1">
                      <Eye size={16} />
                      <span>{product.viewCount} views</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock size={16} />
                      <span>Posted {product.createdAt}</span>
                    </div>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={handleSave}
                    className={`p-3 rounded-lg transition-colors shadow-sm outline-none hover:scale-105 cursor-pointer ${
                      isSaved ? "bg-red-50 text-red-500 border border-red-100" : "bg-white border border-gray-200 text-gray-600 hover:bg-gray-50"
                    }`}
                  >
                    <Heart size={24} fill={isSaved ? "currentColor" : "none"} />
                  </button>
                  <button onClick={handleShare} className="p-3 rounded-lg bg-white border border-gray-200 text-gray-600 hover:bg-gray-50 shadow-sm transition-transform hover:scale-105 cursor-pointer">
                    <Share2 size={24} />
                  </button>
                </div>
              </div>

              {/* Price */}
              <div className="mb-6 pb-6 border-b">
                <p className="text-4xl font-bold text-blue-600 mb-2">£{product.price.toLocaleString()}</p>
                {product.isNegotiable && (
                  <p className="text-green-600 font-medium flex items-center gap-2">
                    <CheckCircle size={18} /> Price is negotiable
                  </p>
                )}
              </div>

              {/* Key Details */}
              <div className="space-y-3 mb-8 pb-8 border-b">
                <div className="flex items-center gap-2 text-gray-700">
                  <span className="font-medium w-32 flex-shrink-0">Condition:</span>
                  <span className="text-gray-600 font-medium">{product.condition.replace(/_/g, " ")}</span>
                </div>
                <div className="flex items-center gap-2 text-gray-700">
                  <span className="font-medium w-32 flex-shrink-0">Location:</span>
                  <div className="flex items-center text-gray-600">
                    <MapPin size={18} className="text-gray-400 mr-1" />
                    <span>{product.address}</span>
                  </div>
                </div>
              </div>

              {/* Seller Card */}
              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg p-6 mb-8 border border-blue-100">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-14 h-14 bg-blue-600 rounded-full flex items-center justify-center text-white text-lg font-bold shadow-md">
                    {product.seller.name?.charAt(0).toUpperCase()}
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-gray-900 text-lg">{product.seller.name}</p>
                    <div className="flex items-center gap-2">
                      <div className="flex items-center gap-1 bg-white px-2 py-0.5 rounded-md border border-gray-200">
                        <Star size={14} className="text-yellow-400" fill="currentColor" />
                        <span className="text-sm font-bold text-gray-900">{product.seller.rating}</span>
                        <span className="text-xs text-gray-500 ml-1">({product.seller.reviewCount})</span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="space-y-2 text-sm text-gray-700 mb-5 font-medium">
                  <p className="flex items-center gap-2"><CheckCircle size={16} className="text-blue-500" /> {product.seller.responseTime}</p>
                  <p className="flex items-center gap-2"><CheckCircle size={16} className="text-blue-500" /> {product.seller.itemsSold} items sold</p>
                  <p className="flex items-center gap-2"><CheckCircle size={16} className="text-blue-500" /> Member since {product.seller.memberSince}</p>
                </div>

                {showContactForm ? (
                  <div className="bg-white p-4 rounded-lg border border-gray-200">
                    <h3 className="font-bold text-gray-900 mb-2">Message {product.seller.name}</h3>
                    <textarea
                      className="w-full border border-gray-300 rounded-md p-3 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none mb-3 resize-none font-medium"
                      rows={3}
                      placeholder={`Hi, is the ${product.title} still available?`}
                      value={contactMessage}
                      onChange={(e) => setContactMessage(e.target.value)}
                    />
                    <div className="flex gap-2">
                      <Button 
                        onClick={handleSendMessage} 
                        disabled={isSendingMessage || !contactMessage.trim()}
                        className="flex-1 font-bold"
                      >
                        {isSendingMessage ? <Loader2 className="w-5 h-5 animate-spin" /> : "Send"}
                      </Button>
                      <Button onClick={() => setShowContactForm(false)} variant="secondary" className="font-bold">Cancel</Button>
                    </div>
                  </div>
                ) : (
                  <Button onClick={() => setShowContactForm(true)} className="w-full shadow-sm font-bold py-3 transition-all hover:shadow-blue-200">
                    Contact Seller
                  </Button>
                )}
              </div>

              {/* Action Buttons */}
              <div className="space-y-3">
                <Button onClick={() => showToast("Adding to cart... Checkout flow coming soon!")} className="w-full py-4 text-lg font-bold shadow-md hover:shadow-lg transition-shadow">
                  Buy Now
                </Button>
                {product.isNegotiable && (
                  <Button 
                    onClick={() => setShowOfferModal(true)} 
                    variant="secondary" 
                    className="w-full py-3 font-semibold border-2 border-gray-200 bg-white hover:bg-gray-50"
                  >
                    Make an Offer
                  </Button>
                )}
              </div>

              {/* Offer Modal */}
              <AnimatePresence>
                {showOfferModal && (
                  <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-gray-900/60 backdrop-blur-sm">
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95, y: 20 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95, y: 20 }}
                      className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden"
                    >
                      <div className="p-8">
                        <h3 className="text-2xl font-bold text-gray-900 mb-2">Make an Offer</h3>
                        <p className="text-gray-500 mb-6 font-medium">Original price: <span className="text-blue-600 font-bold">£{product.price}</span></p>
                        
                        <div className="space-y-4">
                          <div>
                            <label className="block text-sm font-bold text-gray-700 mb-2 uppercase tracking-wider">Your Offer Price (£)</label>
                            <input
                              type="number"
                              value={offerPrice}
                              onChange={(e) => setOfferPrice(e.target.value)}
                              placeholder="Enter your best price"
                              className="w-full px-5 py-4 bg-gray-50 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-bold text-xl text-blue-600"
                            />
                          </div>
                          
                          <div className="flex gap-3 pt-4">
                            <Button 
                              onClick={handleMakeOffer} 
                              disabled={!offerPrice || isSubmittingOffer}
                              className="flex-1 py-4 font-bold h-14"
                            >
                              {isSubmittingOffer ? <Loader2 className="w-6 h-6 animate-spin" /> : "Submit Offer"}
                            </Button>
                            <Button 
                              onClick={() => setShowOfferModal(false)} 
                              variant="secondary"
                              className="flex-1 py-4 font-bold border-2 h-14"
                            >
                              Cancel
                            </Button>
                          </div>
                        </div>
                        
                        <p className="mt-6 text-[10px] text-gray-400 font-medium uppercase tracking-widest text-center">
                          Offers are binding once accepted by the seller
                        </p>
                      </div>
                    </motion.div>
                  </div>
                )}
              </AnimatePresence>

              {/* Trust Badges */}
              <div className="mt-8 pt-6 border-t border-gray-200">
                <p className="text-sm font-bold text-gray-900 mb-4 uppercase tracking-wider">Safe Transaction Guarantee</p>
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-start gap-3 bg-green-50/50 p-3 rounded-md border border-green-100">
                    <Shield size={24} className="text-green-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <span className="block font-semibold text-gray-900 text-sm">Secure Escrow</span>
                      <span className="block text-xs text-gray-600 mt-1">Funds held until delivery</span>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 bg-blue-50/50 p-3 rounded-md border border-blue-100">
                    <CheckCircle size={24} className="text-blue-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <span className="block font-semibold text-gray-900 text-sm">Verified Seller</span>
                      <span className="block text-xs text-gray-600 mt-1">Identity checked</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Product Details Section */}
          <div className="mt-16 pt-12 border-t border-gray-200">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
              <div className="lg:col-span-2">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">About This Item</h2>
                <p className="leading-relaxed text-lg text-gray-700 mb-12 whitespace-pre-line">{product.description}</p>

                <h3 className="text-2xl font-bold text-gray-900 mb-6">Specifications</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {Object.entries(product.details).map(([key, value]) => (
                    <div key={key} className="bg-white border border-gray-200 p-4 rounded-lg flex flex-col hover:border-blue-300 transition-colors">
                      <span className="text-xs font-semibold uppercase tracking-wider text-gray-500 mb-1">{key.replace(/([A-Z])/g, " $1")}</span>
                      <span className="font-semibold text-gray-900">{value}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-6">
                <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
                  <h3 className="font-bold text-gray-900 mb-3 text-lg">Still deciding?</h3>
                  <p className="text-sm text-gray-600 mb-5">Save this item or contact the seller with any questions.</p>
                  <div className="flex gap-2">
                    <Button onClick={handleSave} variant={isSaved ? "secondary" : "primary"} className="flex-1 text-sm bg-gray-900 text-white">
                      {isSaved ? "Saved" : "Save"}
                    </Button>
                    <Button onClick={() => { window.scrollTo({ top: 100, behavior: "smooth" }); setShowContactForm(true); }} variant="secondary" className="flex-1 text-sm bg-gray-100">
                      Message
                    </Button>
                  </div>
                </div>

                <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
                  <h3 className="font-bold text-gray-900 mb-3">Something wrong?</h3>
                  <p className="text-xs text-gray-600 mb-4 leading-relaxed">If you believe this listing violates our guidelines, please let us know.</p>
                  <button onClick={() => showToast("Listing has been reported to moderation team")} className="text-red-600 text-sm font-bold hover:underline cursor-pointer">
                    Report this listing
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
        )}
      </main>

      <Footer />
    </div>
  );
}