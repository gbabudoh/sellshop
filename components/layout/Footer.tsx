import Link from "next/link";

export function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300 py-12">
      <div className="max-w-7xl mx-auto px-4">


        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div>
            <h3 className="text-white font-bold mb-4">About Sellshop</h3>
            <p className="text-sm">
              Secure peer-to-peer marketplace for buying and selling items across the United Kingdom and Europe.
            </p>
          </div>
          <div>
            <h3 className="text-white font-bold mb-4">Support</h3>
            <ul className="space-y-2 text-sm">
              <li><Link href="#" className="hover:text-white cursor-pointer">Help Center</Link></li>
              <li><Link href="#" className="hover:text-white cursor-pointer">Contact Us</Link></li>
              <li><Link href="#" className="hover:text-white cursor-pointer">Safety Tips</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="text-white font-bold mb-4">Legal</h3>
            <ul className="space-y-2 text-sm">
              <li><Link href="#" className="hover:text-white cursor-pointer">Terms of Service</Link></li>
              <li><Link href="#" className="hover:text-white cursor-pointer">Privacy Policy</Link></li>
              <li><Link href="#" className="hover:text-white cursor-pointer">Cookie Policy</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="text-white font-bold mb-4">Community</h3>
            <ul className="space-y-2 text-sm">
              <li><Link href="#" className="hover:text-white cursor-pointer">Twitter</Link></li>
              <li><Link href="#" className="hover:text-white cursor-pointer">Facebook</Link></li>
              <li><Link href="#" className="hover:text-white cursor-pointer">Instagram</Link></li>
            </ul>
          </div>
        </div>
        <div className="border-t border-gray-700 pt-8 text-center text-sm">
          <p>&copy; 2024 Sellshop. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
