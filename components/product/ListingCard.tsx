import Link from "next/link";
import { Heart } from "lucide-react";
import { ImageService } from "@/lib/imageService";
import Image from "next/image";

interface ListingCardProps {
  id: string;
  title: string;
  price: number;
  condition: string;
  address: string;
  image: string;
  isNegotiable: boolean;
  seller: {
    name: string | null;
    rating: number | null;
    reviewCount: number;
  };
}

export function ListingCard({
  id,
  title,
  price,
  condition,
  address,
  image,
  isNegotiable,
  seller,
}: ListingCardProps) {
  const optimizedImage = image.startsWith('http') || image.startsWith('data:') 
    ? ImageService.getOptimizedUrl(image) 
    : image;

  return (
    <Link href={`/products/${id}`}>
      <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow overflow-hidden cursor-pointer h-full flex flex-col">
        <div className="relative w-full h-48 bg-gray-200 overflow-hidden group">
          <Image 
            src={optimizedImage} 
            alt={title} 
            fill 
            className="w-full h-full object-cover group-hover:scale-105 transition-transform" 
          />
          <button className="absolute top-3 right-3 p-2 bg-white rounded-full shadow-md hover:bg-gray-100">
            <Heart size={20} className="text-gray-600" />
          </button>
        </div>

        <div className="p-4 flex-1 flex flex-col">
          <h3 className="font-semibold text-lg text-gray-900 line-clamp-2 mb-2">{title}</h3>

          <p className="text-2xl font-bold text-primary mb-2">${price.toFixed(2)}</p>

          {isNegotiable && <p className="text-sm text-green-600 font-medium mb-2">Negotiable</p>}

          <p className="text-xs text-gray-500 mb-3">{condition.replace(/_/g, " ")}</p>

          <p className="text-xs text-gray-600 mb-3">{address}</p>

          <div className="border-t pt-3 mt-auto flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center text-xs font-semibold">
                {seller.name?.charAt(0).toUpperCase() || "?"}
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900">{seller.name || "Anonymous"}</p>
                <p className="text-xs text-gray-500">⭐ {seller.rating?.toFixed(1) || "N/A"}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
